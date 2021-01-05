from django.contrib import admin
from .models import Post, User


class PostAdmin(admin.ModelAdmin):
    list_display = ("user", "timestamp")

admin.site.register(Post, PostAdmin);
admin.site.register(User);
