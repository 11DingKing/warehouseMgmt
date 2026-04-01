/**
 * 提示框模块
 * 仓库管理系统 - Alkaid-SOP 3.0
 */

const Toast = {
  container: null,
  defaultDuration: 3000,

  /**
   * 初始化 Toast 容器
   */
  init() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },

  /**
   * 显示 Toast
   * @param {object} options - 配置选项
   * @param {string} options.type - 类型：success/error/warning/info
   * @param {string} options.title - 标题
   * @param {string} options.message - 消息内容
   * @param {number} options.duration - 显示时长（毫秒）
   * @param {boolean} options.closable - 是否可手动关闭
   */
  show(options = {}) {
    this.init();

    const {
      type = 'info',
      title = '',
      message = '',
      duration = this.defaultDuration,
      closable = true,
    } = options;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        ${title ? `<h4 class="toast-title">${title}</h4>` : ''}
        ${message ? `<p class="toast-message">${message}</p>` : ''}
      </div>
      ${closable ? '<button class="toast-close">×</button>' : ''}
      ${duration > 0 ? `<div class="toast-progress" style="animation-duration: ${duration}ms"></div>` : ''}
    `;

    // 关闭按钮事件
    if (closable) {
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.close(toast));
    }

    this.container.appendChild(toast);

    // 自动关闭
    if (duration > 0) {
      setTimeout(() => this.close(toast), duration);
    }

    return toast;
  },

  /**
   * 关闭 Toast
   * @param {HTMLElement} toast - Toast 元素
   */
  close(toast) {
    if (!toast || !toast.parentNode) return;

    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  },

  /**
   * 快捷方法：成功提示
   */
  success(message, title = '成功') {
    return this.show({ type: 'success', title, message });
  },

  /**
   * 快捷方法：错误提示
   */
  error(message, title = '错误') {
    return this.show({ type: 'error', title, message, duration: 5000 });
  },

  /**
   * 快捷方法：警告提示
   */
  warning(message, title = '警告') {
    return this.show({ type: 'warning', title, message, duration: 4000 });
  },

  /**
   * 快捷方法：信息提示
   */
  info(message, title = '提示') {
    return this.show({ type: 'info', title, message });
  },

  /**
   * 清除所有 Toast
   */
  clearAll() {
    if (!this.container) return;
    
    const toasts = this.container.querySelectorAll('.toast');
    toasts.forEach(toast => this.close(toast));
  }
};

/**
 * 确认框模块
 */
const Confirm = {
  /**
   * 显示确认框
   * @param {object} options - 配置选项
   * @returns {Promise<boolean>}
   */
  show(options = {}) {
    return new Promise((resolve) => {
      const {
        title = '确认操作',
        message = '确定要执行此操作吗？',
        type = 'warning', // warning / danger / info
        confirmText = '确定',
        cancelText = '取消',
        confirmClass = type === 'danger' ? 'btn-danger' : 'btn-primary',
      } = options;

      const icons = {
        warning: '⚠',
        danger: '⚠',
        info: '❓',
      };

      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';
      overlay.innerHTML = `
        <div class="confirm-box">
          <div class="confirm-icon ${type}">${icons[type] || icons.warning}</div>
          <h3 class="confirm-title">${title}</h3>
          <p class="confirm-message">${message}</p>
          <div class="confirm-buttons">
            <button class="btn btn-secondary" data-action="cancel">${cancelText}</button>
            <button class="btn ${confirmClass}" data-action="confirm">${confirmText}</button>
          </div>
        </div>
      `;

      const close = (result) => {
        overlay.classList.add('hide');
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
          resolve(result);
        }, 300);
      };

      // 按钮点击事件
      overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => close(true));
      overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => close(false));

      // 点击遮罩关闭
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close(false);
      });

      // ESC 键关闭
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          close(false);
          document.removeEventListener('keydown', handleKeydown);
        }
      };
      document.addEventListener('keydown', handleKeydown);

      document.body.appendChild(overlay);

      // 聚焦确认按钮
      setTimeout(() => {
        overlay.querySelector('[data-action="confirm"]').focus();
      }, 100);
    });
  },

  /**
   * 快捷方法：删除确认
   */
  delete(itemName = '此项') {
    return this.show({
      title: '确认删除',
      message: `确定要删除${itemName}吗？此操作不可恢复。`,
      type: 'danger',
      confirmText: '删除',
    });
  },

  /**
   * 快捷方法：退出确认
   */
  logout() {
    return this.show({
      title: '退出登录',
      message: '确定要退出登录吗？',
      type: 'warning',
      confirmText: '退出',
    });
  }
};

// 导出到全局
window.Toast = Toast;
window.Confirm = Confirm;
