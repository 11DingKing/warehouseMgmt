"""
URL configuration for warehouse project.
仓库管理系统 - URL 路由配置
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # 根路径重定向到登录页
    path('', lambda request: redirect('login')),
    
    # 核心应用路由
    path('', include('core.urls')),
]
