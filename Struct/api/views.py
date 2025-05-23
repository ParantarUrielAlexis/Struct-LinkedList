from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Max, F
from .serializers import UserRegistrationSerializer
from .models import Class, TypeTestProgress
from .serializers import ClassSerializer, ClassCreateSerializer, TypeTestProgressSerializer


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

        return Response({
            'token': token.key,
            'user_id': user.id,
            'email': user.email,
            'username': user.username,
            'user_type': user.user_type
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

# Add these new views

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