from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now

class User(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return self.username



class Club(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    advisor_name = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_clubs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name



class Member(models.Model):
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='members')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='club_memberships')
    signup_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.student.username} in {self.club.name}"
