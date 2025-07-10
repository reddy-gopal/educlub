from django.urls import path, include
from . import views
# from rest_framework.routers import DefaultRouter
# router = DefaultRouter()
# router.register(r'clubs', views.Club)

urlpatterns = [
   path("clubs/create/", views.CreateClub.as_view()),
    path("clubs/<int:id>/edit/", views.edit_club),
    path("clubs/<int:id>/delete/", views.delete_club),
    path("clubs/<int:id>/members/", views.view_members),

    path("clubs/", views.list_clubs),
    path("clubs/<int:id>/join/", views.join_club),
    path("clubs/<int:id>/leave/", views.leave_club),
    path("user/clubs/", views.my_clubs),
    path("login/", views.login, name="login"),
    path("register/", views.register, name="register"),
    # path("api/", include(router.urls))

]
