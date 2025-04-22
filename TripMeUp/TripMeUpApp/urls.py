from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

# Register viewsets with appropriate base names
router.register(r"city", CityDetailView, basename="city-detail")
router.register(r"places", PlaceDetailView, basename="place-detail")
router.register(r"accommodation", AccommodationDetailView, basename="accommodation-detail")
router.register(r"restaurants", RestaurantDetailView, basename="restaurant-detail")
router.register(r'home', HomeViewSet, basename='home') 
router.register(r"reviews", ReviewViewSet, basename="review")
router.register(r"users", UserViewSet, basename="user")
router.register(r'place-list',PlaceViewSet, basename='place-list')
router.register(r"admins", AdminViewSet, basename="admin")

router.register(r'booking',BookingViewSet, basename='booking')


urlpatterns = [
    path("", include(router.urls))
]
