from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('registro_carreras/', views.registro_carreras, name='registro_carreras'),
    path('registro_asignaturas/', views.registro_asignaturas, name='registro_asignaturas'),
    path('registro_docentes/', views.registro_docentes, name='registro_docentes'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('pedir_tutoria/', views.pedir_tutoria, name='pedir_tutoria'),
    path('aceptar_tutoria/', views.aceptar_tutoria, name='aceptar_tutoria')
]