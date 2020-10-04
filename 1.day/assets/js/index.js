$(function () {
  getUserInfo();

  const layer = layui.layer;
  // 点击退出功能退出功能实现
  $('#btnLogout').on('click', function () {
    // 点击退出按钮提示框
    layer.confirm('确定退出登录?', {icon: 3, title: '提示'}, function (
      index
    ) {
      // 点击确定按钮之后执行的事件
      // 清除token后跳转登录页面
      localStorage.removeItem('token');
      location.href = '/login.html';

      // 关闭页面
      layer.close(index);
    });
  });
});

function getUserInfo() {
  $.ajax({
    url: 'my/userinfo',
    method: 'GET',
    // headers: {
    //   Authorization: localStorage.getItem('token') || '',
    // },
    success(res) {
      if (res.status !== 0) {
        layui.layer.msg('获取用户失败');
        return;
      }

      // 调用渲染头像方法
      renderAvatar(res.data);
    },
  });
}

function renderAvatar(data) {
  // 如果有nickname（昵称）优先选择nickname
  const name = data.nickname || data.username;

  $('#welcome').text(`欢迎 ${name}`);

  if (data.user_pic) {
    // 如果用户头像存在，进行渲染头像
    $('.layui-nav-img').attr('src', data.user_pic).show();
    $('.text-avatar').hide();
  } else {
    // 否则渲染文字头像
    const text = name[0].toUpperCase();
    $('.layui-nav-img').hide();
    $('.text-avatar').text(text).show();
  }
}
