from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from django.contrib.auth.models import User
from django.shortcuts import render

from .models import Ticket
from .serializers import UserSerializer, TicketSerializer
from .ai_helper import get_ai_analysis
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class AdminCheckView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "is_admin": request.user.is_superuser
        })

def view_tickets_page(request):
    return render(request, "view_tickets.html")


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AdminTicketListView(generics.ListAPIView):

    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Ticket.objects.all()
        return Ticket.objects.none()
class TicketListCreateView(generics.ListCreateAPIView):

    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)

    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user,
            category="Other",
            ai_response="",
            status="OPEN"
        )


class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)


class GenerateAIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        ticket = Ticket.objects.get(
            id=pk,
            user=request.user
        )

        ticket.status = "IN_PROGRESS"
        ticket.save()

        category, ai_response = get_ai_analysis(
            ticket.description
        )

        ticket.category = category
        ticket.ai_response = ai_response
        ticket.status = "RESOLVED"

        ticket.save()

        return Response({
            "message": "AI response generated successfully"
        })
    
