var designFlow = {};
designFlow.saveCallback;
designFlow.extendInfoSaveCallback;
//编辑
designFlow.init = function(flowData,inSaveCallback,inExtendInfoSaveCallback){
	$('#myflow_tools').show();
	$('#myflow_props').show();
	designFlow.saveCallback = inSaveCallback;
	designFlow.extendInfoSaveCallback = inExtendInfoSaveCallback;
	$('#myflow').myflow({
		basePath : "",
		allowStateMutiLine:true,
		restore : eval("(" + flowData + ")"),
		tools : {
			save : function(data) {
				designFlow.saveCallback(data);
			},
			moreInfo : function(nowType,flowInfo,attInfo) {
				designFlow.extendInfoSaveCallback(nowType,flowInfo,attInfo);
			}
		}
	});
}
//查看
designFlow.view = function(flowData){
	$('#myflow_tools').hide();
	$('#myflow_props').hide();	
	$('#myflow').myflow({
		editable: false,
		basePath : "",
		allowStateMutiLine:true,
		restore : eval("(" + flowData + ")"),
		tools : {
			save : function(data) {
				
			},
			moreInfo : function(nowType,flowInfo,attInfo) {
				
			}
		}
	});
}
	