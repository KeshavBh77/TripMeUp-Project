
from django.http import HttpResponse
from django.shortcuts import render
from .models import City
from rest_framework.views import APIView, HttpResponseBase
from .serializers import CitySerializer
from rest_framework.response import Response

# Create your views here.

class CityListView(APIView):
   def get(self, request):
      cities = City.objects.all().values()
      serializer = CitySerializer(cities, many=True)
      return Response(cities)

