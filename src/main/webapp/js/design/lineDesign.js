var lineDesign = {};
//保存
lineDesign.save = function(){
	var itemCode = $("#itemCode").val();
	var itemName = $("#itemName").val();
	var itemCond = $("#itemCond").val();
	lineDesign.data.code = itemCode;
	lineDesign.data.name = itemName;
	if(!(lineDesign.data.extendData)){
		lineDesign.data.extendData = {};
	}
	lineDesign.data.extendData.cond = itemCond;
	parent.WorkflowDesign.dlgLineSaveCallback(lineDesign.data);
};
//初始化数据
lineDesign.data = null;
//初始化
lineDesign.init = function(){
	lineDesign.data = parent.WorkflowDesign.dlgLineQueryCallback();
	$("#itemId").val(lineDesign.data.id);
	$("#itemCode").val(lineDesign.data.code);
	$("#itemName").val(lineDesign.data.name);
	if(lineDesign.data.extendData){
		$("#itemCond").val(lineDesign.data.extendData.cond);
	}	
};

$(document).ready(function(){
	lineDesign.init();
});
