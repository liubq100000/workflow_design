var nodeDesign = {};
//保存
nodeDesign.save = function(){
	var itemCode = $("#itemCode").val();
	var itemName = $("#itemName").val();
	var jsTxt = $("#jsTxt").val();
	nodeDesign.data.code = itemCode;
	nodeDesign.data.name = itemName;
	if(!(nodeDesign.data.extendData)){
		nodeDesign.data.extendData = {};
	}
	nodeDesign.data.extendData.jsTxt = jsTxt;
	parent.WorkflowDesign.dlgNodeSaveCallback(nodeDesign.data);
};
//初始化数据
nodeDesign.data = null;
//初始化
nodeDesign.init = function(){
	nodeDesign.data = parent.WorkflowDesign.dlgNodeQueryCallback();
	$("#itemId").val(nodeDesign.data.id);
	$("#itemCode").val(nodeDesign.data.code);
	$("#itemName").val(nodeDesign.data.name);
	if(nodeDesign.data.extendData){
		$("#jsTxt").val(nodeDesign.data.extendData.jsTxt);
	}
};
$(document).ready(function(){
	nodeDesign.init();
});

