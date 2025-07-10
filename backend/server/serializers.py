from rest_framework import serializers
from .models import Club

class ClubSerializers(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ['name', 'description', 'advisor_name']

