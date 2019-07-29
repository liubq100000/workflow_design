var WorkflowDesign = {};
WorkflowDesign.width = 1200;
WorkflowDesign.height = window.screen.height;
WorkflowDesign.dfg = null;
WorkflowDesign.nowItemCallback = null;
WorkflowDesign.nowItemData = null;
//判空
WorkflowDesign.isNull = function(v){
	if(v == undefined||v ==null || v == 'null'||v == 'undefined'||v == ''){
		return true;
	}
	return false;
}

//节点弹出框保存回调
WorkflowDesign.dlgNodeSaveCallback = function(data){
	layer.closeAll();
	if(WorkflowDesign.nowItemCallback){
		WorkflowDesign.nowItemCallback(data);		
	}	
}
//节点弹出框初始化回调
WorkflowDesign.dlgNodeQueryCallback = function(){
	return WorkflowDesign.nowItemData;
}
//连接线弹出框保存回调
WorkflowDesign.dlgLineSaveCallback = function(data){
	layer.closeAll();
	if(WorkflowDesign.nowItemCallback){
		WorkflowDesign.nowItemCallback(data);
		layer.closeAll();
	}	
}
//连接线弹出框初始化回调
WorkflowDesign.dlgLineQueryCallback = function(){
	return WorkflowDesign.nowItemData;
}
//弹出框
WorkflowDesign.showItemDlg = function(itemType,data,itemCallback){	
	WorkflowDesign.nowItemCallback = itemCallback;
	WorkflowDesign.nowItemData = data;
	if("line" == itemType){
		WorkflowDesign.showItemLineDlg(data);
	} else {
		WorkflowDesign.showItemNodeDlg(data);
	}
	
}
//弹出框
WorkflowDesign.showItemLineDlg = function(data){
	var url = getRootPath()+"/design/lineDesign.action?n_"+(new Date().getTime());
	layer.open({
	  type: 2,
	  title:"连接线信息",
	  area: ['800px', '300px'],
	  fixed: true, //不固定
	  maxmin: false,
	  content: url
	});
}
//弹出框
WorkflowDesign.showItemNodeDlg = function(data){
	var url = getRootPath()+"/design/nodeDesign.action?n_"+(new Date().getTime());
	layer.open({
	  type: 2,
	  title:"节点信息",
	  offset: '100px',
	  area: ['800px', '300px'],
	  fixed: true, //不固定
	  maxmin: false,
	  content: url
	});
}
//json格式化
WorkflowDesign.simpleJson2Text = function(json){	
	var text = [];
	for(var k in json){
		var v = json[k];
		var row = [];
		for(var n in v){
			if(n == 'jQueryObject'){
				continue;
			}
			if(WorkflowDesign.isNull(v[n])){
				continue;
			}
			if(n == 'extendData'){
				var subRow = [];
				for(var subv in v[n]){
					if(WorkflowDesign.isNull(v[n])){
						continue;
					}
					subRow.push('"'+subv+'":"'+v[n][subv]+'"');
				}
				var subJson = "{"+subRow.join(",")+"}";
				row.push('"'+n+'":'+subJson);
			} else {
				row.push('"'+n+'":"'+v[n]+'"');
			}
			
			
		}
		text.push("{"+row.join(",")+"}");
	}
	return "["+text.join(",")+"]";
};
//保存
WorkflowDesign.saveFun = function(){
	var gpData = WorkflowDesign.dfg.getGraphData();
	var nodeTxt = WorkflowDesign.simpleJson2Text(gpData.nodes);
	var lineTxt = WorkflowDesign.simpleJson2Text(gpData.lines);
	$.ajax({
		type : "POST",
		url : getRootPath()+"/design/save.action",
		data : {id:"1","nodeTxt": nodeTxt,"lineTxt":lineTxt},
		dataType : "json",
		success : function(data) {
			alert(data.result);
		}
	});
}
//删除
WorkflowDesign.deleteFun = function(){
	var selectedElenet = WorkflowDesign.dfg.getSelectedElement();
	if(selectedElenet&&selectedElenet.id){
		WorkflowDesign.dfg.removeElement(selectedElenet.id);
	}
}
//显示页面
WorkflowDesign.show = function(data,width,height){
	var inNodes = [];
	for(nIndex=0;nIndex<data.nodeList.length;nIndex++){
		inNodes[nIndex] = eval('(' + data.nodeList[nIndex].json+ ')');
		inNodes[nIndex].left = parseInt(inNodes[nIndex].left); 
		inNodes[nIndex].top = parseInt(inNodes[nIndex].top);
		inNodes[nIndex].height = parseInt(inNodes[nIndex].height);
		inNodes[nIndex].width = parseInt(inNodes[nIndex].width);
	}
	var inLines = [];
	for(lIndex=0;lIndex<data.lineList.length;lIndex++){		
		inLines[lIndex] =  eval('(' + data.lineList[lIndex].json+ ')');
	}
	WorkflowDesign.dfg = new fishflow({
		title : "WORKFLOW案例",
		renderTo : $("#dgxDemo"),
		width:width,
		height:height,
		editable:true,
		showItemDlg:WorkflowDesign.showItemDlg,
		headerToolBar:{
			"save":function(){
				WorkflowDesign.saveFun();
			},
			"delete":function(){
				WorkflowDesign.deleteFun();
			},
			"line":null
		},
		data:{
			//工具箱按钮
			toolBox : ["end","node"],
			nodes:inNodes,
			//连接线
			lines:inLines
		}
	});
}
//初始化
WorkflowDesign.init = function(){	
	$.ajax({
		type : "POST",
		url : getRootPath()+"/design/get.action",
		data : {id:"1"},
		dataType : "json",
		success : function(data) {
			WorkflowDesign.show(data,WorkflowDesign.width,WorkflowDesign.height);
		}
	});
}
$(document).ready(function(){
	WorkflowDesign.init();
});

