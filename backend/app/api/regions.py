from flask import jsonify, request
from flask_jwt_extended import jwt_required
import json
from app import db
from app.api import bp
from app.models import Region
from app.api.decorators import admin_required
from app.data_loader import get_animals_for_region, get_all_animals

@bp.route('/regions', methods=['GET'])
def get_regions():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    pagination = Region.query.paginate(page=page, per_page=per_page)
    regions = pagination.items
    
    return jsonify({
        'items': [{
            'id': region.id,
            'name': region.name,
            'description': region.description,
            'coordinates': json.loads(region.coordinates) if region.coordinates else None,
            'animal_count': len(region.animals)
        } for region in regions],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@bp.route('/regions/<int:id>', methods=['GET'])
def get_region(id):
    try:
        # Get region info from our predefined regions
        region_info = {
            1: {"name": "Diana", "description": "Northern region of Madagascar"},
            2: {"name": "Sava", "description": "Northeastern region of Madagascar"},
            3: {"name": "Analamanga", "description": "Central region containing the capital Antananarivo"},
            4: {"name": "Atsinanana", "description": "Eastern coastal region"},
            5: {"name": "Menabe", "description": "Western coastal region"}
        }.get(id)
        
        if not region_info:
            return jsonify({
                'error': 'Region not found'
            }), 404
        
        # Get animals for the region from our JSON data
        animals = get_animals_for_region(id)
        print(f"Found {len(animals)} animals for region {id}")  # Debug print
        
        return jsonify({
            'id': id,
            'name': region_info['name'],
            'description': region_info['description'],
            'animals': animals
        })
        
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({
            'error': 'Failed to load region information'
        }), 500

@bp.route('/regions', methods=['POST'])
@jwt_required()
@admin_required
def create_region():
    data = request.get_json()
    
    region = Region(
        name=data['name'],
        description=data.get('description'),
        coordinates=json.dumps(data.get('coordinates'))
    )
    
    db.session.add(region)
    db.session.commit()
    
    return jsonify({
        'id': region.id,
        'name': region.name,
        'message': 'Region created successfully'
    }), 201

@bp.route('/regions/<int:id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_region(id):
    region = Region.query.get_or_404(id)
    data = request.get_json()
    
    region.name = data.get('name', region.name)
    region.description = data.get('description', region.description)
    
    if 'coordinates' in data:
        region.coordinates = json.dumps(data['coordinates'])
    
    db.session.commit()
    
    return jsonify({
        'message': 'Region updated successfully'
    })

@bp.route('/regions/<int:id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_region(id):
    region = Region.query.get_or_404(id)
    db.session.delete(region)
    db.session.commit()
    
    return jsonify({
        'message': 'Region deleted successfully'
    })

@bp.route('/all-animals', methods=['GET'])
def get_all_animals_list():
    try:
        animals = get_all_animals()
        print(f"Returning {len(animals)} animals")  # Debug print
        return jsonify({
            'items': animals,
            'total': len(animals)
        })
    except Exception as e:
        print(f"Error getting animals: {e}")
        return jsonify({
            'error': 'Failed to load animals'
        }), 500 