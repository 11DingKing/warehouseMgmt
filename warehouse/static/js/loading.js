/**
 * 加载动画模块
 * 仓库管理系统 - Alkaid-SOP 3.0
 */

const Loading = {
  overlay: null,
  count: 0,

  /**
   * 初始化加载遮罩
   */
  init() {
    if (this.overlay) return;

    this.overlay = document.createElement('div');
    this.overlay.className = 'loading-overlay';
    this.overlay.innerHTML = `
      <div class="loading-container">
        <div class="loading-tech">
          <div class="loading-tech-inner"></div>
        </div>
        <div class="loading-text">加载中...</div>
      </div>
    `;
    document.body.appendChild(this.overlay);
  },

  /**
   * 显示加载动画
   * @param {string} text - 加载提示文本
   */
  show(text = '加载中...') {
    this.init();
    this.count++;
    
    const textEl = this.overlay.querySelector('.loading-text');
    if (textEl) {
      textEl.textContent = text;
    }
    
    this.overlay.classList.remove('hide');
  },

  /**
   * 隐藏加载动画
   * @param {boolean} force - 是否强制隐藏
   */
  hide(force = false) {
    if (!this.overlay) return;
    
    if (force) {
      this.count = 0;
    } else {
      this.count = Math.max(0, this.count - 1);
    }
    
    if (this.count === 0) {
      this.overlay.classList.add('hide');
    }
  },

  /**
   * 创建内联加载器
   * @param {HTMLElement} container - 容器元素
   * @param {string} text - 加载提示文本
   * @returns {HTMLElement}
   */
  createInline(container, text = '加载中...') {
    const loader = document.createElement('div');
    loader.className = 'loading-inline';
    loader.innerHTML = `
      <div class="loading-spinner small"></div>
      <span>${text}</span>
    `;
    
    if (container) {
      container.innerHTML = '';
      container.appendChild(loader);
    }
    
    return loader;
  },

  /**
   * 创建骨架屏
   * @param {HTMLElement} container - 容器元素
   * @param {number} rows - 行数
   */
  createSkeleton(container, rows = 3) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-container';
    
    for (let i = 0; i < rows; i++) {
      skeleton.innerHTML += `
        <div class="skeleton skeleton-text" style="width: ${70 + Math.random() * 30}%"></div>
      `;
    }
    
    if (container) {
      container.innerHTML = '';
      container.appendChild(skeleton);
    }
    
    return skeleton;
  },

  /**
   * 按钮加载状态
   * @param {HTMLElement} button - 按钮元素
   * @param {boolean} loading - 是否加载中
   */
  setButtonLoading(button, loading) {
    if (!button) return;
    
    if (loading) {
      button.classList.add('loading');
      button.disabled = true;
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = `<span>${button.textContent}</span>`;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
      if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
        delete button.dataset.originalText;
      }
    }
  }
};

// 导出到全局
window.Loading = Loading;

// 页面加载完成后隐藏初始加载
document.addEventListener('DOMContentLoaded', () => {
  const initialLoader = document.getElementById('initial-loader');
  if (initialLoader) {
    setTimeout(() => {
      initialLoader.classList.add('hide');
      setTimeout(() => initialLoader.remove(), 300);
    }, 500);
  }
});
