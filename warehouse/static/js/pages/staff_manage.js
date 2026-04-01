/**
 * Staff Manage Page - 人员管理页面
 */

(function() {
  'use strict';

  const STAFF_ROLE = window.STAFF_ROLE;
  const ROLE_DISPLAY = STAFF_ROLE === 'attendance' ? '考勤人员' : '出库人员';

  // 分页实例
  let allData = [];
  const pagination = Pagination.create({
    pageSize: 10,
    containerId: 'pagination-container',
    infoId: 'pagination-info',
    buttonsId: 'pagination-buttons',
    onPageChange: function() {
      renderTable();
      this.render();
    }
  });

  async function loadData() {
    Loading.show('加载中...');
    const result = await API.getStaff({ role: STAFF_ROLE });
    Loading.hide();
    
    if (result.success) {
      allData = result.data;
      pagination.reset();
      renderTable();
      pagination.render();
    } else {
      Toast.error(result.error || '加载失败');
    }
  }

  function renderTable() {
    const tbody = document.getElementById('table-body');
    document.getElementById('total-count').textContent = allData.length;

    if (allData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="table-empty">
            <div class="table-empty-icon">👥</div>
            <div class="table-empty-text">暂无${ROLE_DISPLAY}数据</div>
          </td>
        </tr>
      `;
      document.getElementById('pagination-container').style.display = 'none';
      return;
    }

    const pageData = pagination.getPageData(allData);

    tbody.innerHTML = pageData.map(item => `
      <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.employee_id}</td>
        <td>${item.phone || '-'}</td>
        <td>
          <span class="table-status ${item.is_active ? 'active' : 'inactive'}">
            ${item.is_active ? '在职' : '离职'}
          </span>
        </td>
        <td>${item.created_at}</td>
        <td class="text-center">
          <div class="table-actions table-actions-center">
            <button class="table-action-btn edit" data-id="${item.id}" data-item='${JSON.stringify(item)}' title="编辑">✏️</button>
            <button class="table-action-btn delete" data-id="${item.id}" data-name="${item.name}" title="删除">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('add-btn').addEventListener('click', () => {
    const modal = Modal.form({
      title: `新增${ROLE_DISPLAY}`,
      fields: [
        { name: 'name', label: '姓名', type: 'text', placeholder: '请输入姓名', required: true },
        { name: 'employee_id', label: '工号', type: 'text', placeholder: '请输入工号', required: true },
        { name: 'phone', label: '联系电话', type: 'text', placeholder: '请输入手机号（选填）' }
      ],
      async onSubmit(data) {
        data.role = STAFF_ROLE;
        const result = await API.createStaff(data);
        if (result.success) {
          Toast.success('创建成功');
          loadData();
          return true;
        } else {
          Toast.error(result.error);
          return false;
        }
      }
    });
    modal.open();
  });

  document.getElementById('table-body').addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit');
    const deleteBtn = e.target.closest('.delete');

    if (editBtn) {
      const item = JSON.parse(editBtn.dataset.item);
      
      const modal = Modal.form({
        title: '编辑人员信息',
        fields: [
          { name: 'name', label: '姓名', type: 'text', required: true },
          { name: 'employee_id', label: '工号', type: 'text', required: true },
          { name: 'phone', label: '联系电话', type: 'text' },
          { 
            name: 'is_active', 
            label: '状态', 
            type: 'select',
            options: [
              { value: 'true', label: '在职' },
              { value: 'false', label: '离职' }
            ]
          }
        ],
        data: {
          name: item.name,
          employee_id: item.employee_id,
          phone: item.phone,
          is_active: String(item.is_active)
        },
        async onSubmit(data) {
          data.is_active = data.is_active === 'true';
          data.role = STAFF_ROLE;
          const result = await API.updateStaff(item.id, data);
          if (result.success) {
            Toast.success('更新成功');
            loadData();
            return true;
          } else {
            Toast.error(result.error);
            return false;
          }
        }
      });
      modal.open();
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      const name = deleteBtn.dataset.name;
      
      const confirmed = await Confirm.delete(`人员「${name}」`);
      if (confirmed) {
        Loading.show('删除中...');
        const result = await API.deleteStaff(id);
        Loading.hide();
        
        if (result.success) {
          Toast.success('删除成功');
          loadData();
        } else {
          Toast.error(result.error);
        }
      }
    }
  });

  // 页面加载时执行
  loadData();
})();
