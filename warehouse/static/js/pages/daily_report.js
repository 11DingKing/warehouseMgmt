/**
 * Daily Report Page - 每日报表页面
 */

(function() {
  'use strict';

  // 初始化日期为今天
  const dateInput = document.getElementById('report-date');
  dateInput.value = new Date().toISOString().slice(0, 10);

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

  // 表单提交
  document.getElementById('report-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await generateReport();
  });

  async function generateReport() {
    const date = dateInput.value;
    if (!date) {
      Toast.warning('请选择日期');
      return;
    }

    Loading.show();
    try {
      const response = await API.get('/api/goods/');
      if (response.success) {
        // 按日期筛选
        allData = response.data.filter(g => g.inbound_date === date);
        
        // 更新统计数据
        document.getElementById('stat-inbound').textContent = allData.length;
        document.getElementById('stat-approved').textContent = allData.filter(g => g.status === 'approved').length;
        document.getElementById('stat-rejected').textContent = allData.filter(g => g.status === 'rejected').length;
        document.getElementById('stat-pending').textContent = allData.filter(g => g.status === 'pending').length;
        document.getElementById('result-count').textContent = `共 ${allData.length} 条记录`;

        // 重置分页并渲染
        pagination.reset();
        renderTable();
        pagination.render();
        
        Toast.success('报表生成成功');
      }
    } catch (error) {
      Toast.error('生成报表失败');
    } finally {
      Loading.hide();
    }
  }

  function renderTable() {
    const tbody = document.getElementById('report-table');
    
    if (allData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="table-empty">当日暂无入库记录</td></tr>';
      document.getElementById('pagination-container').style.display = 'none';
      return;
    }

    const pageData = pagination.getPageData(allData);
    
    tbody.innerHTML = pageData.map(g => `
      <tr>
        <td>${g.id}</td>
        <td>${g.name}</td>
        <td>${g.variety}</td>
        <td>${g.quantity}</td>
        <td>${g.unit}</td>
        <td><span class="table-status ${g.status}">${g.status_display}</span></td>
        <td>${g.operator}</td>
        <td>${g.created_at}</td>
      </tr>
    `).join('');
  }

  // 页面加载时自动生成当天报表
  generateReport();
})();
