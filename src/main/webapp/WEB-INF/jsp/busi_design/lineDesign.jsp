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
<title>节点</title>
<script language="javascript">
function getRootPath(){
	return "<%=basePath%>"
}
</script>
<style type="text/css">
.table{

}
.table td{
	margin:2px;
	text-align:left;
}
.table td input{
	width:97%;
	margin:6px;
}
</style>
</head>
<body>
<div style="width:100%">
		<input type="hidden" id="type" name="type" value="${type}"/>
	<input type="hidden" id="flowCode" name="flowCode" value="${flowCode}" />
	<input type="hidden" id="flowName" name="flowName" value="${flowName}" />
	<table style="width:100%" class="table">
		<tr>
			<td style="width:70px;" align="right">名称：</td>
			<td><input type="text" id="tarCode" name="tarCode" value="${tarCode}"/></td>
		</tr>
		<tr>
			<td  align="right">条件：</td>
			<td><input type="text" id="tarName" name="tarName" value="${tarName}"/></td>
		</tr>
	</table>
	<br>
	<div style="text-align:center">
		<input type="button" onclick="lineDesign.save()" value="保存">
	</div>
</div>
<script type="text/javascript" src="${sysPath}/js/design/lineDesign.js"></script>
</body>
</html>
 