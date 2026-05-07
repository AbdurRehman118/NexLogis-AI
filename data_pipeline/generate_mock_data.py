import pandas as pd
import numpy as np
import os

# Set seed for reproducibility
np.random.seed(42)

NUM_RECORDS = 50000

couriers = ['Pakistan Post', 'TCS', 'M&P', 'Leopard']
categories = ['City to City', 'Local', 'Overnight', 'Same Day', 'Overland', 'Economy']
regions = ['Islamabad', 'Punjab', 'Sindh', 'Pakhtunkhwa', 'Balochistan']

# Base rates for categories
base_rates = {
    'City to City': 250,
    'Local': 180,
    'Overnight': 400,
    'Same Day': 300,
    'Overland': 150,
    'Economy': 120
}

# Courier multipliers (some couriers are more premium)
courier_multipliers = {
    'Pakistan Post': 1.0,
    'Leopard': 1.1,
    'M&P': 1.2,
    'TCS': 1.4
}

# Region GST
gst_rates = {
    'Islamabad': 0.16,
    'Punjab': 0.16,
    'Sindh': 0.13,
    'Pakhtunkhwa': 0.15,
    'Balochistan': 0.15
}

def generate_mock_data(num_records):
    print(f"Generating {num_records} mock records...")
    
    data = []
    for _ in range(num_records):
        courier = np.random.choice(couriers)
        
        # Valid categories per courier (simplified logic)
        if courier == 'Pakistan Post':
            cat = np.random.choice(['City to City', 'Local'])
        elif courier == 'Leopard':
            cat = np.random.choice(['Overland', 'Economy', 'Overnight'])
        else:
            cat = np.random.choice(categories)
            
        region = np.random.choice(regions)
        
        # Weight distribution (skewed towards lighter packages)
        weight_kg = round(np.random.exponential(scale=3.0) + 0.1, 2)
        if weight_kg > 50:
            weight_kg = 50.0
            
        # Insured value
        if np.random.rand() > 0.5:
            insured_value = 0
        else:
            insured_value = np.random.choice([10000, 20000, 50000, 100000])
            
        # Calculate base rate based on weight and category
        rate = base_rates[cat]
        
        # Add weight cost
        if weight_kg <= 0.5:
            rate += 0  # included in base
        else:
            extra_weight = weight_kg - 0.5
            if cat in ['Local', 'Economy']:
                rate += extra_weight * 30
            else:
                rate += extra_weight * 70
                
        # Apply courier multiplier
        rate *= courier_multipliers[courier]
        
        # Add insurance cost (e.g. 1% of insured value)
        insurance_cost = insured_value * 0.01
        rate += insurance_cost
        
        # Add some random noise (-5% to +5%)
        noise = np.random.uniform(0.95, 1.05)
        rate *= noise
        
        # Add GST
        rate = rate * (1 + gst_rates[region])
        
        # Round to nearest integer
        rate = int(round(rate))
        
        data.append([courier, cat, region, weight_kg, insured_value, rate])
        
    df = pd.DataFrame(data, columns=['Courier', 'Service_Category', 'Destination_Region', 'Weight_kg', 'Insured_Value_Rs', 'Rate_Rs'])
    return df

if __name__ == "__main__":
    df = generate_mock_data(NUM_RECORDS)
    
    # Save to data/processed
    output_path = os.path.join("data", "processed", "clean_rates.csv")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Successfully generated {NUM_RECORDS} records and saved to {output_path}")
    print(df.head())
