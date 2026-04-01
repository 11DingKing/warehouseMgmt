/**
 * Goods Inbound Page - 货物入库页面
 */

(function() {
  'use strict';

  // 设置默认日期为今天
  document.querySelector('input[name="inbound_date"]').valueAsDate = new Date();

  // 加载下拉选项
  async function loadOptions() {
    Loading.show('加载数据...');
    
    try {
      // 并行加载品类和单位
      const [categoriesRes, unitsRes] = await Promise.all([
        API.getCategories(),
        API.getUnits()
      ]);

      // 填充品类选项
      const categorySelect = document.getElementById('category-select');
      if (categoriesRes.success) {
        categoriesRes.data.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.id;
          option.textContent = cat.name;
          categorySelect.appendChild(option);
        });
      }

      // 填充单位选项
      const unitSelect = document.getElementById('unit-select');
      if (unitsRes.success) {
        unitsRes.data.forEach(unit => {
          const option = document.createElement('option');
          option.value = unit.id;
          option.textContent = unit.name;
          unitSelect.appendChild(option);
        });
      }
    } catch (error) {
      Toast.error('加载数据失败');
    } finally {
      Loading.hide();
    }
  }

  // 品类变化时加载品种
  document.getElementById('category-select').addEventListener('change', async (e) => {
    const categoryId = e.target.value;
    const varietySelect = document.getElementById('variety-select');
    
    varietySelect.innerHTML = '<option value="">请选择品种</option>';
    
    if (!categoryId) {
      varietySelect.innerHTML = '<option value="">请先选择品类</option>';
      return;
    }

    const result = await API.getVarieties(categoryId);
    if (result.success) {
      result.data.forEach(variety => {
        const option = document.createElement('option');
        option.value = variety.id;
        option.textContent = variety.name;
        varietySelect.appendChild(option);
      });
    }
  });

  // 表单提交
  const form = document.getElementById('inbound-form');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = Form.getData(form);
    
    // 验证
    if (!formData.name || !formData.variety_id || !formData.unit_id || !formData.quantity || !formData.inbound_date) {
      Toast.warning('请填写所有必填项');
      return;
    }

    Loading.setButtonLoading(submitBtn, true);

    try {
      const result = await API.createGoods(formData);
      
      if (result.success) {
        Toast.success('入库单创建成功，等待审批');
        form.reset();
        document.querySelector('input[name="inbound_date"]').valueAsDate = new Date();
        document.getElementById('variety-select').innerHTML = '<option value="">请先选择品类</option>';
      } else {
        Toast.error(result.error || '创建失败');
      }
    } catch (error) {
      Toast.error('操作失败，请稍后重试');
    } finally {
      Loading.setButtonLoading(submitBtn, false);
    }
  });

  // 页面加载
  loadOptions();
})();
