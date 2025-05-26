from django.contrib import admin
from .models import User, Class, TypeTestProgress, UserProgress
# Register your models here.
admin.site.register(User)
admin.site.register(Class)
admin.site.register(TypeTestProgress)
admin.site.register(UserProgress)