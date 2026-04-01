"""
视图函数定义
仓库管理系统 - Alkaid-SOP 3.0
"""
import json
from datetime import date
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Q

from .models import Unit, Category, Variety, Goods, Approval, Staff


# ========================================
# 认证相关视图
# ========================================

def login_page(request):
    """登录页面"""
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'login.html')


@require_POST
def api_login(request):
    """登录 API"""
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return JsonResponse({
                'success': False, 
                'error': '请输入用户名和密码'
            })
        
        # Django 认证
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({
                'success': True, 
                'message': '登录成功',
                'redirect': '/dashboard/'
            })
        else:
            return JsonResponse({
                'success': False, 
                'error': '用户名或密码错误'
            })
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False, 
            'error': '请求数据格式错误'
        })
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': f'服务器错误: {str(e)}'
        })


@require_POST
def api_logout(request):
    """退出登录 API"""
    logout(request)
    return JsonResponse({
        'success': True, 
        'message': '已退出登录',
        'redirect': '/login/'
    })


# ========================================
# 主框架视图
# ========================================

@login_required
def dashboard(request):
    """仪表盘/主框架页面"""
    return render(request, 'dashboard.html', {
        'current_page': 'dashboard'
    })


@login_required
@require_GET
def api_dashboard_stats(request):
    """获取仪表盘统计数据"""
    from django.db.models import Count, Sum
    from datetime import datetime, timedelta
    
    today = date.today()
    
    # 货物统计
    total_goods = Goods.objects.count()
    pending_goods = Goods.objects.filter(status='pending').count()
    approved_goods = Goods.objects.filter(status='approved').count()
    rejected_goods = Goods.objects.filter(status='rejected').count()
    
    # 今日入库
    today_inbound = Goods.objects.filter(created_at__date=today).count()
    
    # 人员统计
    total_staff = Staff.objects.count()
    active_staff = Staff.objects.filter(is_active=True).count()
    
    # 类型统计
    total_categories = Category.objects.count()
    total_varieties = Variety.objects.count()
    total_units = Unit.objects.count()
    
    # 最近7天入库趋势
    week_ago = today - timedelta(days=6)
    daily_stats = []
    for i in range(7):
        day = week_ago + timedelta(days=i)
        count = Goods.objects.filter(created_at__date=day).count()
        daily_stats.append({
            'date': day.strftime('%m-%d'),
            'count': count
        })
    
    # 最近入库记录（最近5条）
    recent_goods = Goods.objects.select_related(
        'variety', 'variety__category', 'unit', 'operator'
    ).order_by('-created_at')[:5]
    
    recent_goods_data = [{
        'id': g.id,
        'name': g.name,
        'variety': g.variety.name,
        'quantity': str(g.quantity),
        'unit': g.unit.name,
        'status': g.status,
        'status_display': g.get_status_display(),
        'created_at': g.created_at.strftime('%Y-%m-%d %H:%M'),
    } for g in recent_goods]
    
    # 最近审批记录（最近5条）
    recent_approvals = Approval.objects.select_related(
        'goods', 'approver'
    ).order_by('-created_at')[:5]
    
    recent_approvals_data = [{
        'id': a.id,
        'goods_name': a.goods.name,
        'approver': a.approver.username,
        'status': a.status,
        'status_display': '通过' if a.status == 'approved' else '驳回',
        'created_at': a.created_at.strftime('%Y-%m-%d %H:%M'),
    } for a in recent_approvals]
    
    return JsonResponse({
        'success': True,
        'data': {
            'overview': {
                'total_goods': total_goods,
                'pending_goods': pending_goods,
                'approved_goods': approved_goods,
                'rejected_goods': rejected_goods,
                'today_inbound': today_inbound,
                'total_staff': total_staff,
                'active_staff': active_staff,
                'total_categories': total_categories,
                'total_varieties': total_varieties,
                'total_units': total_units,
            },
            'daily_stats': daily_stats,
            'recent_goods': recent_goods_data,
            'recent_approvals': recent_approvals_data,
        }
    })


@login_required
def query_export(request):
    """查询导出页面"""
    return render(request, 'query_export.html', {
        'current_page': 'query'
    })


@login_required
def daily_report(request):
    """每日报表页面"""
    return render(request, 'daily_report.html', {
        'current_page': 'report'
    })


@login_required
def alert_page(request):
    """预警页面"""
    return render(request, 'alert.html', {
        'current_page': 'alert'
    })


# ========================================
# 货物入库视图
# ========================================

@login_required
def goods_inbound(request):
    """货物入库页面"""
    return render(request, 'goods_inbound.html', {
        'current_page': 'inbound'
    })


@login_required
@require_GET
def api_goods_list(request):
    """获取货物列表"""
    goods = Goods.objects.select_related('variety', 'unit', 'operator').all()
    
    # 搜索筛选
    search = request.GET.get('search', '')
    if search:
        goods = goods.filter(
            Q(name__icontains=search) | 
            Q(variety__name__icontains=search)
        )
    
    # 状态筛选
    status = request.GET.get('status', '')
    if status:
        goods = goods.filter(status=status)
    
    data = [{
        'id': g.id,
        'name': g.name,
        'variety': g.variety.name,
        'category': g.variety.category.name,
        'unit': g.unit.name,
        'quantity': str(g.quantity),
        'inbound_date': g.inbound_date.strftime('%Y-%m-%d'),
        'operator': g.operator.username,
        'status': g.status,
        'status_display': g.get_status_display(),
        'created_at': g.created_at.strftime('%Y-%m-%d %H:%M'),
    } for g in goods[:100]]  # 限制返回数量
    
    return JsonResponse({'success': True, 'data': data})


@login_required
@require_POST
def api_goods_create(request):
    """创建货物入库记录"""
    try:
        data = json.loads(request.body)
        
        # 验证必填字段
        required_fields = ['name', 'variety_id', 'unit_id', 'quantity', 'inbound_date']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({
                    'success': False, 
                    'error': f'缺少必填字段: {field}'
                })
        
        # 获取关联对象
        variety = get_object_or_404(Variety, pk=data['variety_id'])
        unit = get_object_or_404(Unit, pk=data['unit_id'])
        
        # 创建货物记录
        goods = Goods.objects.create(
            name=data['name'].strip(),
            variety=variety,
            unit=unit,
            quantity=data['quantity'],
            inbound_date=data['inbound_date'],
            operator=request.user,
            status='pending',
            remark=data.get('remark', '')
        )
        
        return JsonResponse({
            'success': True, 
            'message': '入库记录创建成功，等待审批',
            'data': {'id': goods.id}
        })
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': f'创建失败: {str(e)}'
        })


# ========================================
# 单位管理视图
# ========================================

@login_required
def unit_manage(request):
    """单位管理页面"""
    return render(request, 'unit_manage.html', {
        'current_page': 'unit'
    })


@login_required
@require_GET
def api_units_list(request):
    """获取单位列表"""
    units = Unit.objects.all()
    data = [{
        'id': u.id,
        'name': u.name,
        'created_at': u.created_at.strftime('%Y-%m-%d %H:%M'),
    } for u in units]
    return JsonResponse({'success': True, 'data': data})


@login_required
@require_POST
def api_unit_create(request):
    """创建单位"""
    try:
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        
        if not name:
            return JsonResponse({'success': False, 'error': '单位名称不能为空'})
        
        if Unit.objects.filter(name=name).exists():
            return JsonResponse({'success': False, 'error': '该单位已存在'})
        
        unit = Unit.objects.create(name=name)
        return JsonResponse({
            'success': True, 
            'message': '单位创建成功',
            'data': {'id': unit.id, 'name': unit.name}
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def api_unit_update(request, pk):
    """更新单位"""
    try:
        unit = get_object_or_404(Unit, pk=pk)
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        
        if not name:
            return JsonResponse({'success': False, 'error': '单位名称不能为空'})
        
        if Unit.objects.filter(name=name).exclude(pk=pk).exists():
            return JsonResponse({'success': False, 'error': '该单位名称已存在'})
        
        unit.name = name
        unit.save()
        return JsonResponse({'success': True, 'message': '单位更新成功'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def api_unit_delete(request, pk):
    """删除单位"""
    try:
        unit = get_object_or_404(Unit, pk=pk)
        
        # 检查是否有关联的货物
        if unit.goods.exists():
            return JsonResponse({
                'success': False, 
                'error': '该单位已被货物使用，无法删除'
            })
        
        unit.delete()
        return JsonResponse({'success': True, 'message': '单位删除成功'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


# ========================================
# 品类管理视图
# ========================================

@login_required
def category_manage(request):
    """品类管理页面"""
    return render(request, 'category_manage.html', {
        'current_page': 'category'
    })


@login_required
@require_GET
def api_categories_list(request):
    """获取品类列表"""
    categories = Category.objects.all()
    data = [{
        'id': c.id,
        'name': c.name,
        'variety_count': c.varieties.count(),
        'created_at': c.created_at.strftime('%Y-%m-%d %H:%M'),
    } for c in categories]
    return JsonResponse({'success': True, 'data': data})


@login_required
@require_POST
def api_category_create(request):
    """创建品类"""
    try:
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        
        if not name:
            return JsonResponse({'success': False, 'error': '品类名称不能为空'})
        
        if Category.objects.filter(name=name).exists():
            return JsonResponse({'success': False, 'error': '该品类已存在'})
        
        category = Category.objects.create(name=name)
        return JsonResponse({
            'success': True, 
            'message': '品类创建成功',
            'data': {'id': category.id, 'name': category.name}
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def api_category_update(request, pk):
    """更新品类"""
    try:
        category = get_object_or_404(Category, pk=pk)
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        
        if not name:
            return JsonResponse({'success': False, 'error': '品类名称不能为空'})
        
        if Category.objects.filter(name=name).exclude(pk=pk).exists():
            return JsonResponse({'success': False, 'error': '该品类名称已存在'})
        
        category.name = name
        category.save()
        return JsonResponse({'success': True, 'message': '品类更新成功'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def api_category_delete(request, pk):
    """删除品类"""
    try:
        category = get_object_or_404(Category, pk=pk)
        
        if category.varieties.exists():
            return JsonResponse({
                'success': False, 
                'error': '该品类下有品种，无法删除'
            })
        
        category.delete()
        return JsonResponse({'success': True, 'message': '品类删除成功'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


# ========================================
# 品种管理视图
# ========================================

@login_required
def variety_manage(request):
    """品种管理页面"""
    return render(request, 'variety_manage.html', {
        'current_page': 'variety'
    })


@login_required
@require_GET
def api_varieties_list(request):
    """获取品种列表"""
    varieties = Variety.objects.select_related('category').all()
    
    # 按品类筛选
    category_id = request.GET.get('category_id', '')
    if category_id:
        varieties = varieties.filter(category_id=category_id)
    
    data = [{
        'id': v.id,
        'name': v.name,
        'category_id': v.category.id,
        'category_name': v.category.name,
        'created_at': v.created_at.strftime('%Y-%m-%d %H:%M'),
    } for v in varieties]
    return JsonResponse({'success': True, 'data': data})


@login_required
@require_POST
def api_variety_create(request):
    """创建品种"""
    try:
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        category_id = data.get('category_id')
        
        if not name:
            return JsonResponse({'success': False, 'error': '品种名称不能为空'})
        
        if not category_id:
            return JsonResponse({'success': False, 'error': '请选择所属品类'})
        
        category = get_object_or_404(Category, pk=category_id)
        
        if Variety.objects.filter(name=name, category=category).exists():
            return JsonResponse({'success': False, 'error': '该品类下已存在同名品种'})
        
        variety = Variety.objects.create(name=name, category=category)
        return JsonResponse({
            'success': True, 
            'message': '品种创建成功',
            'data': {'id': variety.id, 'name': variety.name}
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def api_variety_update(request, pk):
    """更新品种"""
    try:
        variety = get_object_or_404(Variety, pk=pk)
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        category_id = data.get('category_id')
        
        if not name:
            return JsonResponse({'success': False, 'error': '品种名称不能为空'})
        
        if category_id:
            category = get_object_or_404(Category, pk=category_id)
            if Variety.objects.filter(name=name, category=category).exclude(pk=pk).exists():
                return JsonResponse({'success': False, 'error': '该品类下已存在同名品种'})
            variety.category = category
        
        variety.name = name
        variety.save()
        return JsonResponse({'success': True, 'message': '品种更新成功'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def api_variety_delete(request, pk):
    """删除品种"""
    try:
        variety = get_object_or_404(Variety, pk=pk)
        
        if variety.goods.exists():
            return JsonResponse({
                'success': False, 
                'error': '该品种已被货物使用，无法删除'
            })
        
        variety.delete()
        return JsonResponse({'success': True, 'message': '品种删除成功'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


# ========================================
# 审批区域视图
# ========================================

@login_required
def approval_page(request):
    """审批区域页面"""
    return render(request, 'approval.html', {
        'current_page': 'approval'
    })


@login_required
@require_GET
def api_approval_pending(request):
    """获取待审批列表"""
    goods = Goods.objects.filter(status='pending').select_related(
        'variety', 'variety__category', 'unit', 'operator'
    )
    
    data = [{
        'id': g.id,
        'name': g.name,
        'variety': g.variety.name,
        'category': g.variety.category.name,
        'unit': g.unit.name,
        'quantity': str(g.quantity),
        'inbound_date': g.inbound_date.strftime('%Y-%m-%d'),
        'operator': g.operator.username,
        'remark': g.remark,
        'created_at': g.created_at.strftime('%Y-%m-%d %H:%M'),
    } for g in goods]
    
    return JsonResponse({'success': True, 'data': data})


@login_required
@require_POST
def api_approval_approve(request, pk):
    """审批通过"""
    try:
        goods = get_object_or_404(Goods, pk=pk)
        
        if goods.status != 'pending':
            return JsonResponse({'success': False, 'error': '该货物已审批'})
        
        data = json.loads(request.body) if request.body else {}
        remark = data.get('remark', '')
        
        # 更新货物状态
        goods.status = 'approved'
        goods.save()
        
        # 创建审批记录
        Approval.objects.create(
            goods=goods,
            approver=request.user,
            status='approved',
            remark=remark
        )
        
        return JsonResponse({'success': True, 'message': '审批通过'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def api_approval_reject(request, pk):
    """审批驳回"""
    try:
        goods = get_object_or_404(Goods, pk=pk)
        
        if goods.status != 'pending':
            return JsonResponse({'success': False, 'error': '该货物已审批'})
        
        data = json.loads(request.body) if request.body else {}
        remark = data.get('remark', '')
        
        # 更新货物状态
        goods.status = 'rejected'
        goods.save()
        
        # 创建审批记录
        Approval.objects.create(
            goods=goods,
            approver=request.user,
            status='rejected',
            remark=remark
        )
        
        return JsonResponse({'success': True, 'message': '已驳回'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


# ========================================
# 人员管理视图
# ========================================

@login_required
def staff_attendance(request):
    """考勤人员管理页面"""
    return render(request, 'staff_manage.html', {
        'current_page': 'attendance',
        'staff_role': 'attendance',
        'page_title': '考勤人员管理'
    })


@login_required
def staff_outbound(request):
    """出库人员管理页面"""
    return render(request, 'staff_manage.html', {
        'current_page': 'outbound',
        'staff_role': 'outbound',
        'page_title': '出库人员管理'
    })


@login_required
@require_GET
def api_staff_list(request):
    """获取人员列表"""
    staff_list = Staff.objects.all()
    
    # 按角色筛选
    role = request.GET.get('role', '')
    if role:
        staff_list = staff_list.filter(role=role)
    
    # 按状态筛选
    is_active = request.GET.get('is_active', '')
    if is_active:
        staff_list = staff_list.filter(is_active=is_active == 'true')
    
    data = [{
        'id': s.id,
        'name': s.name,
        'employee_id': s.employee_id,
        'role': s.role,
        'role_display': s.get_role_display(),
        'phone': s.phone,
        'is_active': s.is_active,
        'created_at': s.created_at.strftime('%Y-%m-%d %H:%M'),
    } for s in staff_list]
    
    return JsonResponse({'success': True, 'data': data})


@login_required
@require_POST
def api_staff_create(request):
    """创建人员"""
    try:
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        employee_id = data.get('employee_id', '').strip()
        role = data.get('role', '').strip()
        phone = data.get('phone', '').strip()
        
        if not name:
            return JsonResponse({'success': False, 'error': '姓名不能为空'})
        
        if not employee_id:
            return JsonResponse({'success': False, 'error': '工号不能为空'})
        
        if not role:
            return JsonResponse({'success': False, 'error': '请选择角色'})
        
        if Staff.objects.filter(employee_id=employee_id).exists():
            return JsonResponse({'success': False, 'error': '该工号已存在'})
        
        staff = Staff.objects.create(
            name=name,
            employee_id=employee_id,
            role=role,
            phone=phone
        )
        return JsonResponse({
            'success': True, 
            'message': '人员创建成功',
            'data': {'id': staff.id}
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def api_staff_update(request, pk):
    """更新人员"""
    try:
        staff = get_object_or_404(Staff, pk=pk)
        data = json.loads(request.body)
        
        name = data.get('name', '').strip()
        employee_id = data.get('employee_id', '').strip()
        role = data.get('role', '').strip()
        phone = data.get('phone', '').strip()
        is_active = data.get('is_active', True)
        
        if not name:
            return JsonResponse({'success': False, 'error': '姓名不能为空'})
        
        if employee_id and Staff.objects.filter(employee_id=employee_id).exclude(pk=pk).exists():
            return JsonResponse({'success': False, 'error': '该工号已存在'})
        
        staff.name = name
        if employee_id:
            staff.employee_id = employee_id
        if role:
            staff.role = role
        staff.phone = phone
        staff.is_active = is_active
        staff.save()
        
        return JsonResponse({'success': True, 'message': '人员信息更新成功'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@require_POST
def api_staff_delete(request, pk):
    """删除人员"""
    try:
        staff = get_object_or_404(Staff, pk=pk)
        staff.delete()
        return JsonResponse({'success': True, 'message': '人员删除成功'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
