package org.lc.design.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.lc.common.util.JsonUtil;
import org.lc.design.domain.Def;
import org.lc.design.service.DefService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 测试
 * 
 * @author liubq
 */
@Controller
@RequestMapping(value = "/design")
public class DesignController {
	

	
	@Resource(name = "defService")
	private DefService defService;
	
	@RequestMapping("/init.action")
	public String init(HttpServletRequest request, HttpServletResponse response) {
		String flowId= request.getParameter("flowId");
		if(flowId == null||flowId.trim().length()<=0) {
			flowId = "10001";
		}
		request.setAttribute("flowId", flowId);
		return "design/design";
	}
	
	@RequestMapping("/nodeDesign.action")
	public String nodeDesign(HttpServletRequest request, HttpServletResponse response) {
		return "design/nodeDesign";
	}
	
	@RequestMapping("/lineDesign.action")
	public String lineDesign(HttpServletRequest request, HttpServletResponse response) {
		return "design/lineDesign";
	}
	
	@RequestMapping("/get.action")
	@ResponseBody
	public Map<String,Object> get(HttpServletRequest request, HttpServletResponse response) {
		Map<String,Object> resMap = new HashMap<String,Object>();
		String flowId= request.getParameter("flowId");
		Def def = defService.query(flowId);
		if(def == null) {
			resMap.put("json", "");
		} else {
			resMap.put("json", def.getContent());
		}		
		return resMap;
	}
	
	@RequestMapping("/save.action")
	@ResponseBody
	public Map<String,Object> save(HttpServletRequest request) {
		Map<String,Object> resMap = new HashMap<String,Object>();
		try {
			String content = request.getParameter("content");
			String flowId= request.getParameter("flowId");		 
			defService.save(flowId, content);		
			resMap.put("code", "200");
			resMap.put("message", "保存成功");
		} catch (Exception e) {
			e.printStackTrace();
			resMap.put("code", "500");
			resMap.put("message", e.getMessage());
		}
		return resMap;
	}
	
	@RequestMapping("/saveExtend.action")
	@ResponseBody
	public Map<String,Object> saveExtend(HttpServletRequest request) {
		Map<String,Object> resMap = new HashMap<String,Object>();		 
		return resMap;
	}
	
	@RequestMapping("/openExtend.action")
	public String openExtend(HttpServletRequest request) {
		String type = request.getParameter("type");
		String flowCode = request.getParameter("flowCode");
		String flowName = request.getParameter("flowName");
		String tarCode = request.getParameter("tarCode");
		String tarName = request.getParameter("tarName");
		request.setAttribute("type", type);
		request.setAttribute("flowCode", flowCode);
		request.setAttribute("tarCode", tarCode);
		request.setAttribute("flowName", flowName);
		request.setAttribute("tarName", tarName);
		if("path".equalsIgnoreCase(type)) {
			return "busi_design/lineDesign";
		} else {
			return "busi_design/nodeDesign";
		}		
	}
	

}
