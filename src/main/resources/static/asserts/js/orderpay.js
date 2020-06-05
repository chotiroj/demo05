 /**
 * 
 */
$(function(){
$('#paytoolbar_top').layout({
		fit:true,
	});

$('#combopay').combobox({
	panelHeight:"auto",
	valueField:'va',
	textField:'va_name',
	editable:false,
	data:[{va:'0',va_name:'未支付'},{va:'1',va_name:'已支付'},{va:'2',va_name:'已入库'}],
	onLoadSuccess:function(){
		 $('#comboreback').combobox('setValue',0);
	 }
});

$('#pay_list').datagrid({
		url:'orderinList',
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
			{field:'id',title:'货单编号',width:100,align:'center'},/*halign:'center'数据不居中,表头居中----align:'center'数据和表头都居中*/
			{field:'amount',title:'金额',width:100,align:'center'},
			{field:'status',title:'状态',width:100,align:'center',formatter:function(value,index,row){
				switch(value){
				case 0:
					return '未支付';
				case 1:
					return '已支付';
				case 2:
					return '已入库';
				}
				return value;
			}},
			{field:'num',title:'商品数量',width:100,align:'center'},
			{field:'ordertime',title:'进货时间',width:200,align:'center'}
		]],
		toolbar:'#pay_toolbar',//引入toolbar工具栏
	});

		
		pay_obj={
				//搜索监听
				search:function(){
					var status=$('#comboreback').combobox('getValue');
					var minMoney = $("#search-minMoney").val();
					var maxMoney = $("#search-maxMoney").val();
					if(minMoney==''){
						minMoney=null;
					}
					if(maxMoney==''){
						maxMoney=null;
					}
					$('#pay_list').datagrid('reload',{//reload表示从当前页刷新数据，load表示从第一页开始刷新数据
						status:status,
						maxMoney:maxMoney,
						minMoney:minMoney,
					});
					
				},
				
				
				//支付
				openPay:function(){
					var item=$('#pay_list').datagrid('getSelected');
					if(item==null||item.length==0){
						$.messager.alert('消息提醒！','请选择一个货单进行支付','info');
						return;
					}
					if(item.status==1){
						$.messager.alert('消息提醒！','您选择的货单已支付！','info');
						return;
					}
					if(item.status==2){
						$.messager.alert('消息提醒！','您选择的货单商品已入库！','info');
						return;
					}
					console.log(item.id);
					$('#paytable').css({'margin':'10px auto'});
					//弹出支付框
					$('#pay-dialog').dialog({
						closed: false,
						modal:true,
						iconCls:'icon-tag-blue',
			            title: "支付订单",
			            buttons: [{
			                text: '确定',
			                iconCls: 'icon-ok',
			                handler: function(){
			                	$.ajax({
									url:'pay',
									dataType:'json',
									type:'post',
									data:{id:item.id,payType:$("#add-payType").combobox('getValue'),status:$("#add-status").combobox('getValue')},
									success:function(data){
										if(data.type=='success'){
											$.messager.alert('信息提示',data.msg,'info');
											$('#pay-dialog').dialog('close');
											$('#pay_list').datagrid('reload');
										}
										else{
											$.messager.alert('信息提示',data.msg,'warning');
										}
									}
								});
			                }
			            }, {
			                text: '取消',
			                iconCls: 'icon-cancel',
			                handler: function () {
			                    $('#pay-dialog').dialog('close');                    
			                }
			            }]
					});
				},
				
				
				//显示货单查询窗口
				openView:function(){
					var item = $('#pay_list').datagrid('getSelected');
					if(item == null || item.length == 0){
						$.messager.alert('信息提示','请选择要查看的数据！','info');
						return;
					}
					$('#pay_viewDialog').dialog({
						closed: false,
						modal:true,
			            title: "查看进货商品信息",
			            buttons: [{
			                text: '确定',
			                iconCls: 'icon-ok',
			                handler: function(){
			                	$('#pay_viewDialog').dialog('close');
			                }
			            }, {
			                text: '取消',
			                iconCls: 'icon-cancel',
			                handler: function () {
			                    $('#pay_viewDialog').dialog('close');                 
			                }
			            }],
			            onBeforeOpen:function(){
			            	$.ajax({
			            		url:'orderdetail',
			            		dataType:'json',
			            		type:'post',
			            		data:{id:item.id},
			            		success:function(data){
			            			$("#pay_view-detailDatagrid").datagrid('loadData',{total:0,rows:[]});
					            	var productList = item.orderInDetailList;
					            	//console.log(data);
					            	
					            	for(var i = 0; i < productList.length; i++){
					            		for(var j=0;j<data.length;j++){
					            		if(item.id==productList[i].orderid&&data[j].id==productList[i].goodsid){  				
					            		$("#pay_view-detailDatagrid").datagrid('appendRow',{
					            			goodsid:productList[i].goodsid,
					            			gsname:data[j].gsname,
					            			gsprice:data[j].gsprice,
					            			shopnum:productList[i].shopnum,
					            			total:data[j].gsprice*productList[i].shopnum
					            		});
					            			
					            	}
					            }
					            }	
			            		}
			            	});
			            }
			        });
				},
				
			
		};
})
