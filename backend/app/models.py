from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), nullable=False, default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Region(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    coordinates = db.Column(db.String(500))  # Store coordinates as JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    animals = db.relationship('Animal', secondary='animal_region', back_populates='regions')

class Animal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    scientific_name = db.Column(db.String(100))
    description = db.Column(db.Text)
    risk_level = db.Column(db.String(50))  # e.g., 'Endangered', 'Vulnerable', 'Safe'
    image_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    regions = db.relationship('Region', secondary='animal_region', back_populates='animals')

# Association table for many-to-many relationship between animals and regions
animal_region = db.Table('animal_region',
    db.Column('animal_id', db.Integer, db.ForeignKey('animal.id'), primary_key=True),
    db.Column('region_id', db.Integer, db.ForeignKey('region.id'), primary_key=True)
) 