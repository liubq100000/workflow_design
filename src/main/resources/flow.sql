/*
SQLyog Ultimate v8.32 
MySQL - 5.7.26 : Database - wk_flow
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `abc_wf_def` */

DROP TABLE IF EXISTS `abc_wf_def`;

CREATE TABLE `abc_wf_def` (
  `id` varchar(200) DEFAULT NULL COMMENT '主键',
  `code` varchar(200) DEFAULT NULL COMMENT '标识',
  `name` varchar(200) DEFAULT NULL COMMENT '名称',
  `txt` varchar(1000) DEFAULT NULL COMMENT '描述',
  `content` longtext COMMENT '页面内容'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `abc_wf_info` */

DROP TABLE IF EXISTS `abc_wf_info`;

CREATE TABLE `abc_wf_info` (
  `flow_code` varchar(200) DEFAULT NULL COMMENT '流程编码',
  `type` varchar(200) DEFAULT NULL COMMENT '定义主键',
  `tar_code` varchar(200) DEFAULT NULL COMMENT '编码',
  `def_info01` varchar(200) DEFAULT NULL COMMENT '扩展字段',
  `def_info02` varchar(200) DEFAULT NULL COMMENT '扩展字段',
  `def_info03` varchar(200) DEFAULT NULL COMMENT '扩展字段',
  `def_info04` varchar(200) DEFAULT NULL COMMENT '扩展字段',
  `def_info05` varchar(200) DEFAULT NULL COMMENT '扩展字段',
  `def_info06` varchar(200) DEFAULT NULL COMMENT '扩展字段',
  `def_info07` varchar(200) DEFAULT NULL COMMENT '扩展字段',
  `def_info08` varchar(200) DEFAULT NULL COMMENT '扩展字段',
  `def_info09` varchar(200) DEFAULT NULL COMMENT '扩展字段',
  `def_info10` varchar(200) DEFAULT NULL COMMENT '扩展字段'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `abc_wf_line` */

DROP TABLE IF EXISTS `abc_wf_line`;

CREATE TABLE `abc_wf_line` (
  `id` varchar(200) DEFAULT NULL COMMENT '主键',
  `wf_def_id` varchar(200) DEFAULT NULL COMMENT '定义主键',
  `wf_code` varchar(200) DEFAULT NULL COMMENT '编码',
  `wf_name` varchar(200) DEFAULT NULL COMMENT '名称',
  `wf_type` varchar(200) DEFAULT NULL COMMENT '类型',
  `wf_from` varchar(200) DEFAULT NULL COMMENT '来源',
  `wf_to` varchar(200) DEFAULT NULL COMMENT '目标',
  `wf_json` longtext COMMENT '内容'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `abc_wf_node` */

DROP TABLE IF EXISTS `abc_wf_node`;

CREATE TABLE `abc_wf_node` (
  `id` varchar(200) DEFAULT NULL COMMENT '主键',
  `wf_def_id` varchar(200) DEFAULT NULL COMMENT '定义主键',
  `wf_code` varchar(200) DEFAULT NULL COMMENT '编码',
  `wf_name` varchar(200) DEFAULT NULL COMMENT '名称',
  `wf_type` varchar(200) DEFAULT NULL COMMENT '类型',
  `wf_json` longtext COMMENT '内容'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
