from django.contrib import admin
from .models import User, Class, TypeTestProgress, UserProgress, SelectionSortResult
# Register your models here.
admin.site.register(User)
admin.site.register(Class)
admin.site.register(TypeTestProgress)
admin.site.register(UserProgress)
admin.site.register(SelectionSortResult)
