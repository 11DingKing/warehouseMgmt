"""
Django Admin 配置
仓库管理系统
"""
from django.contrib import admin
from .models import Unit, Category, Variety, Goods, Approval, Staff


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_at']
    search_fields = ['name']
    ordering = ['-created_at']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_at']
    search_fields = ['name']
    ordering = ['-created_at']


@admin.register(Variety)
class VarietyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'created_at']
    list_filter = ['category']
    search_fields = ['name', 'category__name']
    ordering = ['-created_at']


@admin.register(Goods)
class GoodsAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'variety', 'unit', 'quantity', 'status', 'operator', 'inbound_date', 'created_at']
    list_filter = ['status', 'variety__category', 'inbound_date']
    search_fields = ['name', 'variety__name']
    ordering = ['-created_at']


@admin.register(Approval)
class ApprovalAdmin(admin.ModelAdmin):
    list_display = ['id', 'goods', 'approver', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['goods__name', 'approver__username']
    ordering = ['-created_at']


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'employee_id', 'role', 'phone', 'is_active', 'created_at']
    list_filter = ['role', 'is_active']
    search_fields = ['name', 'employee_id', 'phone']
    ordering = ['-created_at']
