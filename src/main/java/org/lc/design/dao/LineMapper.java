package org.lc.design.dao;

import java.util.List;

import org.lc.design.domain.Line;

public interface LineMapper {
	public List<Line> query(Line line);
	
	public java.lang.Integer insert(Line line);
	
	public java.lang.Integer delete();
}
