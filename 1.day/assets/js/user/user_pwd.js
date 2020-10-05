$(function () {
  const { form, layer } = layui;

  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

    // 新密码验证
    samePwd: (value) => {
      console.log($('input[name=oldPwd]'));

      if (value === $('input[name=oldPwd]').val()) {
        return '新旧密码不能相同！';
      }
    },

    // 重复密码框
    rePwd: (value) => {
      if (value !== $('input[name=newPwd]').val()) {
        return '两次输入的密码不一致';
      }
    },
  });

  // 监听表单提交事件
  $('.layui-form').submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST', //默认get
      url: 'my/updatepwd', //默认当前页
      data: $(this).serialize(), //格式{key:value}
      success: function (res) {
        //请求成功回调
        if (res.status !== 0) {
          layer.msg(res.message || '更新密码失败');
          return;
        }

        layer.msg('更新密码成功');

        // 重置表单
        $('.layui-form')[0].reset();
      },
    });
  });
});
