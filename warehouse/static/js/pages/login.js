/**
 * Login Page - 登录页面
 */

(function() {
  'use strict';

  // 验证码逻辑
  const Captcha = {
    num1: 0,
    num2: 0,
    answer: 0,

    generate() {
      this.num1 = Math.floor(Math.random() * 10);
      this.num2 = Math.floor(Math.random() * 10);
      this.answer = this.num1 + this.num2;
      
      const questionEl = document.getElementById('captcha-question');
      if (questionEl) {
        questionEl.textContent = `${this.num1} + ${this.num2} = ?`;
      }
    },

    verify(input) {
      return parseInt(input, 10) === this.answer;
    }
  };

  // 初始化验证码
  Captcha.generate();

  // 登录表单处理
  const loginForm = document.getElementById('login-form');
  const loginBtn = document.getElementById('login-btn');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = Form.getData(loginForm);
    
    // 验证验证码（前端拦截）
    if (!Captcha.verify(formData.captcha)) {
      Toast.error('验证码错误，请重新计算');
      Captcha.generate();
      loginForm.elements.captcha.value = '';
      loginForm.elements.captcha.focus();
      return;
    }

    // 显示加载状态
    Loading.setButtonLoading(loginBtn, true);
    
    try {
      const result = await API.login(formData.username, formData.password);
      
      if (result.success) {
        Toast.success('登录成功，正在跳转...');
        setTimeout(() => {
          window.location.href = result.redirect || '/dashboard/';
        }, 500);
      } else {
        Toast.error(result.error || '登录失败');
        Captcha.generate();
        loginForm.elements.captcha.value = '';
      }
    } catch (error) {
      Toast.error('网络错误，请稍后重试');
      Captcha.generate();
    } finally {
      Loading.setButtonLoading(loginBtn, false);
    }
  });

  // 页面加载完成后隐藏初始加载
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.classList.add('hide');
        setTimeout(() => loader.remove(), 300);
      }
    }, 800);
  });
})();
