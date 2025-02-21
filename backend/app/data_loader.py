import json
import os
import random
from typing import Dict, List
from pathlib import Path

# Dictionary to store animals by region
animals_by_region: Dict[int, List[dict]] = {
    1: [],  # Diana (Northern)
    2: [],  # Sava (Northeastern)
    3: [],  # Analamanga (Central)
    4: [],  # Atsinanana (Eastern)
    5: []   # Menabe (Western)
}

# Global list to store all animals
all_animals: List[dict] = []

def load_animals_from_csv() -> bool:
    """Load animals from JSON file and distribute them to regions."""
    try:
        # Clear existing data
        all_animals.clear()
        for region_id in animals_by_region:
            animals_by_region[region_id].clear()
            
        # Define paths relative to the workspace root
        workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        json_path = os.path.join(workspace_root, 'Animals_Madagascar.json')
        photos_dir = os.path.join(workspace_root, 'Animals_Photo')
        
        print(f"Loading animals from: {json_path}")
        print(f"Photos directory: {photos_dir}")
        
        if not os.path.exists(json_path):
            print(f"Error: JSON file not found at {json_path}")
            return False
            
        if not os.path.exists(photos_dir):
            print(f"Error: Photos directory not found at {photos_dir}")
            return False

        # Get list of available photos
        available_photos = {
            file.stem.lower(): file.name 
            for file in Path(photos_dir).glob('*.jpg')
        }
        
        print(f"Found {len(available_photos)} photos")
        
        # Load and parse JSON file
        with open(json_path, 'r', encoding='utf-8') as f:
            animals_data = json.load(f)
            
        print(f"Loaded {len(animals_data)} animals from JSON")
        
        # Process each animal
        for i, animal in enumerate(animals_data):
            try:
                # Find matching photo
                photo_name = animal['Common Name'].lower()
                image_filename = available_photos.get(photo_name)
                
                if not image_filename:
                    print(f"Warning: No photo found for {animal['Common Name']}")
                    continue
                    
                # Copy photo to static directory
                source_path = os.path.join(photos_dir, image_filename)
                dest_dir = os.path.join('app', 'static', 'animal-images')
                os.makedirs(dest_dir, exist_ok=True)
                dest_path = os.path.join(dest_dir, image_filename)
                
                # Copy only if not already exists
                if not os.path.exists(dest_path):
                    import shutil
                    shutil.copy2(source_path, dest_path)
                
                image_url = f"/static/animal-images/{image_filename}"
                    
                animal_data = {
                    'id': i + 1,
                    'name': animal['Common Name'],
                    'scientific_name': animal['Scientific Name'],
                    'risk_level': animal['Risk Level'].split('(')[0].strip(),
                    'description': animal['Description'],
                    'type': animal['Type'],
                    'region': animal['Region'],
                    'habitat': animal['Habitat'],
                    'image_url': image_url
                }
                
                # Add to global list
                all_animals.append(animal_data)
                
                # Distribute to regions based on region description
                region = animal['Region'].lower()
                regions = set()  # Use set to avoid duplicates
                
                # Map region descriptions to regions
                if any(x in region for x in ['northern', 'north']):
                    regions.add(1)  # Diana
                if any(x in region for x in ['northeastern', 'ne ']):
                    regions.add(2)  # Sava
                if 'central' in region:
                    regions.add(3)  # Analamanga
                if 'eastern' in region:
                    regions.add(4)  # Atsinanana
                if 'western' in region:
                    regions.add(5)  # Menabe
                
                # If no specific region found or "throughout Madagascar", add to all regions
                if not regions or 'throughout' in region:
                    regions = {1, 2, 3, 4, 5}
                
                # Add the animal to its regions
                for region_id in regions:
                    animals_by_region[region_id].append(animal_data)
                    
            except KeyError as e:
                print(f"Warning: Skipping animal due to missing field: {e}")
                continue
        
        print(f"Successfully processed {len(all_animals)} animals")
        for region_id, animals in animals_by_region.items():
            print(f"Region {region_id}: {len(animals)} animals")
            
        return True
            
    except Exception as e:
        print(f"Unexpected error loading JSON file: {e}")
        import traceback
        traceback.print_exc()
        return False

def get_all_animals() -> List[dict]:
    """Get all animals."""
    return all_animals

def get_animals_for_region(region_id: int) -> List[dict]:
    """Get animals for a specific region."""
    return animals_by_region.get(region_id, []) 