/**
 * Approval Page - 审批区域页面
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
    const result = await API.getPendingApprovals();
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
          <td colspan="8" class="table-empty">
            <div class="table-empty-icon">✅</div>
            <div class="table-empty-text">暂无待审批记录</div>
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
        <td>${item.category} / ${item.variety}</td>
        <td>${item.quantity} ${item.unit}</td>
        <td>${item.inbound_date}</td>
        <td>${item.operator}</td>
        <td>${item.created_at}</td>
        <td class="text-center">
          <div class="table-actions table-actions-center">
            <button class="btn btn-success btn-xs approve-btn" data-id="${item.id}" data-name="${item.name}">✓ 通过</button>
            <button class="btn btn-danger btn-xs reject-btn" data-id="${item.id}" data-name="${item.name}">✕ 驳回</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('refresh-btn').addEventListener('click', loadData);

  document.getElementById('table-body').addEventListener('click', async (e) => {
    const approveBtn = e.target.closest('.approve-btn');
    const rejectBtn = e.target.closest('.reject-btn');

    if (approveBtn) {
      const id = approveBtn.dataset.id;
      const name = approveBtn.dataset.name;
      
      const confirmed = await Confirm.show({
        title: '确认审批通过',
        message: `确定通过「${name}」的入库申请吗？`,
        type: 'info',
        confirmText: '通过',
      });

      if (confirmed) {
        Loading.show('处理中...');
        const result = await API.approveGoods(id);
        Loading.hide();
        
        if (result.success) {
          Toast.success('审批通过');
          loadData();
        } else {
          Toast.error(result.error);
        }
      }
    }

    if (rejectBtn) {
      const id = rejectBtn.dataset.id;
      const name = rejectBtn.dataset.name;
      
      const confirmed = await Confirm.show({
        title: '确认驳回',
        message: `确定驳回「${name}」的入库申请吗？`,
        type: 'danger',
        confirmText: '驳回',
      });

      if (confirmed) {
        Loading.show('处理中...');
        const result = await API.rejectGoods(id);
        Loading.hide();
        
        if (result.success) {
          Toast.success('已驳回');
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
