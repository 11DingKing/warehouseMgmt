/**
 * Unit Manage Page - 单位管理页面
 */

(function() {
  'use strict';

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
    const result = await API.getUnits();
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
          <td colspan="4" class="table-empty">
            <div class="table-empty-icon">📋</div>
            <div class="table-empty-text">暂无数据，点击右上角添加</div>
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
        <td>${item.created_at}</td>
        <td class="text-center">
          <div class="table-actions table-actions-center">
            <button class="table-action-btn edit" data-id="${item.id}" data-name="${item.name}" title="编辑">✏️</button>
            <button class="table-action-btn delete" data-id="${item.id}" data-name="${item.name}" title="删除">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('add-btn').addEventListener('click', () => {
    const modal = Modal.form({
      title: '新增单位',
      fields: [
        { name: 'name', label: '单位名称', type: 'text', placeholder: '如：kg、个、箱', required: true }
      ],
      async onSubmit(data) {
        const result = await API.createUnit(data.name);
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
      const id = editBtn.dataset.id;
      const name = editBtn.dataset.name;
      
      const modal = Modal.form({
        title: '编辑单位',
        fields: [
          { name: 'name', label: '单位名称', type: 'text', required: true }
        ],
        data: { name },
        async onSubmit(data) {
          const result = await API.updateUnit(id, data.name);
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
      
      const confirmed = await Confirm.delete(`单位「${name}」`);
      if (confirmed) {
        Loading.show('删除中...');
        const result = await API.deleteUnit(id);
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
