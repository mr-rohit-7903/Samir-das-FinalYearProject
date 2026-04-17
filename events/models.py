from django.db import models
from django.utils import timezone


class Event(models.Model):
    LOCATION_CHOICES = [
        ('Outdoor Garden Venue', 'Outdoor Garden Venue'),
        ('Luxury Hotel Ballroom', 'Luxury Hotel Ballroom'),
        ('Beachside Pavilion', 'Beachside Pavilion'),
        ('Rooftop Terrace', 'Rooftop Terrace'),
        ('Heritage Haveli', 'Heritage Haveli'),
        ('Community Hall', 'Community Hall'),
    ]

    DECOR_CHOICES = [
        ('Floral Fantasy', 'Floral Fantasy'),
        ('Fairy Lights & Drapes', 'Fairy Lights & Drapes'),
        ('Royal Gold & Red', 'Royal Gold & Red'),
        ('Minimalist Modern', 'Minimalist Modern'),
        ('Boho & Rustic', 'Boho & Rustic'),
    ]

    FOOD_CHOICES = [
        ('Veg Buffet (100 pax)', 'Veg Buffet (100 pax)'),
        ('Non-Veg Buffet (100 pax)', 'Non-Veg Buffet (100 pax)'),
        ('Multi-Cuisine (100 pax)', 'Multi-Cuisine (100 pax)'),
        ('Dessert & Snacks Bar', 'Dessert & Snacks Bar'),
        ('Live Food Stations', 'Live Food Stations'),
    ]

    name = models.CharField(max_length=200, verbose_name="Event Name")
    location = models.CharField(max_length=100, choices=LOCATION_CHOICES, verbose_name="Venue")
    decoration = models.CharField(max_length=100, choices=DECOR_CHOICES, verbose_name="Decoration Style")
    food = models.CharField(max_length=100, choices=FOOD_CHOICES, verbose_name="Catering Option")
    extras = models.TextField(blank=True, verbose_name="Additional Services",
                              help_text="Comma-separated list of extra services selected")
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total Cost (₹)")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Created On")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return f"{self.name} — ₹{self.total_cost:,.0f}"

    def extras_list(self):
        """Return extras as a Python list."""
        if not self.extras:
            return []
        return [e.strip() for e in self.extras.split(',') if e.strip()]

    def formatted_cost(self):
        return f"₹{int(self.total_cost):,}"
