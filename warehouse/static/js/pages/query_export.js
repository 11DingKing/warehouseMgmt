/**
 * Query Export Page - 查询导出页面
 */

(function() {
  'use strict';

  const queryForm = document.getElementById('query-form');
  const dataTable = document.getElementById('data-table');
  const resultCount = document.getElementById('result-count');
  
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

  queryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    pagination.reset();
    await loadData();
  });

  document.getElementById('btn-export').addEventListener('click', () => {
    if (allData.length === 0) {
      Toast.warning('没有可导出的数据');
      return;
    }
    exportToCSV(allData);
  });

  async function loadData() {
    const name = document.getElementById('filter-name').value;
    const status = document.getElementById('filter-status').value;
    const date = document.getElementById('filter-date').value;
    
    Loading.show();
    try {
      let url = '/api/goods/';
      const params = [];
      if (name) params.push(`search=${encodeURIComponent(name)}`);
      if (status) params.push(`status=${status}`);
      if (params.length) url += '?' + params.join('&');
      
      const response = await API.get(url);
      if (response.success) {
        // 前端日期筛选
        allData = date 
          ? response.data.filter(g => g.inbound_date === date)
          : response.data;
        
        resultCount.textContent = `共 ${allData.length} 条记录`;
        renderTable();
        pagination.render();
      }
    } catch (error) {
      Toast.error('查询失败');
    } finally {
      Loading.hide();
    }
  }

  function renderTable() {
    if (allData.length === 0) {
      dataTable.innerHTML = '<tr><td colspan="9" class="table-empty">暂无数据</td></tr>';
      document.getElementById('pagination-container').style.display = 'none';
      return;
    }

    const pageData = pagination.getPageData(allData);
    
    dataTable.innerHTML = pageData.map(g => `
      <tr>
        <td>${g.id}</td>
        <td>${g.name}</td>
        <td>${g.variety}</td>
        <td>${g.category}</td>
        <td>${g.quantity}</td>
        <td>${g.unit}</td>
        <td>${g.inbound_date}</td>
        <td><span class="table-status ${g.status}">${g.status_display}</span></td>
        <td>${g.operator}</td>
      </tr>
    `).join('');
  }

  function exportToCSV(data) {
    const headers = ['ID', '货物名称', '品种', '品类', '数量', '单位', '入库日期', '状态', '操作员'];
    const rows = data.map(g => [
      g.id, g.name, g.variety, g.category, g.quantity, g.unit, g.inbound_date, g.status_display, g.operator
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `货物数据_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    
    Toast.success('导出成功');
  }

  // 页面加载时自动查询
  loadData();
})();
