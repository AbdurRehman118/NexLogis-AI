import pandas as pd
from fpdf import FPDF
import os

# Create directory if not exists
output_dir = "test_rate_cards"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 1. Generate Excel Rate Card
excel_data = {
    'service_type': ['Same Day', 'Next Day', 'Standard', 'Economy'],
    'destination': ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad'],
    'base_rate_rs': [500, 300, 200, 150],
    'per_kg_rate_rs': [100, 80, 60, 40],
    'estimated_days': ['Same Day', '1 Day', '4-6 Days', '7-10 Days'],
    'cod_available': [True, True, True, True],
    'insurance_pct': [1.0, 0.8, 0.5, 0.5],
    'reliability_pct': [98, 95, 90, 85]
}
df = pd.DataFrame(excel_data)
df.to_excel(os.path.join(output_dir, "Dummy_TCS_Rates.xlsx"), index=False)
print(f"Generated: {os.path.join(output_dir, 'Dummy_TCS_Rates.xlsx')}")

# 2. Generate PDF Rate Card
class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(80)
        self.cell(30, 10, 'Leopards Courier Official Rate Card', 0, 0, 'C')
        self.ln(20)

    def rate_table(self, header, data):
        self.set_font('Arial', 'B', 10)
        # Column widths
        widths = [30, 30, 30, 30, 30]
        for i, h in enumerate(header):
            self.cell(widths[i], 7, h, 1)
        self.ln()
        self.set_font('Arial', '', 10)
        for row in data:
            for i, item in enumerate(row):
                self.cell(widths[i], 6, str(item), 1)
            self.ln()

pdf = PDF()
pdf.add_page()
headers = ['service_type', 'destination', 'base_rate_rs', 'per_kg_rate_rs', 'estimated_days']
data = [
    ['Same Day', 'Karachi', '550', '110', 'Same Day'],
    ['Next Day', 'Lahore', '320', '85', '1 Day'],
    ['Standard', 'Islamabad', '210', '65', '4-6 Days'],
    ['Economy', 'Faisalabad', '160', '45', '7-10 Days']
]
pdf.rate_table(headers, data)
pdf.output(os.path.join(output_dir, "Dummy_Leopards_Rates.pdf"))
print(f"Generated: {os.path.join(output_dir, 'Dummy_Leopards_Rates.pdf')}")
