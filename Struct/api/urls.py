# api/urls.py
from django.urls import path
from .views import UserRegistrationView

# These URLs will be included under the /api/ prefix
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    # Add other API endpoints here
    # path('login/', LoginView.as_view(), name='login'),
    # path('users/', UserListView.as_view(), name='user-list'),
    # etc.
]