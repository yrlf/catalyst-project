from django.urls import path, include
from . import apps

urlpatterns =[
    path('/list', apps.list_materials, name='list_materials'),
    path('/detail', apps.detail, name='detail'),
    path('/upload', apps.upload, name='upload'),
    path('/uploadPOSCAR', apps.uploadPOSCAR, name='uploadPOSCAR'),
    path('/api/get_poscar', apps.get_poscar, name='get_poscar'),
]