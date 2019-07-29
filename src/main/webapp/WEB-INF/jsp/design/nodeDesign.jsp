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
	text-align:right;
}
.table td input{
	width:100%;
	margin:6px;
}
</style>
</head>
<body>
<div style="width:100%">
	<input type="hidden" id="itemId" name="itemId" value=""/>
	<table style="width:100%"  class="table">
		<tr>
			<td style="width:60px;" >编码：</td>
			<td><input type="text" id="itemCode" name="itemCode" value=""/></td>
		</tr>
		<tr>
			<td>名称：</td>
			<td><input type="text" id="itemName" name="itemName" value=""/></td>
		</tr>
		<tr>
			<td>脚本：</td>
			<td><input type="text" id="jsTxt" name="jsTxt" value=""/></td>
		</tr>
	</table>
	<br>
	<div style="text-align:center">
		<input type="button" onclick="nodeDesign.save()" value="保存">
	</div>
</div>
<script type="text/javascript" src="${sysPath}/js/design/nodeDesign.js"></script>
</body>
</html>
 