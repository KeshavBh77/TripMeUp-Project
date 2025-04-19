
from django.http import HttpResponse
from django.shortcuts import render
from .models import *
from rest_framework.views import APIView, HttpResponseBase
from .serializers import *
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, RetrieveUpdateAPIView
# Create your views here.

class CityDetailView(RetrieveAPIView):
   def get(self, request, *args, **kwargs):
      city_id = kwargs.get('pk')

      city_details = City.objects.get(pk=city_id)
      place_details = Place.objects.filter(city=city_details)

      serializer_city = CitySerializer(city_details)
      serializer_place = PlaceSerializer(place_details, many=True)
      return Response({
         'city': serializer_city.data,
         'place': serializer_place.data
      })

