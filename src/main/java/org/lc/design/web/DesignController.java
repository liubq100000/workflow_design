package org.lc.design.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
		request.setAttribute("id", System.currentTimeMillis());
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
		String id = request.getParameter("id");
		return defService.query(id);
	}
	
	@RequestMapping("/save.action")
	@ResponseBody
	public Map<String,Object> save(Def cond,HttpServletRequest request) {
		Map<String,Object> resMap = new HashMap<String,Object>();
		String nodeTxt = request.getParameter("nodeTxt");
		String lineTxt = request.getParameter("lineTxt");
		defService.save(cond, nodeTxt, lineTxt);
		resMap.put("result", "success");
		return resMap;
	}

}
