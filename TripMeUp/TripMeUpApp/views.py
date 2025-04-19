
from django.http import HttpResponse
from django.shortcuts import render
from .models import *
from rest_framework.views import APIView, HttpResponseBase
from .serializers import *
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, RetrieveUpdateAPIView
# Create your views here.

class CityListView(ListAPIView):
   def get(self, request, *args,**kwargs):
      cities = City.objects.all().values()
      serializer = CitySerializer(cities, many=True)
      return Response(serializer.data)

