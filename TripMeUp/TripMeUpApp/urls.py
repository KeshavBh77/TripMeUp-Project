from django.urls import path
from . import views

urlpatterns = [
 path('',views.CityListView.as_view(),name = 'home'),
]