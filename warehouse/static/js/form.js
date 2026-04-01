/**
 * 表单验证模块
 * 仓库管理系统 - Alkaid-SOP 3.0
 */

const Form = {
  /**
   * 验证规则
   */
  rules: {
    required: (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      return true;
    },
    
    minLength: (value, min) => {
      if (!value) return true; // 空值由 required 验证
      return String(value).length >= min;
    },
    
    maxLength: (value, max) => {
      if (!value) return true;
      return String(value).length <= max;
    },
    
    min: (value, min) => {
      if (!value && value !== 0) return true;
      return Number(value) >= min;
    },
    
    max: (value, max) => {
      if (!value && value !== 0) return true;
      return Number(value) <= max;
    },
    
    email: (value) => {
      if (!value) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    
    phone: (value) => {
      if (!value) return true;
      return /^1[3-9]\d{9}$/.test(value);
    },
    
    number: (value) => {
      if (!value && value !== 0) return true;
      return !isNaN(Number(value));
    },
    
    integer: (value) => {
      if (!value && value !== 0) return true;
      return Number.isInteger(Number(value));
    },
    
    pattern: (value, regex) => {
      if (!value) return true;
      return new RegExp(regex).test(value);
    }
  },

  /**
   * 错误消息模板
   */
  messages: {
    required: '此字段为必填项',
    minLength: '长度不能少于 {0} 个字符',
    maxLength: '长度不能超过 {0} 个字符',
    min: '值不能小于 {0}',
    max: '值不能大于 {0}',
    email: '请输入有效的邮箱地址',
    phone: '请输入有效的手机号码',
    number: '请输入有效的数字',
    integer: '请输入整数',
    pattern: '格式不正确',
  },

  /**
   * 验证单个字段
   * @param {HTMLElement} field - 表单字段元素
   * @param {object} rules - 验证规则
   * @returns {object} { valid: boolean, message: string }
   */
  validateField(field, rules = {}) {
    const value = field.value;
    
    for (const [rule, param] of Object.entries(rules)) {
      const validator = this.rules[rule];
      if (!validator) continue;
      
      const isValid = typeof param === 'boolean' 
        ? validator(value) 
        : validator(value, param);
      
      if (!isValid) {
        let message = this.messages[rule] || '验证失败';
        message = message.replace('{0}', param);
        
        return { valid: false, message };
      }
    }
    
    return { valid: true, message: '' };
  },

  /**
   * 显示字段错误
   * @param {HTMLElement} field - 表单字段元素
   * @param {string} message - 错误消息
   */
  showError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');
    
    // 移除已有的错误提示
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
    
    // 添加错误提示
    if (message) {
      const errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      errorEl.textContent = message;
      field.parentNode.appendChild(errorEl);
    }
  },

  /**
   * 清除字段错误
   * @param {HTMLElement} field - 表单字段元素
   */
  clearError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
  },

  /**
   * 显示字段成功状态
   * @param {HTMLElement} field - 表单字段元素
   */
  showSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
    
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
  },

  /**
   * 验证表单
   * @param {HTMLFormElement} form - 表单元素
   * @param {object} fieldRules - 字段验证规则 { fieldName: { rule: param } }
   * @returns {object} { valid: boolean, errors: object, data: object }
   */
  validate(form, fieldRules) {
    const errors = {};
    const data = {};
    let valid = true;
    
    for (const [fieldName, rules] of Object.entries(fieldRules)) {
      const field = form.elements[fieldName];
      if (!field) continue;
      
      const result = this.validateField(field, rules);
      
      if (result.valid) {
        this.clearError(field);
        data[fieldName] = field.value;
      } else {
        this.showError(field, result.message);
        errors[fieldName] = result.message;
        valid = false;
      }
    }
    
    return { valid, errors, data };
  },

  /**
   * 获取表单数据
   * @param {HTMLFormElement} form - 表单元素
   * @returns {object} 表单数据对象
   */
  getData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  },

  /**
   * 设置表单数据
   * @param {HTMLFormElement} form - 表单元素
   * @param {object} data - 数据对象
   */
  setData(form, data) {
    for (const [key, value] of Object.entries(data)) {
      const field = form.elements[key];
      if (field) {
        if (field.type === 'checkbox') {
          field.checked = Boolean(value);
        } else if (field.type === 'radio') {
          const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
          if (radio) radio.checked = true;
        } else {
          field.value = value;
        }
      }
    }
  },

  /**
   * 重置表单
   * @param {HTMLFormElement} form - 表单元素
   */
  reset(form) {
    form.reset();
    
    // 清除所有错误状态
    const fields = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    fields.forEach(field => {
      this.clearError(field);
      field.classList.remove('success');
    });
  },

  /**
   * 绑定实时验证
   * @param {HTMLFormElement} form - 表单元素
   * @param {object} fieldRules - 字段验证规则
   */
  bindRealTimeValidation(form, fieldRules) {
    for (const [fieldName, rules] of Object.entries(fieldRules)) {
      const field = form.elements[fieldName];
      if (!field) continue;
      
      field.addEventListener('blur', () => {
        const result = this.validateField(field, rules);
        if (result.valid) {
          this.clearError(field);
        } else {
          this.showError(field, result.message);
        }
      });
      
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          const result = this.validateField(field, rules);
          if (result.valid) {
            this.clearError(field);
          }
        }
      });
    }
  }
};

// 导出到全局
window.Form = Form;
