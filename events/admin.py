from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'decoration', 'food', 'formatted_cost', 'created_at')
    list_filter = ('location', 'decoration', 'food', 'created_at')
    search_fields = ('name', 'extras')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Event Info', {
            'fields': ('name', 'created_at')
        }),
        ('Selections', {
            'fields': ('location', 'decoration', 'food', 'extras')
        }),
        ('Cost', {
            'fields': ('total_cost',)
        }),
    )
