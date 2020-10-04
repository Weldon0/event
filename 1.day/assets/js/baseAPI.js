// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象

const rootUrl = 'http://ajax.frontend.itheima.net';

$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = `${rootUrl}/${options.url}`;


  // 全局权限校验的配置项
  options.complete = function (res) {
    const {status, message} = res.responseJSON;
    if (status === 1 && message === '身份认证失败！') {
      localStorage.removeItem('token');
      location.href = '/login.html';
    }
  }

  // 如果请求头包含/my/说明是需要权限的接口，需要统一添加Authorization请求头
  if (options.url.includes('/my/')) {
    options.headers = {
      Authorization: localStorage.getItem('token'),
    };
  }
  console.log(options);
});
