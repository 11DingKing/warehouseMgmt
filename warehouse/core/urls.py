"""
Core 应用 URL 路由配置
仓库管理系统
"""
from django.urls import path
from . import views

urlpatterns = [
    # ===== 认证相关 =====
    path('login/', views.login_page, name='login'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/logout/', views.api_logout, name='api_logout'),
    
    # ===== 主框架 =====
    path('dashboard/', views.dashboard, name='dashboard'),
    path('api/dashboard/stats/', views.api_dashboard_stats, name='api_dashboard_stats'),
    
    # ===== 货物入库 =====
    path('goods/inbound/', views.goods_inbound, name='goods_inbound'),
    path('api/goods/', views.api_goods_list, name='api_goods_list'),
    path('api/goods/create/', views.api_goods_create, name='api_goods_create'),
    
    # ===== 类型管理 =====
    # 单位管理
    path('type/unit/', views.unit_manage, name='unit_manage'),
    path('api/units/', views.api_units_list, name='api_units_list'),
    path('api/units/create/', views.api_unit_create, name='api_unit_create'),
    path('api/units/<int:pk>/update/', views.api_unit_update, name='api_unit_update'),
    path('api/units/<int:pk>/delete/', views.api_unit_delete, name='api_unit_delete'),
    
    # 品类管理
    path('type/category/', views.category_manage, name='category_manage'),
    path('api/categories/', views.api_categories_list, name='api_categories_list'),
    path('api/categories/create/', views.api_category_create, name='api_category_create'),
    path('api/categories/<int:pk>/update/', views.api_category_update, name='api_category_update'),
    path('api/categories/<int:pk>/delete/', views.api_category_delete, name='api_category_delete'),
    
    # 品种管理
    path('type/variety/', views.variety_manage, name='variety_manage'),
    path('api/varieties/', views.api_varieties_list, name='api_varieties_list'),
    path('api/varieties/create/', views.api_variety_create, name='api_variety_create'),
    path('api/varieties/<int:pk>/update/', views.api_variety_update, name='api_variety_update'),
    path('api/varieties/<int:pk>/delete/', views.api_variety_delete, name='api_variety_delete'),
    
    # ===== 审批区域 =====
    path('approval/', views.approval_page, name='approval'),
    path('api/approval/pending/', views.api_approval_pending, name='api_approval_pending'),
    path('api/approval/<int:pk>/approve/', views.api_approval_approve, name='api_approval_approve'),
    path('api/approval/<int:pk>/reject/', views.api_approval_reject, name='api_approval_reject'),
    
    # ===== 人员管理 =====
    path('staff/attendance/', views.staff_attendance, name='staff_attendance'),
    path('staff/outbound/', views.staff_outbound, name='staff_outbound'),
    path('api/staff/', views.api_staff_list, name='api_staff_list'),
    path('api/staff/create/', views.api_staff_create, name='api_staff_create'),
    path('api/staff/<int:pk>/update/', views.api_staff_update, name='api_staff_update'),
    path('api/staff/<int:pk>/delete/', views.api_staff_delete, name='api_staff_delete'),
    
    # ===== 其他功能页面 =====
    path('query/', views.query_export, name='query'),
    path('report/', views.daily_report, name='report'),
    path('alert/', views.alert_page, name='alert'),
]
