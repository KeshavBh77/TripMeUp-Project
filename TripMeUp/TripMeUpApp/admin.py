from django.contrib import admin
from .models import *

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    pass

@admin.register(Writes)
class WritesAdmin(admin.ModelAdmin):
    pass
@admin.register(ClientCuisine)
class CCAdmin(admin.ModelAdmin):
    pass