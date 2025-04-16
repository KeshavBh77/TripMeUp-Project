from django.urls import path
from . import views

urlpatterns = [
 path('city/',views.CityListView.as_view(),name = 'city'),
]