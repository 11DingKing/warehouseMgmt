/**
 * Pagination Module - 分页模块
 * 提供统一的客户端分页功能
 */

const Pagination = {
  // 默认配置
  config: {
    pageSize: 10,
    maxVisiblePages: 5
  },

  /**
   * 创建分页实例
   * @param {Object} options - 配置选项
   * @param {number} options.pageSize - 每页数量
   * @param {Function} options.onPageChange - 页面变化回调
   * @param {string} options.containerId - 分页容器 ID
   * @param {string} options.infoId - 分页信息元素 ID
   * @param {string} options.buttonsId - 分页按钮容器 ID
   */
  create(options) {
    const pageSize = options.pageSize || this.config.pageSize;
    let currentPage = 1;
    let totalItems = 0;

    const instance = {
      currentPage: 1,
      pageSize,
      totalItems: 0,
      
      /**
       * 获取当前页数据
       * @param {Array} allData - 全部数据
       * @returns {Array} 当前页数据
       */
      getPageData(allData) {
        this.totalItems = allData.length;
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return allData.slice(start, end);
      },

      /**
       * 获取总页数
       */
      getTotalPages() {
        return Math.ceil(this.totalItems / this.pageSize);
      },

      /**
       * 跳转到指定页
       * @param {number} page - 目标页码
       */
      goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page < 1 || page > totalPages) return false;
        this.currentPage = page;
        if (options.onPageChange) {
          options.onPageChange(page);
        }
        return true;
      },

      /**
       * 重置到第一页
       */
      reset() {
        this.currentPage = 1;
      },

      /**
       * 渲染分页控件
       */
      render() {
        const container = document.getElementById(options.containerId);
        const infoEl = document.getElementById(options.infoId);
        const buttonsEl = document.getElementById(options.buttonsId);
        
        if (!container || !infoEl || !buttonsEl) return;

        const totalPages = this.getTotalPages();

        if (totalPages <= 1) {
          container.style.display = 'none';
          return;
        }

        container.style.display = 'flex';
        infoEl.textContent = `第 ${this.currentPage} 页，共 ${totalPages} 页`;

        let buttonsHTML = '';
        const maxVisiblePages = Pagination.config.maxVisiblePages;
        
        // 上一页
        buttonsHTML += `<button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">‹</button>`;
        
        // 计算可见页码范围
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // 第一页
        if (startPage > 1) {
          buttonsHTML += `<button class="pagination-btn" data-page="1">1</button>`;
          if (startPage > 2) {
            buttonsHTML += `<span class="pagination-ellipsis">...</span>`;
          }
        }

        // 页码按钮
        for (let i = startPage; i <= endPage; i++) {
          buttonsHTML += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        // 最后一页
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            buttonsHTML += `<span class="pagination-ellipsis">...</span>`;
          }
          buttonsHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // 下一页
        buttonsHTML += `<button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">›</button>`;

        buttonsEl.innerHTML = buttonsHTML;

        // 绑定点击事件
        buttonsEl.querySelectorAll('.pagination-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (!isNaN(page)) {
              this.goToPage(page);
            }
          });
        });
      }
    };

    return instance;
  }
};
