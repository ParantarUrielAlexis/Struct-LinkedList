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


from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Max, Q
from .models import SnakeGameProgress
from .serializers import SnakeGameProgressSerializer


from django.core.files.storage import default_storage

from .serializers import UserRegistrationSerializer, UserProfileSerializer
from .models import Class, User
from .serializers import ClassSerializer, ClassCreateSerializer

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