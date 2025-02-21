# WildMap - Madagascar Wildlife Mapping System

A comprehensive web application for mapping and tracking wildlife across different regions of Madagascar. This interactive platform allows users to explore wildlife information through an intuitive map interface and detailed animal database.

## Features

### 🗺️ Interactive Map
- Region-based wildlife exploration
- Interactive region highlighting
- Detailed region information panels
- Real-time animal data display by region
- Dynamic filtering of animals by risk level

### 🦁 Wildlife Database
- Comprehensive animal catalog with detailed information:
  - Common Name
  - Scientific Name
  - Type (Mammal, Bird, Insect, etc.)
  - Region (Geographic location in Madagascar)
  - Habitat (Specific environmental conditions)
  - Risk Level (Conservation status)
  - Description
  - High-quality animal images
- Risk level categorization:
  - Critically Endangered (CR)
  - Endangered (EN)
  - Vulnerable (VU)
  - Least Concern (LC)
  - Not Evaluated (NE)

### 🔍 Search & Filter
- Full-text search across animal names and scientific names
- Risk level filtering with color-coded indicators
- Grouped display by conservation status
- Alphabetical sorting within groups

### 📱 User Interface
- Modern, responsive Material-UI design
- Intuitive navigation
- High-quality image display
- Interactive animal cards
- Detailed animal profiles
- Color-coded risk level indicators

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Leaflet** - Interactive maps
- **Axios** - API client

### Backend
- **Python Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing

### Data Storage
- **File-based Storage** - Using JSON files for data persistence
  - No traditional database required
  - Animal data stored in `Animals_Madagascar.json`
  - Images stored in filesystem
  - Simple and portable data structure
  - Easy to version control
  - Suitable for static datasets

## Data Structure

### Animal Data Storage
The application uses a file-based approach for data storage:

#### JSON Data File (`Animals_Madagascar.json`)
- Contains all animal information
- Structured data format
- Easy to maintain and version control
```json
{
  "Common Name": "String",
  "Scientific Name": "String",
  "Type": "String",
  "Region": "String",
  "Habitat": "String",
  "Risk Level": "String",
  "Description": "String"
}
```

#### Image Storage
- Animal images stored in filesystem
- Original images in `Animals_Photo/`
- Processed images in `backend/app/static/animal-images/`
- Images referenced by filename in JSON data
- Supported format: JPG

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- Git

### Project Structure Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wildmap.git
   cd wildmap
   ```

2. Create necessary directories:
   ```bash
   mkdir -p backend/app/static/animal-images
   ```

3. Place animal images:
   ```bash
   # Place all animal images in Animals_Photo directory
   # Image filenames should match the animal common names from Animals_Madagascar.json
   ```

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Unix/MacOS
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run the server:
   ```bash
   flask run
   ```
   Server will start at http://localhost:5000

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm start
   ```
   Application will open at http://localhost:3000

## Environment Variables

### Backend (.env)
```
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=5000
```

## API Endpoints

### Animals
- `GET /api/all-animals` - Get complete animal list
- `GET /api/animals/{id}` - Get animal details

### Regions
- `GET /api/regions` - List all regions
- `GET /api/regions/{id}` - Get region details with animals

## Project Structure
```
wildmap/
├── Animals_Madagascar.json    # Animal data
├── Animals_Photo/            # Animal images
├── backend/
│   ├── app/
│   │   ├── api/             # API endpoints
│   │   ├── static/          # Static files
│   │   │   └── animal-images/  # Processed images
│   │   └── data_loader.py   # Data initialization
│   ├── .env                 # Backend environment variables
│   └── requirements.txt     # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── config/          # API configuration
    │   └── hooks/           # Custom React hooks
    ├── .env                 # Frontend environment variables
    └── package.json         # JavaScript dependencies
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
This is an academic project and is not open for public contributions.

## License
This project is created for academic purposes and is not licensed for public or commercial use. 