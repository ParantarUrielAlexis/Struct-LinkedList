from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Max, F, Avg
from .serializers import UserRegistrationSerializer
from .models import Class, TypeTestProgress, UserProgress
from .serializers import ClassSerializer, ClassCreateSerializer, TypeTestProgressSerializer, UserProgressSerializer 

from django.core.files.storage import default_storage

from .serializers import UserRegistrationSerializer, UserProfileSerializer
from .models import Class, User
from .serializers import ClassSerializer, ClassCreateSerializer, SelectionSortResultSerializer, BubbleSortResultSerializer, InsertionSortResultSerializer

from .models import SnakeGameProgress
from .serializers import SnakeGameProgressSerializer

from datetime import timedelta
from .models import SelectionSortResult, BubbleSortResult, InsertionSortResult

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "success": True,
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "user_type": user.user_type
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Please provide both email and password'},
                            status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=email, email=email, password=password)

        if not user:
            return Response({'error': 'Invalid credentials'},
                            status=status.HTTP_401_UNAUTHORIZED)

        token, created = Token.objects.get_or_create(user=user)

        # Include profile photo URL if available
        profile_photo_url = None
        if user.profile_photo:
            profile_photo_url = request.build_absolute_uri(user.profile_photo.url)

        return Response({
            'token': token.key,
            'user_id': user.id,
            'email': user.email,
            'username': user.username,
            'user_type': user.user_type,
            'profile_photo_url': profile_photo_url,
            'points': user.points,
            'hearts': user.hearts,
            'hints': user.hints
        }, status=status.HTTP_200_OK)

class ClassCreateView(generics.CreateAPIView):
    serializer_class = ClassCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

class JoinClassView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = request.data.get('code')

        if not code:
            return Response({"error": "Class code is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            class_obj = Class.objects.get(code=code)

            # If user is already enrolled or is the teacher
            if request.user in class_obj.students.all() or class_obj.teacher == request.user:
                return Response({
                    "success": True,
                    "message": "You are already enrolled in this class",
                    "class": ClassSerializer(class_obj).data
                })

            # Add user to the class
            class_obj.students.add(request.user)

            return Response({
                "success": True,
                "message": "Successfully joined the class",
                "class": ClassSerializer(class_obj).data
            })

        except Class.DoesNotExist:
            return Response({"error": "Invalid class code"}, status=status.HTTP_404_NOT_FOUND)

class UserClassesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_classes = {}

        # Get classes where user is a student
        enrolled_classes = user.enrolled_classes.all()

        # Get classes where user is a teacher
        teaching_classes = user.teaching_classes.all()

        return Response({
            "enrolled_classes": ClassSerializer(enrolled_classes, many=True).data,
            "teaching_classes": ClassSerializer(teaching_classes, many=True).data,
            "user_type": user.user_type  # Assuming user_type is available
        })

class DeleteClassView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            class_obj = Class.objects.get(pk=pk)

            # Only the teacher can delete the class
            if request.user != class_obj.teacher:
                return Response({"error": "You do not have permission to delete this class"},
                               status=status.HTTP_403_FORBIDDEN)

            class_obj.delete()
            return Response({"success": True, "message": "Class deleted successfully"})

        except Class.DoesNotExist:
            return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)

class LeaveClassView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            class_obj = Class.objects.get(pk=pk)

            # Check if user is enrolled in the class
            if request.user not in class_obj.students.all():
                return Response({"error": "You are not enrolled in this class"},
                               status=status.HTTP_400_BAD_REQUEST)

            # Remove student from class
            class_obj.students.remove(request.user)

            return Response({
                "success": True,
                "message": "Successfully left the class"
            })

        except Class.DoesNotExist:
            return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)

class TypeTestProgressCreateView(generics.CreateAPIView):
    queryset = TypeTestProgress.objects.all()
    serializer_class = TypeTestProgressSerializer
    permission_classes = [permissions.IsAuthenticated] # Ensure only authenticated users can submit progress

    def perform_create(self, serializer):
        # Automatically assign the logged-in user to the progress record
        serializer.save(user=self.request.user)

class UserTypeTestProgressView(generics.ListAPIView):
    serializer_class = TypeTestProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return all progress records for the authenticated user
        return TypeTestProgress.objects.filter(user=self.request.user)

class UserTypeTestBestProgressView(generics.ListAPIView):
    serializer_class = TypeTestProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Aggregate to find the best stars earned for each level
        # You'll need to decide what "best" means (e.g., highest stars, then highest WPM, then highest score)
        # For simplicity, let's get the highest stars for each level.
        # If multiple entries have the same highest stars, it picks one (e.g., the latest one due to default ordering).

        # This will get the max stars for each level for the current user
        best_progress_subquery = TypeTestProgress.objects.filter(
            user=user
        ).values('level_index').annotate(
            max_stars=Max('stars_earned')
        )

        # Now, fetch the actual TypeTestProgress objects that match these best scores
        # This approach can be tricky if there are ties (multiple entries with max_stars for a level)
        # A more robust way might involve iterating or using window functions (Django 3.2+)

        # A simpler but less efficient way for a small number of levels:
        # Fetch all progress for the user, then group and find the best in Python
        user_progress = TypeTestProgress.objects.filter(user=user).order_by('level_index', '-stars_earned', '-wpm', '-score')

        best_records = {}
        for progress in user_progress:
            if progress.level_index not in best_records:
                best_records[progress.level_index] = progress
            else:
                # If current record has more stars, update
                if progress.stars_earned > best_records[progress.level_index].stars_earned:
                    best_records[progress.level_index] = progress
                # If stars are equal, prioritize WPM
                elif progress.stars_earned == best_records[progress.level_index].stars_earned:
                    if progress.wpm > best_records[progress.level_index].wpm:
                        best_records[progress.level_index] = progress
                    # If WPM is equal, prioritize score
                    elif progress.wpm == best_records[progress.level_index].wpm:
                        if progress.score > best_records[progress.level_index].score:
                            best_records[progress.level_index] = progress

        # Return a list of the best records
        return list(best_records.values())
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile_photo(request):
    """API endpoint to update user profile photo"""
    if 'photo' not in request.FILES:
        return Response({'error': 'No photo provided'}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user

    # Delete old profile photo if it exists
    if user.profile_photo and hasattr(user.profile_photo, 'path') and default_storage.exists(user.profile_photo.path):
        default_storage.delete(user.profile_photo.path)

    # Save new photo
    user.profile_photo = request.FILES['photo']
    user.save()

    # Return the URL of the uploaded photo
    profile_photo_url = None
    if user.profile_photo:
        profile_photo_url = request.build_absolute_uri(user.profile_photo.url)

    return Response({
        'success': True,
        'message': 'Profile photo updated successfully',
        'profile_photo_url': profile_photo_url
    }, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    """API endpoint to get user profile data"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Regenerate hearts before returning profile data
        request.user.regenerate_hearts()
        
        serializer = UserProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        """Update user profile data"""
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        progress, created = UserProgress.objects.get_or_create(user=request.user)
        serializer = UserProgressSerializer(progress)
        return Response(serializer.data)

    def post(self, request):
        progress, created = UserProgress.objects.get_or_create(user=request.user)
        serializer = UserProgressSerializer(progress, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)



class ClassUserWPMView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_id):
        try:
            # Verify the class exists and user has access
            class_obj = Class.objects.get(id=class_id)

            # Check if requester is the teacher or a student in the class
            if request.user != class_obj.teacher and request.user not in class_obj.students.all():
                return Response(
                    {"error": "You don't have permission to view this class data"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Get all students in the class
            students = class_obj.students.all()

            # Collect WPM data for each student
            results = []
            for student in students:
                # Get the student's best WPM for each level they've completed
                progress_data = TypeTestProgress.objects.filter(
                    user=student,
                    all_words_completed=True  # Only count completed levels
                ).values('level_index').annotate(
                    best_wpm=Max('wpm'),
                    avg_wpm=Avg('wpm')
                ).order_by('level_index')

                # Calculate the student's overall average WPM
                overall_avg_wpm = TypeTestProgress.objects.filter(
                    user=student,
                    all_words_completed=True
                ).aggregate(avg_wpm=Avg('wpm'))['avg_wpm'] or 0

                results.append({
                    'user_id': student.id,
                    'username': student.username,
                    'email': student.email,
                    'overall_avg_wpm': round(overall_avg_wpm, 1),
                    'levels': list(progress_data)
                })

            return Response(results)

        except Class.DoesNotExist:
            return Response(
                {"error": "Class not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SelectionSortResultCreateView(generics.CreateAPIView):
    serializer_class = SelectionSortResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # Convert duration from seconds to timedelta before saving
        duration_seconds = self.request.data.get('duration', 0)
        duration = timedelta(seconds=float(duration_seconds))
        
        # Get the user's attempt number
        user = self.request.user
        attempt_count = SelectionSortResult.objects.filter(user=user).count() + 1
        
        serializer.save(
            user=user,
            duration=duration,
            attempt_number=attempt_count
        )

class BubbleSortResultCreateView(generics.CreateAPIView):
    serializer_class = BubbleSortResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # Convert duration from seconds to timedelta before saving
        duration_seconds = self.request.data.get('duration', 0)
        duration = timedelta(seconds=float(duration_seconds))
        
        # Get the user's attempt number
        user = self.request.user
        attempt_count = BubbleSortResult.objects.filter(user=user).count() + 1
        
        serializer.save(
            user=user,
            duration=duration,
            attempt_number=attempt_count
        )

class InsertionSortResultCreateView(generics.CreateAPIView):
    serializer_class = InsertionSortResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # Convert duration from seconds to timedelta before saving
        duration_seconds = self.request.data.get('duration', 0)
        duration = timedelta(seconds=float(duration_seconds))
        
        # Get the user's attempt number
        user = self.request.user
        attempt_count = InsertionSortResult.objects.filter(user=user).count() + 1
        
        serializer.save(
            user=user,
            duration=duration,
            attempt_number=attempt_count
        )

class ClassSortShiftDataView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, class_id):
        """Get SortShift data for all students in a class"""
        try:
            # Check if user is the teacher of this class
            class_obj = Class.objects.get(id=class_id)
            if class_obj.teacher != request.user:
                return Response(
                    {"detail": "You don't have permission to view this class's data."},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            # Get all users in this class
            users = class_obj.students.all()
            
            # Prepare data structure
            result = {}
            
            for user in users:
                # Get selection sort results for this user
                selection_results = SelectionSortResult.objects.filter(user=user)
                
                if selection_results.exists():
                    selection_best_score = selection_results.aggregate(Max('score'))['score__max']
                    selection_best_time = selection_results.order_by('duration').first().duration_seconds
                    selection_avg_time = selection_results.aggregate(Avg('duration'))['duration__avg'].total_seconds()
                    selection_attempts = selection_results.count()
                else:
                    selection_best_score = 0
                    selection_best_time = "-"
                    selection_avg_time = "-"
                    selection_attempts = 0
                
                # Get bubble sort results for this user
                bubble_results = BubbleSortResult.objects.filter(user=user)
                
                if bubble_results.exists():
                    bubble_best_score = bubble_results.aggregate(Max('score'))['score__max']
                    bubble_best_time = bubble_results.order_by('duration').first().duration_seconds
                    bubble_avg_time = bubble_results.aggregate(Avg('duration'))['duration__avg'].total_seconds()
                    bubble_attempts = bubble_results.count()
                else:
                    bubble_best_score = 0
                    bubble_best_time = "-"
                    bubble_avg_time = "-"
                    bubble_attempts = 0
                
                # Get insertion sort results for this user
                insertion_results = InsertionSortResult.objects.filter(user=user)
                
                if insertion_results.exists():
                    insertion_best_score = insertion_results.aggregate(Max('score'))['score__max']
                    insertion_best_time = insertion_results.order_by('duration').first().duration_seconds
                    insertion_avg_time = insertion_results.aggregate(Avg('duration'))['duration__avg'].total_seconds()
                    insertion_attempts = insertion_results.count()
                else:
                    insertion_best_score = 0
                    insertion_best_time = "-"
                    insertion_avg_time = "-"
                    insertion_attempts = 0
                
                result[str(user.id)] = {
                    "selection": {
                        "bestTime": selection_best_time,
                        "avgTime": selection_avg_time,
                        "attempts": selection_attempts,
                        "score": selection_best_score
                    },
                    "bubble": {
                        "bestTime": bubble_best_time,
                        "avgTime": bubble_avg_time,
                        "attempts": bubble_attempts,
                        "score": bubble_best_score
                    },
                    "insertion": {
                        "bestTime": insertion_best_time,
                        "avgTime": insertion_avg_time,
                        "attempts": insertion_attempts,
                        "score": insertion_best_score
                    }
                }
            
            return Response(result)
            
        except Class.DoesNotExist:
            return Response(
                {"detail": "Class not found."},
                status=status.HTTP_404_NOT_FOUND
            )
            
class SnakeGameProgressCreateView(generics.CreateAPIView):
    """
    Create a new snake game progress entry
    """
    serializer_class = SnakeGameProgressSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the user to the current authenticated user
        serializer.save(user=self.request.user)

class UserSnakeGameProgressView(generics.ListAPIView):
    """
    Get all snake game progress for the current user
    """
    serializer_class = SnakeGameProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SnakeGameProgress.objects.filter(user=self.request.user)

class UserSnakeGameBestProgressView(generics.ListAPIView):
    """
    Get the best snake game progress for each level for the current user
    """
    serializer_class = SnakeGameProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        try:
            # Get all progress for the user
            user_progress = SnakeGameProgress.objects.filter(user=user).order_by(
                'level', '-stars_earned', '-score', '-food_eaten', '-time_survived'
            )

            # Find the best record for each level
            best_records = {}
            for progress in user_progress:
                level = progress.level
                if level not in best_records:
                    best_records[level] = progress
                else:
                    current_best = best_records[level]
                    # Compare based on stars first, then score, then food eaten, then time survived
                    if (progress.stars_earned > current_best.stars_earned or
                        (progress.stars_earned == current_best.stars_earned and progress.score > current_best.score) or
                        (progress.stars_earned == current_best.stars_earned and progress.score == current_best.score and progress.food_eaten > current_best.food_eaten) or
                        (progress.stars_earned == current_best.stars_earned and progress.score == current_best.score and progress.food_eaten == current_best.food_eaten and progress.time_survived > current_best.time_survived)):
                        best_records[level] = progress

            # Return the best records sorted by level
            return sorted(best_records.values(), key=lambda x: x.level)
            
        except Exception as e:
            # Log the error for debugging
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in UserSnakeGameBestProgressView: {str(e)}")
            
            # Return empty queryset on error
            return SnakeGameProgress.objects.none()

class SnakeGameLevelStatsView(generics.GenericAPIView):
    """
    Get statistics for a specific level for the current user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, level):
        user = request.user
        
        # Validate level
        if level < 1 or level > 5:
            return Response(
                {"error": "Level must be between 1 and 5"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get all attempts for this level
            attempts = SnakeGameProgress.objects.filter(user=user, level=level)
            
            if not attempts.exists():
                return Response({
                    "level": level,
                    "attempts": 0,
                    "best_score": 0,
                    "best_stars": 0,
                    "total_food_eaten": 0,
                    "best_time_survived": 0,
                    "completion_rate": 0.0
                })
            
            # Calculate statistics
            best_attempt = attempts.order_by('-score').first()
            total_attempts = attempts.count()
            completed_attempts = attempts.filter(game_completed=True).count()
            
            stats = {
                "level": level,
                "attempts": total_attempts,
                "best_score": best_attempt.score if best_attempt else 0,
                "best_stars": attempts.aggregate(Max('stars_earned'))['stars_earned__max'] or 0,
                "total_food_eaten": sum(attempt.food_eaten for attempt in attempts),
                "best_time_survived": attempts.aggregate(Max('time_survived'))['time_survived__max'] or 0,
                "completion_rate": (completed_attempts / total_attempts) * 100 if total_attempts > 0 else 0.0
            }
            
            return Response(stats)
            
        except Exception as e:
            # Log the error for debugging
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in SnakeGameLevelStatsView for level {level}: {str(e)}")
            
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SnakeGameOverallStatsView(generics.GenericAPIView):
    """
    Get overall snake game statistics for the current user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        try:
            all_attempts = SnakeGameProgress.objects.filter(user=user)
            
            if not all_attempts.exists():
                return Response({
                    "total_attempts": 0,
                    "levels_unlocked": 1,  # Level 1 is always unlocked
                    "total_stars": 0,
                    "highest_level_completed": 0,
                    "total_score": 0,
                    "total_food_eaten": 0,
                    "total_time_played": 0
                })
            
            # Calculate overall statistics
            total_stars = 0
            levels_with_progress = set()
            highest_level_completed = 0
            
            # Get best attempt for each level to calculate stars and completion
            for level in range(1, 6):
                level_attempts = all_attempts.filter(level=level)
                if level_attempts.exists():
                    levels_with_progress.add(level)
                    best_stars = level_attempts.aggregate(Max('stars_earned'))['stars_earned__max']
                    total_stars += best_stars if best_stars else 0
                    
                    # Check if level was completed
                    if level_attempts.filter(game_completed=True).exists():
                        highest_level_completed = max(highest_level_completed, level)
            
            # Calculate levels unlocked (based on star requirements)
            levels_unlocked = 1  # Level 1 always unlocked
            level_requirements = {2: 1, 3: 1, 4: 2, 5: 2}  # Stars needed from previous level
            
            for level in range(2, 6):
                prev_level = level - 1
                prev_level_attempts = all_attempts.filter(level=prev_level)
                if prev_level_attempts.exists():
                    prev_level_stars = prev_level_attempts.aggregate(Max('stars_earned'))['stars_earned__max'] or 0
                    if prev_level_stars >= level_requirements.get(level, 1):
                        levels_unlocked = level
                    else:
                        break
            
            stats = {
                "total_attempts": all_attempts.count(),
                "levels_unlocked": levels_unlocked,
                "total_stars": total_stars,
                "highest_level_completed": highest_level_completed,
                "total_score": sum(attempt.score for attempt in all_attempts),
                "total_food_eaten": sum(attempt.food_eaten for attempt in all_attempts),
                "total_time_played": sum(attempt.time_survived for attempt in all_attempts)
            }
            
            return Response(stats)
            
        except Exception as e:
            # Log the error for debugging
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in SnakeGameOverallStatsView: {str(e)}")
            
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
class UserSnakeGameDataView(generics.ListAPIView):
    """
    Get snake game progress for a specific user (for teachers to view student data)
    """
    serializer_class = SnakeGameProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        
        # Verify that the requesting user is a teacher
        if self.request.user.user_type != 'teacher':
            return SnakeGameProgress.objects.none()
        
        # Get the target user
        try:
            target_user = User.objects.get(id=user_id)
            
            # Verify that the target user is a student in one of the teacher's classes
            teacher_classes = Class.objects.filter(teacher=self.request.user)
            student_in_teacher_class = any(
                target_user in class_obj.students.all() 
                for class_obj in teacher_classes
            )
            
            if not student_in_teacher_class:
                return SnakeGameProgress.objects.none()
                
            return SnakeGameProgress.objects.filter(user=target_user)
            
        except User.DoesNotExist:
            return SnakeGameProgress.objects.none()

class ClassSnakeGameDataView(APIView):
    """
    comprehensive snake game data for all students in a specific class (for teacher dashboard)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, class_id):
        """Get detailed snake game data for all students in a class"""
        try:
            # Check if user is the teacher of this class
            class_obj = Class.objects.get(id=class_id)
            if class_obj.teacher != request.user:
                return Response(
                    {"detail": "You don't have permission to view this class's data."},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            # Get all students in this class
            students = class_obj.students.all()
            
            # Prepare data structure
            result = {}
            
            for student in students:
                # Get all snake game progress for this student
                snake_progress = SnakeGameProgress.objects.filter(user=student)
                
                if snake_progress.exists():
                    # Calculate overall statistics
                    total_attempts = snake_progress.count()
                    total_score = sum(progress.score for progress in snake_progress)
                    total_food_eaten = sum(progress.food_eaten for progress in snake_progress)
                    total_time_played = sum(progress.time_survived for progress in snake_progress)
                    
                    # Calculate best scores and detailed stats per level
                    level_data = {}
                    total_stars = 0
                    highest_level_completed = 0
                    levels_unlocked = 1  # Level 1 always unlocked
                    overall_best_score = 0
                    overall_best_level = 1
                    
                    for level in range(1, 6):
                        level_progress = snake_progress.filter(level=level).order_by('-score', '-stars_earned')
                        
                        if level_progress.exists():
                            # Get the best attempt for this level
                            best_attempt = level_progress.first()
                            best_score = best_attempt.score
                            best_stars = level_progress.aggregate(Max('stars_earned'))['stars_earned__max']
                            attempts = level_progress.count()
                            completed_attempts = level_progress.filter(game_completed=True).count()
                            avg_score = level_progress.aggregate(Avg('score'))['score__avg']
                            best_food_eaten = level_progress.aggregate(Max('food_eaten'))['food_eaten__max']
                            best_time_survived = level_progress.aggregate(Max('time_survived'))['time_survived__max']
                            
                            # Get completion time for the best score attempt
                            best_score_attempt = level_progress.filter(score=best_score).first()
                            best_score_completion_time = best_score_attempt.time_survived if best_score_attempt else 0
                            best_score_date = best_score_attempt.completed_at if best_score_attempt else None
                            
                            # Calculate performance metrics
                            success_rate = (completed_attempts / attempts) * 100 if attempts > 0 else 0
                            improvement_rate = 0
                            if attempts > 1:
                                first_attempt = level_progress.order_by('completed_at').first()
                                last_attempt = level_progress.order_by('-completed_at').first()
                                if first_attempt and last_attempt and first_attempt.score > 0:
                                    improvement_rate = ((last_attempt.score - first_attempt.score) / first_attempt.score) * 100
                            
                            # Track overall best score across all levels
                            if best_score > overall_best_score:
                                overall_best_score = best_score
                                overall_best_level = level
                            
                            level_data[level] = {
                                "best_score": best_score,
                                "best_stars": best_stars or 0,
                                "attempts": attempts,
                                "completed_attempts": completed_attempts,
                                "success_rate": round(success_rate, 1),
                                "avg_score": round(avg_score, 1) if avg_score else 0,
                                "best_food_eaten": best_food_eaten or 0,
                                "best_time_survived": best_time_survived or 0,
                                "best_score_completion_time": best_score_completion_time,
                                "best_score_date": best_score_date.strftime('%Y-%m-%d %H:%M') if best_score_date else None,
                                "improvement_rate": round(improvement_rate, 1),
                                "total_time_spent": sum(attempt.time_survived for attempt in level_progress),
                                "average_time_per_attempt": round(sum(attempt.time_survived for attempt in level_progress) / attempts, 1) if attempts > 0 else 0,
                                "best_stars_date": level_progress.filter(stars_earned=best_stars).first().completed_at.strftime('%Y-%m-%d %H:%M') if level_progress.filter(stars_earned=best_stars).exists() else None,
                                "consistency_score": self.calculate_consistency_score(level_progress),
                                "recent_trend": self.calculate_recent_trend(level_progress)
                            }
                            
                            total_stars += best_stars or 0
                            
                            # Check if level was completed
                            if completed_attempts > 0:
                                highest_level_completed = max(highest_level_completed, level)
                        else:
                            level_data[level] = {
                                "best_score": 0,
                                "best_stars": 0,
                                "attempts": 0,
                                "completed_attempts": 0,
                                "success_rate": 0,
                                "avg_score": 0,
                                "best_food_eaten": 0,
                                "best_time_survived": 0,
                                "best_score_completion_time": 0,
                                "best_score_date": None,
                                "improvement_rate": 0,
                                "total_time_spent": 0,
                                "average_time_per_attempt": 0,
                                "best_stars_date": None,
                                "consistency_score": 0,
                                "recent_trend": "stable"
                            }
                    
                    # Calculate levels unlocked based on star requirements
                    level_requirements = {2: 1, 3: 1, 4: 2, 5: 2}
                    for level in range(2, 6):
                        prev_level = level - 1
                        if level_data[prev_level]["best_stars"] >= level_requirements.get(level, 1):
                            levels_unlocked = level
                        else:
                            break
                    
                    # Get detailed recent activity (last 10 attempts)
                    recent_attempts = snake_progress.order_by('-completed_at')[:10]
                    recent_activity = []
                    for attempt in recent_attempts:
                        recent_activity.append({
                            "level": attempt.level,
                            "score": attempt.score,
                            "stars_earned": attempt.stars_earned,
                            "food_eaten": attempt.food_eaten,
                            "time_survived": attempt.time_survived,
                            "game_completed": attempt.game_completed,
                            "date": attempt.completed_at.strftime('%Y-%m-%d %H:%M') if attempt.completed_at else "N/A",
                            "performance_rating": self.get_performance_rating(attempt.score, attempt.level)
                        })
                    
                    # Calculate student performance insights
                    performance_insights = self.generate_performance_insights(level_data, total_attempts, total_stars)
                    
                    # Calculate student ranking metrics
                    student_metrics = {
                        "skill_level": self.calculate_skill_level(total_stars, highest_level_completed, total_attempts),
                        "engagement_level": self.calculate_engagement_level(total_attempts, len([l for l in level_data.values() if l["attempts"] > 0])),
                        "progress_velocity": self.calculate_progress_velocity(snake_progress),
                        "strength_areas": self.identify_strength_areas(level_data),
                        "improvement_areas": self.identify_improvement_areas(level_data),
                        "play_style": self.determine_play_style(level_data, total_attempts)
                    }
                    
                    result[str(student.id)] = {
                        "student_info": {
                            "id": student.id,
                            "username": student.username,
                            "email": student.email
                        },
                        "overall_stats": {
                            "total_attempts": total_attempts,
                            "total_score": total_score,
                            "total_stars": total_stars,
                            "total_food_eaten": total_food_eaten,
                            "total_time_played": total_time_played,
                            "highest_level_completed": highest_level_completed,
                            "levels_unlocked": levels_unlocked,
                            "avg_score_per_attempt": round(total_score / total_attempts, 1) if total_attempts > 0 else 0,
                            "overall_best_score": overall_best_score,
                            "overall_best_level": overall_best_level,
                            "total_completion_rate": round((sum(l["completed_attempts"] for l in level_data.values()) / total_attempts) * 100, 1) if total_attempts > 0 else 0
                        },
                        "level_breakdown": level_data,
                        "recent_activity": recent_activity,
                        "performance_insights": performance_insights,
                        "student_metrics": student_metrics
                    }
                else:
                    # Student has no snake game progress
                    empty_level_data = {}
                    for level in range(1, 6):
                        empty_level_data[level] = {
                            "best_score": 0, "best_stars": 0, "attempts": 0, "completed_attempts": 0, 
                            "success_rate": 0, "avg_score": 0, "best_food_eaten": 0, "best_time_survived": 0,
                            "best_score_completion_time": 0, "best_score_date": None, "improvement_rate": 0,
                            "total_time_spent": 0, "average_time_per_attempt": 0, "best_stars_date": None,
                            "consistency_score": 0, "recent_trend": "stable"
                        }
                    
                    result[str(student.id)] = {
                        "student_info": {
                            "id": student.id,
                            "username": student.username,
                            "email": student.email
                        },
                        "overall_stats": {
                            "total_attempts": 0, "total_score": 0, "total_stars": 0, "total_food_eaten": 0,
                            "total_time_played": 0, "highest_level_completed": 0, "levels_unlocked": 1,
                            "avg_score_per_attempt": 0, "overall_best_score": 0, "overall_best_level": 0,
                            "total_completion_rate": 0
                        },
                        "level_breakdown": empty_level_data,
                        "recent_activity": [],
                        "performance_insights": {"summary": "No game data available", "recommendations": ["Start playing to see insights!"]},
                        "student_metrics": {
                            "skill_level": "Beginner", "engagement_level": "Not Started", "progress_velocity": "Not Started",
                            "strength_areas": [], "improvement_areas": [], "play_style": "Unknown"
                        }
                    }
            
            # Enhanced class summary statistics
            students_with_progress = [s for s in result.values() if s["overall_stats"]["total_attempts"] > 0]
            class_summary = {
                "total_students": students.count(),
                "students_with_progress": len(students_with_progress),
                "total_class_attempts": sum(s["overall_stats"]["total_attempts"] for s in result.values()),
                "total_class_score": sum(s["overall_stats"]["total_score"] for s in result.values()),
                "total_class_stars": sum(s["overall_stats"]["total_stars"] for s in result.values()),
                "avg_attempts_per_student": sum(s["overall_stats"]["total_attempts"] for s in result.values()) / students.count() if students.count() > 0 else 0,
                "class_participation_rate": (len(students_with_progress) / students.count()) * 100 if students.count() > 0 else 0,
                "class_avg_score": sum(s["overall_stats"]["avg_score_per_attempt"] for s in students_with_progress) / len(students_with_progress) if students_with_progress else 0,
                "top_performer": max(students_with_progress, key=lambda x: x["overall_stats"]["overall_best_score"])["student_info"]["username"] if students_with_progress else None,
                "most_engaged": max(students_with_progress, key=lambda x: x["overall_stats"]["total_attempts"])["student_info"]["username"] if students_with_progress else None,
                "level_completion_stats": self.calculate_class_level_stats(result)
            }
            
            return Response({
                "class_info": {
                    "id": class_obj.id,
                    "name": class_obj.name,
                    "code": class_obj.code
                },
                "class_summary": class_summary,
                "students_data": result
            })
            
        except Class.DoesNotExist:
            return Response(
                {"detail": "Class not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in ClassSnakeGameDataView: {str(e)}")
            
            return Response(
                {"detail": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def calculate_consistency_score(self, attempts):
        """Calculate how consistent a student's performance is"""
        if attempts.count() < 3:
            return 0
        
        scores = [attempt.score for attempt in attempts]
        if not scores:
            return 0
        
        mean_score = sum(scores) / len(scores)
        variance = sum((score - mean_score) ** 2 for score in scores) / len(scores)
        std_dev = variance ** 0.5
        
        # Lower standard deviation relative to mean = higher consistency
        if mean_score > 0:
            coefficient_of_variation = std_dev / mean_score
            consistency = max(0, 100 - (coefficient_of_variation * 100))
            return round(consistency, 1)
        return 0
    
    def calculate_recent_trend(self, attempts):
        """Calculate if student is improving, declining, or stable"""
        if attempts.count() < 3:
            return "insufficient_data"
        
        recent_attempts = list(attempts.order_by('-completed_at')[:5])
        if len(recent_attempts) < 3:
            return "insufficient_data"
        
        # Compare first half vs second half of recent attempts
        mid_point = len(recent_attempts) // 2
        recent_half = recent_attempts[:mid_point]
        older_half = recent_attempts[mid_point:]
        
        recent_avg = sum(attempt.score for attempt in recent_half) / len(recent_half)
        older_avg = sum(attempt.score for attempt in older_half) / len(older_half)
        
        if recent_avg > older_avg * 1.1:
            return "improving"
        elif recent_avg < older_avg * 0.9:
            return "declining"
        else:
            return "stable"
    
    def get_performance_rating(self, score, level):
        """Get performance rating based on score and level"""
        # Define score thresholds per level
        thresholds = {
            1: {"excellent": 150, "good": 100, "fair": 50},
            2: {"excellent": 200, "good": 150, "fair": 100},
            3: {"excellent": 250, "good": 200, "fair": 150},
            4: {"excellent": 300, "good": 250, "fair": 200},
            5: {"excellent": 400, "good": 300, "fair": 250}
        }
        
        level_thresholds = thresholds.get(level, thresholds[1])
        
        if score >= level_thresholds["excellent"]:
            return "excellent"
        elif score >= level_thresholds["good"]:
            return "good"
        elif score >= level_thresholds["fair"]:
            return "fair"
        else:
            return "needs_improvement"
    
    def generate_performance_insights(self, level_data, total_attempts, total_stars):
        """Generate insights about student performance"""
        insights = {
            "summary": "",
            "recommendations": [],
            "strengths": [],
            "areas_for_improvement": []
        }
        
        if total_attempts == 0:
            insights["summary"] = "No game data available yet"
            insights["recommendations"] = ["Start playing to build skills and track progress"]
            return insights
        
        # Analyze performance
        completed_levels = len([l for l in level_data.values() if l["completed_attempts"] > 0])
        avg_success_rate = sum(l["success_rate"] for l in level_data.values()) / 5
        
        # Generate summary
        if total_stars >= 10:
            insights["summary"] = f"Excellent player with {total_stars} stars across {completed_levels} levels"
        elif total_stars >= 5:
            insights["summary"] = f"Good progress with {total_stars} stars, showing consistent improvement"
        elif total_attempts >= 10:
            insights["summary"] = f"Active player with {total_attempts} attempts, building experience"
        else:
            insights["summary"] = f"Getting started with {total_attempts} attempts"
        
        # Identify strengths
        if avg_success_rate > 60:
            insights["strengths"].append("High completion rate across levels")
        
        best_level = max(level_data.items(), key=lambda x: x[1]["best_score"])
        if best_level[1]["best_score"] > 0:
            insights["strengths"].append(f"Strong performance on Level {best_level[0]}")
        
        # Identify improvements
        if avg_success_rate < 40:
            insights["areas_for_improvement"].append("Focus on completing more games")
        
        struggling_levels = [k for k, v in level_data.items() if v["attempts"] > 3 and v["success_rate"] < 30]
        if struggling_levels:
            insights["areas_for_improvement"].append(f"Need more practice on Level(s) {', '.join(map(str, struggling_levels))}")
        
        return insights
    
    def calculate_skill_level(self, total_stars, highest_level, total_attempts):
        """Calculate overall skill level"""
        if total_attempts == 0:
            return "Not Started"
        elif total_stars >= 15 and highest_level >= 4:
            return "Expert"
        elif total_stars >= 10 and highest_level >= 3:
            return "Advanced"
        elif total_stars >= 5:
            return "Intermediate"
        else:
            return "Beginner"
    
    def calculate_engagement_level(self, total_attempts, levels_played):
        """Calculate engagement level"""
        if total_attempts == 0:
            return "Not Started"
        elif total_attempts >= 50:
            return "Highly Engaged"
        elif total_attempts >= 20:
            return "Moderately Engaged"
        elif total_attempts >= 5:
            return "Getting Started"
        else:
            return "Limited Engagement"
    
    def calculate_progress_velocity(self, attempts):
        """Calculate how quickly student is progressing"""
        if attempts.count() < 5:
            return "Building Foundation"
        
        # Look at improvement over time
        recent_attempts = list(attempts.order_by('-completed_at')[:10])
        if len(recent_attempts) < 5:
            return "Steady"
        
        # Compare early vs recent performance
        early_avg = sum(attempt.score for attempt in recent_attempts[-5:]) / 5
        recent_avg = sum(attempt.score for attempt in recent_attempts[:5]) / 5
        
        if recent_avg > early_avg * 1.5:
            return "Rapid Improvement"
        elif recent_avg > early_avg * 1.2:
            return "Good Progress"
        elif recent_avg > early_avg:
            return "Steady Progress"
        else:
            return "Needs Focus"
    
    def identify_strength_areas(self, level_data):
        """Identify student's strongest areas"""
        strengths = []
        
        for level, data in level_data.items():
            if data["success_rate"] > 70:
                strengths.append(f"Level {level} Completion")
            if data["consistency_score"] > 75:
                strengths.append(f"Level {level} Consistency")
            if data["recent_trend"] == "improving":
                strengths.append(f"Level {level} Improvement")
        
        return strengths[:3]  # Return top 3
    
    def identify_improvement_areas(self, level_data):
        """Identify areas where student needs improvement"""
        improvements = []
        
        for level, data in level_data.items():
            if data["attempts"] > 0 and data["success_rate"] < 30:
                improvements.append(f"Level {level} Completion Rate")
            if data["consistency_score"] < 40 and data["attempts"] > 3:
                improvements.append(f"Level {level} Consistency")
            if data["recent_trend"] == "declining":
                improvements.append(f"Level {level} Recent Performance")
        
        return improvements[:3]  # Return top 3
    
    def determine_play_style(self, level_data, total_attempts):
        """Determine student's play style"""
        if total_attempts == 0:
            return "Unknown"
        
        total_time = sum(l["total_time_spent"] for l in level_data.values())
        avg_time_per_attempt = total_time / total_attempts if total_attempts > 0 else 0
        
        completion_focused = sum(l["completed_attempts"] for l in level_data.values()) / total_attempts > 0.6
        
        if avg_time_per_attempt > 120:  # More than 2 minutes per attempt
            return "Methodical Player" if completion_focused else "Careful Explorer"
        elif avg_time_per_attempt < 60:  # Less than 1 minute per attempt
            return "Speed Player" if completion_focused else "Quick Learner"
        else:
            return "Balanced Player" if completion_focused else "Casual Player"
    
    def calculate_class_level_stats(self, students_data):
        """Calculate class-wide statistics per level"""
        level_stats = {}
        
        for level in range(1, 6):
            level_attempts = []
            level_completions = []
            level_scores = []
            
            for student_data in students_data.values():
                level_data = student_data["level_breakdown"][level]
                if level_data["attempts"] > 0:
                    level_attempts.append(level_data["attempts"])
                    level_completions.append(level_data["completed_attempts"])
                    level_scores.append(level_data["best_score"])
            
            level_stats[level] = {
                "students_attempted": len(level_attempts),
                "total_class_attempts": sum(level_attempts),
                "avg_score": round(sum(level_scores) / len(level_scores), 1) if level_scores else 0,
                "completion_rate": round((sum(level_completions) / sum(level_attempts)) * 100, 1) if sum(level_attempts) > 0 else 0,
                "top_score": max(level_scores) if level_scores else 0
            }
        
        return level_stats

from .serializers import UserHeartSerializer

class UserHeartsView(APIView):
    """API endpoint to get and manage user heart data"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Check and regenerate hearts based on time elapsed
        user.regenerate_hearts()
        
        serializer = UserHeartSerializer(user, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """Endpoint to use a heart (decrement count)"""
        user = request.user
        
        # First check if user has hearts available
        if user.hearts <= 0:
            return Response(
                {"error": "No hearts available", "hearts": 0}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Decrement heart count
        user.hearts -= 1
        
        # Update last_heart_regen_time if this was the last heart
        # This ensures the timer starts counting properly
        if user.hearts == 0:
            from django.utils import timezone
            user.last_heart_regen_time = timezone.now()
            user.save(update_fields=['hearts', 'last_heart_regen_time'])
        else:
            user.save(update_fields=['hearts'])
        
        # Return updated heart info
        serializer = UserHeartSerializer(user, context={'request': request})
        return Response(serializer.data)