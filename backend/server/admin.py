from django.contrib import admin

from .models import User, Club, Member
admin.site.register(User)
admin.site.register(Club)
admin.site.register(Member)
