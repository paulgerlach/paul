import json
import random
from datetime import datetime, timedelta

def generate_realistic_values(device_type, day_offset):
    """Generate realistic meter readings based on device type and time"""
    base_values = {
        'Heat': 650,     # Wh - heating energy
        'Water': 2.0,    # m³ - water volume 
        'WWater': 1.5,   # m³ - warm water volume
        'Elec': 7000     # Wh - electrical energy
    }
    
    # Seasonal variations (day 0 = July 26, day 45 = Sep 9)
    seasonal_factor = 1.0
    if device_type == 'Heat':
        # Less heating in summer, more in early fall
        seasonal_factor = 0.3 + (day_offset / 45) * 0.4
    
    # Daily variations (slightly random)
    daily_variation = random.uniform(0.85, 1.15)
    
    base = base_values[device_type]
    
    if device_type in ['Water', 'WWater']:
        # Volume meters - cumulative but with daily increments
        daily_increment = random.uniform(0.05, 0.3)
        return round(base + (day_offset * daily_increment) + random.uniform(-0.1, 0.1), 3)
    else:
        # Energy meters - daily consumption with variations
        return int(base * seasonal_factor * daily_variation + random.uniform(-50, 50))

def generate_hourly_values(device_type, base_value):
    """Generate 24-hour values (IV,0 to IV,30 in 2-hour intervals)"""
    values = {}
    
    for i in range(0, 32, 2):  # 0, 2, 4, ..., 30 (16 values for 2-hour intervals)
        if device_type in ['Water', 'WWater']:
            # Volume doesn't have hourly intervals in the original data
            continue
        else:
            # Energy values with hourly variations
            hour_factor = random.uniform(0.8, 1.2)
            values[f"IV,{i},0,0,Wh,E"] = int(base_value * hour_factor)
    
    return values

# Load existing data
with open('data.json', 'r') as f:
    existing_data = json.load(f)

# Extract device information
device_info = {}
for item in existing_data:
    device_type = item.get('Device Type')
    device_id = item.get('ID')
    manufacturer = item.get('Manufacturer')
    
    if device_type and device_id:
        if device_type not in device_info:
            device_info[device_type] = []
        
        # Only add if we haven't seen this device ID before
        if not any(d['ID'] == device_id for d in device_info[device_type]):
            device_info[device_type].append({
                'ID': device_id,
                'Manufacturer': manufacturer,
                'template': item  # Store full template
            })

# Generate data for last 46 days (July 26, 2025 to September 9, 2025)
start_date = datetime(2025, 7, 26)
new_data = []

for day in range(46):  # 46 days
    current_date = start_date + timedelta(days=day)
    
    # Generate random times for each device on this day
    for device_type, devices in device_info.items():
        for device in devices:
            # Create new entry based on template
            template = device['template'].copy()
            
            # Update date/time (random time during the day)
            hour = random.randint(0, 23)
            minute = random.randint(0, 59)
            date_str = f"{current_date.strftime('%d.%m.%Y')} {hour:02d}:{minute:02d} invalid 0 summer time 0"
            template["IV,0,0,0,,Date/Time"] = date_str
            
            # Generate realistic values
            if device_type == 'Heat':
                base_energy = generate_realistic_values('Heat', day)
                template["IV,0,0,0,Wh,E"] = base_energy
                
                # Update volume (heating systems)
                vol_increment = random.uniform(0.01, 0.05)
                new_vol = template["IV,0,0,0,m^3,Vol"] + vol_increment
                template["IV,0,0,0,m^3,Vol"] = round(new_vol, 3)
                
                # Generate hourly energy values
                hourly_values = generate_hourly_values('Heat', base_energy)
                template.update(hourly_values)
                
            elif device_type == 'Water':
                new_vol = generate_realistic_values('Water', day)
                template["IV,0,0,0,m^3,Vol"] = new_vol
                
            elif device_type == 'WWater':
                new_vol = generate_realistic_values('WWater', day)
                template["IV,0,0,0,m^3,Vol"] = new_vol
                # Some WWater devices have energy readings
                if "IV,14,0,0,Wh,E" in template:
                    template["IV,14,0,0,Wh,E"] = random.randint(250, 300)
                    
            elif device_type == 'Elec':
                base_energy = generate_realistic_values('Elec', day)
                template["IV,0,0,0,Wh,E"] = base_energy
                
                # Volume should be 0 for electric meters
                template["IV,0,0,0,m^3,Vol"] = 0
                
                # Generate hourly energy values
                hourly_values = generate_hourly_values('Elec', base_energy)
                template.update(hourly_values)
            
            # Update access number (incremental)
            template["Access Number"] = template.get("Access Number", 0) + random.randint(1, 3)
            
            new_data.append(template)

# Combine existing and new data
all_data = existing_data + new_data

# Save to file
with open('data.json', 'w') as f:
    json.dump(all_data, f, indent=2)

print(f"Generated {len(new_data)} new entries for 46 days")
print(f"Total entries: {len(all_data)}")
print(f"Date range: July 26, 2025 to September 9, 2025")
