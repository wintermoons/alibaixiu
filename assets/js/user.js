// import { log } from "util";

// 当表单发生提交行为时
$('#userForm').on('submit',function(){
    var formData = $(this).serialize();
    // console.log(formData);
    // 向服务器发送添加请求
    $.ajax({
        type: "post",
        url: "/users",
        data: formData,
        success: function () {
            location.reload();
        },
        error:function(){
            alert('用户添加失败')
        }
    });
    // 阻止表单默认提交行为
    return false;
})

// 当用户选择文件时
$('#modifyBox').on('change','#avatar',function(){
    // 用户选择到的文件
    // this.files[0]
    var formData = new FormData();
    formData.append('avatar',this.files[0]);

    $.ajax({
        type: "post",
        url: "/upload",
        data: formData,
        // 告诉$.ajax方法不要解析请求参数
        processData:false,
        contentType:false,
        success: function (response) {
            // 头像预览功能
            $('#preview').attr('src',response[0].avatar)
            $('#hiddenAvatar').val(response[0].avatar)
        }
    });
})

// 获取用户列表
$.ajax({
    type: "get",
    url: "/users",
    success: function (response) {
        // 使用模板引擎将数据和HTML字符串进行拼接
        var html = template('userTpl',{
            data: response,
        });
        // 将拼接好的字符串显示到页面中
        $('#userBox').html(html)
    }
});

// 通过事件委托为编辑按钮添加点击事件
$('#userBox').on('click','.edit',function(){
    // 获取被点击的用户id
    var id = $(this).attr('data-id');
    $.ajax({
        type: "get",
        url: "/users/"+ id,
        data: {
            _id: id,
        },
        success: function (response) {
            // console.log(response);
            var html = template('modifyTpl',response);
            $('#modifyBox').html(html)
        }
    });
})


$('#modifyBox').on('submit','#modifyForm',function(){
    var id = $(this).attr('data-id')
    // 获取用户在表单中输入的内容
    var formData = $(this).serialize();
    // console.log(formData);
    // 发送请求，修改用户信息
    $.ajax({
        type: "put",
        url: "/users/" + id,
        data: formData,
        success: function (response) {
            // 修改用信息成功，重新刷新页面
            location.reload()
        }
    });

    // 阻止表单默认提交
    return false;
})


// 当删除按钮被点击时
$('#userBox').on('click','.delete',function(){
    if(confirm('您确定要删除此用户吗？')){
        var id = $(this).attr('data-id')
        $.ajax({
            type: "delete",
            url: "/users/" + id,
            success: function () {
                location.reload()
            }
        });
    }
})


// 获取全选按钮
var selectAll =$('#selectAll');
// 获取批量删除按钮
var deleteMany = $('#deleteMany');

// 当全选按钮状态发生变化时
selectAll.on('change',function(){
    // 获取全选状态按钮当前的状态
    var status = $(this).prop('checked');

    if(status) {
        deleteMany.show()
    }else{
        deleteMany.hide()
    }

    // 获取到所有的用户,将用户的状态和全选按钮状态保持一致
    $('#userBox').find('input').prop('checked',status);

})

// 当用户前面的复选框发生变化时
$('#userBox').on('change','.userStatus',function(){
    var inputs = $('#userBox').find('input')
    if(inputs.length == inputs.filter(':checked').length){
        selectAll.prop('checked',true)
    } else {
        selectAll.prop('checked',false)

    }

    // 如果选中的复选框数量大于0，说明有选中的复选框
    if(inputs.filter(':checked').length > 0) {
        deleteMany.show()
    } else {
        deleteMany.hide()
    }
})


// 为批量删除添加点击事件
deleteMany.on('click',function(){
    var ids = [];
    var checkedUser = $('#userBox').find('input').filter(':checked');
    checkedUser.each(function(index,element){
        ids.push($(element).attr('data-id'));
    });
    if(confirm('您确定要进行批量删除吗？')) {
        $.ajax({
            type: "delete",
            url: "/users/" + ids.join('-'),
            success: function () {
                location.reload()
            }
        });
    }
})