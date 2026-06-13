from django.urls import path

from .views import (
    RegisterView,
    TicketListCreateView,
    TicketDetailView,
    GenerateAIView,
    AdminCheckView,
    AdminTicketListView,
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('tickets/', TicketListCreateView.as_view()),
    path('tickets/<int:pk>/', TicketDetailView.as_view()),
    
    path(
        'tickets/<int:pk>/generate-ai/',
        GenerateAIView.as_view()
    ),
    path("admin-check/", AdminCheckView.as_view() ),  
    path('admin-tickets/', AdminTicketListView.as_view()),
]