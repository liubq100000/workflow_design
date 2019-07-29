package org.lc.common.util;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * JSON相关功能
 * 
 * @author liubq
 */
public class JsonUtil {

	/**
	 * 对象转换为JSON字符串
	 * 
	 * @param obj 对象
	 * @return JSON字符串
	 */
	public static String toString(Object obj) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			mapper.setSerializationInclusion(Include.NON_NULL);
			return mapper.writeValueAsString(obj);
		} catch (Exception ex) {
			ex.printStackTrace();
			return "";
		}

	}

	/**
	 * JSON字符串转换为对象
	 * 
	 * @param json JSON字符串
	 * @param clasz 对象类型
	 * @return 对象
	 */
	public static <T> T toBean(String json, Class<T> clasz) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			return mapper.readValue(json, clasz);
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}
}
