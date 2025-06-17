# api/urls.py
from django.urls import path
from .views import UserRegistrationView, LoginView, ClassCreateView, JoinClassView, UserClassesView, DeleteClassView, LeaveClassView, TypeTestProgressCreateView, UserTypeTestProgressView, UserTypeTestBestProgressView, UserProgressView, ClassUserWPMView, SnakeGameProgressCreateView, UserSnakeGameProgressView, UserSnakeGameBestProgressView, SnakeGameLevelStatsView, SnakeGameOverallStatsView, ClassSnakeGameDataView, UserHeartsView  
from . import views

# These URLs will be included under the /api/ prefix
urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),

    # Profile Management
    path('user/profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('user/update-profile-photo/', views.update_profile_photo, name='update_profile_photo'),
    
    # Heart Management
    path('user/hearts/', UserHeartsView.as_view(), name='user_hearts'),

    # Class Management
    path('classes/create/', ClassCreateView.as_view(), name='create_class'),
    path('classes/join/', JoinClassView.as_view(), name='join_class'),
    path('classes/user/', UserClassesView.as_view(), name='user_classes'),
    path('classes/delete/<int:pk>/', DeleteClassView.as_view(), name='delete_class'),
    path('classes/leave/<int:pk>/', LeaveClassView.as_view(), name='leave_class'),

    path('classes/<int:class_id>/students/', views.ClassStudentsView.as_view(), name='class_students'),
    path('classes/<int:class_id>/add-student/', views.AddStudentToClassView.as_view(), name='add_student_to_class'),
    path('classes/<int:class_id>/remove-student/<int:student_id>/', views.RemoveStudentFromClassView.as_view(), name='remove_student_from_class'),

    # Endpoint to submit new type test progress
    path('progress/create/', TypeTestProgressCreateView.as_view(), name='typetest-progress-create'),

    # Endpoint to get all type test progress for the current user
    path('progress/me/', UserTypeTestProgressView.as_view(), name='typetest-my-progress'),

    # Endpoint to get the best progress for each level for the current user
    path('progress/me/best/', UserTypeTestBestProgressView.as_view(), name='typetest-my-best-progress'),
    path('user-progress/', UserProgressView.as_view(), name='user-progress'),


    path('classes/<int:class_id>/users/wpm/', ClassUserWPMView.as_view(), name='class-users-wpm'),
   
    # Sortshift API Endpoints
    path('selection-sort/results/', views.SelectionSortResultCreateView.as_view(), name='selection_sort_results'),
    path('bubble-sort/results/', views.BubbleSortResultCreateView.as_view(), name='bubble_sort_results'),
    path('insertion-sort/results/', views.InsertionSortResultCreateView.as_view(), name='insertion_sort_results'),
    path('classes/<int:class_id>/sortshift/', views.ClassSortShiftDataView.as_view(), name='class_sortshift_data'),
    # Add other API endpoints here
    # path('login/', LoginView.as_view(), name='login'),
    # path('users/', UserListView.as_view(), name='user-list'),
    # etc.
    
     # Snake Game Progress Endpoints
    path('snake-progress/', SnakeGameProgressCreateView.as_view(), name='snake-progress-create'),
    path('snake-progress/me/', UserSnakeGameProgressView.as_view(), name='snake-my-progress'),
    path('snake-progress/me/best/', UserSnakeGameBestProgressView.as_view(), name='snake-my-best-progress'),
    path('snake-progress/level/<int:level>/stats/', SnakeGameLevelStatsView.as_view(), name='snake-level-stats'),
    path('snake-progress/stats/', SnakeGameOverallStatsView.as_view(), name='snake-overall-stats'),
    path('classes/<int:class_id>/snake-game/', ClassSnakeGameDataView.as_view(), name='class-snake-game-data'),
]
