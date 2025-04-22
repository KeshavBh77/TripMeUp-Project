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
from rest_framework import viewsets, status
from .models import City
from .serializers import CitySerializer
from rest_framework.reverse import reverse

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


class ReviewView(ModelViewSet):
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
    queryset = User.objects.all().order_by('user_id')
    serializer_class = UserSerializer
    lookup_field = 'user_id'

    def perform_create(self, serializer):
        user = serializer.save()
        Client.objects.create(user=user)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by("-review_id")
    serializer_class = ReviewSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def list(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id')

        if user_id:
            bookings = Booking.objects.filter(client__user__user_id=user_id)
        else:
            bookings = Booking.objects.none()

        if not bookings.exists():
            return Response([], status=status.HTTP_200_OK)

        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        place_id = request.data.get('place_id')
        starting_date = request.data.get('starting_date')
        ending_date = request.data.get('ending_date')
        no_of_guests = request.data.get('no_of_guests')

        if not all([user_id, place_id, starting_date, ending_date, no_of_guests]):
            return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = Client.objects.get(user__user_id=user_id)
            place = Place.objects.get(place_id=place_id)

            booking = Booking.objects.create(
                client=client,
                place=place,
                starting_date=starting_date,
                ending_date=ending_date,
                no_of_guests=no_of_guests
            )

            serializer = BookingSerializer(booking)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)
        except Place.DoesNotExist:
            return Response({"error": "Place not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PlaceViewSet(viewsets.ViewSet):
    def list(self, request):
        places = Place.objects.all()
        serializer = PlaceSerializer(places, many=True)
        return Response(serializer.data)

class CheckAdmin(viewsets.ViewSet):
    def list(self, request):
        is_admin = request.session.get('is_admin')
        return Response({"admin": is_admin}, status=status.HTTP_200_OK)

class AdminLoginSet(viewsets.ViewSet):
    def create(self, request):
        global my_user
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            my_user = User.objects.get(username=username)
        except my_user.DoesNotExist:
            return Response({'error': 'Invalid credentials.'},status=status.HTTP_400_BAD_REQUEST)

        if my_user.password != password:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)

        is_admin = Admin.objects.filter(user=my_user).exists()
        if not is_admin:
            return Response({'error': 'Not an admin.'}, status=status.HTTP_400_BAD_REQUEST)

        request.session['user_id'] = my_user.user_id
        request.session['username'] = my_user.username
        request.session['is_authenticated'] = True
        request.session['is_admin'] = True

        return Response({
            'message': 'Admin login successful',
            'username': my_user.username,
        }, status=status.HTTP_200_OK)
