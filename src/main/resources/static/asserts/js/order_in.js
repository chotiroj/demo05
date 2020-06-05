 /**
 * 
 */
$(function(){
$('#odtoolbar_top').layout({
		fit:true,
	});

$('#combood').combobox({
	panelHeight:"auto",
	valueField:'va',
	textField:'va_name',
	editable:false,
	data:[{va:'0',va_name:'未支付'},{va:'1',va_name:'已支付'},{va:'2',va_name:'已入库'}],
	onLoadSuccess:function(){
		 $('#combood').combobox('setValue',0);
	 }
});

$('#orderin_list').datagrid({
		url:'/orderinList',
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
            {field:'order.id',title:'货单编号',width:100,align:'center',formatter: function (value, row) {
                    return row["order"]['id'];//返回department字段中的departmentName值
                }},/*halign:'center'数据不居中,表头居中----align:'center'数据和表头都居中*/
			{field:'amount',title:'金额/元',width:100,align:'center'},
			{field:'order.status',title:'状态',width:100,align:'center',formatter:function(value,row){
				var status=row["order"]["status"];
				switch(status){
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
            {field:'createDate',title:'创建时间',width:100,align:'center',formatter: function (value, row) {
                    return row["order"]['createDate'];//返回department字段中的departmentName值
                }}
		]],
		toolbar:'#od_toolbar',//引入toolbar工具栏
	});
//编辑数量
$("#select-goods-datagrid").datagrid({
	onClickCell:function(rowIndex, field, value){
		if(field == 'shopnum'){
			$("#select-goods-datagrid").datagrid('beginEdit',rowIndex);
			return;
		}
		$("#select-goods-datagrid").datagrid('endEdit',rowIndex);
	}
});
		od_obj={
				//搜索监听
				search:function(){
					var status=$('#combood').combobox('getValue');
					console.log(status);
					var minMoney = $("#search-minMoney").val();
					console.log(minMoney);
					var maxMoney = $("#search-maxMoney").val();
					if(minMoney==''){
                        minMoney=null;
					}
					if(maxMoney==''){
						maxMoney=null;
					}
					$('#orderin_list').datagrid('reload',{//reload表示从当前页刷新数据，load表示从第一页开始刷新数据
						status:status,
						minMoney:minMoney,
						maxMoney:maxMoney,
					});
					
				},
				
				//显示添加窗口
				openAdd:function(){
					$('#od_addDialog').dialog({
						modal:true,//底层不可编辑
						closed:false,//打开对话框
						title:'添加进货单',
						buttons:[{
							text:'确定',
							iconCls:'icon-ok',
							handler:od_obj.addorderin,
						},{
							text:'取消',
							iconCls:'icon-cancel',
							handler:function(){
								$('#od_addDialog').dialog('close');
							}
						}],
						onBeforeOpen:function(){}
						
					});
				},
				
				addorderin:function(){
					var selectProducts=$('#select-goods-datagrid').datagrid('getData').rows;
					if(selectProducts.length<=0){
						$.messager.alert('信息提示','请选择至少一个商品加入货单！','warning');
						return;
					}
					//防止用户修改数量后无点击保存
					for(var i=0;i<selectProducts.length;i++){
						$('#select-goods-datagrid').datagrid('endEdit',i);
					}
					$.ajax({
						url:'/addOrderIn',
						dataType:'json',
						type:'post',
						data:{productList:JSON.stringify(selectProducts),status:1},
						success:function(data){
							if(data.type=='success'){
                                console.log(selectProducts);
								$.messager.alert('信息提示',data.msg,'info');
								$('#od_addDialog').dialog('close');
								$('#orderin_list').datagrid('reload');
							}
							else{
								$.messager.alert('信息提示',data.msg,'warning');
							}
						}
					});
				},
				
				//显示添加商品进货单的窗口
				selectProduct:function(){
					$('#show-goods-dialog').dialog({
						closed: false,
						modal:true,
			            title: "选择商品",
			            buttons: [{
			                text: '确定',
			                iconCls: 'icon-ok',
			                handler: function(){
			                	var item = $('#show-goods-datagrid').datagrid('getSelections');
			    				if(item == null || item.length == 0){
			    					$.messager.alert('信息提示','请至少选择一个商品信息！','info');
			    					return;
			    				}
			    				for(var i = 0; i < item.length; i++){
			    					var selectedProducts = $("#select-goods-datagrid").datagrid('getData').rows;
			    					var index = -1;
			    					for(var j = 0; j < selectedProducts.length; j++){
			    						if(selectedProducts[j].id == item[i].id){
			    							index = j;
			    							break;
			    						}
			    					}
			    					if(index > -1){
			    						//说明存在，更新
			    						$("#select-goods-datagrid").datagrid('updateRow',{
			    							index:j,	
			    							row:{
			    	    						id:item[i].id,
			    	    						goodsName:item[i].goodsName,
			    	    						price:item[i].price,
			    	    						shopnum:parseInt(selectedProducts[j].shopnum) + 1
			    							}
			        					});
			    						continue;
			    					}
			    					//追加新的
			    					$("#select-goods-datagrid").datagrid('appendRow',{
			    						id:item[i].id,
			    						goodsName:item[i].goodsName,
			    						price:item[i].price,
			    						shopnum:1
			    					})
			    				}
			    				$('#show-goods-dialog').dialog('close');
			                }
			            }, {
			                text: '取消',
			                iconCls: 'icon-cancel',
			                handler: function () {
			                    $('#show-goods-dialog').dialog('close');                    
			                }
			            }],
						onBeforeOpen:function(){
			            	$('#show-goods-datagrid').datagrid({
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
					var item = $('#orderin_list').datagrid('getSelected');
					if(item == null || item.length == 0){
						$.messager.alert('信息提示','请选择要查看的数据！','info');
						return;
					}
					$('#gs_viewDialog').dialog({
						closed: false,
						modal:true,
			            title: "查看进货商品信息",
			            buttons: [{
			                text: '确定',
			                iconCls: 'icon-ok',
			                handler: function(){
			                	$('#gs_viewDialog').dialog('close');
			                }
			            }, {
			                text: '取消',
			                iconCls: 'icon-cancel',
			                handler: function () {
			                    $('#gs_viewDialog').dialog('close');                 
			                }
			            }],
                        onBeforeOpen:function(){
                            $.ajax({
                                url:'/orderDetails',
                                dataType:'json',
                                type:'post',
                                data:{id:item.id},
                                success:function(data){
                                    $("#gs_view-detailDatagrid").datagrid('loadData',{total:0,rows:[]});
                                    var productList = data.rows;
                                    console.log(productList);

                                    // for(var i = 0; i < productList.length; i++){
                                        //for(var j=0;j<data.length;j++){
                                          //  if(item.id==productList[i].orderid&&data[j].id==productList[i].goodsid){
                                                $("#gs_view-detailDatagrid").datagrid('appendRow',{
                                                    id:productList[0].id,
                                                    goodsName:productList[0].goods.goodsName,
                                                    price:productList[0].goods.price,
                                                    shopnum:productList[0].num,
                                                    amount:productList[0].goods.price*productList[0].num
                                                });

                                          //  }
                                        //}
                                    }
                               // }
                            });
                        }
                    });
                },
				
				//删除已加入货单的商品
				 removeProduct:function(){
					$.messager.confirm('信息提示','确定要删除该记录？', function(result){
						if(result){
							var item = $('#select-goods-datagrid').datagrid('getSelections');
							if(item == null || item.length == 0){
								$.messager.alert('信息提示','请选择要删除的数据！','info');
								return;
							}
							for(var i=0;i<item.length;i++){
								$('#select-goods-datagrid').datagrid('deleteRow',$('#select-goods-datagrid').datagrid('getRowIndex',item[i]));
							}
						}	
					});
				},
				
				//采购入库
				stockIn:function(){
					var item=$('#orderin_list').datagrid('getSelections');
                    console.log(item);
                    var ids=""
                    if(item==null||item.length==0){
                        $.messager.alert('信息提示','请选择一个货单入库！','info');
                        return;
                    }
                    for(var i=0;i<item.length;i++){
                        var num=item[0].num;
                        var orderId=item[0].order.id;
                        if(item[i].order.status==0){
                            $.messager.alert('信息提示','您选择的货单还未支付！','info');
                            return;
                        }
                        if(item[i].order.status==2){
                            $.messager.alert('信息提示','您选择的货单商品已入库！','info');
                            return;
                        }
                        ids+=item[i].goods.id+",";
                    }
                    console.log(ids);

					$.ajax({
						url:'/stockIn',
						dataType:'json',
						type:'post',
						data:{num:num,ids:ids,orderId:orderId},
						success:function(data){
							if(data.type=='success'){
								$.messager.alert('信息提示',data.msg,'info');
								$('#orderin_list').datagrid('reload');
							}
							else{
								$.messager.alert('信息提示',data.msg,'warning');
							}
						}
					});
				}
				
			
		};
})
