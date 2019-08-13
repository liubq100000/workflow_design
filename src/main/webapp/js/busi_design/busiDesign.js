var busiDesign = {};
$.ajaxSetup({
 contentType: "application/x-www-form-urlencoded; charset=utf-8"
});

//扩展属性
busiDesign.extendInfoFun = function(nowType,flowInfo,extInfo){
	var type = nowType;
	var flowCode = flowInfo["code"].value;
	var flowName = flowInfo["name"].value;
	var tarCode = extInfo["code"].value;
	var tarName = extInfo["text"].value;
	var url = getRootPath()+"/design/openExtend.action";
	url +="?type="+type;
	url +="&flowCode="+flowCode;
	url +="&flowName="+flowName;
	url +="&tarCode="+tarCode;
	url +="&tarName="+tarName;
	url +="&n_="+(new Date().getTime());
	window.open(encodeURI(url))
}
//保存数据
busiDesign.save = function(data){
	var queryCondFlowId = $("#queryCondFlowId").val();
	$.ajax({
		type : "POST",		
		url : getRootPath()+"/design/save.action",
		data : {"flowId":queryCondFlowId,"content":data},
		dataType : "json",
		success : function(data) {
			if(data.code == "200"){
				alert("保存工作图成功");
			} else {
				alert(data.message);
			}
			
		}
	});
}
//取得数据
busiDesign.get = function(){
	var queryCondFlowId = $("#queryCondFlowId").val();
	var resJson = "";
	$.ajax({
		type : "POST",		
		url : getRootPath()+"/design/get.action",
		async: false,
		data : {"flowId":queryCondFlowId},
		dataType : "json",
		success : function(data) {			
			if(data){
				designFlow.init(data.json,busiDesign.save,busiDesign.extendInfoFun);
			}			
		}
	});
	return resJson;
}
$(document).ready(function(){
	busiDesign.get();
});

