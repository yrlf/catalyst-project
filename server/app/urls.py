from django.urls import path, include
from . import apps

urlpatterns =[
    path('/list', apps.list, name='list'),
    path('/detail', apps.detail, name='detail'),
    path('/upload', apps.upload, name='upload'),
    path('/uploadPOSCAR', apps.uploadPOSCAR, name='uploadPOSCAR')
]