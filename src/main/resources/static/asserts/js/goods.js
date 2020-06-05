/**
 * 
 */
$(function(){
$('#gtoolbar_top').layout({
		fit:true,
	});

$('#combogs').combobox({
	url:'/suppliers',
	panelHeight:"auto",
	valueField:'id',
	textField:'contactName',
	editable:false,
	onLoadSuccess:function(){
		 $('#combogs').combobox('setValue',"");
	 }
});

$('#goods_list').datagrid({
		url:'/goods',
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
			{field:'id',title:'商品编号',width:50,align:'center'},/*halign:'center'数据不居中,表头居中----align:'center'数据和表头都居中*/
			{field:'goodsName',title:'商品名称',width:100,align:'center'},
			{field:'produceArea',title:'产地',width:50,align:'center'},//右边需要填充时要与fitColumns共用,100为100%
			{field:'size',title:'规格',width:50,align:'center'},
			{field:'price',title:'价格/元',width:50,align:'center'},
            {field:'supplier.contactName',title:'所属供应商',width:200,align:'center',formatter: function (value, row) {
                    return row["supplier"]['contactName'];//返回department字段中的departmentName值
                }}
            // {field:'address',title:'所属供应商',width:100,align:'center',formatter:function(value,index,row){
				// var supplierList = $("#combogs").combobox('getData');
				// for(var i = 0; i < supplierList.length; i++){
				// 	if(supplierList[i].id == value)
				// 		return supplierList[i].name;
				// }
				// return value;
            // }}
		]],
		toolbar:'#goods_toolbar',//引入toolbar工具栏
	});

		$('#gs_addDialog').dialog({
			title:'添加商品',
			width:300,
			height:400,
			iconCls:'icon-table-add',
			closed:true,//默认隐藏
		});

		$('#gs_editDialog').dialog({
			title:'修改商品信息',
			width:300,
			height:400,
			iconCls:'icon-table-edit',
			closed:true,//默认隐藏
		});
		
		$('#combogs1').combobox({
			url:'/suppliers',
			panelHeight:"auto",
			valueField:'id',
			textField:'contactName',
			editable:false,
			onLoadSuccess:function(){
				 $('#combogs1').combobox('setValue',1);
			 }
		});

		$('#combogs2').combobox({
			url:'/suppliers',
			panelHeight:"auto",
			valueField:'id',
			textField:'contactName',
			editable:false,
			onLoadSuccess:function(){
				 $('#combogs2').combobox('setValue',1);
			 }
		});
		
		
		gs_obj={
				search:function(){
					var supid=$('#combogs').combobox('getValue');
					$('#goods_list').datagrid('reload',{//reload表示从当前页刷新数据，load表示从第一页开始刷新数据
						id:$("input[name='id']").val(),
						goodsName:$.trim($("input[name='goodsName']").val()),//$.trim()过滤开始和末尾的(删除)空格
						supid:supid,
					});
					
				},
				
				//显示添加窗口
				openAdd:function(){
					$('#gs_addDialog').dialog({
						modal:true,//底层不可编辑
						closed:false,//打开对话框
						buttons:[{
							text:'提交',
							iconCls:'icon-ok',
							handler:gs_obj.addEmp,
						},{
							text:'取消',
							iconCls:'icon-cancel',
							handler:function(){
								$('#gs_addDialog').dialog('close');
								$('#gs_add-form').form('reset');//关闭并恢复到初始状态
							}
						}],
						onBeforeOpen:function(){}
						
					});
					$('#gs_addDialog').css({'text-align':'center'});
					
				},
				
				//显示编辑窗口
				openEdit:function(){
					var item=$('#goods_list').datagrid('getSelections');
					if(item==null||item.length==0){
						$.messager.alert('信息提醒','请选择要修改的数据！','info');
						return;
					}
					if(item.length>1){
						$.messager.alert('信息提醒','请选择一条数据修改！','info');
						return;
					}
					
						item=item[0];
						$('#gs_edit-form').form('load',{
							id:item.id,
							goodsName:item.goodsName,
							supplier:item.supplier,
							produceArea:item.produceArea,
							size:item.size,
							price:item.price,
						});
						
					$('#gs_editDialog').dialog({
						modal:true,//底层不可编辑
						closed:false,
						buttons:[{
							text:'提交',
							iconCls:'icon-ok',
							handler:gs_obj.editEmp,
						},{
							text:'取消',
							iconCls:'icon-cancel',
							handler:function(){
								$('#gs_editDialog').dialog('close');
								$('#gs_edit-form').form('reset');//关闭并恢复到初始状态
							}
						}],
						
					});
					$('#gs_editDialog').css({'text-align':'center'});
				},
				
				//添加新供应商
				addEmp:function(){
					//判断是否通过验证
					var validate=$('#gs_add-form').form('validate');
					//console.log(validate);
					if(!validate){
						$.messager.alert("消息提醒","请检查您输入的信息！","warning");
						return;
					}
					//序列化参数值（不用单个的获取）
					var data=$('#gs_add-form').serialize();
					console.log(data);
					$.ajax({
						url:'/good',
						dataType:'json',
						type:'post',
						data:data,
						success:function(data){
							if(data.type=="success"){
								$.messager.alert("信息提醒",data.msg,"info");
								$('#gs_addDialog').dialog('close');
								$('#gs_add-form').form('reset');
								//本页刷新列表
								$('#goods_list').datagrid('reload');
							}
							else{
								$.messager.alert('信息提醒',data.msg,'warning');
							}
						}
					});
				},
				
				//删除供应商信息
				deleteEmp:function(){
					$.messager.confirm('信息提醒','确定要删除该记录吗？',function(result){
						if(result){
							var item=$('#goods_list').datagrid('getSelections');
							//console.log(item);
							if(item==null||item.length==0){
								$.messager.alert('信息提醒','请选择要删除的数据！','info');
								return;
							}
							var ids='';
							for(var i=0;i<item.length;i++){
								ids+=item[i].id+',';//传字符串
							}
							//console.log(ids);
							$.ajax({
								url:'/good/'+ids,
								dataType:'json',
								type:'DELETE',
								data:{ids:ids},
								success:function(data){
									if(data.type=='success'){
										$.messager.alert('消息提醒',data.msg,'info');
										$('#goods_list').datagrid('reload');
									}
									else{
										$.messager.alert('消息提醒',data.msg,'warning');
									}
								}
							});
							
						}
					})
				},
				
				//修改供应商信息
				editEmp:function(){
					//判断是否通过验证
					var validate=$('#gs_edit-form').form('validate');
					//console.log(validate);
					if(!validate){
						$.messager.alert("消息提醒","请检查您输入的信息！","warning");
						return;
					}
					//序列化参数值（不用单个的获取）
					var data=$('#gs_edit-form').serialize();
					console.log(data);
					$.ajax({
						url:'/good',
						dataType:'json',
						type:'put',
						data:data,
						success:function(data){
							if(data.type=="success"){
								$.messager.alert("信息提醒",data.msg,"info");
								$('#gs_editDialog').dialog('close');
								$('#gs_edit-form').form('reset');
								//本页刷新列表
								$('#goods_list').datagrid('reload');
							}
							else{
								$.messager.alert('信息提醒',data.msg,'warning');
							}
						}
					});
				},
				
		};
})
