
from django.http import HttpResponse
from django.shortcuts import render
from .models import *
from rest_framework.views import APIView, HttpResponseBase
from .serializers import *
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.viewsets import ModelViewSet
# Create your views here.
class CityListSearch(ListAPIView):
   def get(self,request,*args,**kwargs):
      queryset = City.objects.all()
      serializer = CitySerializer(queryset, many=True)
      return Response(serializer.data)
class CityDetailView(ModelViewSet):
   queryset = City.objects.all()
   serializer_class = CitySerializer
   lookup_field = 'name'
   def retrieve(self, request, *args, **kwargs):
      city = self.get_object()  # Gets the City object based on 'name' from URL
      serializer_city = self.get_serializer(city)

      # Get all Places that belong to this City
      places = Place.objects.filter(city=city)
      serializer_places = PlaceSerializer(places, many=True)

      return Response({
         'city': serializer_city.data,
         'places': serializer_places.data
      })

