var infoDesign = {};
//保存
infoDesign.save = function(){
	var init_type = $("#init_type").val();
	var init_flowCode = $("#init_flowCode").val();
	var init_tarCode = $("#init_tarCode").val();
	var defInfo01 = $("#defInfo01").val();
	var defInfo02 = $("#defInfo02").val();
	var defInfo03 = $("#defInfo03").val();
	var defInfo04 = $("#defInfo04").val();
	var defInfo05 = $("#defInfo05").val();
	$.ajax({
		type : "POST",		
		url : getRootPath()+"/design/saveExtend.action",
		data : {"type":init_type,"flowCode":init_flowCode,"tarCode":init_tarCode,"defInfo01":defInfo01,"defInfo02":defInfo02,"defInfo03":defInfo03,"defInfo04":defInfo04,"defInfo05":defInfo05},
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
			$("#defInfo01").val(data.defInfo01);
			$("#defInfo02").val(data.defInfo02);
			$("#defInfo03").val(data.defInfo03);
			$("#defInfo04").val(data.defInfo04);
			$("#defInfo05").val(data.defInfo05);			
		}
	});
};

$(document).ready(function(){
	infoDesign.init();
});
