/**
 * 
 */
$(function(){
$('#logtoolbar_top').layout({
		fit:true,
	});

$('#log_list').datagrid({
		url:'logs',
		fit:true,
		fitColumns:true,
		striped:true,
		rownumbers:true,
		pageList:[10,15,20],
		pageSize:10,
		border:false,
		pagination:true,
		columns:[[
			{field:'ckb',checkbox:true},
			{field:'content',title:'日志内容',width:200,align:'center'},
			{field:'createTime',title:'时间',width:100,align:'center'},
		]],
		toolbar:'#log_toolbar',
	});

		$('#log_addDialog').dialog({
			title:' 添加日志',
			width:400,
			height:210,
			iconCls:'icon-add1',
			closed:true,
		});
					
		log_obj={
				search:function(){
					console.log($("input[name='search_content']").val());
					$('#log_list').datagrid('reload',{
						content:$.trim($("input[name='search_content']").val()),
					});
					
				},
				
				//显示添加窗口
				openAdd:function(){
					$('#log_addDialog').dialog({
						modal:true,//底层不可编辑
						closed:false,//打开对话框
						buttons:[{
							text:'提交',
							iconCls:'icon-ok',
							handler:log_obj.addLog,
						},{
							text:'取消',
							iconCls:'icon-cancel',
							handler:function(){
								$('#log_addDialog').dialog('close');
								$('#log_add-form').form('reset');//关闭并恢复到初始状态
							}
						}],
						onBeforeOpen:function(){}
						
					});					
				},
				
				//添加日志
				addLog:function(){
					//序列化参数值（不用单个的获取）
					var data=$('#log_add-form').serialize();
					$.ajax({
						url:'addLog',
						dataType:'json',
						type:'post',
						data:data,
						success:function(data){
							if(data.type=="success"){
								$.messager.alert("信息提醒",data.msg,"info");
								$('#log_addDialog').dialog('close');
								$('#log_add-form').form('reset');
								//本页刷新列表
								$('#log_list').datagrid('reload');
							}
							else{
								$.messager.alert('信息提醒',data.msg,'warning');
							}
						}
					});
				},
				
				//删除供应商信息
				deleteLog:function(){
					$.messager.confirm('信息提醒','确定要删除该记录吗？',function(result){
						if(result){
							var item=$('#log_list').datagrid('getSelections');
							//console.log(item);
							if(item==null||item.length==0){
								$.messager.alert('信息提醒','请选择要删除的数据！','info');
								return;
							}
							var ids='';
							for(var i=0;i<item.length;i++){
								ids+=item[i].id+',';//传字符串
							}
							$.ajax({
								url:'deleteLog',
								dataType:'json',
								type:'post',
								data:{ids:ids},
								success:function(data){
									if(data.type=='success'){
										$.messager.alert('消息提醒',data.msg,'info');
										$('#log_list').datagrid('reload');
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
					var validate=$('#log_edit-form').form('validate');
					//console.log(validate);
					if(!validate){
						$.messager.alert("消息提醒","请检查您输入的信息！","warning");
						return;
					}
					//序列化参数值（不用单个的获取）
					var data=$('#log_edit-form').serialize();
					console.log(data);
					$.ajax({
						url:'updateGoods',
						dataType:'json',
						type:'post',
						data:data,
						success:function(data){
							if(data.type=="success"){
								$.messager.alert("信息提醒",data.msg,"info");
								$('#log_editDialog').dialog('close');
								$('#log_edit-form').form('reset');
								//本页刷新列表
								$('#log_list').datagrid('reload');
							}
							else{
								$.messager.alert('信息提醒',data.msg,'warning');
							}
						}
					});
				},
				
		};
})
