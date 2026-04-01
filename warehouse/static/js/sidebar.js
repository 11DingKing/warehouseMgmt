/**
 * 侧边栏菜单模块
 * 仓库管理系统 - Alkaid-SOP 3.0
 */

const Sidebar = {
  // 菜单数据
  menuData: [
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
  ],

  currentPage: null,

  /**
   * 初始化侧边栏
   * @param {string} currentPage - 当前页面标识
   */
  init(currentPage) {
    this.currentPage = currentPage;
    this.render();
    this.bindEvents();
  },

  /**
   * 渲染菜单
   */
  render() {
    const menuContainer = document.getElementById('sidebar-menu');
    if (!menuContainer) return;

    let html = '';
    
    this.menuData.forEach(item => {
      if (item.children) {
        // 有子菜单
        const isExpanded = item.children.some(child => child.id === this.currentPage);
        const isActive = isExpanded;
        
        html += `
          <div class="menu-item ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}" data-id="${item.id}" data-has-children="true">
            <span class="menu-item-icon">${item.icon}</span>
            <span class="menu-item-text">${item.name}</span>
            <span class="menu-item-arrow">›</span>
          </div>
          <div class="menu-submenu ${isExpanded ? 'expanded' : ''}" data-parent="${item.id}">
            ${item.children.map(child => `
              <a href="${child.url}" class="menu-submenu-item ${child.id === this.currentPage ? 'active' : ''}" data-id="${child.id}">
                ${child.name}
              </a>
            `).join('')}
          </div>
        `;
      } else {
        // 无子菜单
        html += `
          <a href="${item.url}" class="menu-item ${item.id === this.currentPage ? 'active' : ''}" data-id="${item.id}">
            <span class="menu-item-icon">${item.icon}</span>
            <span class="menu-item-text">${item.name}</span>
          </a>
        `;
      }
    });
    
    menuContainer.innerHTML = html;
  },

  /**
   * 绑定事件
   */
  bindEvents() {
    const menuContainer = document.getElementById('sidebar-menu');
    if (!menuContainer) return;

    // 菜单项点击事件
    menuContainer.addEventListener('click', (e) => {
      const menuItem = e.target.closest('.menu-item[data-has-children="true"]');
      if (menuItem) {
        e.preventDefault();
        this.toggleSubmenu(menuItem);
      }
    });

    // 退出登录按钮
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const confirmed = await Confirm.logout();
        if (confirmed) {
          Loading.show('正在退出...');
          const result = await API.logout();
          Loading.hide();
          
          if (result.success) {
            window.location.href = result.redirect || '/login/';
          } else {
            Toast.error(result.error || '退出失败');
          }
        }
      });
    }
  },

  /**
   * 切换子菜单展开/折叠
   * @param {HTMLElement} menuItem - 菜单项元素
   */
  toggleSubmenu(menuItem) {
    const parentId = menuItem.dataset.id;
    const submenu = document.querySelector(`.menu-submenu[data-parent="${parentId}"]`);
    
    if (!submenu) return;

    const isExpanded = menuItem.classList.contains('expanded');
    
    if (isExpanded) {
      menuItem.classList.remove('expanded');
      submenu.classList.remove('expanded');
    } else {
      menuItem.classList.add('expanded');
      submenu.classList.add('expanded');
    }
  },

  /**
   * 展开指定菜单
   * @param {string} menuId - 菜单 ID
   */
  expand(menuId) {
    const menuItem = document.querySelector(`.menu-item[data-id="${menuId}"]`);
    if (menuItem && menuItem.dataset.hasChildren === 'true') {
      menuItem.classList.add('expanded');
      const submenu = document.querySelector(`.menu-submenu[data-parent="${menuId}"]`);
      if (submenu) {
        submenu.classList.add('expanded');
      }
    }
  },

  /**
   * 折叠所有菜单
   */
  collapseAll() {
    const expandedItems = document.querySelectorAll('.menu-item.expanded');
    const expandedSubmenus = document.querySelectorAll('.menu-submenu.expanded');
    
    expandedItems.forEach(item => item.classList.remove('expanded'));
    expandedSubmenus.forEach(submenu => submenu.classList.remove('expanded'));
  },

  /**
   * 设置当前活动菜单
   * @param {string} pageId - 页面 ID
   */
  setActive(pageId) {
    // 移除所有活动状态
    document.querySelectorAll('.menu-item.active, .menu-submenu-item.active')
      .forEach(item => item.classList.remove('active'));
    
    // 设置新的活动状态
    const menuItem = document.querySelector(`.menu-item[data-id="${pageId}"]`);
    const submenuItem = document.querySelector(`.menu-submenu-item[data-id="${pageId}"]`);
    
    if (menuItem) {
      menuItem.classList.add('active');
    }
    
    if (submenuItem) {
      submenuItem.classList.add('active');
      // 展开父菜单
      const submenu = submenuItem.closest('.menu-submenu');
      if (submenu) {
        submenu.classList.add('expanded');
        const parentId = submenu.dataset.parent;
        const parentItem = document.querySelector(`.menu-item[data-id="${parentId}"]`);
        if (parentItem) {
          parentItem.classList.add('expanded', 'active');
        }
      }
    }
    
    this.currentPage = pageId;
  }
};

// 导出到全局
window.Sidebar = Sidebar;
