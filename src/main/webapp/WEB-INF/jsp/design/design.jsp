<%@ page language="java" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<c:set var="sysPath" value="${pageContext.request.contextPath}"/>
<!DOCTYPE >
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript">
		function getRootPath(){
			return "<%=path%>";
		}
	</script>
	<link type="text/css" href="${sysPath}/lib/jquery-ui-1.8.4.custom/css/smoothness/jquery-ui-1.8.4.custom.css" rel="stylesheet" />
	<link rel="stylesheet" type="text/css" href="${sysPath}/css/design.css">
	<script type="text/javascript" src="${sysPath}/lib/raphael-min.js"></script>
	<script type="text/javascript" src="${sysPath}/lib/jquery-ui-1.8.4.custom/js/jquery.min.js"></script>
	<script type="text/javascript" src="${sysPath}/lib/jquery-ui-1.8.4.custom/js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="${sysPath}/js/flow/myflow.js"></script>
	<script type="text/javascript" src="${sysPath}/js/flow/myflow.jpdl4.js"></script>
	<script type="text/javascript" src="${sysPath}/js/flow/myflow.editors.js"></script>
	<script type="text/javascript" src="${sysPath}/js/flow/design.js"></script>
</head>
<body>
	<input type="hidden" id="queryCondFlowId" name="queryCondFlowId" value="${flowId}">
	<input type="hidden" id="showMode" name="showMode" value="${mode}">
	<div id="myflow_tools" class="ui-widget-content" style="display:none">
	<div id="myflow_tools_handle" style="text-align: center;" class="ui-widget-header"> 工具集 </div>

	<div class="node" id="myflow_revoke"><img src="${sysPath}/img/save.gif" />&nbsp;&nbsp;撤销</div>
	<div class="node" id="myflow_redraw"><img src="${sysPath}/img/save.gif" />&nbsp;&nbsp;重绘</div>
	<div class="node" id="myflow_save"><img src="${sysPath}/img/save.gif" />&nbsp;&nbsp;保存</div>
	<div>

	<hr />
	</div>
	<div class="node selectable selected" id="pointer"><img src="${sysPath}/img/select16.gif" />&nbsp;&nbsp;选择</div>
	<div class="node selectable" id="path"><img src="${sysPath}/img/16/flow_sequence.png" />&nbsp;&nbsp;连接</div>
	<div>
	<hr />
	</div>
	<div class="node state" id="start" type="start"><img src="${sysPath}/img/16/start_event_empty.png" />&nbsp;&nbsp;开始</div>
	<div class="node state" id="state" type="state"><img src="${sysPath}/img/16/task_empty.png" />&nbsp;&nbsp;状态</div>
	<div class="node state" id="task" type="task"><img src="${sysPath}/img/16/task_empty.png" />&nbsp;&nbsp;任务</div>
	<div class="node state" id="fork" type="fork"><img src="${sysPath}/img/16/gateway_parallel.png" />&nbsp;&nbsp;分支</div>
	<div class="node state" id="join" type="join"><img src="${sysPath}/img/16/gateway_parallel.png" />&nbsp;&nbsp;合并</div>
	<div class="node state" id="end" type="end"><img src="${sysPath}/img/16/end_event_terminate.png" />&nbsp;&nbsp;结束</div>
	<div class="node state" id="end-cancel" type="end-cancel"><img src="${sysPath}/img/16/end_event_cancel.png" />&nbsp;&nbsp;取消</div>
	<div class="node state" id="end-error" type="end-error"><img src="${sysPath}/img/16/end_event_error.png" />&nbsp;&nbsp;错误</div>
	</div>

	<div id="myflow_props" class="ui-widget-content" style="display:none">
	<div id="myflow_props_handle" class="ui-widget-header">属性</div>
	<table border="1" width="100%" cellpadding="0" cellspacing="0">
		<tr>
			<td></td>
		</tr>
		<tr>
			<td></td>
		</tr>
	</table>
	<div>&nbsp;</div>
	</div>

	<div id="myflow"></div>
	<script type="text/javascript" src="${sysPath}/js/busi_design/busiDesign.js"></script>
</body>
</html>
 