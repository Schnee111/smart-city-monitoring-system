#!/usr/bin/env python3
"""
Sensor Seeder Script
Creates initial sensors in the backend if none exist.
"""

import os
import json
import random
import requests
from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:8080/api/v1')

# Jakarta coordinates boundaries
JAKARTA_LAT_MIN = -6.35
JAKARTA_LAT_MAX = -6.10
JAKARTA_LON_MIN = 106.70
JAKARTA_LON_MAX = 107.00

# District center coordinates (approximate)
DISTRICT_CENTERS = {
    'Jakarta Pusat': (-6.1751, 106.8650),
    'Jakarta Selatan': (-6.2615, 106.8106),
    'Jakarta Utara': (-6.1214, 106.9004),
    'Jakarta Barat': (-6.1681, 106.7588),
    'Jakarta Timur': (-6.2250, 106.9004),
}


def load_district_config():
    """Load district configuration."""
    config_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'districts.json')
    with open(config_path, 'r') as f:
        return json.load(f)


def generate_coordinates(district_name):
    """Generate random coordinates near district center."""
    if district_name in DISTRICT_CENTERS:
        center_lat, center_lon = DISTRICT_CENTERS[district_name]
        # Random offset within ~2km
        lat = center_lat + random.uniform(-0.02, 0.02)
        lon = center_lon + random.uniform(-0.02, 0.02)
    else:
        # Random within Jakarta
        lat = random.uniform(JAKARTA_LAT_MIN, JAKARTA_LAT_MAX)
        lon = random.uniform(JAKARTA_LON_MIN, JAKARTA_LON_MAX)
    
    return round(lat, 6), round(lon, 6)


def create_sensor(district_name, energy_source):
    """Create a sensor via the API."""
    lat, lon = generate_coordinates(district_name)
    
    payload = {
        'districtName': district_name,
        'latitude': lat,
        'longitude': lon,
        'energySource': energy_source
    }
    
    try:
        response = requests.post(
            f'{API_BASE_URL}/sensors',
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 201:
            data = response.json()
            sensor_id = data.get('data', {}).get('sensorId', 'unknown')[:8]
            print(f"  ✅ Created: {district_name} ({energy_source}) - ID: {sensor_id}...")
            return True
        else:
            print(f"  ❌ Failed to create sensor: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("  ❌ Cannot connect to backend")
        return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False


def check_existing_sensors():
    """Check if sensors already exist."""
    try:
        response = requests.get(f'{API_BASE_URL}/sensors', timeout=10)
        if response.status_code == 200:
            data = response.json()
            sensors = data.get('data', [])
            return len(sensors)
    except:
        pass
    return 0


def main():
    print("\n" + "="*60)
    print("🌱 SENSOR SEEDER - Smart City Energy Monitoring")
    print("="*60)
    print(f"📡 API URL: {API_BASE_URL}")
    print("="*60 + "\n")
    
    # Check existing sensors
    existing = check_existing_sensors()
    if existing > 0:
        print(f"⚠️  Found {existing} existing sensors")
        choice = input("Do you want to add more sensors? (y/n): ").lower()
        if choice != 'y':
            print("👋 Exiting...")
            return
    
    # Load configuration
    config = load_district_config()
    districts = config.get('districts', [])
    energy_sources = config.get('energy_sources', ['Solar', 'Grid'])
    
    print("\n🔧 Creating sensors...")
    print("-" * 40)
    
    total_created = 0
    for district in districts:
        district_name = district.get('name')
        sensors_count = district.get('sensors_count', 3)
        
        print(f"\n📍 {district_name} ({sensors_count} sensors)")
        
        for i in range(sensors_count):
            # Alternate between Solar and Grid
            energy_source = energy_sources[i % len(energy_sources)]
            if create_sensor(district_name, energy_source):
                total_created += 1
    
    print("\n" + "="*60)
    print(f"✅ Created {total_created} sensors successfully!")
    print("="*60)
    print("\nYou can now run the energy simulator:")
    print("  python scripts/sensor_gen.py")


if __name__ == '__main__':
    main()
