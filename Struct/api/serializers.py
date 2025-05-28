from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Class, TypeTestProgress, UserProgress, SelectionSortResult, BubbleSortResult, InsertionSortResult, SnakeGameProgress

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password', 'user_type')
        extra_kwargs = {
            'user_type': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        # Remove confirm_password from the data
        validated_data.pop('confirm_password', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            user_type=validated_data['user_type']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'user_type', 'profile_photo_url', 'points', 'hearts', 'hints')
    
    def get_profile_photo_url(self, user):
        if user.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(user.profile_photo.url)
        return None

class ClassSerializer(serializers.ModelSerializer):
    students_count = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = ['id', 'name', 'description', 'code', 'created_at', 'students_count']
        read_only_fields = ['code']

    def get_students_count(self, obj):
        return obj.students.count()

class ClassCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'description', 'code']
        read_only_fields = ['code']

    def create(self, validated_data):
        # Set the current user as the teacher
        user = self.context['request'].user
        validated_data['teacher'] = user
        return super().create(validated_data)

class TypeTestProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeTestProgress
        fields = ['id', 'user', 'level_index', 'time_taken', 'selected_timer', 'stars_earned', 'wpm', 'score', 'completed_at', 'all_words_completed']
        # Only make user and completed_at read-only, allow stars_earned to be set from frontend
        read_only_fields = ['user', 'completed_at']

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['selection_sort_passed', 'bubble_sort_passed', 'insertion_sort_passed']

class SelectionSortResultSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    duration_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = SelectionSortResult
        fields = ['id', 'username', 'score', 'duration', 'duration_formatted', 'attempt_number', 'date_created']
        read_only_fields = ['id', 'user', 'date_created']
    
    def get_duration_formatted(self, obj):
        """Return a human-readable duration format"""
        seconds = obj.duration_seconds
        minutes = seconds // 60
        seconds %= 60
        return f"{int(minutes)}m {int(seconds)}s"

class BubbleSortResultSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    duration_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = BubbleSortResult
        fields = ['id', 'username', 'score', 'duration', 'duration_formatted', 'attempt_number', 'date_created']
        read_only_fields = ['id', 'user', 'date_created']
    
    def get_duration_formatted(self, obj):
        """Return a human-readable duration format"""
        seconds = obj.duration_seconds
        minutes = seconds // 60
        seconds %= 60
        return f"{int(minutes)}m {int(seconds)}s"

class InsertionSortResultSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    duration_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = InsertionSortResult
        fields = ['id', 'username', 'score', 'duration', 'duration_formatted', 'attempt_number', 'date_created']
        read_only_fields = ['id', 'user', 'date_created']
    
    def get_duration_formatted(self, obj):
        """Return a human-readable duration format"""
        seconds = obj.duration_seconds
        minutes = seconds // 60
        seconds %= 60
        return f"{int(minutes)}m {int(seconds)}s"
    
class SnakeGameProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = SnakeGameProgress
        fields = [
            'id', 'user', 'level', 'score', 'food_eaten', 'time_survived', 
            'game_completed', 'stars_earned', 'completed_at'
        ]
        read_only_fields = ['user', 'completed_at']

    def validate_level(self, value):
        """Ensure level is within valid range"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Level must be between 1 and 5")
        return value

    def validate_stars_earned(self, value):
        """Ensure stars are within valid range"""
        if value < 0 or value > 3:
            raise serializers.ValidationError("Stars earned must be between 0 and 3")
        return value