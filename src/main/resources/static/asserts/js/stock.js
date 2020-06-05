/**
 * 
 */
$(function(){
$('#sttoolbar_top').layout({
		fit:true,
	});

$('#combost').combobox({
    url:'/suppliers',
    panelHeight:"auto",
    valueField:'id',
    textField:'address',
	editable:false,
	onLoadSuccess:function(){
		 $('#combost').combobox('setValue',"");
	 }
});

$('#stock_list').datagrid({
		url:'/stock',
		fit:true,
		fitColumns:true,//自适应列宽
		striped:true,
		//singleSelect:false,
		rownumbers:true,
		//scrollbarSize:0,//滚动条宽度
		pageList:[10,15,20],
		pageSize:10,
		border:false,
		pagination:true,//分页栏
		columns:[[
			{field:'ckb',checkbox:true},
			{field:'goods.goodsName',title:'商品名称',width:100,align:'center',formatter: function (value, row) {
                    return row["goods"]['goodsName'];
                }},
			{field:'num',title:'库存量',width:50,align:'center'},
            {field:'goods.price',title:'价格',width:50,align:'center',formatter: function (value, row) {
                    return row["goods"]['price'];
                }},
            {field:'goods.size',title:'规格',width:100,align:'center',formatter: function (value, row) {
                    return row["goods"]['size'];
                }},
            {field:'goods.supplier.address',title:'所属供应商',width:200,align:'center',formatter: function (value, row) {
                    return row["goods"]["supplier"]['address'];
                }}
		]],
		toolbar:'#stock_toolbar',//引入toolbar工具栏
	});

		$('#stock_editDialog').dialog({
			title:'调整库存',
			width:280,
			height:230,
			iconCls:'icon-brick-edit',
			closed:true,//默认隐藏
		});

		
		
		st_obj={
				search:function(){
					var supid=$('#combost').combobox('getValue');
					$('#stock_list').datagrid('reload',{//reload表示从当前页刷新数据，load表示从第一页开始刷新数据
                        stock_num:$("input[name='stock_num']").val(),
						goodsName:$.trim($("input[name='goodsName']").val()),//$.trim()过滤开始和末尾的(删除)空格
						supid:supid,
					});
					
				},
				
				
				//显示编辑窗口
				openEdit:function(){
					var item=$('#stock_list').datagrid('getSelections');
					if(item==null||item.length==0){
						$.messager.alert('信息提醒','请选择要修改的数据！','info');
						return;
					}
					if(item.length>1){
						$.messager.alert('信息提醒','请选择一条数据修改！','info');
						return;
					}
					
						item=item[0];
						$('#st_edit-form').form('load',{
							goodsid:item.goods.id,
							goodsName:item.goods.goodsName,
							num:item.num,
						});
						//console.log(item);
					$('#stock_editDialog').dialog({
						modal:true,//底层不可编辑
						closed:false,
						buttons:[{
							text:'提交',
							iconCls:'icon-ok',
							handler:st_obj.editStock,
						},{
							text:'取消',
							iconCls:'icon-cancel',
							handler:function(){
								$('#stock_editDialog').dialog('close');
								$('#st_edit-form').form('reset');
							}
						}],
						
					});
					$('#stock_editDialog').css({'text-align':'center'});
				},
				
				
				//删除库存
				deleteStock:function(){
					$.messager.confirm('信息提醒','确定要删除该库存吗？',function(result){
						if(result){
							var item=$('#stock_list').datagrid('getSelected');
							if(item==null||item.length==0){
								$.messager.alert('信息提醒','请选择要删除的库存信息！','info');
								return;
							}
							$.ajax({
								url:'/deleteStock',
								dataType:'json',
								type:'delete',
								data:{goodsid:item.goods.id},
								success:function(data){
									if(data.type=='success'){
										$.messager.alert('消息提醒',data.msg,'info');
										$('#stock_list').datagrid('reload');
									}
									else{
										$.messager.alert('消息提醒',data.msg,'warning');
									}
								}
							});
							
						}
					})
				},
				
				//修改库存数量信息
				editStock:function(){
					//判断是否通过验证
					var validate=$('#st_edit-form').form('validate');
					if(!validate){
						$.messager.alert("消息提醒","请检查您输入的信息！","warning");
						return;
					}
					//序列化参数值（不用单个的获取）
					var data=$('#st_edit-form').serialize();
					console.log(data);
					$.ajax({
						url:'/editStock',
						dataType:'json',
						type:'post',
						data:data,
						success:function(data){
							if(data.type=="success"){
								$.messager.alert("信息提醒",data.msg,"info");
								$('#stock_editDialog').dialog('close');
								$('#st_edit-form').form('reset');
								//本页刷新列表
								$('#stock_list').datagrid('reload');
							}
							else{
								$.messager.alert('信息提醒',data.msg,'warning');
							}
						}
					});
				},
				
		};
})
