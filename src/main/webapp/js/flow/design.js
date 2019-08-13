var designFlow = {};
designFlow.saveCallback;
designFlow.extendInfoSaveCallback;
designFlow.init = function(flowData,inSaveCallback,inExtendInfoSaveCallback){
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
	