from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter
from django.urls import include, path, re_path
router = DefaultRouter()
router.register(r'city', CityDetailView, basename='city')
urlpatterns = [
path('', include(router.urls)),
]