// 添加分类
$('#addCategory').on('submit',function(){
    var formData = $(this).serialize();
    $.ajax({
        type: "post",
        url: "/categories",
        data: formData,
        success: function () {
            location.reload()
        }
    });
    return false;
});


// 向服务器发送获取列表请求
$.ajax({
    type: "get",
    url: "/categories",
    success: function (response) {
        var html = template('categoryTpl',{data:response})
        $('#categoryBox').html(html)
    }
});

// 为编辑按钮添加点击事件
$('#categoryBox').on('click','.edit',function(){
    var id = $(this).attr('data-id');
    $.ajax({
        type: "get",
        url: "/categories/" + id,
        success: function (response) {
            // console.log(response);
            var html = template('modifyTpl',response)
            $('#modifyBox').html(html)
        }
    });
})

// 为修改按钮添加点击事件，发送请求更新数据
$('#modifyBox').on('submit','#modifyCategory',function(){
    var id = $(this).attr('data-id')
    var formData = $(this).serialize();
    $.ajax({
        type: "put",
        url: "/categories/" + id,
        data: formData,
        success: function (response) {
            location.reload()            
        }
    });
    return false;
})


// 通过事件委托为删除按钮添加点击事件
$('#categoryBox').on('click','.delete',function(){
    if(confirm('您确认删除吗？')){
        var id = $(this).attr('data-id');

        $.ajax({
            type: "delete",
            url: "/categories/" + id,
            success: function (response) {
                location.reload()
            }
        });
    }
    
})