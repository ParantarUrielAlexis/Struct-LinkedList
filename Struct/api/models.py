from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils import timezone
import random
import string
import datetime

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(_('email address'), unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    points = models.IntegerField(default=0)
    hearts = models.IntegerField(default=3)
    hints = models.IntegerField(default=3)
    # New fields for heart regeneration
    max_hearts = models.IntegerField(default=5)  # Maximum hearts a user can have
    last_heart_regen_time = models.DateTimeField(default=timezone.now)  # When the last heart regenerated
    # Add this new field to track daily heart regeneration
    hearts_gained_today = models.IntegerField(default=0)
    hearts_reset_date = models.DateTimeField(default=timezone.now)  # Changed from DateField to DateTimeField
    # Maximum hearts a user can gain in a day (limit)
    max_daily_hearts = models.IntegerField(default=3)
    quiz_attempts = models.IntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'user_type']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email
        
    @property
    def profile_photo_url(self):
        if self.profile_photo:
            return self.profile_photo.url
        return None
    
    def save(self, *args, **kwargs):
        """Override save to enforce heart cap"""
        # Always enforce maximum heart limit
        if self.hearts > self.max_hearts:
            self.hearts = self.max_hearts
        
        # Ensure hearts can't go below 0
        if self.hearts < 0:
            self.hearts = 0
            
        super().save(*args, **kwargs)
        
    def regenerate_hearts(self):
        """Regenerate hearts based on time elapsed since last regeneration"""
        from django.utils import timezone
        
        # Check if we need to reset daily heart counter
        self.reset_daily_hearts_if_needed()
        
        # If hearts are already at max, nothing to do
        if self.hearts >= self.max_hearts:
            return
        
        # If daily limit reached, nothing to do
        if self.hearts_gained_today >= self.max_daily_hearts:
            return
        
        # Calculate time elapsed since last heart regeneration
        now = timezone.now()
        if not self.last_heart_regen_time:
            self.last_heart_regen_time = now
            self.save(update_fields=['last_heart_regen_time'])
            return
        
        # Get time difference in minutes
        time_diff = (now - self.last_heart_regen_time).total_seconds() / 60
        heart_regen_minutes = 30  # Time in minutes to regenerate one heart
        
        # Calculate how many hearts to add based on time passed
        hearts_to_add = int(time_diff / heart_regen_minutes)
        
        # If no hearts should be added based on time passed, return early
        if hearts_to_add <= 0:
            return
            
        # Check if we've reached daily limit
        remaining_daily_hearts = self.max_daily_hearts - self.hearts_gained_today
        hearts_to_add = min(hearts_to_add, remaining_daily_hearts)
        
        if hearts_to_add <= 0:
            return  # Daily limit reached
            
        # Add hearts, but don't exceed max (this is now also enforced in save())
        new_hearts = min(self.hearts + hearts_to_add, self.max_hearts)
        hearts_added = new_hearts - self.hearts
        
        if hearts_added > 0:
            self.hearts = new_hearts
            self.hearts_gained_today += hearts_added
            
            # Update the last regen time based on complete intervals only
            self.last_heart_regen_time = self.last_heart_regen_time + timezone.timedelta(
                minutes=hearts_added * heart_regen_minutes
            )
            
            self.save(update_fields=['hearts', 'last_heart_regen_time', 'hearts_gained_today'])
    
    def add_hearts(self, amount):
        """Safely add hearts while respecting the maximum limit"""
        if amount <= 0:
            return False
        
        # Calculate how many hearts can actually be added
        hearts_to_add = min(amount, self.max_hearts - self.hearts)
        
        if hearts_to_add > 0:
            self.hearts += hearts_to_add
            self.save(update_fields=['hearts'])
            return True
        return False
    
    def use_heart(self):
        """Use a heart (decrement count) if available"""
        if self.hearts > 0:
            self.hearts -= 1
            self.save(update_fields=['hearts'])
            return True
        return False
    
    def post(self, request):
        try:
            points_to_add = request.data.get('score', 0)
            quiz_type = request.data.get('quiz_type', 'unknown')
            
            if not isinstance(points_to_add, (int, float)) or points_to_add < 0:
                return Response({
                    'success': False,
                    'error': 'Invalid score value'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = request.user
            
            with transaction.atomic():
                user.points = F('points') + points_to_add
                user.quiz_attempts = F('quiz_attempts') + 1
                user.save(update_fields=['points', 'quiz_attempts'])
                user.refresh_from_db()
            
            return Response({
                'success': True,
                'points_added': points_to_add,
                'total_points': user.points,
                'attempts': user.quiz_attempts,
                'quiz_type': quiz_type
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self, request):
        user = request.user
        # Force refresh from database to get latest values
        user.refresh_from_db()
        
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'user_type': user.user_type,
            'points': user.points,
            'hearts': user.hearts,
            'hints': user.hints,
            'quiz_attempts': getattr(user, 'quiz_attempts', 0),
            'profile_photo_url': user.profile_photo.url if user.profile_photo else None,
        })
    
    def get_next_heart_time(self):
        """Calculate time until next heart regeneration"""
        # No regeneration if at max hearts or daily limit reached
        if self.hearts >= self.max_hearts or self.hearts_gained_today >= self.max_daily_hearts:
            return None
            
        # Calculate when the next heart will be available
        next_heart_time = self.last_heart_regen_time + timezone.timedelta(minutes=30)
        time_remaining = next_heart_time - timezone.now()
        
        # Return milliseconds for easy frontend use
        return max(0, time_remaining.total_seconds() * 1000) if time_remaining.total_seconds() > 0 else 0

    def reset_daily_hearts_if_needed(self):
        """Reset hearts_gained_today at 8AM each day"""
        now = timezone.now()
        today = now.date()
        
        # Create today's reset time (8AM today)
        todays_reset = timezone.make_aware(
            datetime.datetime.combine(today, datetime.time(hour=8, minute=0))
        )
        
        # If we're before 8AM, we should compare with yesterday's 8AM
        if now.hour < 8:
            todays_reset = todays_reset - timezone.timedelta(days=1)
        
        # If the last reset was before today's reset time (8AM)
        if self.hearts_reset_date < todays_reset:
            # Only reset the counter, don't give hearts immediately
            self.hearts_gained_today = 0
            self.hearts_reset_date = now
            
            # Don't update hearts or last_heart_regen_time here
            # This ensures that when hearts_gained_today is reset, 
            # hearts still regenerate according to the timer
            self.save(update_fields=['hearts_gained_today', 'hearts_reset_date'])

def generate_class_code():
    """Generate a random 6-character alphanumeric class code"""
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for _ in range(6))

class Class(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    code = models.CharField(max_length=10, unique=True, default=generate_class_code)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teaching_classes')
    students = models.ManyToManyField(User, related_name='enrolled_classes', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class TypeTestProgress(models.Model):
    # Links to the User model (assuming you have Django's default User model or a custom one)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='typetest_progress')

    # Information about the completed level
    level_index = models.IntegerField(help_text="The 0-based index of the level completed")

    # Performance metrics
    time_taken = models.IntegerField(help_text="Time taken to complete the level in seconds")
    selected_timer = models.IntegerField(help_text="The timer setting chosen by the user for this attempt (e.g., 30, 45, 60 seconds)")
    wpm = models.IntegerField(default=0, help_text="Words Per Minute achieved in this attempt")
    score = models.IntegerField(default=0, help_text="Final score achieved in this attempt")

    # Stars earned for this attempt
    stars_earned = models.IntegerField(default=0, help_text="Number of stars earned (0-3)")

    # Timestamp for when the progress was recorded
    completed_at = models.DateTimeField(auto_now_add=True)

    # only give stars if the user has completed the level
    all_words_completed = models.BooleanField(default=False, help_text="Whether the user completed all words in the level")

    class Meta:
        # Order by most recent completion
        ordering = ['-completed_at']
        verbose_name_plural = "TypeTest Progress" # Nicer name in Django admin

    def __str__(self):
        return f"{self.user.username} - Level {self.level_index + 1} - {self.stars_earned} stars"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class UserProgress(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress')
    selection_sort_passed = models.BooleanField(default=False)
    bubble_sort_passed = models.BooleanField(default=False)
    insertion_sort_passed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} Progress"

class SelectionSortResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='selection_sort_results')
    score = models.FloatField()
    duration = models.DurationField()
    attempt_number = models.IntegerField(default=1)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_created']

    def __str__(self):
        return f"{self.user.username} - Score: {self.score} - Attempt: {self.attempt_number}"

    @property
    def duration_seconds(self):
        return self.duration.total_seconds()

class BubbleSortResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bubble_sort_results')
    score = models.FloatField()
    duration = models.DurationField()
    attempt_number = models.IntegerField(default=1)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_created']

    def __str__(self):
        return f"{self.user.username} - Score: {self.score} - Attempt: {self.attempt_number}"

    @property
    def duration_seconds(self):
        """Returns duration in seconds for easy comparison"""
        return self.duration.total_seconds()

class InsertionSortResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='insertion_sort_results')
    score = models.FloatField()
    duration = models.DurationField()
    attempt_number = models.IntegerField(default=1)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_created']

    def __str__(self):
        return f"{self.user.username} - Score: {self.score} - Attempt: {self.attempt_number}"

    @property
    def duration_seconds(self):
        """Returns duration in seconds for easy comparison"""
        return self.duration.total_seconds()
    
class SnakeGameProgress(models.Model):
    # Links to the User model
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='snake_game_progress')
    
    # Level information (1-5)
    level = models.IntegerField(help_text="The level number (1-5)")
    
    # Performance metrics
    score = models.IntegerField(default=0, help_text="Score achieved in this attempt")
    food_eaten = models.IntegerField(default=0, help_text="Number of food items eaten")
    time_survived = models.IntegerField(default=0, help_text="Time survived in seconds")
    
    # Game completion status
    game_completed = models.BooleanField(default=False, help_text="Whether the user completed the level successfully")
    
    # Stars earned for this attempt (0-3)
    stars_earned = models.IntegerField(default=0, help_text="Number of stars earned (0-3)")
    
    # Timestamp for when the progress was recorded
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Order by most recent completion
        ordering = ['-completed_at']
        verbose_name_plural = "Snake Game Progress"
        # Allow multiple attempts per user per level
        indexes = [
            models.Index(fields=['user', 'level']),
            models.Index(fields=['user', 'level', 'score']),
        ]

    def __str__(self):
        return f"{self.user.username} - Level {self.level} - Score: {self.score} - {self.stars_earned} stars"

    def save(self, *args, **kwargs):
        # Ensure level is within valid range
        if self.level < 1 or self.level > 5:
            raise ValueError("Level must be between 1 and 5")
        
        # Ensure stars are within valid range
        if self.stars_earned < 0 or self.stars_earned > 3:
            raise ValueError("Stars earned must be between 0 and 3")
            
        super().save(*args, **kwargs)