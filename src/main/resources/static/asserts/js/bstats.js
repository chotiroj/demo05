/**
 * 
 */
$(function(){
$('#statoolbar_top').layout({
		fit:true,
	});

stats_obj={
		statsDay:function(){
			$.ajax({
				url:'getStats_Day',
				dataType:'json',
				type:'post',
				data:{type:'statsDay'},
				success:function(data){
					if(data.type=='success'){
						setOption('日商品销售统计',stats_obj.getKeys(data.sellData),stats_obj.getValues(data.sellData),stats_obj.getRebackValues(stats_obj.getKeys(data.sellData),data.sellRebackData));
					}
					else{
						$.messager.alert('信息提示',data.msg,'warning');
					}
				}
			});
		},
		
		statsMonth:function(){
			$.ajax({
				url:'getStats_Month',
				dataType:'json',
				type:'post',
				data:{type:'statsMonth'},
				success:function(data){
					if(data.type=='success'){
						setOption('月商品销售统计',stats_obj.getKeys(data.sellData),stats_obj.getValues(data.sellData),stats_obj.getRebackValues(stats_obj.getKeys(data.sellData),data.sellRebackData));
					}
					else{
						$.messager.alert('信息提示',data.msg,'warning');
					}
				}
			});
		},
		
		statsYear:function(){
			$.ajax({
				url:'getStats_Year',
				dataType:'json',
				type:'post',
				data:{type:'statsYear'},
				success:function(data){
					if(data.type=='success'){
						setOption('年销售退货统计',stats_obj.getKeys(data.sellData),stats_obj.getValues(data.sellData),stats_obj.getRebackValues(stats_obj.getKeys(data.sellData),data.sellRebackData));
					}
					else{
						$.messager.alert('信息提示',data.msg,'warning');
					}
				}
			});
		},
		
		getKeys:function(data){
			var keys = [];
			for(var i=0;i<data.length;i++){
				keys[i] = data[i].statsDate;
			}
			return keys;
		},
		
		getValues:function(data){
			var values = [];
			for(var i=0;i<data.length;i++){
				values[i] = data[i].money;
			}
			return values;
		},
		
		getRebackValues:function(keys,data){
			var values = [];
			for(var i=0;i<keys.length;i++){
				values[i] = stats_obj.getValueFromRebackData(keys[i],data);
			}
			return values;
		},
		
		getValueFromRebackData:function(key,rebackData){
			for(var i=0;i<rebackData.length;i++){
				if(stats_obj.isExistKey(key,rebackData[i]))
					return rebackData[i].money;
			}
			return 0;
		},
		
		isExistKey:function(key,data){
			if(data.statsDate == key)
			{
				return true;
			}
			return false;
		}
};

//基于准备的dom，初始化echarts实例
var myChart=echarts.init(document.getElementById('stats_main'));

//指定表的配置项和数据
function setOption(title,keys,value1,value2) {
	var options={
			title:{
				text:title
			},
			tooltip:{
				trigger:'axis',
			},
			legend:{
				data:['进货数量','销售数量']
			},
			grid:{
				left:'3%',
				right:'4%',
				bottom:'10%',
				containLable:true
			},
			toolbox:{
				feature: {
		            saveAsImage: {}
		        }
			},
			xAxis:{
				type:'category',
				boundaryGap:false,
				data:keys
			},
			yAxis:{
				type:'value'
			},
			series:[
				{
					name:'进货数量',
					type:'line',
					data:value1
				},
				{
					name:'销售数量',
					type:'line',
					data:value2
				}]
			
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(options);
};
//setOption('日商品销售统计',['A','B','C','D','E'],[10,22,30,40,50,52],[5,8,12,23,25,30]);
stats_obj.statsDay;

})