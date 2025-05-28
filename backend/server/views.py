import json
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from oauth2_provider.contrib.rest_framework import OAuth2Authentication
from django.utils.timezone import now
from .models import Club, User, Member
import requests
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
User = get_user_model()


# -------------------- Admin: Create Club --------------------
@api_view(["POST"])
@authentication_classes([OAuth2Authentication])
@permission_classes([IsAuthenticated])
def create_club(request):
    if not request.user.is_staff:
        return JsonResponse({'error': 'Only admins can create clubs.'}, status=403)

    data = request.data
    name = data.get('name')
    description = data.get('description')
    advisor_name = data.get('advisor_name')
    created_by = request.user

    if not name or not description or not advisor_name:
        return JsonResponse({'error': 'All fields are required.'}, status=400)

    club = Club.objects.create(
        name=name,
        description=description,
        advisor_name=advisor_name,
        created_by=created_by
    )

    return JsonResponse({
        'id': club.id,
        'name': club.name,
        'description': club.description,
        'advisor_name': club.advisor_name,
        'created_by': club.created_by.username
    }, status=201)

# -------------------- Admin: Edit Club --------------------
@api_view(["PUT"])
@authentication_classes([OAuth2Authentication])
@permission_classes([IsAuthenticated])
def edit_club(request, id):
    if not request.user.is_staff:
        return JsonResponse({'error': 'Only admins can update clubs.'}, status=403)

    try:
        club = Club.objects.get(id=id)
    except Club.DoesNotExist:
        return JsonResponse({'error': 'Club not found.'}, status=404)

    data = request.data
    club.name = data.get('name', club.name)
    club.description = data.get('description', club.description)
    club.advisor_name = data.get('advisor_name', club.advisor_name)
    club.save()

    return JsonResponse({'message': 'Club updated successfully.'})

# -------------------- Admin: Delete Club --------------------
@api_view(["DELETE"])
@authentication_classes([OAuth2Authentication])
@permission_classes([IsAuthenticated])
def delete_club(request, id):
    if not request.user.is_staff:
        return JsonResponse({'error': 'Only admins can delete clubs.'}, status=403)

    try:
        club = Club.objects.get(id=id)
    except Club.DoesNotExist:
        return JsonResponse({'error': 'Club not found.'}, status=404)

    club.delete()
    return JsonResponse({'message': 'Club deleted successfully.'}, status=204)

# -------------------- Admin: View Members --------------------
@api_view(["GET"])
@authentication_classes([OAuth2Authentication])
@permission_classes([IsAuthenticated])
def view_members(request, id):
    try:
        club = Club.objects.get(id=id)
    except Club.DoesNotExist:
        return JsonResponse({'error': 'Club not found.'}, status=404)

    if not request.user.is_staff and club.created_by != request.user:
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    members = club.members.select_related('student').all()
    data = [
        {
            'member_id': m.id,
            'student_id': m.student.id,
            'student_username': m.student.username,
            'signup_date': m.signup_date
        }
        for m in members
    ]
    return JsonResponse(data, safe=False)

# -------------------- Student: Browse All Clubs --------------------
@api_view(["GET"])
@authentication_classes([OAuth2Authentication])
@permission_classes([IsAuthenticated])
def list_clubs(request):
    clubs = Club.objects.all()
    data = [
        {
            'id': c.id,
            'name': c.name,
            'description': c.description,
            'advisor_name': c.advisor_name,
            'created_by': c.created_by.username
        }
        for c in clubs
    ]
    return JsonResponse(data, safe=False)

# -------------------- Student: Join Club --------------------
@api_view(["POST"])
@authentication_classes([OAuth2Authentication])
@permission_classes([IsAuthenticated])
def join_club(request, id):
    try:
        club = Club.objects.get(id=id)
    except Club.DoesNotExist:
        return JsonResponse({'error': 'Club not found.'}, status=404)

    if Member.objects.filter(club=club, student=request.user).exists():
        return JsonResponse({'error': 'Already a member.'}, status=400)

    member = Member.objects.create(club=club, student=request.user, signup_date=now())
    return JsonResponse({'message': 'Joined the club!', 'club_id': club.id})

# -------------------- Student: View Joined Clubs --------------------
@api_view(["GET"])
@authentication_classes([OAuth2Authentication])
@permission_classes([IsAuthenticated])
def my_clubs(request):
    joined = Member.objects.filter(student=request.user).select_related('club')
    data = [
        {
            'id': m.club.id,
            'name': m.club.name,
            'description': m.club.description,
            'advisor_name': m.club.advisor_name
        }
        for m in joined
    ]
    return JsonResponse(data, safe=False)

# -------------------- Student: Leave Club --------------------
@api_view(["DELETE"])
@authentication_classes([OAuth2Authentication])
@permission_classes([IsAuthenticated])
def leave_club(request, id):
    try:
        member = Member.objects.get(club_id=id, student=request.user)
        member.delete()
        return JsonResponse({'message': 'Left the club.'}, status=204)
    except Member.DoesNotExist:
        return JsonResponse({'error': 'You are not a member of this club.'}, status=404)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    try:
        data = request.data
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({'error': 'Username and password are required.'}, status=400)

        token_url = 'http://127.0.0.1:8000/o/token/'
        response = requests.post(token_url, data={
            'grant_type': 'password',
            'username': username,
            'password': password,
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET
        })

        if response.status_code == 200:
            token_data = response.json()
            user = User.objects.get(username=username)
            token_data['is_admin'] = user.is_staff 
            return JsonResponse(token_data)
        else:
            return JsonResponse({'error': 'Invalid credentials or token fetch failed.'}, status=response.status_code)

    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    try:
        data = request.data
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        is_admin = data.get('is_admin', False)

        if not username or not password or not email:
            return JsonResponse({'error': 'Username, password, and email are required.'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists.'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists.'}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        user.is_staff = is_admin
        user.save()

        return JsonResponse({'message': 'User created successfully.', 'is_admin': user.is_staff}, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
