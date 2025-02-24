from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def sample_data(request):
    return JsonResponse({'message': 'Hello from Uriel!'})
