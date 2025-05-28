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