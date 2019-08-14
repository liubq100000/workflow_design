package org.lc.design.service;

import java.util.List;

import javax.annotation.Resource;

import org.lc.design.dao.InfoMapper;
import org.lc.design.domain.Info;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class InfoService {

	@Resource(name = "infoMapper")
	private InfoMapper infoMapper;

	 
	public List<Info> query(Info info){
		return infoMapper.query(info);
	}
	
	@Transactional(rollbackFor=Exception.class,propagation=Propagation.REQUIRED)
	public java.lang.Integer insert(Info info){
		return infoMapper.insert(info);
	}
	
	@Transactional(rollbackFor=Exception.class,propagation=Propagation.REQUIRED)
	public java.lang.Integer delete(String flowCode,String tarCode){
		Info cond = new Info();
		cond.setFlowCode(flowCode);
		cond.setTarCode(tarCode);
		return infoMapper.delete(cond);
	}
	
}
