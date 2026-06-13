from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Ticket


#admin.site.register(Ticket)
from django.contrib import admin
from .models import Ticket

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'category',
        'status',
        'user',
        'created_at',
    )

    list_filter = (
        'status',
        'category',
    )

    search_fields = (
        'title',
        'description',
    )