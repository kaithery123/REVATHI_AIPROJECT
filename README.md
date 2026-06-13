# Ai_project
# API DOCUMENTATION

 AI Customer Support Ticket System



## Project Overview
This project is a Django REST API with JWT authentication and AI-powered ticket support system.

---

## Authentication APIs

### Register User
POST /api/register/

Request:
{
  "username": "user",
  "email": "user@gmail.com",
  "password": "123456"
}

---

### Login (JWT)
POST /api/token/

Request:
{
  "username": "user",
  "password": "123456"
}

Response:
{
  "access": "token",
  "refresh": "token"
}

---

## Ticket APIs

### Create Ticket
POST /api/tickets/
Authorization: Bearer <token>

Request:
{
  "title": "Login issue",
  "description": "Cannot login"
}

Response:
{
  "id": 1,
  "title": "Login Issue",
  "description": "Cannot login",
  "category": "Authentication",
  "status": "RESOLVED",
  "ai_response": "Please reset your password..."
}
---

### Get All Tickets
GET /api/tickets/
Authorization: Bearer <token>

---

### Get Single Ticket
GET /api/tickets/<id>/

---

### Delete Ticket
DELETE /api/tickets/<id>/

---

## AI Features

- Auto category detection:
  Authentication, Billing, Technical, Account, Other

- AI response generation using Gemini API

---



---

## Tech Stack

- Django
- Django REST Framework
- JWT Authentication
- Google Gemini AI
- HTML/CSS/JS

---

## How to Run

1. pip install -r requirements.txt
2. python manage.py runserver
3. Open http://127.0.0.1:8000
