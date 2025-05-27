from django.contrib import admin
from .models import User, Class, TypeTestProgress, UserProgress, SelectionSortResult, BubbleSortResult
# Register your models here.
admin.site.register(User)
admin.site.register(Class)
admin.site.register(TypeTestProgress)
admin.site.register(UserProgress)

@admin.register(SelectionSortResult)
class SelectionSortResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'formatted_duration', 'attempt_number', 'date_created')
    list_filter = ('user', 'date_created')
    search_fields = ('user__username',)
    
    def formatted_duration(self, obj):
        seconds = obj.duration.total_seconds()
        minutes = seconds // 60
        seconds %= 60
        return f"{int(minutes)}m {int(seconds)}s"
    
    formatted_duration.short_description = 'Duration'

@admin.register(BubbleSortResult)
class BubbleSortResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'formatted_duration', 'attempt_number', 'date_created')
    list_filter = ('user', 'date_created')
    search_fields = ('user__username',)
    
    def formatted_duration(self, obj):
        seconds = obj.duration.total_seconds()
        minutes = seconds // 60
        seconds %= 60
        return f"{int(minutes)}m {int(seconds)}s"
    
    formatted_duration.short_description = 'Duration'
