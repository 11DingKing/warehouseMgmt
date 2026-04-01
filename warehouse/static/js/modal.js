/**
 * 模态框模块
 * 仓库管理系统 - Alkaid-SOP 3.0
 */

const Modal = {
  activeModals: [],

  /**
   * 创建模态框
   * @param {object} options - 配置选项
   * @returns {object} 模态框控制对象
   */
  create(options = {}) {
    const {
      title = '',
      content = '',
      size = '', // sm, lg, xl, full
      closable = true,
      footer = null,
      onOpen = null,
      onClose = null,
    } = options;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const sizeClass = size ? `modal-${size}` : '';
    
    overlay.innerHTML = `
      <div class="modal ${sizeClass}">
        ${title ? `
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            ${closable ? '<button class="modal-close">×</button>' : ''}
          </div>
        ` : ''}
        <div class="modal-body">
          ${content}
        </div>
        ${footer !== null ? `
          <div class="modal-footer">
            ${footer}
          </div>
        ` : ''}
      </div>
    `;

    const modalElement = overlay.querySelector('.modal');
    const bodyElement = overlay.querySelector('.modal-body');
    const footerElement = overlay.querySelector('.modal-footer');

    const modalInstance = {
      overlay,
      modal: modalElement,
      body: bodyElement,
      footer: footerElement,

      /**
       * 打开模态框
       */
      open() {
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        // 触发动画
        requestAnimationFrame(() => {
          overlay.classList.add('show');
        });

        Modal.activeModals.push(this);
        
        if (onOpen) onOpen(this);
        
        return this;
      },

      /**
       * 关闭模态框
       */
      close() {
        overlay.classList.remove('show');
        overlay.classList.add('hide');
        
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
          
          const index = Modal.activeModals.indexOf(this);
          if (index > -1) {
            Modal.activeModals.splice(index, 1);
          }
          
          if (Modal.activeModals.length === 0) {
            document.body.style.overflow = '';
          }
          
          if (onClose) onClose(this);
        }, 300);
        
        return this;
      },

      /**
       * 设置内容
       */
      setContent(html) {
        if (bodyElement) {
          bodyElement.innerHTML = html;
        }
        return this;
      },

      /**
       * 设置标题
       */
      setTitle(text) {
        const titleEl = modalElement.querySelector('.modal-title');
        if (titleEl) {
          titleEl.textContent = text;
        }
        return this;
      },

      /**
       * 设置底部
       */
      setFooter(html) {
        if (footerElement) {
          footerElement.innerHTML = html;
        }
        return this;
      },

      /**
       * 获取表单元素
       */
      getForm() {
        return modalElement.querySelector('form');
      }
    };

    // 绑定关闭事件
    if (closable) {
      const closeBtn = overlay.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => modalInstance.close());
      }

      // 点击遮罩关闭
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          modalInstance.close();
        }
      });

      // ESC 键关闭
      const handleKeydown = (e) => {
        if (e.key === 'Escape' && Modal.activeModals[Modal.activeModals.length - 1] === modalInstance) {
          modalInstance.close();
        }
      };
      document.addEventListener('keydown', handleKeydown);
    }

    return modalInstance;
  },

  /**
   * 创建表单模态框
   * @param {object} options - 配置选项
   * @returns {object} 模态框控制对象
   */
  form(options = {}) {
    const {
      title = '',
      fields = [],
      data = {},
      submitText = '提交',
      cancelText = '取消',
      onSubmit = null,
      size = '',
    } = options;

    // 生成表单 HTML
    let formHtml = '<form class="modal-form">';
    
    fields.forEach(field => {
      const value = data[field.name] || field.default || '';
      const required = field.required ? 'required' : '';
      const labelClass = field.required ? 'form-label required' : 'form-label';
      
      formHtml += `<div class="form-group">`;
      formHtml += `<label class="${labelClass}">${field.label}</label>`;
      
      switch (field.type) {
        case 'select':
          formHtml += `<select name="${field.name}" class="form-select" ${required}>`;
          formHtml += `<option value="">请选择</option>`;
          (field.options || []).forEach(opt => {
            const selected = opt.value == value ? 'selected' : '';
            formHtml += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
          });
          formHtml += `</select>`;
          break;
          
        case 'textarea':
          formHtml += `<textarea name="${field.name}" class="form-textarea" ${required} placeholder="${field.placeholder || ''}">${value}</textarea>`;
          break;
          
        case 'number':
          formHtml += `<input type="number" name="${field.name}" class="form-input" value="${value}" ${required} placeholder="${field.placeholder || ''}" step="${field.step || 'any'}" min="${field.min || ''}" max="${field.max || ''}">`;
          break;
          
        case 'date':
          formHtml += `<input type="date" name="${field.name}" class="form-input" value="${value}" ${required}>`;
          break;
          
        default:
          formHtml += `<input type="${field.type || 'text'}" name="${field.name}" class="form-input" value="${value}" ${required} placeholder="${field.placeholder || ''}">`;
      }
      
      formHtml += `</div>`;
    });
    
    formHtml += '</form>';

    const footerHtml = `
      <button type="button" class="btn btn-secondary modal-cancel">${cancelText}</button>
      <button type="submit" class="btn btn-primary modal-submit">${submitText}</button>
    `;

    const modal = this.create({
      title,
      content: formHtml,
      footer: footerHtml,
      size,
    });

    // 绑定表单提交
    const form = modal.modal.querySelector('form');
    const submitBtn = modal.modal.querySelector('.modal-submit');
    const cancelBtn = modal.modal.querySelector('.modal-cancel');

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (onSubmit) {
        const formData = Form.getData(form);
        Loading.setButtonLoading(submitBtn, true);
        
        try {
          const result = await onSubmit(formData, modal);
          if (result !== false) {
            modal.close();
          }
        } catch (error) {
          Toast.error(error.message || '操作失败');
        } finally {
          Loading.setButtonLoading(submitBtn, false);
        }
      }
    };

    form.addEventListener('submit', handleSubmit);
    submitBtn.addEventListener('click', () => form.dispatchEvent(new Event('submit')));
    cancelBtn.addEventListener('click', () => modal.close());

    return modal;
  },

  /**
   * 关闭所有模态框
   */
  closeAll() {
    [...this.activeModals].forEach(modal => modal.close());
  },

  /**
   * 获取当前活动的模态框
   */
  getActive() {
    return this.activeModals[this.activeModals.length - 1] || null;
  }
};

// 导出到全局
window.Modal = Modal;
