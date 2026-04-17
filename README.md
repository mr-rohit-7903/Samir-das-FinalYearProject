# Smart Event Organizer System

A full-stack Django web application to create, price, and manage custom events.

## Project Structure

```
smart_event_organizer/
├── manage.py
├── requirements.txt
├── db.sqlite3                  ← auto-created on first run
├── smart_event_organizer/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── events/
    ├── __init__.py
    ├── apps.py
    ├── admin.py
    ├── models.py               ← Event model
    ├── views.py                ← All view logic + cost calculation
    ├── urls.py                 ← URL routing
    └── templates/
        └── events/
            └── index.html      ← Full frontend (form + card list)
```

## Quick Start

### 1. Install Python (3.10+) and pip

### 2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Apply migrations (creates SQLite database)
```bash
python manage.py migrate
```

### 5. Create an admin user (optional — for /admin panel)
```bash
python manage.py createsuperuser
```

### 6. Run the development server
```bash
python manage.py runserver
```

### 7. Open in browser
- Main app:   http://127.0.0.1:8000/
- Admin panel: http://127.0.0.1:8000/admin/
- JSON API:   http://127.0.0.1:8000/api/events/

---

## Features

| Feature | Details |
|---|---|
| Create Event | Custom name + select location, decoration, food, extras |
| Real-time Cost | JS calculates total instantly as you select options |
| Save to DB | POST to Django → stored in SQLite via ORM |
| View Events | Card-based list of all saved events |
| Delete Events | One-click delete with confirmation |
| Admin Panel | Full CRUD at /admin/ with filters and search |
| JSON API | GET /api/events/ returns all events as JSON |
| Validation | Client-side JS + server-side Django validation |
| Responsive | Works on mobile, tablet, desktop |

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

## API Endpoints

| Method | URL | Action |
|---|---|---|
| GET | / | Main app page |
| POST | /events/create/ | Create new event |
| POST | /events/delete/<id>/ | Delete event |
| GET | /api/events/ | JSON list of all events |

The create endpoint accepts both regular HTML form POST and `application/json` POST for AJAX usage.
# Samir-das-FinalYearProject
