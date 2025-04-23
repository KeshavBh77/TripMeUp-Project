from django.contrib import admin
from .models import *


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    pass

@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    pass

@admin.register(Amenities)
class AmenitiesAdmin(admin.ModelAdmin):
    pass

@admin.register(Accommodation)
class AccommodationAdmin(admin.ModelAdmin):
    pass

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    pass

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass

@admin.register(Admin)
class AdminModelAdmin(admin.ModelAdmin):
    pass

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    pass


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    pass

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    pass

@admin.register(Browses)
class BrowsesAdmin(admin.ModelAdmin):
    pass

@admin.register(Curates)
class CuratesAdmin(admin.ModelAdmin):
    pass

@admin.register(Writes)
class WritesAdmin(admin.ModelAdmin):
    pass

