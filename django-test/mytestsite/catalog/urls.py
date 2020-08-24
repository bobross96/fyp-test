from django.urls import path, include
from . import views
from rest_framework import routers



#name parameter can be used to link in the Django HTML template page
""" urlpatterns = [
    path('', views.index, name='index'),
] """



#url part

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups',views.GroupViewSet)
router.register(r'books',views.BookViewSet)
router.register(r'language',views.LanguageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/',include('rest_framework.urls',namespace='rest_framework'))
]

