var infoDesign = {};
//长度
infoDesign.dataLen = 10;
//关闭
infoDesign.close = function(){
	 window.close();
}
//保存
infoDesign.save = function(){
	var init_type = $("#init_type").val();
	var init_flowCode = $("#init_flowCode").val();
	var init_tarCode = $("#init_tarCode").val();
	var param = {"type":init_type,"flowCode":init_flowCode,"tarCode":init_tarCode};
	var key;
	var tempV;
	for(var index=0;index<infoDesign.dataLen;index++){
		if(index<10){
			key = "defInfo0"+index;
		}else{
			key = "defInfo"+index;
		}
		tempV = $("#"+key).val();
		if(typeof(tempV)  == "undefined"){
			continue;
		}
		if(tempV&&tempV!=''){
			param[key] = tempV;
		}		
	}
	$.ajax({
		type : "POST",		
		url : getRootPath()+"/design/saveExtend.action",
		data : param,
		dataType : "json",
		success : function(data) {
			alert(data.message)
		}
	});
};
//初始化数据
infoDesign.data = null;
//初始化
infoDesign.init = function(){
	var init_flowCode = $("#init_flowCode").val();
	var init_tarCode = $("#init_tarCode").val();
	$.ajax({
		type : "POST",		
		url : getRootPath()+"/design/getExtend.action",
		data : {"flowCode":init_flowCode,"tarCode":init_tarCode},
		dataType : "json",
		success : function(data) {
			var key;
			var tempV;
			for(var index=0;index<infoDesign.dataLen;index++){
				if(index<10){
					key = "defInfo0"+index;
				}else{
					key = "defInfo"+index;
				}
				tempV = data[key];
				if(typeof(tempV)  == "undefined"){
					continue;
				}
				if(tempV&&tempV!=''){
					$("#"+key).val(tempV);
				}		
			}
		}
	});
};

$(document).ready(function(){
	infoDesign.init();
});
