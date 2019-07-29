package org.lc.design.service;

import java.util.List;

import javax.annotation.Resource;

import org.lc.design.dao.LineMapper;
import org.lc.design.domain.Line;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
public class LineService {

	@Resource(name = "lineMapper")
	private LineMapper lineMapper;

	 
	public List<Line> query(Line line){
		return lineMapper.query(line);
	}
	
	@Transactional(rollbackFor=Exception.class,propagation=Propagation.REQUIRED)
	public java.lang.Integer insert(Line line){
		return lineMapper.insert(line);
	}
	
	@Transactional(rollbackFor=Exception.class,propagation=Propagation.REQUIRED)
	public java.lang.Integer delete(){
		return lineMapper.delete();
	}
	
}
