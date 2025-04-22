from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

# old code
# router = DefaultRouter()
# router.register(r'city', CityDetailView, basename='city')
# router.register(r'', HomeListView, basename='home')
# urlpatterns = [
# path('', include(router.urls)),
# ]

router = DefaultRouter()

# Register viewsets with appropriate base names
router.register(r"city", CityDetailView, basename="city-detail")
router.register(r"places", PlaceDetailView, basename="place-detail")
router.register(r"accommodation", AccommodationDetailView, basename="accommodation-detail")
router.register(r"restaurants", RestaurantDetailView, basename="restaurant-detail")
router.register(r'', HomeViewSet, basename='home')

urlpatterns = [
    path("", include(router.urls))
]
