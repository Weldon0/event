$(function () {
  const layer = layui.layer;
  const form = layui.form;
  initArtCateList();

  // 获取类别(初始化数据)
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: 'my/article/cates',
      success(res) {
        if (res.status !== 0) {
          layui.layer.msg(res.message || '获取类别失败');
          return;
        }

        const htmlString = template('tpl-table', res);
        $('tbody').html(htmlString);
      },
    });
  }

  // 为添加类别按钮绑定点击事件
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    });
  });

  let indexAdd = null;

  // 添加类别请求接口
  $('body').on('submit', '#form-add', function (e) {
    // debugger;
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: 'my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！');
        }
        initArtCateList();
        layer.msg('新增分类成功！');
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd);
      },
    });
  });

  // 点击编辑弹出层
  let indexEdit = null;
  $('tbody').on('click', '.btn-add', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-edit').html(),
    });

    const id = $(this).data('id');
    console.log(id);

    $.ajax({
      method: 'GET',
      url: 'my/article/cates/' + id,
      success(res) {
        console.log(res);
        if (res.status !== 0) return;
        form.val('form-edit', res.data);
        console.log(form.val('form-edit'));
      },
    });
  });

  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      data: $(this).serialize(),
      url: 'my/article/updatecate',
      success(res) {
        if (res.status !== 0) {
          layer.msg(res.message || '更新失败');
          return;
        }
        layer.msg('更新成功');
        initArtCateList();
        layer.close(indexEdit);
      },
    });
  });

  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: 'my/article/deletecate/' + id,
        success(res) {
          // console.log(res);
          if (res.status !== 0) {
            layer.msg(res.message || '删除失败');
            return;
          }
          layer.close(index);
          layer.msg('删除成功');
          initArtCateList();
          // layer.close();
        },
      });
    });
  });
});
