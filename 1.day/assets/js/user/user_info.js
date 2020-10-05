$(function () {
  const form = layui.form;
  const layer = layui.layer;

  form.verify({
    nickname: (value) => {
      console.log(value);

      if (value.length > 6) {
        return '用户昵称只能是1-6位';
      }
    },
  });

  initUserInfo();

  $('#btnReset').click(function (e) {
    // 阻止默认的reset重置行为
    e.preventDefault();
    // 重新调用接口获取用户信息
    initUserInfo();
  });

  $('.layui-form').submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST', // 默认get
      url: 'my/userinfo', // 默认当前页
      data: $(this).serialize(), // 格式{key:value}
      success: function (res) {
        // 请求成功回调
        if (res.status !== 0) {
          layer.msg(res.message || '更新失败');
          return;
        }
        layer.msg('更新用户信息成功！');
        window.parent.getUserInfo();
        // console.log(window.parent);
      },
    });
  });

  function initUserInfo() {
    $.ajax({
      url: 'my/userinfo',
      method: 'GET',
      success(res) {
        if (res.status !== 0) {
          layer.msg(res.message || '获取用户信息失败');
          return;
        }
        console.log(res);

        form.val('formUserInfo', res.data);
      },
    });
  }
});
