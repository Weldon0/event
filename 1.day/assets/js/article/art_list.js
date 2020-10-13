$(function () {
  const layer = layui.layer;
  const form = layui.form;
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '', // 文章的发布状态
  };

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }
  initCate();
  initTable();
  // 获取列表数据

  function initTable() {
    $.ajax({
      method: 'GET',
      data: q,
      url: 'my/article/list',
      success(res) {
        if (res.status !== 0) {
          layer.msg(res.message || '获取列表数据失败');
          return;
        }

        const htmlStr = template('art_list', res);
        console.log(htmlStr);

        $('tbody').html(htmlStr);

        renderPage(res.total);
      },
    });
  }

  // 获取分类数据
  function initCate() {
    $.ajax({
      method: 'GET',
      url: 'my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          layer.msg(res.message || '获取分类数据失败');
          return;
        }

        // 渲染页面
        const htmlStr = template('tpl_cate', res);
        $('select[name=cate_id]').html(htmlStr);
        form.render();
      },
    });
  }

  // 筛选功能
  $('#form_search').submit(function (e) {
    e.preventDefault();
    const cateId = $('select[name=cate_id]').val();
    const state = $('select[name=state]').val();
    console.log($('select[name=cate_id]'));
    console.log(status);

    q.cate_id = cateId;
    q.state = state;

    initTable();
  });

  // 分页区域
  function renderPage(total) {
    console.log(total);
    const { laypage } = layui;
    laypage.render({
      elem: 'pageBox',
      curr: q.pagenum,
      limit: q.pagesize,
      count: total,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10], // 每页展示多少条
      jump(obj, first) {
        //首次不执行
        console.log(obj);
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        // initTable();

        if (!first) {
          initTable();
        }
      },
    });
  }

  // 删除功能
  $('tbody').on('click', '.btn-delete', function () {
    // 获取到文章的 id
    var id = $(this).data('id');
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: 'my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！');
          }
          layer.msg('删除文章成功！');
          var len = $('.btn-delete').length;
          console.log(len);
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });

      layer.close(index);
    });
  });
  // 编辑功能
  $('body').on('click', '.btn_edit', function () {
    location.href = '/article/art_edit.html?id=' + $(this).attr('data-id');
  });
});
