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
# router.register(r"cities", CityListView, basename="city-list")
router.register(r"city", CityDetailView, basename="city-detail")
router.register(r"", HomeListView, basename="home")

urlpatterns = [
    path("", include(router.urls)),


path("city/<str:name>/", CityDetailView.as_view({'get': 'retrieve'}), name="city-detail"),
]
