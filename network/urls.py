
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:user>", views.profile, name="profile"),
    path("following", views.following, name="following"),

    # API Routes
    path("posts", views.newpost, name="newpost"),
    path("users/<str:username>", views.followuser, name="followuser"),
    path("posts/<str:id>", views.editpost, name="editpost")
]
