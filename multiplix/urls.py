from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:user>", views.profile, name="profile"),
    path("info", views.info, name="info"),
    path("leaderboard", views.leaderboard, name="leaderboard"),
    path("test", views.create_test, name="create_test"),
    path("test/<int:id>", views.test, name="test"),
]
