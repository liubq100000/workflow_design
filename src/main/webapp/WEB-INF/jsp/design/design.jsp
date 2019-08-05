<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<c:set var="sysPath" value="${pageContext.request.contextPath}"/>
<!DOCTYPE >
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="pragma"   content="no-cache" />   
<meta http-equiv="Cache-Control" content="no-cache,must-revalidate" />   
<script type="text/javascript" src="${sysPath}/js/jquery/jquery-3.4.1.js"></script>
<script type="text/javascript" src="${sysPath}/js/jquery/jquery.draggable-1.0.js"></script>
<script type="text/javascript" src="${sysPath}/js/jquery/jquery.resizable-1.0.js"></script>
<script type="text/javascript" src="${sysPath}/js/jquery/jquery.fishflow-1.0.js"></script>
<script type="text/javascript" src="${sysPath}/layer/layer.js"></script>
<link rel="stylesheet" type="text/css" href="${sysPath}/css/fishflow.css"></link>
<title>设计器</title>
<script language="javascript">
function getRootPath(){
	return "<%=basePath%>"
}
</script>
<style> 
body{ text-align:center} 
#dgxDemo{ margin:0 auto; width:1200px; border:1px solid #F00} 
#btnBar{ margin:0 auto; width:1200px;height:30px; border:1px solid #F00;text-align:left} 
#btnBar input{ margin:2px;width:400px;} 
</style>
</head>
<body>
<div id="btnBar">
<input type="text" id="wkflowName" name="wkflowName" value="监管主体业务流程">
<input type="text" id="wkflowMaxTime" name="wkflowMaxTime" value="90">
</div>
<div id="dgxDemo"></div>
<div id="messageDlg"></div>
<script type="text/javascript" src="${sysPath}/js/design/design.js"></script>
</body>
</html>
 