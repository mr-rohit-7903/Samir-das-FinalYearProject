import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from .models import Event

# Cost lookup (mirrors frontend constants)
COSTS = {
    # Locations
    'Outdoor Garden Venue': 45000,
    'Luxury Hotel Ballroom': 120000,
    'Beachside Pavilion': 75000,
    'Rooftop Terrace': 60000,
    'Heritage Haveli': 95000,
    'Community Hall': 18000,
    # Decor
    'Floral Fantasy': 35000,
    'Fairy Lights & Drapes': 22000,
    'Royal Gold & Red': 55000,
    'Minimalist Modern': 18000,
    'Boho & Rustic': 28000,
    # Food
    'Veg Buffet (100 pax)': 40000,
    'Non-Veg Buffet (100 pax)': 60000,
    'Multi-Cuisine (100 pax)': 85000,
    'Dessert & Snacks Bar': 20000,
    'Live Food Stations': 35000,
    # Extras
    'Professional DJ': 25000,
    'Photography (8hr)': 40000,
    'Videography': 30000,
    'Event Coordinator': 15000,
    'Floral Car Decoration': 8000,
    'Photo Booth': 12000,
    'Live Music Band': 55000,
}


LOCATIONS = [
    ('Outdoor Garden Venue', 45000), ('Luxury Hotel Ballroom', 120000),
    ('Beachside Pavilion', 75000), ('Rooftop Terrace', 60000),
    ('Heritage Haveli', 95000), ('Community Hall', 18000),
]
DECORATIONS = [
    ('Floral Fantasy', 35000), ('Fairy Lights & Drapes', 22000),
    ('Royal Gold & Red', 55000), ('Minimalist Modern', 18000), ('Boho & Rustic', 28000),
]
FOOD_OPTIONS = [
    ('Veg Buffet (100 pax)', 40000), ('Non-Veg Buffet (100 pax)', 60000),
    ('Multi-Cuisine (100 pax)', 85000), ('Dessert & Snacks Bar', 20000), ('Live Food Stations', 35000),
]
EXTRAS_OPTIONS = [
    ('Professional DJ', 25000), ('Photography (8hr)', 40000), ('Videography', 30000),
    ('Event Coordinator', 15000), ('Floral Car Decoration', 8000),
    ('Photo Booth', 12000), ('Live Music Band', 55000),
]


def index(request):
    """Main page: show create form + all saved events."""
    events = Event.objects.all()
    context = {
        'events': events,
        'costs_json': json.dumps(COSTS),
        'locations': LOCATIONS,
        'decorations': DECORATIONS,
        'food_options': FOOD_OPTIONS,
        'extras': EXTRAS_OPTIONS,
    }
    return render(request, 'events/index.html', context)


@csrf_exempt
def create_event(request):
    """Handle POST from the frontend form (both AJAX JSON and regular form)."""
    if request.method != 'POST':
        return redirect('index')

    # Support both JSON (fetch API) and multipart form submissions
    if request.content_type and 'application/json' in request.content_type:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)
    else:
        data = request.POST

    name = data.get('name', '').strip()
    location = data.get('location', '').strip()
    decoration = data.get('decoration', '').strip()
    food = data.get('food', '').strip()

    # extras can arrive as a comma string or a JSON list
    extras_raw = data.get('extras', '')
    if isinstance(extras_raw, list):
        extras_list = extras_raw
    else:
        extras_list = [e.strip() for e in extras_raw.split(',') if e.strip()]
    extras_str = ', '.join(extras_list)

    # --- Validation ---
    errors = []
    if not name:
        errors.append('Event name is required.')
    if not location:
        errors.append('Please select a location.')
    if not decoration:
        errors.append('Please select a decoration style.')
    if not food:
        errors.append('Please select a food option.')

    if errors:
        if request.content_type and 'application/json' in request.content_type:
            return JsonResponse({'success': False, 'errors': errors}, status=400)
        for e in errors:
            messages.error(request, e)
        return redirect('index')

    # --- Compute total cost server-side ---
    total = 0
    total += COSTS.get(location, 0)
    total += COSTS.get(decoration, 0)
    total += COSTS.get(food, 0)
    for extra in extras_list:
        total += COSTS.get(extra, 0)

    event = Event.objects.create(
        name=name,
        location=location,
        decoration=decoration,
        food=food,
        extras=extras_str,
        total_cost=total,
    )

    if request.content_type and 'application/json' in request.content_type:
        return JsonResponse({
            'success': True,
            'event': {
                'id': event.id,
                'name': event.name,
                'location': event.location,
                'decoration': event.decoration,
                'food': event.food,
                'extras': event.extras_list(),
                'total_cost': int(event.total_cost),
                'formatted_cost': event.formatted_cost(),
                'created_at': event.created_at.strftime('%d %b %Y'),
            }
        }, status=201)

    messages.success(request, f'Event "{name}" saved successfully!')
    return redirect('index')


@csrf_exempt
def delete_event(request, pk):
    """Delete an event by ID."""
    event = get_object_or_404(Event, pk=pk)

    if request.method in ('POST', 'DELETE'):
        event_name = event.name
        event.delete()

        if request.content_type and 'application/json' in request.content_type:
            return JsonResponse({'success': True, 'deleted_id': pk})

        messages.success(request, f'Event "{event_name}" deleted.')
        return redirect('index')

    return JsonResponse({'error': 'Method not allowed'}, status=405)


def event_list_api(request):
    """JSON endpoint: return all events."""
    events = Event.objects.all()
    data = [
        {
            'id': e.id,
            'name': e.name,
            'location': e.location,
            'decoration': e.decoration,
            'food': e.food,
            'extras': e.extras_list(),
            'total_cost': int(e.total_cost),
            'formatted_cost': e.formatted_cost(),
            'created_at': e.created_at.strftime('%d %b %Y'),
        }
        for e in events
    ]
    return JsonResponse({'events': data})
