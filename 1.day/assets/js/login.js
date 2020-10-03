$(function () {
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });

  // 点击“去登录”的链接
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  });

  // 定义校验规则
  const form = layui.form;
  form.verify({
    // 密码框校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: function (value, item) {
      const pwd = $('.reg-box [name=password]').val();
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      if (pwd !== value) return '两次密码输入不一致';
    },
  });

  const layer = layui.layer;
  // 注册事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault();
    const data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val(),
    };
    $.ajax({
      url: 'api/reguser',
      data,
      method: 'POST',
      success(res) {
        if (res.status !== 0) {
          layer.msg(res.message || '注册失败');
          return;
        }
        layer.msg(res.message || '注册成功');
        //  注册成功  跳转去登录
        $('#link_login').click();
      },
    });
  });

  $('#form_login').on('submit', function (e) {
    // 阻止默认提交事件
    e.preventDefault();
    const data = $(this).serialize();
    $.ajax({
      url: 'api/login',
      method: 'POST',
      data,
      success(res) {
        // 1、如果请求失败，提示成功信息
        if (res.status !== 0) {
          layer.msg(res.message || '登录失败');
          return;
        }
        // 2、登录失败，提示登录失败
        layer.msg('登录成功');

        // 3、把后台返回的token存储到本地存储
        localStorage.setItem('token', res.token);

        // 4、跳转到首页
        location.href = '/index.html';
      },
    });
  });
});
