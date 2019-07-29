package org.lc.common.filter;

import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * 定义切面：模拟事物
 * 
 * @author kefan
 * 
 */

@Aspect
@Component
public class LogAspect {

	/**
	 * 定义切入点
	 */
	@Pointcut("execution(* org.lc.user.service.*.*(..))")
	public void transactionPointCut() {
		System.out.println("事物运行....");
	}

	/**
	 * 定义前置通知:开启事物
	 */
	@Before("transactionPointCut()")
	public void beginTransaction() {
		System.out.println("事物开启....");
	}

	/**
	 * 定义后置通知：提交事物
	 */
	@After("transactionPointCut()")
	public void CommitTransaction() {
		System.out.println("事物提交....");
	}

	/**
	 * 定义异常通知：事物回滚
	 */
	@AfterThrowing("transactionPointCut()")
	public void rollBackTransaction() {
		System.out.println("事物回滚....");
	}

}