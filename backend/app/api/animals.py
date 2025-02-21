from flask import jsonify, request
from flask_jwt_extended import jwt_required
from app import db
from app.api import bp
from app.models import Animal, Region
from app.api.decorators import admin_required
from app.data_loader import get_all_animals

@bp.route('/animals', methods=['GET'])
def get_animals():
    try:
        # Get all animals from our JSON data
        animals = get_all_animals()
        print(f"Retrieved {len(animals)} animals from data loader")
        
        if not animals:
            print("Warning: No animals returned from data loader")
            return jsonify({
                'error': 'No animals found'
            }), 404
            
        return jsonify({
            'items': animals,
            'total': len(animals)
        })
        
    except Exception as e:
        print(f"Error in get_animals: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to load animals'
        }), 500

@bp.route('/animals/<int:id>', methods=['GET'])
def get_animal(id):
    try:
        # Get all animals from our JSON data
        animals = get_all_animals()
        
        # Find the animal with the matching ID
        animal = next((animal for animal in animals if animal['id'] == id), None)
        
        if not animal:
            return jsonify({
                'error': 'Animal not found'
            }), 404
            
        # Return all fields from the JSON data
        return jsonify({
            'id': animal['id'],
            'name': animal['name'],
            'scientific_name': animal['scientific_name'],
            'type': animal['type'],
            'risk_level': animal['risk_level'],
            'description': animal['description'],
            'region': animal['region'],
            'habitat': animal['habitat'],
            'image_url': animal['image_url']
        })
        
    except Exception as e:
        print(f"Error getting animal details: {e}")
        import traceback
        traceback.print_exc()  # This will print the full error traceback
        return jsonify({
            'error': 'Failed to load animal details'
        }), 500

@bp.route('/animals', methods=['POST'])
@jwt_required()
@admin_required
def create_animal():
    data = request.get_json()
    
    animal = Animal(
        name=data['name'],
        scientific_name=data.get('scientific_name'),
        description=data.get('description'),
        risk_level=data.get('risk_level'),
        image_url=data.get('image_url')
    )
    
    if 'region_ids' in data:
        regions = Region.query.filter(Region.id.in_(data['region_ids'])).all()
        animal.regions = regions
    
    db.session.add(animal)
    db.session.commit()
    
    return jsonify({
        'id': animal.id,
        'name': animal.name,
        'message': 'Animal created successfully'
    }), 201

@bp.route('/animals/<int:id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_animal(id):
    animal = Animal.query.get_or_404(id)
    data = request.get_json()
    
    animal.name = data.get('name', animal.name)
    animal.scientific_name = data.get('scientific_name', animal.scientific_name)
    animal.description = data.get('description', animal.description)
    animal.risk_level = data.get('risk_level', animal.risk_level)
    animal.image_url = data.get('image_url', animal.image_url)
    
    if 'region_ids' in data:
        regions = Region.query.filter(Region.id.in_(data['region_ids'])).all()
        animal.regions = regions
    
    db.session.commit()
    
    return jsonify({
        'message': 'Animal updated successfully'
    })

@bp.route('/animals/<int:id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_animal(id):
    animal = Animal.query.get_or_404(id)
    db.session.delete(animal)
    db.session.commit()
    
    return jsonify({
        'message': 'Animal deleted successfully'
    })

@bp.route('/all-animals', methods=['GET'])
def get_all_animals_endpoint():
    try:
        # Get all animals from our JSON data
        animals = get_all_animals()
        print(f"Retrieved {len(animals)} animals from data loader")
        
        if not animals:
            print("Warning: No animals returned from data loader")
            return jsonify({
                'error': 'No animals found'
            }), 404
            
        return jsonify({
            'items': animals,
            'total': len(animals)
        })
        
    except Exception as e:
        print(f"Error in get_all_animals_endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'Failed to load animals'
        }), 500 