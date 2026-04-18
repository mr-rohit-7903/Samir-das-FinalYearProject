# Smart Event Organizer

**Samir Das**  
**Arka Jain University, Gamhariya**

## About The Project

Smart Event Organizer is a full-stack event management application designed to help users efficiently manage, customize, and calculate costs for various events. This project was developed as a final year college project by **Samir Das** at **Arka Jain University, Gamhariya**.

## Tech Stack

The application uses a modern, separated frontend and backend architecture:

### Frontend
- **HTML/CSS/JS**: Built with vanilla web technologies.
- **LocalStorage**: Includes offline operation capabilities.
- **Responsive Design**: Adapts natively to mobile, tablet, and desktop devices.

### Backend
- **Python**: The core programming language.
- **Django & Django REST Framework**: Handles API development, backend logic, and business rules.
- **SQLite**: Database management handled via Django ORM.

## Deployment

The application is deployed securely and efficiently across two separate services:
- **Frontend**: Hosted on **GitHub Pages** for fast, edge-cached static file delivery.
- **Backend API**: Hosted on **PythonAnywhere**, providing a cloud-based Python environment for the Django REST API.

---

## Architecture & Functionality

### API Endpoints (Django/Python)
The backend serves a lightweight JSON REST API designed for the frontend to securely interact with the database:

- `POST /events/create/`: Receives raw JSON payloads (containing event name, location, decor, food, and extras). The server validates the selections, computes the final total cost securely (to avoid client-side tampering), saves it to the SQLite database, and returns the event object.
- `POST /events/delete/<id>/`: Handles deletions for specific logged events.
- `GET /api/events/`: Fetches the entire directory of logged events currently stored in the DB, returning a structured JSON list.
- `GET /admin/`: Django’s built-in administration panel for superusers to manage entries manually.

### Frontend Logic (JavaScript)
The frontend uses vanilla JavaScript distributed across modular architectural files:

- **`app.js`**: Functions as the main application controller. It wires together the UI event listeners, option grids, and form submissions. It orchestrates pushing the data to the backend API and toggling local caching.
- **`calculator.js`**: Contains the logic to instantaneously calculate real-time cost estimations on the client side whenever a user clicks an option. It computes and breaks down pricing dynamically without needing to hit the server for every click.
- **`events.js`**: Manages data persistence. It houses the network requests to the Django backend. It securely catches failed internet connections and silently falls back to `localStorage` (Offline Mode).
- **`data.js` & `ui.js`**: `data.js` holds the constant pricing matrices and predefined options for HTML generation. `ui.js` handles the DOM manipulation, populating drop-downs, updating selection cards, and rendering the event list dynamically.

---

> For full setup, local development, and deployment instructions, please see the [**instructions.md**](instructions.md) file.

---

## Event Options & Costs (₹)

### Locations
- Outdoor Garden Venue — ₹45,000
- Luxury Hotel Ballroom — ₹1,20,000
- Beachside Pavilion — ₹75,000
- Rooftop Terrace — ₹60,000
- Heritage Haveli — ₹95,000
- Community Hall — ₹18,000

### Decorations
- Floral Fantasy — ₹35,000
- Fairy Lights & Drapes — ₹22,000
- Royal Gold & Red — ₹55,000
- Minimalist Modern — ₹18,000
- Boho & Rustic — ₹28,000

### Food & Catering (per 100 pax)
- Veg Buffet — ₹40,000
- Non-Veg Buffet — ₹60,000
- Multi-Cuisine — ₹85,000
- Dessert & Snacks Bar — ₹20,000
- Live Food Stations — ₹35,000

### Extras (multi-select)
- Professional DJ — ₹25,000
- Photography 8hr — ₹40,000
- Videography — ₹30,000
- Event Coordinator — ₹15,000
- Floral Car Decoration — ₹8,000
- Photo Booth — ₹12,000
- Live Music Band — ₹55,000
