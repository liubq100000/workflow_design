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
<link rel="stylesheet" type="text/css" href="${sysPath}/css/busi.css">
<title>扩展属性信息</title>
<script language="javascript">
function getRootPath(){
	return "<%=basePath%>"
}
</script> 
</head>
<body>
<div style="width:900px; margin:0 auto;border:1px solid #F00">
	<div style="width:100%;text-align:center;padding:5px;"><span>节点扩展数据</span></div>
	<input type="hidden" id="init_type" name="init_type" value="${type}"/>	
	<table style="width:100%" class="table">		
		<tr>		
			<td style="width:80px;" align="right">流程编码：</td>
			<td><input type="text" id="init_flowCode" name="init_flowCode" value="${flowCode}" disabled/></td>	
			<td style="width:80px;" align="right">流程名称：</td>
			<td><input type="text" id="init_flowName" name="init_flowName" value="${flowName}" disabled/></td>
		</tr>
		<tr>
			<td align="right">编码：</td>
			<td><input type="text" id="init_tarCode" name="init_tarCode" value="${tarCode}" disabled/></td>		
			<td align="right">名称：</td>
			<td><input type="text" id="init_tarName" name="init_tarName" value="${tarName}" disabled/></td>
		</tr>		
	</table>
	<form id="infoForm">	
	<table style="width:100%" class="table">
		<tr>
			<td style="width:80px;" align="right">节点脚本：</td>
			<td><textarea id="defInfo01" name="defInfo01" rows="5"></textarea></td>			 
		</tr>
		<tr>
			<td style="width:80px;" align="right">处理类：</td>
			<td><input type="text" id="defInfo02" name="defInfo02"/></td>			 
		</tr>
	</table>
	</form>
	<br>
	<div style="text-align:center">
		<input type="button" onclick="infoDesign.save()" value="保存">
		&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" onclick="infoDesign.close()" value="关闭">
	</div>
	<br/>
	<br/>
</div>
<script type="text/javascript" src="${sysPath}/js/busi_design/infoDesign.js"></script>
</body>
</html>
 