from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils import timezone
import random
import string

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
    hearts_reset_date = models.DateField(default=timezone.now)
    # Maximum hearts a user can gain in a day (limit)
    max_daily_hearts = models.IntegerField(default=5)

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
        
    def regenerate_hearts(self):
        """Check and regenerate hearts based on time elapsed since last regeneration"""
        # Check if we need to reset the daily hearts counter
        today = timezone.now().date()
        if today > self.hearts_reset_date:
            self.hearts_gained_today = 0
            self.hearts_reset_date = today
        
        # Exit if already at max hearts
        if self.hearts >= self.max_hearts:
            return
            
        # Exit if daily heart limit reached
        if self.hearts_gained_today >= self.max_daily_hearts:
            return
            
        now = timezone.now()
        time_elapsed = now - self.last_heart_regen_time
        
        # Calculate how many 30-minute periods have passed
        minutes_passed = time_elapsed.total_seconds() / 60
        
        # Calculate hearts to add while respecting daily limit
        hearts_to_add = min(
            self.max_hearts - self.hearts,  # Don't exceed max hearts
            self.max_daily_hearts - self.hearts_gained_today,  # Don't exceed daily limit
            int(minutes_passed // 30)  # Add 1 heart per 30 minutes
        )
        
        if hearts_to_add > 0:
            # Update heart count and last regeneration time
            self.hearts += hearts_to_add
            self.hearts_gained_today += hearts_to_add
            
            # Update the last regen time based on complete 30-minute intervals used
            minutes_used = hearts_to_add * 30
            self.last_heart_regen_time = self.last_heart_regen_time + timezone.timedelta(minutes=minutes_used)
            self.save(update_fields=['hearts', 'last_heart_regen_time', 'hearts_gained_today', 'hearts_reset_date'])
            
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