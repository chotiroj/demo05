 /**
 * 
 */
$(function(){
$('#setoolbar_top').layout({
		fit:true,
	});



$('#sell_list').datagrid({
		url:'/sellList',
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
			{field:'createDate',title:'下单时间',width:200,align:'center'}
		]],
		toolbar:'#se_toolbar',//引入toolbar工具栏
	});
//编辑数量
$("#select-segoods-datagrid").datagrid({
	onClickCell:function(rowIndex, field, value){
		if(field == 'num'){
			$("#select-segoods-datagrid").datagrid('beginEdit',rowIndex);
			return;
		}
		$("#select-segoods-datagrid").datagrid('endEdit',rowIndex);
	}
});

		
		se_obj={
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
					$('#sell_list').datagrid('reload',{//reload表示从当前页刷新数据，load表示从第一页开始刷新数据
						minMoney:minMoney,
						maxMoney:maxMoney,
					});
					
				},
				
				//显示添加窗口
				openAdd:function(){
					$('#se_addDialog').dialog({
						modal:true,//底层不可编辑
						closed:false,//打开对话框
						title:'添加销售单',
						buttons:[{
							text:'确定',
							iconCls:'icon-ok',
							handler:se_obj.addsell,
						},{
							text:'取消',
							iconCls:'icon-cancel',
							handler:function(){
								$('#se_addDialog').dialog('close');
							}
						}],
						onBeforeOpen:function(){}
						
					});
				},
				
				addsell:function(){
					var selectProducts=$('#select-segoods-datagrid').datagrid('getData').rows;
					if(selectProducts.length<=0){
						$.messager.alert('信息提示','请选择至少一个商品加入货单！','warning');
						return;
					}
					//防止用户修改数量后无点击保存
					for(var i=0;i<selectProducts.length;i++){
						$('#select-segoods-datagrid').datagrid('endEdit',i);
					}
					$('#setable').css({'margin':'10px auto'});
					console.log(JSON.stringify(selectProducts),$("#add-payType").combobox('getValue'),$("#add-status").combobox('getValue'));
					//弹出支付框
					$('#seadd-2-dialog').dialog({
						closed: false,
						modal:true,
						iconCls:'icon-tag-blue',
			            title: "支付订单",
			            buttons: [{
			                text: '确定',
			                iconCls: 'icon-ok',
			                handler: function(){
			                	$.ajax({
									url:'/addSell',
									dataType:'json',
									type:'post',
									data:{productList:JSON.stringify(selectProducts),payType:$("#add-payType").combobox('getValue'),status:$("#add-status").combobox('getValue')},
									success:function(data){
										if(data.type=='success'){
											$.messager.alert('信息提示',data.msg,'info');
											$('#seadd-2-dialog').dialog('close');
											$('#se_addDialog').dialog('close');
											$('#sell_list').datagrid('reload');
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
			                    $('#seadd-2-dialog').dialog('close');
			                }
			            }]
					});
				},
				
			
				//显示添加商品进货单的窗口
				selectProduct:function(){
					$('#show-segoods-dialog').dialog({
						closed: false,
						modal:true,
			            title: "选择商品",
			            buttons: [{
			                text: '确定',
			                iconCls: 'icon-ok',
			                handler: function(){
			                	var item = $('#show-segoods-datagrid').datagrid('getSelections');
			    				if(item == null || item.length == 0){
			    					$.messager.alert('信息提示','请至少选择一个商品信息！','info');
			    					return;
			    				}
			    				for(var i = 0; i < item.length; i++){
			    					var selectedProducts = $("#select-segoods-datagrid").datagrid('getData').rows;
			    					var index = -1;
			    					for(var j = 0; j < selectedProducts.length; j++){
			    						if(selectedProducts[j].id == item[i].id){
			    							index = j;
			    							break;
			    						}
			    					}
			    					if(index > -1){
			    						//说明存在，更新
			    						$("#select-segoods-datagrid").datagrid('updateRow',{
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
			    					$("#select-segoods-datagrid").datagrid('appendRow',{
                                        id:item[i].id,
                                        goodsName:item[i].goodsName,
                                        price:item[i].price,
                                        num:1
			    					})
			    				}
			    				$('#show-segoods-dialog').dialog('close');
			                }
			            }, {
			                text: '取消',
			                iconCls: 'icon-cancel',
			                handler: function () {
			                    $('#show-segoods-dialog').dialog('close');                    
			                }
			            }],
						onBeforeOpen:function(){
			            	$('#show-segoods-datagrid').datagrid({
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
					var item = $('#sell_list').datagrid('getSelected');

					if(item == null || item.length == 0){
						$.messager.alert('信息提示','请选择要查看的数据！','info');
						return;
					}
					$('#se_viewDialog').dialog({
						closed: false,
						modal:true,
			            title: "查看进货商品信息",
			            buttons: [{
			                text: '确定',
			                iconCls: 'icon-ok',
			                handler: function(){
			                	$('#se_viewDialog').dialog('close');
			                }
			            }, {
			                text: '取消',
			                iconCls: 'icon-cancel',
			                handler: function () {
			                    $('#se_viewDialog').dialog('close');                 
			                }
			            }],
			            onBeforeOpen:function(){
			            	$.ajax({
			            		url:'/Selldetail',
			            		dataType:'json',
			            		type:'post',
			            		data:{id:item.id},
			            		success:function(data){
			            			$("#se_view-detailDatagrid").datagrid('loadData',{total:0,rows:[]});
                                    var productList = data.rows;
					            		$("#se_view-detailDatagrid").datagrid('appendRow',{
                                            id:productList[0].goods.id,
                                            goodsName:productList[0].goods.goodsName,
                                            price:productList[0].goods.price,
                                            num:productList[0].num,
                                            amount:productList[0].goods.price*productList[0].num
					            		});
			            		}
			            	});
			            }
			        });
				},

				//删除已加入货单的商品
				 removeProduct:function(){
					$.messager.confirm('信息提示','确定要删除该记录？', function(result){
						if(result){
							var item = $('#select-segoods-datagrid').datagrid('getSelections');
							if(item == null || item.length == 0){
								$.messager.alert('信息提示','请选择要删除的数据！','info');
								return;
							}
							for(var i=0;i<item.length;i++){
								$('#select-segoods-datagrid').datagrid('deleteRow',$('#select-segoods-datagrid').datagrid('getRowIndex',item[i]));
							}
						}
					});
				},


		};
})
