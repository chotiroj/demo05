function searchByName(){
    var  key = $("#lastName").val();
    var  id=$("#id").val();
    if (key == null || key == "") {
        alert("请输入名称！");
        return false;
    } else {
        $.ajax({
            type: "GET",
            success:function () {
                window.location.href=  "../queryEmp?lastName="+key;
            }
        })
    }
}

