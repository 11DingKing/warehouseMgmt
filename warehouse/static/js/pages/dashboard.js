/**
 * Dashboard Page - 仪表盘页面
 */

(function() {
  'use strict';

  async function loadDashboardData() {
    try {
      const response = await API.get('/api/dashboard/stats/');
      if (response.success) {
        const data = response.data;
        
        // 更新统计卡片
        document.getElementById('stat-total').textContent = data.overview.total_goods;
        document.getElementById('stat-pending').textContent = data.overview.pending_goods;
        document.getElementById('stat-approved').textContent = data.overview.approved_goods;
        document.getElementById('stat-staff').textContent = data.overview.total_staff;
        document.getElementById('stat-today').textContent = data.overview.today_inbound;
        document.getElementById('stat-categories').textContent = data.overview.total_categories;
        document.getElementById('stat-varieties').textContent = data.overview.total_varieties;
        document.getElementById('stat-units').textContent = data.overview.total_units;
        
        // 更新状态分布条
        const total = data.overview.total_goods || 1;
        document.getElementById('bar-pending').style.width = (data.overview.pending_goods / total * 100) + '%';
        document.getElementById('bar-approved').style.width = (data.overview.approved_goods / total * 100) + '%';
        document.getElementById('bar-rejected').style.width = (data.overview.rejected_goods / total * 100) + '%';
        
        document.getElementById('dist-pending').textContent = data.overview.pending_goods;
        document.getElementById('dist-approved').textContent = data.overview.approved_goods;
        document.getElementById('dist-rejected').textContent = data.overview.rejected_goods;
        
        // 渲染图表和表格
        renderTrendChart(data.daily_stats);
        renderRecentGoods(data.recent_goods);
        renderRecentApprovals(data.recent_approvals);
      }
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
    }
  }

  function renderTrendChart(dailyStats) {
    const barsContainer = document.getElementById('chart-bars');
    const labelsContainer = document.getElementById('chart-labels');
    const maxCount = Math.max(...dailyStats.map(d => d.count), 1);
    
    barsContainer.innerHTML = dailyStats.map(d => {
      const height = (d.count / maxCount * 100) || 5;
      return `<div class="chart-bar-wrapper">
        <div class="chart-bar" style="height: ${height}%">
          <span class="chart-bar-value">${d.count}</span>
        </div>
      </div>`;
    }).join('');
    
    labelsContainer.innerHTML = dailyStats.map(d => 
      `<span class="chart-label">${d.date}</span>`
    ).join('');
  }

  function renderRecentGoods(goods) {
    const tbody = document.getElementById('recent-goods');
    if (goods.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="table-empty">暂无数据</td></tr>';
      return;
    }
    tbody.innerHTML = goods.map(g => `
      <tr>
        <td>${g.name}</td>
        <td>${g.variety}</td>
        <td>${g.quantity} ${g.unit}</td>
        <td><span class="table-status ${g.status}">${g.status_display}</span></td>
      </tr>
    `).join('');
  }

  function renderRecentApprovals(approvals) {
    const tbody = document.getElementById('recent-approvals');
    if (approvals.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="table-empty">暂无数据</td></tr>';
      return;
    }
    tbody.innerHTML = approvals.map(a => `
      <tr>
        <td>${a.goods_name}</td>
        <td>${a.approver}</td>
        <td><span class="table-status ${a.status}">${a.status_display}</span></td>
        <td>${a.created_at}</td>
      </tr>
    `).join('');
  }

  // 页面加载时执行
  document.addEventListener('DOMContentLoaded', loadDashboardData);
})();
