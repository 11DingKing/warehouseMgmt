/**
 * Alert Page - 预警中心页面
 */

(function() {
  'use strict';

  document.getElementById('btn-refresh').addEventListener('click', loadAlerts);

  async function loadAlerts() {
    Loading.show();
    try {
      const goodsRes = await API.get('/api/goods/');
      const staffRes = await API.get('/api/staff/');
      
      if (goodsRes.success) {
        const goods = goodsRes.data;
        const pendingCount = goods.filter(g => g.status === 'pending').length;
        const rejectedCount = goods.filter(g => g.status === 'rejected').length;
        const today = new Date().toISOString().slice(0, 10);
        const todayCount = goods.filter(g => g.inbound_date === today).length;

        document.getElementById('alert-pending').textContent = pendingCount;
        document.getElementById('alert-rejected').textContent = rejectedCount;
        document.getElementById('alert-today').textContent = todayCount;

        const alerts = [];
        
        if (pendingCount > 10) {
          alerts.push({ level: 'high', levelText: '高', type: '审批积压', desc: `当前有 ${pendingCount} 条入库记录待审批`, count: pendingCount, action: '建议及时处理审批' });
        } else if (pendingCount > 5) {
          alerts.push({ level: 'medium', levelText: '中', type: '审批提醒', desc: `当前有 ${pendingCount} 条入库记录待审批`, count: pendingCount, action: '建议尽快处理' });
        } else if (pendingCount > 0) {
          alerts.push({ level: 'low', levelText: '低', type: '待审批', desc: `当前有 ${pendingCount} 条入库记录待审批`, count: pendingCount, action: '正常处理即可' });
        }

        if (rejectedCount > 0) {
          alerts.push({ level: 'medium', levelText: '中', type: '驳回处理', desc: `有 ${rejectedCount} 条入库记录被驳回`, count: rejectedCount, action: '请核实原因并重新提交' });
        }

        if (staffRes.success) {
          const inactiveStaff = staffRes.data.filter(s => !s.is_active).length;
          if (inactiveStaff > 0) {
            alerts.push({ level: 'low', levelText: '低', type: '人员状态', desc: `有 ${inactiveStaff} 名人员处于停用状态`, count: inactiveStaff, action: '如需恢复请更新人员状态' });
          }
        }

        renderAlerts(alerts);
      }
    } catch (error) {
      Toast.error('加载预警信息失败');
    } finally {
      Loading.hide();
    }
  }

  function renderAlerts(alerts) {
    const tbody = document.getElementById('alert-table');
    
    if (alerts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="table-empty table-empty-success">✅ 系统运行正常，暂无预警事项</td></tr>';
      return;
    }

    tbody.innerHTML = alerts.map(a => `
      <tr>
        <td><span class="alert-level ${a.level}">${a.levelText}</span></td>
        <td>${a.type}</td>
        <td>${a.desc}</td>
        <td><strong>${a.count}</strong></td>
        <td>${a.action}</td>
      </tr>
    `).join('');
  }

  // 页面加载时执行
  loadAlerts();
})();
