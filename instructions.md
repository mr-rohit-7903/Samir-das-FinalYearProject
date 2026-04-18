# Setup & Deployment Instructions

## Project Structure

```
smart_event_organizer/
├── frontend/                    ← Static frontend (GitHub Pages)
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── config.js            ← ⚠️ Set your backend URL here
│       ├── data.js
│       ├── ui.js
│       ├── calculator.js
│       ├── events.js
│       └── app.js
├── events/                      ← Django app (API only)
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── smart_event_organizer/       ← Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
├── requirements.txt
└── README.md
```

---

## Local Development

### Backend
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend runs at `http://127.0.0.1:8000/`

### Frontend
Open `frontend/index.html` directly in a browser, or use VS Code Live Server.

> **Tip:** For local dev with API sync, set `API_BASE = 'http://127.0.0.1:8000'` in `config.js`.

---

## 🚀 Deployment Guide

### Part 1: Deploy Backend on PythonAnywhere

#### Step 1 — Create an Account
1. Go to [pythonanywhere.com](https://www.pythonanywhere.com/) and sign up for a **free account**
2. Note your username (e.g., `samir123`) — your site will be at `samir123.pythonanywhere.com`

#### Step 2 — Upload the Code
1. Open a **Bash console** from the PythonAnywhere dashboard
2. Clone your repository:
   ```bash
   git clone https://github.com/mr-rohit-7903/Samir-das-FinalYearProject.git
   ```

#### Step 3 — Set Up Virtual Environment
```bash
cd Samir-das-FinalYearProject
mkvirtualenv --python=/usr/bin/python3.10 eventenv
pip install -r requirements.txt
```

#### Step 4 — Initialize the Database
```bash
python manage.py migrate
python manage.py createsuperuser
```
Follow the prompts to set admin username and password.

#### Step 5 — Configure the Web App
1. Go to the **Web** tab on PythonAnywhere dashboard
2. Click **"Add a new web app"**
3. Choose **Manual configuration** → **Python 3.10**
4. Set the following:

| Setting | Value |
|---|---|
| **Source code** | `/home/yourusername/Samir-das-FinalYearProject` |
| **Virtualenv** | `/home/yourusername/.virtualenvs/eventenv` |

5. Click on the **WSGI configuration file** link and **replace its entire contents** with:

```python
import os
import sys

path = '/home/yourusername/Samir-das-FinalYearProject'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'smart_event_organizer.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

> ⚠️ Replace `yourusername` with your actual PythonAnywhere username in both the path and virtualenv settings.

#### Step 6 — Update `ALLOWED_HOSTS` (if needed)
The `settings.py` already has `ALLOWED_HOSTS = ['*']`, so this should work out of the box. For production, you can restrict it:
```python
ALLOWED_HOSTS = ['yourusername.pythonanywhere.com']
```

#### Step 7 — Reload & Test
1. Go back to the **Web** tab
2. Click the green **"Reload"** button
3. Visit `https://yourusername.pythonanywhere.com/api/events/` — you should see `{"events": []}`
4. Visit `https://yourusername.pythonanywhere.com/admin/` — log in with your superuser credentials

✅ **Backend is live!**

---

### Part 2: Deploy Frontend on GitHub Pages

#### Step 1 — Set the Backend URL
Open `frontend/js/config.js` and set your PythonAnywhere URL:

```javascript
const API_BASE = 'https://yourusername.pythonanywhere.com';
```

> ⚠️ **No trailing slash!** Use `https://yourusername.pythonanywhere.com` not `https://yourusername.pythonanywhere.com/`

#### Step 2 — Push Changes to GitHub
```bash
git add .
git commit -m "Set backend URL for deployment"
git push
```

#### Step 3 — Enable GitHub Pages
1. Go to your repository on GitHub: `https://github.com/mr-rohit-7903/Samir-das-FinalYearProject`
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Select branch: **main**, folder: **/frontend**
5. Click **Save**

#### Step 4 — Access Your Site
After a minute or two, your frontend will be live at:
```
https://mr-rohit-7903.github.io/Samir-das-FinalYearProject/
```

✅ **Frontend is live!**

---

## API Endpoints

| Method | URL | Action |
|---|---|---|
| POST | /events/create/ | Create new event (JSON body) |
| POST | /events/delete/\<id\>/ | Delete event |
| GET | /api/events/ | JSON list of all events |
| GET | /admin/ | Django admin panel |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| CORS errors in browser console | Make sure your GitHub Pages URL is in `CORS_ALLOWED_ORIGINS` in `settings.py` |
| API returns 404 | Check PythonAnywhere WSGI config and reload the web app |
| Events not syncing to backend | Check `config.js` has the correct `API_BASE` URL (no trailing slash) |
| Frontend works but no backend | The app works offline with localStorage — backend sync is optional |

