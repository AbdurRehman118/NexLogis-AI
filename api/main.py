from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
import pdfplumber
import json
import os
import io
import re
import math
from datetime import datetime

app = FastAPI(
    title="NexLogis AI Rate Aggregator",
    description="AI-powered courier rate aggregation engine — compares rates from multiple couriers across service types and destinations.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Persistent rate store (JSON file as lightweight DB) ────────────────────────
RATES_FILE = os.path.join(os.path.dirname(__file__), "rate_store.json")
UPLOADS_LOG = os.path.join(os.path.dirname(__file__), "uploads_log.json")

def load_rates() -> list:
    if os.path.exists(RATES_FILE):
        with open(RATES_FILE, "r") as f:
            return json.load(f)
    return _seed_rates()

def save_rates(rates: list):
    with open(RATES_FILE, "w") as f:
        json.dump(rates, f, indent=2)

def load_uploads_log() -> list:
    if os.path.exists(UPLOADS_LOG):
        with open(UPLOADS_LOG, "r") as f:
            return json.load(f)
    return []

def append_upload_log(entry: dict):
    log = load_uploads_log()
    log.append(entry)
    with open(UPLOADS_LOG, "w") as f:
        json.dump(log, f, indent=2)

def _seed_rates() -> list:
    """Seed realistic Pakistani courier rate data."""
    couriers = [
        {"name": "TCS Express",       "reliability": 0.95, "speed_score": 0.90, "coverage": "Nationwide"},
        {"name": "Leopards Courier",  "reliability": 0.88, "speed_score": 0.82, "coverage": "Nationwide"},
        {"name": "M&P Express",       "reliability": 0.91, "speed_score": 0.87, "coverage": "Nationwide"},
        {"name": "PostEx",            "reliability": 0.85, "speed_score": 0.80, "coverage": "Major Cities"},
        {"name": "Trax",              "reliability": 0.83, "speed_score": 0.78, "coverage": "Major Cities"},
        {"name": "BlueEx",            "reliability": 0.89, "speed_score": 0.85, "coverage": "Nationwide"},
        {"name": "Call Courier",      "reliability": 0.80, "speed_score": 0.75, "coverage": "Urban Areas"},
        {"name": "Swyft Logistics",   "reliability": 0.86, "speed_score": 0.83, "coverage": "Nationwide"},
    ]
    services = [
        {"type": "Same Day",        "multiplier": 2.5,  "days": "Same Day",   "days_num": 0},
        {"type": "Next Day",        "multiplier": 1.8,  "days": "1 Day",      "days_num": 1},
        {"type": "Express (2-3D)",  "multiplier": 1.3,  "days": "2-3 Days",   "days_num": 2},
        {"type": "Standard",        "multiplier": 1.0,  "days": "4-6 Days",   "days_num": 5},
        {"type": "Economy",         "multiplier": 0.75, "days": "7-10 Days",  "days_num": 8},
    ]
    regions = [
        {"name": "Karachi",      "base": 180, "zone": "South"},
        {"name": "Lahore",       "base": 200, "zone": "Central"},
        {"name": "Islamabad",    "base": 210, "zone": "North"},
        {"name": "Faisalabad",   "base": 190, "zone": "Central"},
        {"name": "Rawalpindi",   "base": 205, "zone": "North"},
        {"name": "Peshawar",     "base": 230, "zone": "North"},
        {"name": "Quetta",       "base": 260, "zone": "West"},
        {"name": "Multan",       "base": 215, "zone": "South"},
        {"name": "Hyderabad",    "base": 185, "zone": "South"},
        {"name": "Sialkot",      "base": 195, "zone": "Central"},
        {"name": "Gujranwala",   "base": 193, "zone": "Central"},
        {"name": "Bahawalpur",   "base": 220, "zone": "South"},
        {"name": "Abbottabad",   "base": 240, "zone": "North"},
        {"name": "Remote Area",  "base": 320, "zone": "Remote"},
    ]
    rates = []
    for c in couriers:
        for s in services:
            for r in regions:
                variance = (abs(hash(c["name"] + s["type"])) % 20 - 10) / 100  # ±10%
                per_kg = round(r["base"] * s["multiplier"] * (1 + variance), 2)
                base   = round(per_kg * 0.55, 2)
                rates.append({
                    "id": f"{c['name']}-{s['type']}-{r['name']}".replace(" ", "_"),
                    "courier":          c["name"],
                    "service_type":     s["type"],
                    "destination":      r["name"],
                    "zone":             r.get("zone", "Unknown"),
                    "coverage":         c["coverage"],
                    "base_rate_rs":     base,
                    "per_kg_rate_rs":   per_kg,
                    "min_weight_kg":    0.5,
                    "max_weight_kg":    70.0,
                    "cod_available":    True,
                    "insurance_pct":    0.8,
                    "reliability_pct":  round(c["reliability"] * 100, 1),
                    "estimated_days":   s["days"],
                    "days_num":         s["days_num"],
                    "source":           "seeded",
                    "last_updated":     datetime.now().isoformat()[:10],
                })
    save_rates(rates)
    return rates


# ── AI Scoring Engine v2 ───────────────────────────────────────────────────────
def ai_score_v2(entry: dict, req) -> dict:
    """
    Multi-criteria AI scoring engine that respects customer priority.
    Priority modes: 'cheapest' | 'fastest' | 'reliable' | 'balanced'
    Returns an enriched result dict with score breakdown.
    """
    weight    = req.weight_kg
    raw_cost  = entry["base_rate_rs"] + entry["per_kg_rate_rs"] * weight
    cod_fee   = 60 if req.cod_required and entry["cod_available"] else 0
    ins_fee   = (req.declared_value_rs * entry["insurance_pct"] / 100) if req.declared_value_rs else 0
    total     = round(raw_cost + cod_fee + ins_fee, 2)

    # --- Individual metric scores (0–100) ---
    # Cost score: lower cost → higher score
    max_expected_cost = 5000
    cost_score = max(0, 100 - (total / max_expected_cost) * 100)

    # Speed score: fewer days → higher score
    day_map = {"Same Day": 100, "1 Day": 85, "2-3 Days": 65, "4-6 Days": 40, "7-10 Days": 20}
    speed_score = day_map.get(entry["estimated_days"], 30)

    # Reliability score: direct percentage
    reliability_score = entry["reliability_pct"]

    # --- Priority weighting ---
    priority = getattr(req, "priority", "balanced")
    if priority == "cheapest":
        weights = {"cost": 0.65, "speed": 0.15, "reliability": 0.20}
    elif priority == "fastest":
        weights = {"cost": 0.15, "speed": 0.65, "reliability": 0.20}
    elif priority == "reliable":
        weights = {"cost": 0.20, "speed": 0.20, "reliability": 0.60}
    else:  # balanced
        weights = {"cost": 0.40, "speed": 0.30, "reliability": 0.30}

    composite = round(
        cost_score       * weights["cost"] +
        speed_score      * weights["speed"] +
        reliability_score * weights["reliability"],
        1
    )

    # --- Warnings ---
    warnings = []
    if weight > entry["max_weight_kg"]:
        warnings.append(f"Exceeds max weight ({entry['max_weight_kg']} kg)")
    if req.cod_required and not entry["cod_available"]:
        warnings.append("COD not available with this courier")
    if weight < entry["min_weight_kg"]:
        warnings.append(f"Below minimum weight ({entry['min_weight_kg']} kg)")

    return {
        **entry,
        "calculated_total_rs": total,
        "breakdown": {
            "shipping_rs":  round(raw_cost, 2),
            "cod_fee_rs":   cod_fee,
            "insurance_rs": round(ins_fee, 2),
        },
        "score_breakdown": {
            "cost_score":        round(cost_score, 1),
            "speed_score":       speed_score,
            "reliability_score": reliability_score,
            "weights_used":      weights,
        },
        "ai_score":    composite,
        "warnings":    warnings,
        "tags":        [],
        "recommended": False,
        "best_value":  False,
        "fastest":     False,
    }


# ── Request / Response Models ──────────────────────────────────────────────────
class RateQuery(BaseModel):
    origin:             str = "Lahore"
    destination:        str
    weight_kg:          float
    declared_value_rs:  Optional[float] = 0.0
    cod_required:       bool = False
    service_preference: Optional[str] = "Any"
    priority:           Optional[str] = "balanced"  # cheapest | fastest | reliable | balanced
    max_budget_rs:      Optional[float] = None
    package_type:       Optional[str] = "Parcel"    # Parcel | Document | Fragile | Bulk

class RateCard(BaseModel):
    courier:        str
    service_type:   str
    destination:    str
    base_rate_rs:   float
    per_kg_rate_rs: float
    estimated_days: str
    cod_available:  bool = True
    insurance_pct:  float = 0.8
    reliability_pct: float = 85.0


# ── API Endpoints ──────────────────────────────────────────────────────────────

@app.get("/")
def health():
    rates = load_rates()
    couriers = list({r["courier"] for r in rates})
    return {
        "status": "healthy",
        "version": "2.0.0",
        "total_rates": len(rates),
        "total_couriers": len(couriers),
        "couriers": sorted(couriers)
    }

@app.get("/couriers")
def get_couriers():
    rates = load_rates()
    courier_info = {}
    for r in rates:
        name = r["courier"]
        if name not in courier_info:
            courier_info[name] = {
                "name": name,
                "coverage": r.get("coverage", "Nationwide"),
                "reliability_pct": r.get("reliability_pct", 85),
                "service_types": set(),
                "destinations": set(),
            }
        courier_info[name]["service_types"].add(r["service_type"])
        courier_info[name]["destinations"].add(r["destination"])
    # Convert sets to lists for JSON
    result = []
    for name, info in sorted(courier_info.items()):
        result.append({**info, "service_types": sorted(info["service_types"]), "destinations": sorted(info["destinations"])})
    return result

@app.get("/destinations")
def get_destinations():
    rates = load_rates()
    dest_map = {}
    for r in rates:
        d = r["destination"]
        if d not in dest_map:
            dest_map[d] = r.get("zone", "Unknown")
    return [{"name": k, "zone": v} for k, v in sorted(dest_map.items())]

@app.get("/service-types")
def get_service_types():
    rates = load_rates()
    st_map = {}
    for r in rates:
        st = r["service_type"]
        if st not in st_map:
            st_map[st] = r.get("estimated_days", "")
    return [{"type": k, "estimated_days": v} for k, v in sorted(st_map.items())]

@app.post("/compare-rates")
def compare_rates(req: RateQuery):
    """Core AI engine: returns ranked courier options for a customer query."""
    rates = load_rates()

    # Filter by destination
    filtered = [
        r for r in rates
        if r["destination"].lower() == req.destination.lower()
        and req.weight_kg >= r["min_weight_kg"]
    ]

    # Filter by service preference
    if req.service_preference and req.service_preference != "Any":
        pref_filtered = [r for r in filtered if r["service_type"] == req.service_preference]
        if pref_filtered:
            filtered = pref_filtered

    if not filtered:
        raise HTTPException(
            status_code=404,
            detail=f"No rates found for destination '{req.destination}'. Try checking spelling or use /destinations to see available cities."
        )

    # Score all options
    scored = [ai_score_v2(r, req) for r in filtered]
    scored.sort(key=lambda x: x["ai_score"], reverse=True)

    # Apply budget filter (soft - keep but flag)
    if req.max_budget_rs:
        for s in scored:
            if s["calculated_total_rs"] > req.max_budget_rs:
                s["warnings"].append(f"Exceeds your budget of Rs {req.max_budget_rs:,.0f}")

    # Tag top options
    if scored:
        scored[0]["recommended"] = True
        scored[0]["tags"].append("AI Recommended")

    # Best value: lowest cost with score > 40
    valid = [s for s in scored if s["ai_score"] > 40]
    if valid:
        cheapest = min(valid, key=lambda x: x["calculated_total_rs"])
        cheapest["best_value"] = True
        if "Best Value" not in cheapest["tags"]:
            cheapest["tags"].append("Best Value")

    # Fastest option
    def day_rank(s):
        order = ["Same Day", "1 Day", "2-3 Days", "4-6 Days", "7-10 Days"]
        return order.index(s["estimated_days"]) if s["estimated_days"] in order else 99
    fastest = min(scored, key=day_rank)
    fastest["fastest"] = True
    if "Fastest" not in fastest["tags"]:
        fastest["tags"].append("Fastest")

    # Most reliable
    most_reliable = max(scored, key=lambda x: x["reliability_pct"])
    if "Most Reliable" not in most_reliable["tags"]:
        most_reliable["tags"].append("Most Reliable")

    # Summary stats
    costs = [s["calculated_total_rs"] for s in scored]
    return {
        "query": req.dict(),
        "total_options": len(scored),
        "results": scored,
        "ai_recommendation": {
            "top_pick":     scored[0]["courier"] if scored else None,
            "service_type": scored[0]["service_type"] if scored else None,
            "total_rs":     scored[0]["calculated_total_rs"] if scored else None,
            "ai_score":     scored[0]["ai_score"] if scored else None,
            "reason":       _build_recommendation_reason(scored[0], req) if scored else ""
        },
        "summary": {
            "cheapest_rs":       min(costs),
            "most_expensive_rs": max(costs),
            "avg_cost_rs":       round(sum(costs) / len(costs), 2),
            "fastest_delivery":  fastest["estimated_days"],
            "highest_ai_score":  scored[0]["ai_score"] if scored else 0,
            "options_in_budget": len([s for s in scored if not req.max_budget_rs or s["calculated_total_rs"] <= req.max_budget_rs]),
        }
    }

def _build_recommendation_reason(top: dict, req) -> str:
    priority = getattr(req, "priority", "balanced")
    reasons = []
    if priority == "cheapest":
        reasons.append(f"lowest effective cost at Rs {top['calculated_total_rs']:,.0f}")
    elif priority == "fastest":
        reasons.append(f"fastest delivery in {top['estimated_days']}")
    elif priority == "reliable":
        reasons.append(f"highest reliability at {top['reliability_pct']}%")
    else:
        reasons.append(f"best balance of cost (Rs {top['calculated_total_rs']:,.0f}), speed ({top['estimated_days']}), and reliability ({top['reliability_pct']}%)")
    return f"Recommended for {priority} priority: {', '.join(reasons)}. AI Score: {top['ai_score']}/100."


@app.post("/upload-rates")
async def upload_rates(
    courier_name: str = Form(...),
    file: UploadFile = File(...)
):
    """Upload a PDF or Excel rate card and parse it into the rate store."""
    content = await file.read()
    filename = file.filename or ""
    new_rows = []

    try:
        if filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(content))
            df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]
            for _, row in df.iterrows():
                try:
                    new_rows.append({
                        "id":               f"{courier_name}-{row.get('service_type','STD')}-{row.get('destination','UNK')}".replace(" ", "_"),
                        "courier":          courier_name,
                        "service_type":     str(row.get("service_type", "Standard")),
                        "destination":      str(row.get("destination", "Unknown")),
                        "zone":             str(row.get("zone", "Unknown")),
                        "coverage":         str(row.get("coverage", "Unknown")),
                        "base_rate_rs":     float(row.get("base_rate_rs", row.get("base_rate", 0))),
                        "per_kg_rate_rs":   float(row.get("per_kg_rate_rs", row.get("per_kg", 0))),
                        "min_weight_kg":    float(row.get("min_weight_kg", 0.5)),
                        "max_weight_kg":    float(row.get("max_weight_kg", 70)),
                        "cod_available":    bool(row.get("cod_available", True)),
                        "insurance_pct":    float(row.get("insurance_pct", 0.8)),
                        "reliability_pct":  float(row.get("reliability_pct", 85)),
                        "estimated_days":   str(row.get("estimated_days", "4-6 Days")),
                        "days_num":         int(row.get("days_num", 5)),
                        "source":           filename,
                        "last_updated":     datetime.now().isoformat()[:10],
                    })
                except Exception:
                    continue

        elif filename.endswith(".pdf"):
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    tables = page.extract_tables()
                    for table in tables:
                        if not table or len(table) < 2:
                            continue
                        headers = [str(h).strip().lower().replace(" ", "_") for h in table[0]]
                        for row_data in table[1:]:
                            row = dict(zip(headers, row_data))
                            try:
                                new_rows.append({
                                    "id":               f"{courier_name}-{row.get('service_type','STD')}-{row.get('destination','UNK')}".replace(" ", "_"),
                                    "courier":          courier_name,
                                    "service_type":     str(row.get("service_type", "Standard")),
                                    "destination":      str(row.get("destination", "Unknown")),
                                    "zone":             str(row.get("zone", "Unknown")),
                                    "coverage":         "Unknown",
                                    "base_rate_rs":     float(re.sub(r"[^\d.]", "", str(row.get("base_rate_rs", row.get("base_rate", "0")))) or 0),
                                    "per_kg_rate_rs":   float(re.sub(r"[^\d.]", "", str(row.get("per_kg_rate_rs", row.get("per_kg", "0")))) or 0),
                                    "min_weight_kg":    0.5,
                                    "max_weight_kg":    70.0,
                                    "cod_available":    True,
                                    "insurance_pct":    0.8,
                                    "reliability_pct":  85.0,
                                    "estimated_days":   str(row.get("estimated_days", "4-6 Days")),
                                    "days_num":         5,
                                    "source":           filename,
                                    "last_updated":     datetime.now().isoformat()[:10],
                                })
                            except Exception:
                                continue
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Upload .xlsx, .xls, or .pdf")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse file: {str(e)}")

    if not new_rows:
        raise HTTPException(status_code=422, detail="No valid rate rows could be extracted from the file.")

    rates = load_rates()
    existing_ids = {r["id"] for r in rates}
    added, updated = 0, 0
    for row in new_rows:
        if row["id"] in existing_ids:
            rates = [row if r["id"] == row["id"] else r for r in rates]
            updated += 1
        else:
            rates.append(row)
            added += 1

    save_rates(rates)

    # Log the upload
    append_upload_log({
        "courier_name": courier_name,
        "filename": filename,
        "added": added,
        "updated": updated,
        "timestamp": datetime.now().isoformat(),
    })

    return {
        "message":       "Rate card processed successfully",
        "courier":       courier_name,
        "filename":      filename,
        "added":         added,
        "updated":       updated,
        "total_records": len(rates)
    }

@app.post("/add-rate")
def add_rate(rate: RateCard):
    """Manually add or update a single rate entry."""
    rates = load_rates()
    entry = {
        **rate.dict(),
        "id":             f"{rate.courier}-{rate.service_type}-{rate.destination}".replace(" ", "_"),
        "zone":           "Unknown",
        "coverage":       "Unknown",
        "min_weight_kg":  0.5,
        "max_weight_kg":  70.0,
        "days_num":       5,
        "source":         "manual",
        "last_updated":   datetime.now().isoformat()[:10],
    }
    existing = [r for r in rates if r["id"] != entry["id"]]
    existing.append(entry)
    save_rates(existing)
    return {"message": "Rate saved", "entry": entry}

@app.get("/rates")
def list_rates(courier: Optional[str] = None, destination: Optional[str] = None, service_type: Optional[str] = None):
    rates = load_rates()
    if courier:
        rates = [r for r in rates if r["courier"].lower() == courier.lower()]
    if destination:
        rates = [r for r in rates if r["destination"].lower() == destination.lower()]
    if service_type:
        rates = [r for r in rates if r["service_type"].lower() == service_type.lower()]
    return {"total": len(rates), "rates": rates}

@app.delete("/rates/{rate_id}")
def delete_rate(rate_id: str):
    rates = load_rates()
    new_rates = [r for r in rates if r["id"] != rate_id]
    if len(new_rates) == len(rates):
        raise HTTPException(status_code=404, detail="Rate not found")
    save_rates(new_rates)
    return {"message": "Rate deleted"}

@app.get("/stats")
def get_stats():
    rates = load_rates()
    couriers    = list({r["courier"] for r in rates})
    destinations = list({r["destination"] for r in rates})
    service_types = list({r["service_type"] for r in rates})
    uploads = load_uploads_log()
    return {
        "total_rates":         len(rates),
        "total_couriers":      len(couriers),
        "total_destinations":  len(destinations),
        "total_service_types": len(service_types),
        "total_uploads":       len(uploads),
        "couriers":            sorted(couriers),
        "destinations":        sorted(destinations),
        "service_types":       sorted(service_types),
        "recent_uploads":      uploads[-5:] if uploads else [],
    }

@app.get("/uploads")
def get_uploads():
    """Return upload history log."""
    return {"uploads": load_uploads_log()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
