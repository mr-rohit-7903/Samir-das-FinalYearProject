from django.urls import path
from . import views

urlpatterns = [
    path('events/create/', views.create_event, name='create_event'),
    path('events/delete/<int:pk>/', views.delete_event, name='delete_event'),
    path('api/events/', views.event_list_api, name='event_list_api'),
]
