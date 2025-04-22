from django.http import HttpResponse
from django.shortcuts import render
from .models import *
from rest_framework.views import APIView, HttpResponseBase
from .serializers import *
from rest_framework.response import Response
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from .models import City
from .serializers import CitySerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import User
from .serializers import LoginSerializer
from django.contrib.auth.hashers import check_password
# Create your views here.
class HomeViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing API endpoints
    """

    def list(self, request):
        return Response(
            {
                "api": "TripMeUpApp",
                "endpoints": {
                    "cities": "/api/cities/",
                    "places": "/api/places/",

                },
            }
        )


class CityDetailView(ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    lookup_field = "name"

    def get_object(self):
        name = self.kwargs.get("name")
        try:
            return City.objects.get(name__iexact=name)
        except City.DoesNotExist:
            raise NotFound("City not found")

    def retrieve(self, request, *args, **kwargs):
        city = self.get_object()
        serializer_city = self.get_serializer(city)

        # Get all Places that belong to this City
        places = Place.objects.filter(city=city)
        serializer_places = PlaceSerializer(places, many=True)

        return Response(
            {"city": serializer_city.data, "places": serializer_places.data}
        )


class CreateBookingView(ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class CreateReviewView(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


class PlaceDetailView(ModelViewSet):
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer
    lookup_field = "name"

    def get_object(self):
        name = self.kwargs.get("name")
        try:
            return Place.objects.get(name__iexact=name)
        except Place.DoesNotExist:
            raise NotFound("Place not found")

    def retrieve(self, request, *args, **kwargs):
        place = self.get_object()
        serializer = PlaceSerializer(place)
        return Response(serializer.data)


class AccommodationDetailView(ModelViewSet):
    queryset = Accommodation.objects.all()
    serializer_class = AccommodationSerializer
    lookup_field = "name"

    def get_object(self):
        name = self.kwargs.get("name")
        try:
            return Accommodation.objects.get(name__iexact=name)
        except Accommodation.DoesNotExist:
            raise NotFound("Place not found")

    def retrieve(self, request, *args, **kwargs):
        place = self.get_object()
        serializer = AccommodationSerializer(place)
        return Response(serializer.data)


class RestaurantDetailView(ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    lookup_field = "name"

    def get_object(self):
        name = self.kwargs.get("name")
        try:
            return Restaurant.objects.get(name__iexact=name)
        except Restaurant.DoesNotExist:
            raise NotFound("Restaurant not found")

    def retrieve(self, request, *args, **kwargs):
        restaurant = self.get_object()
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LoginView(viewsets.ViewSet):
    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(username=username)
                if user.password == password:
                    return Response({
                        "message": "Login successful",
                        "user_id": user.user_id,
                        "username": user.username,
                        "email": user.email,
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

