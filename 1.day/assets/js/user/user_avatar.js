$(function () {
  // 插件使用步骤
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image');
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview',
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 点击上传按钮，触发文件输入框的点击事件
  $('#btnChooseImage').click(function (e) {
    e.preventDefault();
    $('#file').click();
  });

  // 监听文件上传
  $('#file').change(function (e) {
    e.preventDefault();
    const files = e.target.files;

    if (files.length <= 0) {
      layer.msg('请选择图片');
      return;
    }

    const imgUrl = URL.createObjectURL(files[0]);
    console.log(imgUrl);

    $image.cropper('destroy').attr('src', imgUrl).cropper(options);
  });

  // 点击确定按钮上传图片功能
  $('#btnConfirm').click(function () {
    // 获取选择图片，插件提供的功能，只需要使用即可
    const dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL('image/png');

    // dataURL为图片的base64地址

    // 图片上传到服务器
    $.ajax({
      type: 'POST', //默认get
      url: 'my/update/avatar', //默认当前页
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        //请求成功回调
        if (res.status !== 0) {
          layer.msg(res.message || '上传头像失败');
          return;
        }

        layer.msg('上传成功');
        window.parent.getUserInfo();
      },
    });
  });
});
