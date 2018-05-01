"""DeepCloud URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.views.generic import TemplateView
from viewer import views

urlpatterns = [
    # basic URLs
    url(r'^admin/', admin.site.urls),
    url(r'^viewer/', views.viewer, name= 'viewer'),
    url(r'^$', TemplateView.as_view(template_name= "index.html")),

    # directly being used in the DeepCloud
    url(r'^DeepKorg/', TemplateView.as_view(template_name= "deepKorg.html")),
    url(r'^seedStart/',TemplateView.as_view(template_name= "seedStart.html")),
    url(r'^seedEdit/', TemplateView.as_view(template_name= "seedEdit.html")),
    url(r'^hybrid/', TemplateView.as_view(template_name= "hybrid.html")),

##########################################PEDRO ASKS: WHICH LINE SHOULD I USE////##############################################
    url(r'^hybridEdit/', TemplateView.as_view(template_name= "hybridEdit.html")),
    # url(r'^hybridEdit/', views.hybridEdit, name= 'hybridEdit'),
############################################################################################################################


    # main functinoalities
    url(r'^randomPCs/',  views.randomPCs, name="randomPCs"),
    url(r'^randomPC/', views.randomPC, name= 'randomPC'),

    # boilerplates
    url(r'^templatePyFunctionReceive/',  views.templatePyFunctionReceive, name="pythonReceive"),
    url(r'^templatePyFunctionSend/',  views.templatePyFunctionSend, name="pythonSend"),
    url(r'^loadModelByName/',  views.loadModelByName, name="loadModelByName"),
    url(r'^quickPt/',  views.quickPt, name="quickPt"),
    url(r'^latent2PC/',  views.latent2PC, name="latent2PC"),
################################################### PEDRO WAS HERE ##############################################################
    url(r'^hybrid2PC/',  views.hybrid2PC, name="hybrid2PC"),
#################################################################################################################################

]














































