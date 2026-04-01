"""
数据模型定义
仓库管理系统 - Alkaid-SOP 3.0
"""
from django.db import models
from django.contrib.auth.models import User


class Unit(models.Model):
    """单位表 - 货物计量单位"""
    name = models.CharField(max_length=50, unique=True, verbose_name='单位名称')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    
    class Meta:
        db_table = 'unit'
        verbose_name = '单位'
        verbose_name_plural = '单位管理'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Category(models.Model):
    """品类表 - 货物分类"""
    name = models.CharField(max_length=100, unique=True, verbose_name='品类名称')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    
    class Meta:
        db_table = 'category'
        verbose_name = '品类'
        verbose_name_plural = '品类管理'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Variety(models.Model):
    """品种表 - 货物具体品种"""
    name = models.CharField(max_length=100, verbose_name='品种名称')
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='varieties',
        verbose_name='所属品类'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    
    class Meta:
        db_table = 'variety'
        verbose_name = '品种'
        verbose_name_plural = '品种管理'
        ordering = ['-created_at']
        unique_together = ['name', 'category']
    
    def __str__(self):
        return f"{self.category.name} - {self.name}"


class Goods(models.Model):
    """货物表 - 入库货物记录"""
    STATUS_CHOICES = [
        ('pending', '待审批'),
        ('approved', '已通过'),
        ('rejected', '已驳回'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='货物名称')
    variety = models.ForeignKey(
        Variety, 
        on_delete=models.CASCADE,
        related_name='goods',
        verbose_name='品种'
    )
    unit = models.ForeignKey(
        Unit, 
        on_delete=models.CASCADE,
        related_name='goods',
        verbose_name='单位'
    )
    quantity = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name='数量'
    )
    inbound_date = models.DateField(verbose_name='入库日期')
    operator = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='operated_goods',
        verbose_name='操作人'
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        verbose_name='状态'
    )
    remark = models.TextField(blank=True, default='', verbose_name='备注')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    class Meta:
        db_table = 'goods'
        verbose_name = '货物'
        verbose_name_plural = '货物管理'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit.name})"


class Approval(models.Model):
    """审批记录表"""
    STATUS_CHOICES = [
        ('approved', '通过'),
        ('rejected', '驳回'),
    ]
    
    goods = models.ForeignKey(
        Goods, 
        on_delete=models.CASCADE,
        related_name='approvals',
        verbose_name='货物'
    )
    approver = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='approvals',
        verbose_name='审批人'
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES,
        verbose_name='审批结果'
    )
    remark = models.TextField(blank=True, default='', verbose_name='审批备注')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='审批时间')
    
    class Meta:
        db_table = 'approval'
        verbose_name = '审批记录'
        verbose_name_plural = '审批记录'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.goods.name} - {self.get_status_display()}"


class Staff(models.Model):
    """人员表 - 考勤/出库人员"""
    ROLE_CHOICES = [
        ('attendance', '考勤人员'),
        ('outbound', '出库人员'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='姓名')
    employee_id = models.CharField(
        max_length=50, 
        unique=True, 
        verbose_name='工号'
    )
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        verbose_name='角色'
    )
    phone = models.CharField(
        max_length=20, 
        blank=True, 
        default='',
        verbose_name='联系电话'
    )
    is_active = models.BooleanField(default=True, verbose_name='是否在职')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    class Meta:
        db_table = 'staff'
        verbose_name = '人员'
        verbose_name_plural = '人员管理'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"
