from rest_framework import serializers
from .models import (
    City,
    Place,
    Amenities,
    Accommodation,
    Restaurant,
    User,
    Admin,
    Client,
    Cuisine,
    Booking,
    Review,
    ClientCuisine,
    Browses,
    Curates,
    Writes,
    Serves,
)


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"


class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = "__all__"


class AmenitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenities
        fields = "__all__"


class AccommodationSerializer(serializers.ModelSerializer):
    amenities = AmenitiesSerializer(many=True, read_only=True)
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = Accommodation
        fields = "__all__"


class RestaurantSerializer(serializers.ModelSerializer):
    place = PlaceSerializer()

    class Meta:
        model = Restaurant
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = ["user"]


class ClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Client
        fields = "__all__"


class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = "__all__"


class BookingSerializer(serializers.ModelSerializer):
    place = PlaceSerializer(read_only=True)
    class Meta:
        model = Booking
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class ClientCuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientCuisine
        fields = "__all__"


class BrowsesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Browses
        fields = "__all__"


class CuratesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curates
        fields = "__all__"


class WritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Writes
        fields = "__all__"


class ServesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Serves
        fields = "__all__"

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']  # only username and password


