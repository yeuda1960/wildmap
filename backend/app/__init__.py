from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Ensure the static/animal-images directory exists
    images_dir = os.path.join(app.static_folder, 'animal-images')
    os.makedirs(images_dir, exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Configure CORS to allow requests from frontend
    allowed_origins = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
    CORS(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Register blueprints
    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Register error handlers
    from app.errors import bp as errors_bp
    app.register_blueprint(errors_bp)

    # Initialize data from JSON
    from app.data_loader import load_animals_from_csv
    with app.app_context():
        print("Loading animals data...")
        if load_animals_from_csv():
            print("Animals data loaded successfully")
        else:
            print("Failed to load animals data")

    return app

from app import models 