var mydesign = {};
mydesign.saveCallback;
mydesign.extendInfoSaveCallback;
//编辑
mydesign.init = function(flowData,inSaveCallback,inExtendInfoSaveCallback){
	$('#myflow_tools').show();
	$('#myflow_props').show();
	mydesign.saveCallback = inSaveCallback;
	mydesign.extendInfoSaveCallback = inExtendInfoSaveCallback;
	$('#myflow').myflow({
		basePath : "",
		allowStateMutiLine:true,
		restore : eval("(" + flowData + ")"),
		tools : {
			save : function(data) {
				mydesign.saveCallback(data);
			},
			moreInfo : function(nowType,flowInfo,attInfo) {
				mydesign.extendInfoSaveCallback(nowType,flowInfo,attInfo);
			}
		}
	});
}
//查看
mydesign.view = function(flowData){
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
	