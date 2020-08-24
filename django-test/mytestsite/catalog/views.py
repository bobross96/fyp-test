from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User,Group
from .models import Book,Language
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import UserSerializer,GroupSerializer,BookSerializer,LanguageSerializer

#modelviewset allows us the frameowkr to route the urls automatically? no need to use
# get or post or put or delete??

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('title')
    serializer_class = BookSerializer
    #permission_classes = [permissions.IsAuthenticated]

class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all().order_by('name')
    serializer_class = LanguageSerializer  
    permission_classes = [permissions.IsAuthenticated]
