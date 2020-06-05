/**
 * 
 */
$(function(){
$('#toolbar_top1').layout({
		fit:true,
	});
$('#sup_list').datagrid({
		url:'/supliers',
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
			{field:'id',title:'供应商编号',width:50,align:'center'},/*halign:'center'数据不居中,表头居中----align:'center'数据和表头都居中*/
			{field:'address',title:'供应商地址',width:200,align:'center'},
            {field:'contactName',title:'联系人',width:100,align:'center'},
			{field:'gender',title:'性别',width:100,align:'center',formatter:function(value,row,index){
				switch(value){
				case 0:{
					return '女';
				}
				case 1:{
					return '男';
				}
				}
				return value;
			}},
			{field:'tel',title:'联系方式',width:100,align:'center'},//右边需要填充时要与fitColumns共用,100为100%

		]],
		toolbar:'#sup_toolbar',//引入toolbar工具栏
	});

		$('#sup_addDialog').dialog({
			title:' 添加供应商信息',
			width:300,
			height:350,
			iconCls:'icon-vcard-add',
			modal:true,//底层不可编辑
			closed:true,//默认隐藏
		});

		$('#sup_editDialog').dialog({
			title:' 修改供应商信息',
			width:300,
			height:350,
			iconCls:'icon-vcard-edit',
			modal:true,//底层不可编辑
			closed:true,//默认隐藏
		});
		
		$('#sup_combosex').combobox({
            panelHeight:"auto",
			valueField:'va',
			textField:'va_name',
			editable:false,
			data:[
				{va:'0',va_name:'女'},{va:'1',va_name:'男'}
			],
			onLoadSuccess:function(){
				 $('#sup_combosex').combobox('setValue',0);
			 }
		});
		
		$('#sup_combosex1').combobox({
            panelHeight:"auto",
			valueField:'va',
			textField:'va_name',
			editable:false,
			data:[
				{va:'0',va_name:'女'},{va:'1',va_name:'男'}
			],
			onLoadSuccess:function(){
				 $('#sup_combosex1').combobox('setValue',0);
			 }
		});
		
		sup_obj={
				search:function(){
					$('#sup_list').datagrid('reload',{//reload表示从当前页刷新数据，load表示从第一页开始刷新数据
						id:$.trim($("input[name='sup_id']").val()),
						contactName:$.trim($("input[name='sup_name']").val()),//$.trim()过滤开始和末尾的(删除)空格
					});
				},
				
				//显示添加窗口
				openAdd:function(){
					$('#sup_addDialog').dialog({
						closed:false,//打开对话框
						buttons:[{
							text:'提交',
							iconCls:'icon-ok',
							handler:sup_obj.addEmp,
						},{
							text:'取消',
							iconCls:'icon-cancel',
							handler:function(){
								$('#sup_addDialog').dialog('close');
								$('#sup_add-form').form('reset');//关闭并恢复到初始状态
							}
						}],
						onBeforeOpen:function(){}
						
					});
					$('#sup_addDialog').css({'text-align':'center'});
					
				},
				
				//显示编辑窗口
				openEdit:function(){
					var item=$('#sup_list').datagrid('getSelections');
					if(item==null||item.length==0){
						$.messager.alert('信息提醒','请选择要修改的数据！','info');
						return;
					}
					if(item.length>1){
						$.messager.alert('信息提醒','请选择一条数据修改！','info');
						return;
					}
					
						item=item[0];
						$('#sup_edit-form').form('load',{
							id:item.id,
							contactName:item.contactName,
							tel:item.tel,
							gender:item.gender,
							address:item.address,
						});
						
					$('#sup_editDialog').dialog({
						closed:false,
						buttons:[{
							text:'提交',
							iconCls:'icon-ok',
							handler:sup_obj.editEmp,
						},{
							text:'取消',
							iconCls:'icon-cancel',
							handler:function(){
								$('#sup_editDialog').dialog('close');
								$('#sup_edit-form').form('reset');//关闭并恢复到初始状态
							}
						}],
						
					});
					$('#sup_editDialog').css({'text-align':'center'});
				},
				
				//添加新供应商
				addEmp:function(){
					//判断是否通过验证
					var validate=$('#sup_add-form').form('validate');
					//console.log(validate);
					if(!validate){
						$.messager.alert("消息提醒","请检查您输入的信息！","warning");
						return;
					}
					//序列化参数值（不用单个的获取）
					var data=$('#sup_add-form').serialize();
					console.log(data);
					$.ajax({
						url:'/supplier',
						dataType:'json',
						type:'post',
						data:data,
						success:function(data){
							if(data.type=="success"){
								$.messager.alert("信息提醒",data.msg,"info");
								$('#sup_addDialog').dialog('close');
								$('#sup_add-form').form('reset');
								//本页刷新列表
								$('#sup_list').datagrid('reload');
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
							var item=$('#sup_list').datagrid('getSelections');
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
								url:'/supplier/'+ids,
								dataType:'json',
								type:'delete',
								success:function(data){
									if(data.type=='success'){
										$.messager.alert('消息提醒',data.msg,'info');
										$('#sup_list').datagrid('reload');
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
					var validate=$('#sup_edit-form').form('validate');
					//console.log(validate);
					if(!validate){
						$.messager.alert("消息提醒","请检查您输入的信息！","warning");
						return;
					}
					//序列化参数值（不用单个的获取）
					var data=$('#sup_edit-form').serialize();
					//console.log(data);
					$.ajax({
						url:'/supplier',
						dataType:'json',
						type:'put',
						data:data,
						success:function(data){
							if(data.type=="success"){
								$.messager.alert("信息提醒",data.msg,"info");
								$('#sup_editDialog').dialog('close');
								$('#sup_edit-form').form('reset');
								//本页刷新列表
								$('#sup_list').datagrid('reload');
							}
							else{
								$.messager.alert('信息提醒',data.msg,'warning');
							}
						}
					});
				},
				
		};
})
