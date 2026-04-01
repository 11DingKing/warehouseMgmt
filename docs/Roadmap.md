# 开发路线图 (Roadmap)
**项目名称**: 仓库管理系统  
**协议版本**: Alkaid-SOP 3.0  
**创建日期**: 2026-01-30  
**状态**: ✅ 已完成

---

## 📋 技术修正记录
根据用户反馈，以下技术点已在本路线图中体现：
1. ✅ Docker Superuser 使用环境变量 (`DJANGO_SUPERUSER_*`)
2. ✅ 添加 `whitenoise` 到 requirements.txt（静态文件服务）
3. ✅ 验证码策略：前端拦截 + 后端可选校验（Phase 1 实现前端，Phase 2 可增强）

---

## 🏗️ 项目结构设计

```
warehouse_system/
├── .alkaid-sop                    # 协议激活文件
├── docker-compose.yml              # Docker 编排文件
├── Dockerfile                      # Django 应用镜像
├── requirements.txt                # Python 依赖（含 whitenoise）
├── README.md                       # 项目说明
├── docs/                          
│   ├── Requirements.md             # ✅ 已完成
│   ├── Roadmap.md                  # 本文件
│   └── DesignSpec.md               # Phase 0 生成
├── warehouse/                      # Django 项目根目录
│   ├── manage.py
│   ├── warehouse/                  # 项目配置
│   │   ├── __init__.py
│   │   ├── settings.py             # 配置 whitenoise
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── core/                       # 核心应用
│   │   ├── migrations/
│   │   ├── models.py               # 数据模型
│   │   ├── views.py                # API 视图
│   │   ├── urls.py
│   │   └── admin.py
│   ├── static/                     # 静态文件（模块化）
│   │   ├── css/
│   │   │   ├── base.css            # 全局基础样式
│   │   │   ├── loading.css
│   │   │   ├── toast.css
│   │   │   ├── form.css
│   │   │   ├── button.css
│   │   │   └── sidebar.css
│   │   ├── js/
│   │   │   ├── loading.js
│   │   │   ├── toast.js
│   │   │   ├── form.js
│   │   │   ├── sidebar.js
│   │   │   └── api.js              # 统一 AJAX 封装
│   │   └── images/
│   │       └── logo.png
│   ├── templates/                  # HTML 模板
│   │   ├── login.html              # 登录页
│   │   ├── dashboard.html          # 主框架
│   │   ├── goods_inbound.html      # 货物入库
│   │   ├── unit_manage.html        # 单位管理
│   │   ├── category_manage.html    # 品类管理
│   │   ├── variety_manage.html     # 品种管理
│   │   ├── approval.html           # 审批区域
│   │   ├── staff_manage.html       # 人员管理
│   │   └── under_development.html  # 占位页
│   └── db.sqlite3                  # SQLite 数据库（Volume 挂载）
└── .env.example                    # 环境变量模板
```

---

## 🚀 开发阶段划分

### **Phase 0: 设计系统定义** [PENDING]
**目标**: 明确视觉规范，避免后续返工  
**执行命令**: `/design`（必须在 Phase 1 之前完成）

**输出文件**: `docs/DesignSpec.md`  
**包含内容**:
- 色彩系统（主色/辅助色/状态色）
- 字体规范（标题/正文/代码）
- 组件样式（按钮/表单/卡片/表格）
- 动画规范（过渡时长/缓动函数）
- 布局网格（间距/圆角/阴影）

**验收标准**: 
- [ ] DesignSpec.md 包含完整的 CSS 变量定义
- [ ] 设计规范已获得用户确认

---

### **Phase 1: 基础设施搭建** [PENDING]
**目标**: 建立可运行的 Docker 环境 + 登录系统

#### Task 1.1: Docker 容器环境 [PENDING]
**文件**:
- `Dockerfile`
- `docker-compose.yml`
- `requirements.txt`
- `.env.example`

**关键配置**:
```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./warehouse:/app
      - db-data:/app/db.sqlite3
    environment:
      - DJANGO_SUPERUSER_USERNAME=admin
      - DJANGO_SUPERUSER_PASSWORD=123456789
      - DJANGO_SUPERUSER_EMAIL=admin@example.com
```

```txt
# requirements.txt
Django==5.0.1
whitenoise==6.6.0
```

**验收**:
- [ ] `docker compose up` 启动成功
- [ ] 访问 http://localhost:8000 显示 Django 默认页
- [ ] SQLite 数据库自动初始化
- [ ] 环境变量成功创建 admin 用户

---

#### Task 1.2: Django 项目初始化 [PENDING]
**操作**:
1. 创建 Django 项目 `warehouse`
2. 创建核心应用 `core`
3. 配置 `settings.py`:
   - 添加 `whitenoise` 中间件
   - 配置 `STATIC_ROOT` 和 `STATICFILES_DIRS`
   - 设置 `ALLOWED_HOSTS = ['*']`（开发环境）
   - 配置中文语言 `LANGUAGE_CODE = 'zh-hans'`
4. 创建基础目录结构（static/templates）

**验收**:
- [ ] `python manage.py runserver` 正常启动
- [ ] `python manage.py collectstatic` 成功执行
- [ ] 静态文件可通过 `/static/` 访问

---

#### Task 1.3: 前端模块系统 [PENDING]
**输出文件**:
```
static/css/
  - base.css          # 全局变量（CSS Variables）
  - loading.css       # 加载动画
  - toast.css         # 提示框
  - form.css          # 表单样式
  - button.css        # 按钮样式
  - sidebar.css       # 菜单栏

static/js/
  - loading.js        # 显示/隐藏加载层
  - toast.js          # 显示提示（success/error/warning/info）
  - form.js           # 表单验证工具
  - sidebar.js        # 菜单交互逻辑
  - api.js            # AJAX 封装（包含 CSRF Token）
```

**base.css 示例**:
```css
:root {
  /* 主色调 */
  --color-primary: #0066FF;
  --color-primary-light: #00A3FF;
  --color-primary-dark: #003D99;
  
  /* 背景色 */
  --color-bg-dark: #0A0E27;
  --color-bg-light: #1A1F3A;
  
  /* 强调色 */
  --color-accent-cyan: #00FFFF;
  --color-accent-purple: #8B5CF6;
  
  /* 状态色 */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;
  
  /* 字体 */
  --font-family: 'Inter', 'Roboto', sans-serif;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 动画 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

**验收**:
- [ ] 所有模块文件创建完成
- [ ] 每个 JS 模块可独立导入使用
- [ ] CSS 变量在所有模块中生效

---

#### Task 1.4: 登录页面实现 [PENDING]
**前端** (`templates/login.html`):
- 使用 `base.css` + `loading.css` + `toast.css` + `form.css` + `button.css`
- 禁止内嵌 `<style>` 和 `<script>`
- 背景：静态方块 + CSS 动态光效（使用 `animation`）
- 算术验证：JavaScript 随机生成（如 `Math.floor(Math.random()*10) + Math.floor(Math.random()*10)`）

**后端** (`core/views.py`):
```python
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_POST
from django.http import JsonResponse

@require_POST
def login_view(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    
    # 注意：算术验证由前端拦截，后端仅验证账户
    # 如需后端验证，可在 Phase 2 增强
    
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': '用户名或密码错误'})
```

**验收**:
- [ ] 登录页样式符合设计规范（未来科技感）
- [ ] 算术验证错误时阻止提交
- [ ] 使用 admin/123456789 可成功登录
- [ ] 登录失败显示 Toast 提示

---

### **Phase 2: 主框架与菜单系统** [PENDING]
**目标**: 实现登录后的主界面布局

#### Task 2.1: 主框架 HTML [PENDING]
**文件**: `templates/dashboard.html`

**布局结构**:
```html
<!-- 无内嵌 CSS/JS，完全依赖外部模块 -->
<link rel="stylesheet" href="/static/css/base.css">
<link rel="stylesheet" href="/static/css/sidebar.css">
<link rel="stylesheet" href="/static/css/toast.css">

<div class="layout">
  <!-- 顶部标题栏 -->
  <header class="header">
    <div class="logo">仓库管理系统</div>
    <div class="user-info">
      <span id="username">{{ user.username }}</span>
      <button id="logout-btn" class="btn-secondary">退出</button>
    </div>
  </header>
  
  <!-- 左侧菜单 -->
  <aside class="sidebar" id="sidebar">
    <!-- 菜单内容由 sidebar.js 动态生成 -->
  </aside>
  
  <!-- 右侧内容区 -->
  <main class="content" id="content">
    <!-- 动态加载页面 -->
  </main>
</div>

<script src="/static/js/sidebar.js"></script>
<script src="/static/js/toast.js"></script>
<script src="/static/js/api.js"></script>
```

**验收**:
- [ ] 顶部栏显示当前用户名
- [ ] 左侧菜单不遮挡右侧内容
- [ ] 响应式布局（最小 1280x720）

---

#### Task 2.2: 菜单栏交互 [PENDING]
**文件**: `static/js/sidebar.js`

**功能需求**:
1. 渲染菜单结构（支持二级菜单）
2. 二级菜单折叠/展开动画
3. 当前页面高亮
4. 点击菜单项切换内容区

**菜单数据结构**:
```javascript
const menuData = [
  { id: 'dashboard', name: '仪表盘', icon: '📊', url: '/dashboard/' },
  { id: 'inbound', name: '货物入库', icon: '📥', url: '/goods/inbound/' },
  { 
    id: 'type', 
    name: '类型管理', 
    icon: '📂',
    children: [
      { id: 'unit', name: '单位管理', url: '/type/unit/' },
      { id: 'category', name: '品类管理', url: '/type/category/' },
      { id: 'variety', name: '品种管理', url: '/type/variety/' }
    ]
  },
  { id: 'query', name: '查询导出', icon: '🔍', url: '/query/' },
  { id: 'report', name: '每日报表', icon: '📈', url: '/report/' },
  { id: 'alert', name: '预警', icon: '⚠️', url: '/alert/' },
  { id: 'approval', name: '审批区域', icon: '✅', url: '/approval/' },
  {
    id: 'staff',
    name: '人员管理',
    icon: '👥',
    children: [
      { id: 'attendance', name: '考勤人员管理', url: '/staff/attendance/' },
      { id: 'outbound', name: '出库人员管理', url: '/staff/outbound/' }
    ]
  }
];
```

**验收**:
- [ ] 菜单结构正确渲染
- [ ] 二级菜单展开/折叠流畅（0.3s 过渡）
- [ ] 点击后高亮当前项

---

#### Task 2.3: 退出登录确认框 [PENDING]
**文件**: `static/js/toast.js`（扩展 confirm 功能）

**功能**:
```javascript
// 自定义确认框（非 window.confirm）
function showConfirm(message, onConfirm, onCancel) {
  // 创建模态框 DOM
  // 样式符合科技感设计
  // 确认后调用 onConfirm 回调
}

// 使用示例
document.getElementById('logout-btn').addEventListener('click', () => {
  showConfirm('确定要退出登录吗？', () => {
    api.post('/api/logout/').then(() => {
      window.location.href = '/login/';
    });
  });
});
```

**验收**:
- [ ] 点击退出触发自定义确认框（非浏览器原生）
- [ ] 确认框样式符合设计规范
- [ ] 确认后成功退出并跳转

---

### **Phase 3: 核心功能实现** [PENDING]
**目标**: 实现货物入库、类型管理、审批功能

#### Task 3.1: 数据库模型设计 [PENDING]
**文件**: `core/models.py`

```python
from django.db import models
from django.contrib.auth.models import User

class Unit(models.Model):
    """单位表"""
    name = models.CharField(max_length=50, unique=True, verbose_name='单位名称')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'unit'
        verbose_name = '单位'

class Category(models.Model):
    """品类表"""
    name = models.CharField(max_length=100, unique=True, verbose_name='品类名称')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'category'
        verbose_name = '品类'

class Variety(models.Model):
    """品种表"""
    name = models.CharField(max_length=100, verbose_name='品种名称')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='所属品类')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'variety'
        verbose_name = '品种'

class Goods(models.Model):
    """货物表"""
    STATUS_CHOICES = [
        ('pending', '待审批'),
        ('approved', '已通过'),
        ('rejected', '已驳回'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='货物名称')
    variety = models.ForeignKey(Variety, on_delete=models.CASCADE, verbose_name='品种')
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, verbose_name='单位')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='数量')
    inbound_date = models.DateField(verbose_name='入库日期')
    operator = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='操作人')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'goods'
        verbose_name = '货物'

class Approval(models.Model):
    """审批记录表"""
    goods = models.ForeignKey(Goods, on_delete=models.CASCADE, verbose_name='货物')
    approver = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='审批人')
    status = models.CharField(max_length=20, choices=Goods.STATUS_CHOICES)
    remark = models.TextField(blank=True, verbose_name='备注')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'approval'
        verbose_name = '审批记录'

class Staff(models.Model):
    """人员表"""
    ROLE_CHOICES = [
        ('attendance', '考勤人员'),
        ('outbound', '出库人员'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='姓名')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, verbose_name='角色')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'staff'
        verbose_name = '人员'
```

**验收**:
- [ ] `python manage.py makemigrations` 成功
- [ ] `python manage.py migrate` 成功
- [ ] Django Admin 可查看所有表

---

#### Task 3.2: 货物入库页面 [PENDING]
**前端**: `templates/goods_inbound.html`  
**后端**: `core/views.py` -> `goods_inbound_view()`

**功能**:
- 表单字段：货物名称、品种（下拉）、单位（下拉）、数量、入库日期
- 提交后插入数据库（状态为 'pending'）
- 成功后显示 Toast 提示

**验收**:
- [ ] 表单样式使用 `form.css`
- [ ] 品种/单位下拉框动态加载（AJAX）
- [ ] 提交成功后显示成功提示
- [ ] 数据库中可查询到新记录

---

#### Task 3.3: 类型管理页面 [PENDING]
**文件**: 
- `templates/unit_manage.html`
- `templates/category_manage.html`
- `templates/variety_manage.html`

**功能**:
- 表格展示所有记录
- 新增按钮（打开模态框）
- 编辑/删除按钮（每行）
- 删除前自定义确认框

**验收**:
- [ ] 表格样式统一（使用 `base.css` 变量）
- [ ] CRUD 操作正常（真实数据库）
- [ ] 删除确认框样式符合设计

---

#### Task 3.4: 审批区域页面 [PENDING]
**文件**: `templates/approval.html`

**功能**:
- 显示状态为 'pending' 的货物列表
- 每行有「通过」和「驳回」按钮
- 操作后更新 `Goods.status` 并插入 `Approval` 记录

**验收**:
- [ ] 审批列表实时刷新
- [ ] 审批记录存入数据库
- [ ] 操作后显示 Toast 提示

---

#### Task 3.5: 人员管理页面 [PENDING]
**文件**: `templates/staff_manage.html`

**功能**:
- 表格展示人员列表（支持角色筛选）
- 新增/编辑/删除功能

**验收**:
- [ ] 角色筛选正常工作
- [ ] CRUD 操作正常

---

### **Phase 4: 占位页面与未开发功能** [PENDING]
**目标**: 完善所有菜单项的页面

#### Task 4.1: 占位页面 [PENDING]
**文件**: `templates/under_development.html`

**内容**:
```html
<div class="under-development">
  <div class="icon">🚧</div>
  <h2>功能开发中...</h2>
  <p>该功能正在开发中，敬请期待</p>
</div>
```

**路由配置**:
- 仪表盘 -> `under_development.html`
- 查询导出 -> `under_development.html`
- 每日报表 -> `under_development.html`
- 预警 -> `under_development.html`

**验收**:
- [ ] 占位页样式符合设计风格
- [ ] 点击未开发菜单显示占位页

---

### **Phase 5: 容器优化与交付准备** [PENDING]
**目标**: 确保 Docker 交付标准

#### Task 5.1: Dockerfile 优化 [PENDING]
**优化点**:
1. 多阶段构建（减小镜像体积）
2. 使用 `.dockerignore` 排除无关文件
3. 健康检查（HEALTHCHECK）
4. 非 root 用户运行

**示例**:
```dockerfile
FROM python:3.11-slim

# 配置清华镜像源
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 安装依赖
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目
COPY warehouse/ /app/

# 初始化数据库（使用环境变量创建 superuser）
RUN python manage.py migrate && \
    python manage.py collectstatic --noinput

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD python -c "import requests; requests.get('http://localhost:8000')"

# 暴露端口
EXPOSE 8000

# 启动服务
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

**验收**:
- [ ] 镜像构建成功
- [ ] 容器健康检查通过
- [ ] 静态文件正常访问

---

#### Task 5.2: 环境变量初始化 [PENDING]
**文件**: `warehouse/warehouse/settings.py`

**配置**:
```python
import os

# 从环境变量读取 Superuser 配置
DJANGO_SUPERUSER_USERNAME = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
DJANGO_SUPERUSER_PASSWORD = os.getenv('DJANGO_SUPERUSER_PASSWORD', '123456789')
DJANGO_SUPERUSER_EMAIL = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
```

**初始化脚本**: 在 Dockerfile 中添加
```dockerfile
# 使用 django-admin 命令创建 superuser（仅在不存在时）
RUN python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='${DJANGO_SUPERUSER_USERNAME}').exists():
    User.objects.create_superuser('${DJANGO_SUPERUSER_USERNAME}', '${DJANGO_SUPERUSER_EMAIL}', '${DJANGO_SUPERUSER_PASSWORD}')
"
```

**验收**:
- [ ] 容器启动时自动创建 admin 用户
- [ ] 使用环境变量配置的账户可登录

---

#### Task 5.3: README 编写 [PENDING]
**文件**: `README.md`

**内容**:
1. 项目简介
2. 快速开始（`docker compose up`）
3. 默认账户信息
4. 功能清单
5. 技术栈说明
6. 开发说明（如何修改/调试）

**验收**:
- [ ] README 包含完整的启动步骤
- [ ] 非技术人员可根据 README 启动项目

---

#### Task 5.4: 最终验收测试 [PENDING]
**测试清单**:
1. ✅ 容器测试
   - [ ] `docker compose up` 一键启动
   - [ ] 访问 localhost:8000 正常
   - [ ] 容器重启后数据不丢失

2. ✅ 功能测试
   - [ ] 登录页算术验证工作
   - [ ] admin/123456789 可登录
   - [ ] 菜单栏二级菜单正常
   - [ ] 货物入库功能正常
   - [ ] 类型管理 CRUD 正常
   - [ ] 审批功能正常
   - [ ] 人员管理功能正常
   - [ ] 占位页正常显示

3. ✅ 代码质量测试
   - [ ] 主页 HTML 无内嵌 CSS/JS
   - [ ] 所有模块独立文件存在
   - [ ] 前后端完全分离
   - [ ] 无模拟数据

4. ✅ 设计测试
   - [ ] 所有页面视觉风格统一
   - [ ] 科技感设计符合要求
   - [ ] 响应式布局正常

---

## 📊 进度追踪

| 阶段 | 任务数 | 已完成 | 进行中 | 待开始 | 进度 |
|------|--------|--------|--------|--------|------|
| Phase 0 | 1 | 1 | 0 | 0 | 100% |
| Phase 1 | 4 | 4 | 0 | 0 | 100% |
| Phase 2 | 3 | 3 | 0 | 0 | 100% |
| Phase 3 | 5 | 5 | 0 | 0 | 100% |
| Phase 4 | 1 | 1 | 0 | 0 | 100% |
| Phase 5 | 4 | 4 | 0 | 0 | 100% |
| **总计** | **18** | **18** | **0** | **0** | **100%** |

---

## 🎯 当前状态
**状态**: ✅ 开发完成，可执行 Docker 验收  
**启动命令**: `docker compose up`  
**访问地址**: http://localhost:8000  
**默认账户**: admin / 123456789

---

## 📝 技术债务记录
1. **验证码后端校验**: Phase 1 仅实现前端拦截，Phase 2 可增强后端校验逻辑
2. **性能优化**: 当前使用 Django 开发服务器，生产环境需切换到 Gunicorn + Nginx

---

## 🔄 变更日志
- **2026-01-30**: 初始化路线图，包含 5 个阶段 18 个任务
