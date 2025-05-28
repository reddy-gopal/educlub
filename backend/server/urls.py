from django.urls import path
from . import views

urlpatterns = [
   path("clubs/create/", views.create_club),
    path("clubs/<int:id>/edit/", views.edit_club),
    path("clubs/<int:id>/delete/", views.delete_club),
    path("clubs/<int:id>/members/", views.view_members),

    path("clubs/", views.list_clubs),
    path("clubs/<int:id>/join/", views.join_club),
    path("clubs/<int:id>/leave/", views.leave_club),
    path("user/clubs/", views.my_clubs),
    path("login/", views.login, name="login"),
    path("register/", views.register, name="register"),

]
