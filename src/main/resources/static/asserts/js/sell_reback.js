 /**
 * 
 */
$(function(){
    //$('.easyui-textbox').textbox().textbox('addClearBtn','icon-cancel');
$('#rebacktoolbar_top').layout({
		fit:true,
	});


$('#reback_list').datagrid({
    url:'/sellBackList',
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
                            return '已退货';
                        case 2:
                            return '已入库';
                    }
                    return value;
                }},
            {field:'num',title:'商品数量',width:100,align:'center'},
            {field:'createDate',title:'退货时间',width:200,align:'center'}
        ]],
		toolbar:'#reback_toolbar',//引入toolbar工具栏
	});
//编辑数量
$("#select-rebackgoods-datagrid").datagrid({
	onClickCell:function(rowIndex, field, value){
		if(field == 'num'){
			$("#select-rebackgoods-datagrid").datagrid('beginEdit',rowIndex);
			return;
		}
		$("#select-rebackgoods-datagrid").datagrid('endEdit',rowIndex);
	}
});

		
		reback_obj={
				//搜索监听
				search:function(){
					var minMoney = $("#search-minMoney").val();
					var maxMoney = $("#search-maxMoney").val();
					if(minMoney==''){
						minMoney=null;
					}
					if(maxMoney==''){
						maxMoney=null;
					}
					$('#reback_list').datagrid('reload',{//reload表示从当前页刷新数据，load表示从第一页开始刷新数据
						minMoney:minMoney,
						maxMoney:maxMoney,
					});
					
				},
				
				//订单过期查询
				ordersearch:function(){
					var id=$('input[name="orderid"]').val();
					 if(id==''){
						 $.messager.alert('信息提醒','订单号不可为空！','warning');
						 return;
					 }
					 $.ajax({
						 url:'/checkOrderTime',
						 dataType:'json',
						 type:'post',
						 data:{id:id},
						 success:function(data){
							 if(data.type=="success"){
								 $.messager.alert('信息提醒',data.msg,"info");
							 }
							 else{
								 $.messager.alert('信息提醒',data.msg,"info");
							 }
						 }
					 });
				},
				
				//显示添加窗口
				openAdd:function(){
					$('#reback_addDialog').dialog({
						modal:true,//底层不可编辑
						closed:false,//打开对话框
						title:'添加退货单',
						buttons:[{
							text:'确定',
							iconCls:'icon-ok',
							handler:reback_obj.addreback,
						},{
							text:'取消',
							iconCls:'icon-cancel',
							handler:function(){
								$('#reback_addDialog').dialog('close');
							}
						}],
						onBeforeOpen:function(){}
						
					});
				},
				
				addreback:function(){
					var selectProducts=$('#select-rebackgoods-datagrid').datagrid('getData').rows;
					if(selectProducts.length<=0){
						$.messager.alert('信息提示','请选择至少一个商品加入货单！','warning');
						return;
					}
					//防止用户修改数量后无点击保存
					for(var i=0;i<selectProducts.length;i++){
						$('#select-rebackgoods-datagrid').datagrid('endEdit',i);
					}
					$('#rebacktable').css({'margin':'10px auto'});
					//弹出支付框
					$('#rebackadd-2-dialog').dialog({
						closed: false,
						modal:true,
						iconCls:'icon-tag-blue',
			            title: "支付订单",
			            buttons: [{
			                text: '确定',
			                iconCls: 'icon-ok',
			                handler: function(){
			                	$.ajax({
									url:'/addOrderBack',
									dataType:'json',
									type:'post',
									data:{productList:JSON.stringify(selectProducts),payType:$("#add-payType").combobox('getValue'),status:1},
									success:function(data){
										if(data.type=='success'){
											$.messager.alert('信息提示',data.msg,'info');
											$('#rebackadd-2-dialog').dialog('close');
											$('#reback_addDialog').dialog('close');
											$('#reback_list').datagrid('reload');
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
			                    $('#rebackadd-2-dialog').dialog('close');
			                }
			            }]
					});
				},
				
			
				//显示添加商品进货单的窗口
				selectProduct:function(){
					$('#show-rebackgoods-dialog').dialog({
						closed: false,
						modal:true,
			            title: "选择商品",
			            buttons: [{
			                text: '确定',
			                iconCls: 'icon-ok',
			                handler: function(){
			                	var item = $('#show-rebackgoods-datagrid').datagrid('getSelections');
			    				if(item == null || item.length == 0){
			    					$.messager.alert('信息提示','请至少选择一个商品信息！','info');
			    					return;
			    				}
			    				for(var i = 0; i < item.length; i++){
			    					var selectedProducts = $("#select-rebackgoods-datagrid").datagrid('getData').rows;
			    					var index = -1;
			    					for(var j = 0; j < selectedProducts.length; j++){
			    						if(selectedProducts[j].id == item[i].id){
			    							index = j;
			    							break;
			    						}
			    					}
			    					if(index > -1){
			    						//说明存在，更新
			    						$("#select-rebackgoods-datagrid").datagrid('updateRow',{
			    							index:j,	
			    							row:{
                                                id:item[i].id,
                                                goodsName:item[i].goodsName,
                                                price:item[i].price,
                                                num:parseInt(selectedProducts[j].num) + 1
			    							}
			        					});
			    						continue;
			    					}
			    					//追加新的
			    					$("#select-rebackgoods-datagrid").datagrid('appendRow',{
                                        id:item[i].id,
                                        goodsName:item[i].goodsName,
                                        price:item[i].price,
                                        num:1
			    					})
			    				}
			    				$('#show-rebackgoods-dialog').dialog('close');
			                }
			            }, {
			                text: '取消',
			                iconCls: 'icon-cancel',
			                handler: function () {
			                    $('#show-rebackgoods-dialog').dialog('close');                    
			                }
			            }],
						onBeforeOpen:function(){
			            	$('#show-rebackgoods-datagrid').datagrid({
			            		url:'/goods',
			            		rownumbers:true,
			            		singleSelect:false,
			            		pageSize:10,
			            		pageList:[10,15,20],
			            		pagination:true,
			            		multiSort:true,
			            		fitColumns:true,
			            		columns:[[
			            			{ field:'chk',checkbox:true},
			            			{ field:'goodsName',title:'商品名称',width:100,sortable:true},
			            			{ field:'produceArea',title:'产地',width:100,sortable:true},
			            			{ field:'size',title:'规格',width:100,sortable:true},
			            			{ field:'price',title:'价格',width:100,sortable:true},
			            		]]
			            	});
			            }
					});
				},
				
				//显示货单查询窗口
				openView:function(){
					var item = $('#reback_list').datagrid('getSelected');
					if(item == null || item.length == 0){
						$.messager.alert('信息提示','请选择要查看的数据！','info');
						return;
					}
					$('#reback_viewDialog').dialog({
						closed: false,
						modal:true,
			            title: "查看进货商品信息",
			            buttons: [{
			                text: '确定',
			                iconCls: 'icon-ok',
			                handler: function(){
			                	$('#reback_viewDialog').dialog('close');
			                }
			            }, {
			                text: '取消',
			                iconCls: 'icon-cancel',
			                handler: function () {
			                    $('#reback_viewDialog').dialog('close');                 
			                }
			            }],
			            onBeforeOpen:function(){
			            	$.ajax({
			            		url:'/sellBackDetail',
			            		dataType:'json',
			            		type:'post',
			            		data:{id:item.id},
			            		success:function(data){
			            			$("#reback_view-detailDatagrid").datagrid('loadData',{total:0,rows:[]});
					            	var productList = data.rows;
					            	//console.log(data);
					            	
					            	// for(var i = 0; i < productList.length; i++){
					            	// 	for(var j=0;j<data.length;j++){
					            	// 	if(item.id==productList[i].orderid&&data[j].id==productList[i].goodsid){
					            		$("#reback_view-detailDatagrid").datagrid('appendRow',{
                                            id:productList[0].goods.id,
                                            goodsName:productList[0].goods.goodsName,
                                            price:productList[0].goods.price,
                                            num:productList[0].num,
                                            amount:productList[0].goods.price*productList[0].num
					            		});
					            			
					            // 	}
					            // }
					            // }
			            		}
			            	});
			            }
			        });
				},
				
				//删除已加入货单的商品
				 removeProduct:function(){
					$.messager.confirm('信息提示','确定要删除该记录？', function(result){
						if(result){
							var item = $('#select-rebackgoods-datagrid').datagrid('getSelections');
							if(item == null || item.length == 0){
								$.messager.alert('信息提示','请选择要删除的数据！','info');
								return;
							}
							for(var i=0;i<item.length;i++){
								$('#select-rebackgoods-datagrid').datagrid('deleteRow',$('#select-rebackgoods-datagrid').datagrid('getRowIndex',item[i]));
							}
						}	
					});
				},
				
			
		};
})
