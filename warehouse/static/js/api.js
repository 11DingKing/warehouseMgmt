/**
 * API 请求封装模块
 * 仓库管理系统 - Alkaid-SOP 3.0
 * 包含 CSRF Token 处理
 */

const API = {
  /**
   * 获取 CSRF Token
   */
  getCsrfToken() {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue || '';
  },

  /**
   * 通用请求方法
   * @param {string} url - 请求地址
   * @param {object} options - 请求选项
   * @returns {Promise}
   */
  async request(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': this.getCsrfToken(),
      },
      credentials: 'same-origin',
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, mergedOptions);
      
      // 处理非 JSON 响应
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return { success: true };
      }

      const data = await response.json();
      
      // 检查登录状态
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/login/';
        return { success: false, error: '请重新登录' };
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error.message || '网络请求失败，请检查网络连接',
      };
    }
  },

  /**
   * GET 请求
   * @param {string} url - 请求地址
   * @param {object} params - 查询参数
   * @returns {Promise}
   */
  async get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.request(fullUrl, { method: 'GET' });
  },

  /**
   * POST 请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @returns {Promise}
   */
  async post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT 请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @returns {Promise}
   */
  async put(url, data = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE 请求
   * @param {string} url - 请求地址
   * @returns {Promise}
   */
  async delete(url) {
    return this.request(url, { method: 'DELETE' });
  },

  // ==================== 业务 API ====================

  /**
   * 登录
   */
  async login(username, password) {
    return this.post('/api/login/', { username, password });
  },

  /**
   * 退出登录
   */
  async logout() {
    return this.post('/api/logout/');
  },

  // ===== 单位管理 =====
  async getUnits() {
    return this.get('/api/units/');
  },

  async createUnit(name) {
    return this.post('/api/units/create/', { name });
  },

  async updateUnit(id, name) {
    return this.post(`/api/units/${id}/update/`, { name });
  },

  async deleteUnit(id) {
    return this.post(`/api/units/${id}/delete/`);
  },

  // ===== 品类管理 =====
  async getCategories() {
    return this.get('/api/categories/');
  },

  async createCategory(name) {
    return this.post('/api/categories/create/', { name });
  },

  async updateCategory(id, name) {
    return this.post(`/api/categories/${id}/update/`, { name });
  },

  async deleteCategory(id) {
    return this.post(`/api/categories/${id}/delete/`);
  },

  // ===== 品种管理 =====
  async getVarieties(categoryId = null) {
    const params = categoryId ? { category_id: categoryId } : {};
    return this.get('/api/varieties/', params);
  },

  async createVariety(name, categoryId) {
    return this.post('/api/varieties/create/', { name, category_id: categoryId });
  },

  async updateVariety(id, name, categoryId) {
    return this.post(`/api/varieties/${id}/update/`, { name, category_id: categoryId });
  },

  async deleteVariety(id) {
    return this.post(`/api/varieties/${id}/delete/`);
  },

  // ===== 货物入库 =====
  async getGoods(params = {}) {
    return this.get('/api/goods/', params);
  },

  async createGoods(data) {
    return this.post('/api/goods/create/', data);
  },

  // ===== 审批 =====
  async getPendingApprovals() {
    return this.get('/api/approval/pending/');
  },

  async approveGoods(id, remark = '') {
    return this.post(`/api/approval/${id}/approve/`, { remark });
  },

  async rejectGoods(id, remark = '') {
    return this.post(`/api/approval/${id}/reject/`, { remark });
  },

  // ===== 人员管理 =====
  async getStaff(params = {}) {
    return this.get('/api/staff/', params);
  },

  async createStaff(data) {
    return this.post('/api/staff/create/', data);
  },

  async updateStaff(id, data) {
    return this.post(`/api/staff/${id}/update/`, data);
  },

  async deleteStaff(id) {
    return this.post(`/api/staff/${id}/delete/`);
  },
};

// 导出到全局
window.API = API;
