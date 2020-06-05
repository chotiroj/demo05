// JavaScript Document
$(function(){
	
	$('#box').layout({
		fit:true,
	});
	
	$('#box_left').accordion({
		border:false,
		selected:-1,
		fit:true
	});
	/*$('#c_ul').tree();
	$('#y_ul').tree();
	$('#g_ul').tree();
	$('#s_ul').tree();
	$('#x_ul').tree();*/
	
	$('#box_left ul').tree({
		onClick:function(node){
			//console.log(node);
			var url=node.attributes.url;
			var title=node.text;
			var icon=node.iconCls;
			if($('#tabs').tabs('exists',title)){
				$('#tabs').tabs('select',title);
			}
			else{
				//var content="<iframe scrolling='auto' frameborder='0'  src='"+ url +"' style='width:100%;height:90%;margin:0;'></iframe>"
				$('#tabs').tabs('add',{
					title:title,
					closable:true,
					iconCls:icon,
					href:url,
					//content:content,
				});
			}
		}
	});
	
	$('#tabs').tabs({
		fit:true,
		border:false,
	});
	
	$('#toolbar_top').layout({
		fit:true,
	});
	
	$('#em_list').datagrid({
		url:'/emps',
		fit:true,
		fitColumns:true,//自适应列宽
		striped:true,
		//singleSelect:false,
		rownumbers:true,
		//scrollbarSize:0,//滚动条宽度
		pageList:[10,15,20],
		pageSize:10,
		border:false,
		pagination:true,
		columns:[[
			{field:'ckb',checkbox:true},
			{field:'id',title:'员工编号',width:50,align:'center'},/*halign:'center'数据不居中,表头居中----align:'center'数据和表头都居中*/
			{field:'lastName',title:'姓名',width:100,align:'center'},
            {field:'gender',title:'性别',width:100,align:'center',formatter:function(value,row,index){
                    switch(value){
                        case 0:{
                            return '女';
                        }
                        case 1:{
                            return '男';
                        }
                        /*default:{
                        return value;}*/
                    }
                    return value;
                }},
            {field:'userName',title:'用户名',width:100,align:'center'},
            {field:'password',title:'密码',width:100,align:'center'},
            {field:'department.departmentName',title:'职务',width:100,align:'center',formatter: function (value, row) {
                                    return row["department"]['departmentName'];//返回department字段中的departmentName值
					 }},
			{field:'tel',title:'联系方式',width:100,align:'center'}
		]],
		toolbar:'#search_toolbar',//引入toolbar工具栏

	});

	
	//下拉列表框
	$('#combobox').combobox({
			panelHeight:"auto",
        	url:'/depts',
			valueField:'id',
			textField:'departmentName',
			editable:false,//不可编辑
		 // data:[
			//  {va:'-1',va_name:'全部'},{va:'2',va_name:'销售员'},{va:'3',va_name:'采购员'},{va:'4',va_name:'财务员'}
		 // ],//valueField为空时,就是va:''时默认选中第一项，也可用setValue方法设置。
		 onLoadSuccess:function(){
			$('#combobox').combobox('setValue',"");
            // $('#combobox').combobox('setValue','-1');
		 }
	});
	
	$('#addDialog').dialog({
		title:'添加员工信息',
		width:300,
		height:400,
		iconCls:'icon-group-add',
		modal:true,//底层不可编辑
		closed:true,//默认隐藏
	});
	
	$('#editDialog').dialog({
		title:'修改员工信息',
		width:300,
		height:400,
		iconCls:'icon-group-edit',
		modal:true,//底层不可编辑
		closed:true,//默认隐藏
	});
	
	$('#combobox1').combobox({
        panelHeight:"auto",
        url:'/depts',
        valueField:'id',
        textField:'departmentName',
		editable:false,
	//valueField为空时,就是va:''时默认选中第一项，也可用setValue方法设置。
	 onLoadSuccess:function(){
		 $('#combobox1').combobox('setValue',1001);
	 }
		});
	
	
	$('#combosex').combobox({
        panelHeight:"auto",
		valueField:'va',
		textField:'va_name',
		editable:false,
		data:[
			{va:'0',va_name:'女'},{va:'1',va_name:'男'}
		],
		onLoadSuccess:function(){
			 $('#combosex').combobox('setValue',0);
		 }
	});
	
	$('#combobox2').combobox({
        panelHeight:"auto",
        url:'/depts',
        valueField:'id',
        textField:'departmentName',
	 // data:[
		//  {va:'2',va_name:'销售员'},{va:'3',va_name:'采购员'},{va:'4',va_name:'财务员'}
	 // ],//valueField为空时,就是va:''时默认选中第一项，也可用setValue方法设置。
	 onLoadSuccess:function(){
		 $('#combobox2').combobox('setValue',2);
	 }
		});
	
	$('#combosex1').combobox({
		panelHeight:"auto",
		valueField:'va',
		textField:'va_name',
		data:[
			{va:'1',va_name:'男'},{va:'0',va_name:'女'}
		],
		onLoadSuccess:function(){
			 $('#combosex1').combobox('setValue',0);
		 }
	});
	
		obj={
			//搜索监听
			search:function(){
				var emId=$('#combobox').combobox('getValue');
				if(emId=="未选择"){
					emId=null;
				};
				$('#em_list').datagrid('reload',{//reload表示从当前页刷新数据，load表示从第一页开始刷新数据
					id:$.trim($("input[name='id']").val()),
					lastName:$.trim($("input[name='name']").val()),//$.trim()过滤开始和末尾的(删除)空格
					emid:emId,
				});
			},
			
			//显示添加窗口
			openAdd:function(){
				$('#addDialog').dialog({
					closed:false,//打开对话框
					buttons:[{
						text:'提交',
						iconCls:'icon-ok',
						handler:obj.addEmp,
					},{
						text:'取消',
						iconCls:'icon-cancel',
						handler:function(){
							$('#addDialog').dialog('close');
							$('#add-form').form('reset');//关闭并恢复到初始状态
						}
					}],
					onBeforeOpen:function(){}
					
				});
				//$('#addDialog').dialog('open');//打开对话框
				$('#addDialog').css({'text-align':'center'});
				
			},
			
			//显示编辑窗口
			openEdit:function(){
				var item=$('#em_list').datagrid('getSelections');
				if(item==null||item.length==0){
					$.messager.alert('信息提醒','请选择要修改的数据！','info');
					return;
				}
				if(item.length>1){
					$.messager.alert('信息提醒','请选择一条数据修改！','info');
					return;
				}
				item=item[0];
				//console.log(item);
				$('#edit-form').form('load',{
					id:item.id,
					userName:item.userName,
					password:item.password,
					tel:item.tel,
					gender:item.gender,
					lastName:item.lastName,
					department:item.department,
					
				});
				$('#editDialog').dialog({
					closed:false,
					buttons:[{
						text:'提交',
						iconCls:'icon-ok',
						handler:obj.editEmp,
					},{
						text:'取消',
						iconCls:'icon-cancel',
						handler:function(){
							$('#editDialog').dialog('close');
							$('#edit-form').form('reset');//关闭并恢复到初始状态
						}
					}],
					/* onBeforeOpen:function(){
						$("#edit-id").val(item.id);
						$("#username").val(item.username);
						$("#password").val(item.password);
						$("#tel").val(item.tel);
						$("#combosex1").combobox('setValue',item.sex);
						$("#name").val(item.name);
						$("#combobox2").combobox('setValue',item.emid);
					},*/
		
					
				});
				$('#editDialog').css({'text-align':'center'});
			},
			
			//添加新员工
			addEmp:function(){
				//判断是否通过验证
				var validate=$('#add-form').form('validate');
				//console.log(validate);
				if(!validate){
					$.messager.alert("消息提醒","请检查您输入的信息！","warning");
					return;
				}
				//序列化参数值（不用单个的获取）
				var data=$('#add-form').serialize();
				//console.log(data);
				$.ajax({
					url:"/emp",
					dataType:"json",
					type:"POST",
					data:data,
					success:function(data){
						if(data.type=="success"){
							$.messager.alert("信息提醒",data.msg,"info");
							$('#addDialog').dialog('close');
							$('#add-form').form('reset');
							//本页刷新列表
							$('#em_list').datagrid('reload');
						}
						else{
							$.messager.alert('信息提醒',data.msg,'warning');
						}
					}
				});
			},
			
			//删除员工信息
			deleteEmp:function(){
                var item=$('#em_list').datagrid('getSelections');
                //console.log(item);
				var empNames="";
                for(var i=0;i<item.length;i++){
					empNames+=item[i].lastName+",";
                }
                empNames=empNames.substring(0,empNames.length-1);
				$.messager.confirm('信息提醒','确定要删除'+empNames+'的记录吗？',function(result){
					if(result){
						if(item==null||item.length==0){
							$.messager.alert('信息提醒','请选择要删除的数据！','info');
							return;
						}
						var ids='';
						for(var i=0;i<item.length;i++){
							ids+=item[i].id+',';//传字符串
							//ids.push(item[i].id);//传数组
							//or params.ids.push(item[i].id);
						}
                        ids=ids.substring(0,ids.length-1);
						//console.log(ids);
						$.ajax({
							url:'/emp/'+ids,
							dataType:'json',
							type:'delete',

							//data:params,
							//data:JSON.stringify(ids),//JSON.stringify(ids)传集合
							//traditional:true,//传数组开启，不开启则为null
							//contentType:"application/json",//传集合开启，不开则不支持application/x-www-form-urlencoded;charset=UTF-8
							success:function(data){
								if(data.type=='success'){
									$.messager.alert('消息提醒',data.msg,'info');
									$('#em_list').datagrid('reload');
								}
								else{
									$.messager.alert('消息提醒',data.msg,'warning');
								}
							}
						});
						
					}
				})
			},
			
			
			//修改员工信息
			editEmp:function(){
				//判断是否通过验证
				var validate=$('#edit-form').form('validate');
				//console.log(validate);
				if(!validate){
					$.messager.alert("消息提醒","请检查您输入的信息！","warning");
					return;
				}
				//序列化参数值（不用单个的获取）
				var data=$('#edit-form').serialize();
				//console.log(data);
				$.ajax({
					url:'/emp',
					dataType:'json',
					type:'put',
					data:data,
					success:function(data){
						if(data.type=="success"){
							$.messager.alert("信息提醒",data.msg,"info");
							$('#editDialog').dialog('close');
							$('#edit-form').form('reset');
							//本页刷新列表
							$('#em_list').datagrid('reload');
						}
						else{
							$.messager.alert('信息提醒',data.msg,'warning');
						}
					}
				});
			},
	};
		
		//表单验证
		/*$('input[name="username"]').validatebox({
			required:true,
			validType:'length[4,10]',
			missingMessage:'请输入用户名',
			invalidMessage:'用户名为4-10个字符长度！',
		});
		$('input[name="password"]').validatebox({
			required:true,
			validType:'length[6,10]',
			missingMessage:'请输入密码',
			invalidMessage:'密码为6-10个字符长度！',
		});*/
	
});
