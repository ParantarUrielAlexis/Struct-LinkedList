from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings
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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'user_type']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email

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