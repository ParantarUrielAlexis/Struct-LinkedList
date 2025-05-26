# api/urls.py
from django.urls import path
from .views import UserRegistrationView, LoginView, ClassCreateView, JoinClassView, UserClassesView, DeleteClassView, LeaveClassView, TypeTestProgressCreateView, UserTypeTestProgressView, UserTypeTestBestProgressView, UserProgressView
from . import views
from .views import UserRegistrationView, LoginView, ClassCreateView, JoinClassView, UserClassesView, DeleteClassView, LeaveClassView

# These URLs will be included under the /api/ prefix
urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),

    # Profile Management
    path('user/profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('user/update-profile-photo/', views.update_profile_photo, name='update_profile_photo'),

    # Class Management
    path('classes/create/', ClassCreateView.as_view(), name='create_class'),
    path('classes/join/', JoinClassView.as_view(), name='join_class'),
    path('classes/user/', UserClassesView.as_view(), name='user_classes'),
    path('classes/delete/<int:pk>/', DeleteClassView.as_view(), name='delete_class'),
    path('classes/leave/<int:pk>/', LeaveClassView.as_view(), name='leave_class'),

    # Endpoint to submit new type test progress
    path('progress/create/', TypeTestProgressCreateView.as_view(), name='typetest-progress-create'),

    # Endpoint to get all type test progress for the current user
    path('progress/me/', UserTypeTestProgressView.as_view(), name='typetest-my-progress'),

    # Endpoint to get the best progress for each level for the current user
    path('progress/me/best/', UserTypeTestBestProgressView.as_view(), name='typetest-my-best-progress'),
    path('user-progress/', UserProgressView.as_view(), name='user-progress')
    # Add other API endpoints here
    # path('login/', LoginView.as_view(), name='login'),
    # path('users/', UserListView.as_view(), name='user-list'),
    # etc.
]
