/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50508
Source Host           : localhost:3306
Source Database       : eam

Target Server Type    : MYSQL
Target Server Version : 50508
File Encoding         : 65001

Date: 2017-04-02 09:12:23
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for class
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `Class_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Class_Name` varchar(255) NOT NULL,
  `Grade` int(11) NOT NULL,
  `M_ID` int(11) NOT NULL,
  PRIMARY KEY (`Class_ID`),
  KEY `M_ID` (`Grade`),
  KEY `M_ID1` (`M_ID`),
  CONSTRAINT `M_ID1` FOREIGN KEY (`M_ID`) REFERENCES `major` (`M_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of class
-- ----------------------------
INSERT INTO `class` VALUES ('15', '计算机14-1班', '1', '29');
INSERT INTO `class` VALUES ('16', '计算机14-02班', '1', '29');
INSERT INTO `class` VALUES ('17', '计算机14-03班', '1', '29');
INSERT INTO `class` VALUES ('18', '电信科14-1班', '1', '28');
INSERT INTO `class` VALUES ('19', '电信科14-02班', '1', '28');

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `Course_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Course_Name` varchar(255) NOT NULL,
  `week` int(11) NOT NULL,
  `Quarter` int(11) DEFAULT '2',
  `F_ID` int(11) DEFAULT NULL,
  `Is_Single` int(11) DEFAULT '0',
  PRIMARY KEY (`Course_ID`),
  KEY `CF_ID` (`week`),
  KEY `F_ID` (`F_ID`),
  CONSTRAINT `F_ID` FOREIGN KEY (`F_ID`) REFERENCES `faculty` (`F_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of course
-- ----------------------------
INSERT INTO `course` VALUES ('33', '数据库技术', '6', '2', '2', '0');
INSERT INTO `course` VALUES ('34', 'dsp原理', '5', '2', '2', '0');
INSERT INTO `course` VALUES ('35', '形式与政策', '4', '1', '1', '0');
INSERT INTO `course` VALUES ('36', '网络安全概论', '8', '2', '2', '0');
INSERT INTO `course` VALUES ('37', '可编程器件应用', '6', '2', '2', '0');
INSERT INTO `course` VALUES ('38', '微波技术', '12', '2', '2', '0');
INSERT INTO `course` VALUES ('39', '雷达技术', '6', '2', '2', '0');
INSERT INTO `course` VALUES ('40', '毛泽东思想概论', '6', '2', '2', '0');
INSERT INTO `course` VALUES ('41', '嵌入式操作系统', '7', '2', '2', '0');
INSERT INTO `course` VALUES ('42', '单片机原理', '7', '2', '2', '0');
INSERT INTO `course` VALUES ('43', '数字图像处理', '5', '2', '2', '0');
INSERT INTO `course` VALUES ('44', '程序设计基础', '12', '2', '2', '0');
INSERT INTO `course` VALUES ('45', '通信原理', '15', '2', '2', '0');
INSERT INTO `course` VALUES ('46', '通信电子电路A', '13', '2', '2', '0');

-- ----------------------------
-- Table structure for courseplan
-- ----------------------------
DROP TABLE IF EXISTS `courseplan`;
CREATE TABLE `courseplan` (
  `CS_ID` int(11) NOT NULL AUTO_INCREMENT,
  `RC_ID` int(11) DEFAULT NULL,
  `T_ID` int(11) DEFAULT NULL,
  `Course_ID` int(11) DEFAULT NULL,
  `Start_Week` int(11) DEFAULT NULL,
  `Over_Week` int(11) DEFAULT NULL,
  `Time_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`CS_ID`),
  KEY `RC_ID` (`RC_ID`),
  KEY `T_ID1` (`T_ID`),
  KEY `Course_ID1` (`Course_ID`),
  KEY `Time_ID` (`Time_ID`),
  CONSTRAINT `Course_ID1` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`),
  CONSTRAINT `RC_ID` FOREIGN KEY (`RC_ID`) REFERENCES `teach_class` (`RC_ID`),
  CONSTRAINT `Time_ID` FOREIGN KEY (`Time_ID`) REFERENCES `time` (`Time_ID`),
  CONSTRAINT `T_ID1` FOREIGN KEY (`T_ID`) REFERENCES `teacher` (`T_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of courseplan
-- ----------------------------
INSERT INTO `courseplan` VALUES ('1', '2', '17', '33', '1', '3', '1');
INSERT INTO `courseplan` VALUES ('2', '2', '18', '33', '4', '6', '1');
INSERT INTO `courseplan` VALUES ('3', '2', '17', '33', '1', '3', '9');
INSERT INTO `courseplan` VALUES ('4', '2', '18', '33', '4', '6', '9');
INSERT INTO `courseplan` VALUES ('5', '2', '19', '34', '7', '11', '1');
INSERT INTO `courseplan` VALUES ('6', '2', '19', '34', '7', '11', '17');
INSERT INTO `courseplan` VALUES ('7', '2', '20', '35', '2', '5', '5');
INSERT INTO `courseplan` VALUES ('8', '2', '17', '36', '1', '8', '2');
INSERT INTO `courseplan` VALUES ('9', '2', '17', '36', '1', '8', '10');
INSERT INTO `courseplan` VALUES ('10', '2', '21', '37', '11', '16', '5');
INSERT INTO `courseplan` VALUES ('11', '2', '21', '37', '11', '16', '13');
INSERT INTO `courseplan` VALUES ('12', '2', '22', '38', '1', '12', '6');
INSERT INTO `courseplan` VALUES ('13', '2', '22', '38', '1', '12', '14');
INSERT INTO `courseplan` VALUES ('14', '2', '23', '39', '13', '18', '1');
INSERT INTO `courseplan` VALUES ('15', '2', '23', '39', '13', '18', '17');
INSERT INTO `courseplan` VALUES ('16', '2', '24', '40', '12', '17', '9');
INSERT INTO `courseplan` VALUES ('17', '2', '24', '40', '12', '17', '18');
INSERT INTO `courseplan` VALUES ('18', '2', '25', '41', '11', '17', '2');
INSERT INTO `courseplan` VALUES ('19', '2', '25', '41', '11', '17', '10');
INSERT INTO `courseplan` VALUES ('20', '2', '25', '42', '11', '17', '3');
INSERT INTO `courseplan` VALUES ('21', '2', '25', '42', '11', '17', '19');
INSERT INTO `courseplan` VALUES ('22', '2', '26', '43', '4', '8', '3');
INSERT INTO `courseplan` VALUES ('23', '2', '26', '43', '4', '8', '11');
INSERT INTO `courseplan` VALUES ('24', '2', '27', '44', '8', '19', '7');
INSERT INTO `courseplan` VALUES ('25', '2', '27', '44', '8', '19', '15');
INSERT INTO `courseplan` VALUES ('26', '2', '30', '45', '1', '8', '4');
INSERT INTO `courseplan` VALUES ('27', '2', '31', '45', '9', '15', '4');
INSERT INTO `courseplan` VALUES ('28', '2', '30', '45', '1', '8', '20');
INSERT INTO `courseplan` VALUES ('29', '2', '31', '45', '9', '15', '20');
INSERT INTO `courseplan` VALUES ('30', '2', '28', '46', '4', '10', '8');
INSERT INTO `courseplan` VALUES ('31', '2', '29', '46', '11', '16', '8');
INSERT INTO `courseplan` VALUES ('32', '2', '28', '46', '4', '10', '16');
INSERT INTO `courseplan` VALUES ('33', '2', '29', '46', '11', '16', '16');

-- ----------------------------
-- Table structure for faculty
-- ----------------------------
DROP TABLE IF EXISTS `faculty`;
CREATE TABLE `faculty` (
  `F_ID` int(11) NOT NULL AUTO_INCREMENT,
  `F_Name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`F_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of faculty
-- ----------------------------
INSERT INTO `faculty` VALUES ('1', '其他系');
INSERT INTO `faculty` VALUES ('2', '信息工程系');
INSERT INTO `faculty` VALUES ('3', '机械工程系');
INSERT INTO `faculty` VALUES ('4', '建筑工程系');
INSERT INTO `faculty` VALUES ('5', '商学系');
INSERT INTO `faculty` VALUES ('6', '化工与食品加工系');

-- ----------------------------
-- Table structure for major
-- ----------------------------
DROP TABLE IF EXISTS `major`;
CREATE TABLE `major` (
  `M_ID` int(11) NOT NULL AUTO_INCREMENT,
  `M_Name` varchar(255) DEFAULT NULL,
  `F_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`M_ID`),
  KEY `F_ID2` (`F_ID`),
  CONSTRAINT `F_ID2` FOREIGN KEY (`F_ID`) REFERENCES `faculty` (`F_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of major
-- ----------------------------
INSERT INTO `major` VALUES ('28', '电子信息科学与技术', '2');
INSERT INTO `major` VALUES ('29', '计算机', '2');

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room` (
  `R_ID` int(11) NOT NULL AUTO_INCREMENT,
  `R_Name` varchar(255) DEFAULT NULL,
  `Capacity` int(11) DEFAULT NULL,
  PRIMARY KEY (`R_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of room
-- ----------------------------
INSERT INTO `room` VALUES ('8', '敬亭111', '2');
INSERT INTO `room` VALUES ('10', '新安101', '1');
INSERT INTO `room` VALUES ('11', '新安102', '1');
INSERT INTO `room` VALUES ('12', '敬亭122', '2');
INSERT INTO `room` VALUES ('13', '敬亭113', '2');
INSERT INTO `room` VALUES ('15', '敬亭333', '2');
INSERT INTO `room` VALUES ('16', '敬亭123', '3');

-- ----------------------------
-- Table structure for select_course
-- ----------------------------
DROP TABLE IF EXISTS `select_course`;
CREATE TABLE `select_course` (
  `CC_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Course_ID` int(11) DEFAULT NULL,
  `Class_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`CC_ID`),
  KEY `Class_ID1` (`Class_ID`),
  KEY `Course_ID2` (`Course_ID`),
  CONSTRAINT `Class_ID1` FOREIGN KEY (`Class_ID`) REFERENCES `class` (`Class_ID`),
  CONSTRAINT `Course_ID2` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of select_course
-- ----------------------------
INSERT INTO `select_course` VALUES ('129', '33', '18');
INSERT INTO `select_course` VALUES ('130', '33', '19');
INSERT INTO `select_course` VALUES ('131', '34', '18');
INSERT INTO `select_course` VALUES ('132', '34', '19');
INSERT INTO `select_course` VALUES ('133', '35', '18');
INSERT INTO `select_course` VALUES ('134', '35', '19');
INSERT INTO `select_course` VALUES ('135', '36', '18');
INSERT INTO `select_course` VALUES ('136', '36', '19');
INSERT INTO `select_course` VALUES ('137', '37', '18');
INSERT INTO `select_course` VALUES ('138', '37', '19');
INSERT INTO `select_course` VALUES ('139', '38', '18');
INSERT INTO `select_course` VALUES ('140', '38', '19');
INSERT INTO `select_course` VALUES ('141', '39', '18');
INSERT INTO `select_course` VALUES ('142', '39', '19');
INSERT INTO `select_course` VALUES ('143', '40', '18');
INSERT INTO `select_course` VALUES ('144', '40', '19');
INSERT INTO `select_course` VALUES ('145', '41', '18');
INSERT INTO `select_course` VALUES ('146', '41', '19');
INSERT INTO `select_course` VALUES ('147', '42', '18');
INSERT INTO `select_course` VALUES ('148', '42', '19');
INSERT INTO `select_course` VALUES ('149', '43', '18');
INSERT INTO `select_course` VALUES ('150', '43', '19');
INSERT INTO `select_course` VALUES ('151', '44', '18');
INSERT INTO `select_course` VALUES ('152', '44', '19');
INSERT INTO `select_course` VALUES ('153', '45', '18');
INSERT INTO `select_course` VALUES ('154', '45', '19');
INSERT INTO `select_course` VALUES ('155', '46', '18');
INSERT INTO `select_course` VALUES ('156', '46', '19');

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `S_ID` int(11) NOT NULL AUTO_INCREMENT,
  `S_Mum` varchar(255) DEFAULT NULL,
  `S_Name` varchar(255) DEFAULT NULL,
  `S_Age` varchar(255) DEFAULT NULL,
  `S_Sex` varchar(255) DEFAULT NULL,
  `C_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`S_ID`),
  KEY `C_ID` (`C_ID`),
  CONSTRAINT `C_ID` FOREIGN KEY (`C_ID`) REFERENCES `class` (`Class_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of student
-- ----------------------------

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher` (
  `T_ID` int(11) NOT NULL AUTO_INCREMENT,
  `T_Name` varchar(255) DEFAULT NULL,
  `T_Sex` varchar(255) DEFAULT NULL,
  `T_Age` varchar(255) DEFAULT NULL,
  `T_Duty` varchar(255) DEFAULT '教员',
  `F_ID` int(11) DEFAULT NULL,
  `is_local` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`T_ID`),
  KEY `F_ID1` (`F_ID`),
  CONSTRAINT `F_ID1` FOREIGN KEY (`F_ID`) REFERENCES `faculty` (`F_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES ('14', '小明', '男', '22', '教员', '1', '0');
INSERT INTO `teacher` VALUES ('15', '小芳', '女', '22', '教员', '1', '0');
INSERT INTO `teacher` VALUES ('16', '小军', '男', '22', '教员', '1', '0');
INSERT INTO `teacher` VALUES ('17', '张国富', '男', '22', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('18', '苏兆品', '男', '44', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('19', '杨双龙', '女', '33', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('20', '许小玲', '女', '33', '教员', '1', '0');
INSERT INTO `teacher` VALUES ('21', '鲁迎春', '女', '33', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('22', '姜兆能', '女', '44', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('23', '周芳', '女', '44', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('24', '秦华', '女', '22', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('25', '吴永忠', '男', '33', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('26', '詹曙', '男', '22', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('27', '张延孔', '女', '22', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('28', '艾加秋', '女', '22', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('29', '牛朝', '女', '33', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('30', '郭太峰', '男', '22', '教员', '2', '0');
INSERT INTO `teacher` VALUES ('31', '贾露', '男', '22', '教员', '2', '0');

-- ----------------------------
-- Table structure for teach_class
-- ----------------------------
DROP TABLE IF EXISTS `teach_class`;
CREATE TABLE `teach_class` (
  `RC_ID` int(11) NOT NULL AUTO_INCREMENT,
  `R_ID` int(11) DEFAULT NULL,
  `One_ID` int(11) DEFAULT NULL,
  `Two_ID` int(11) DEFAULT NULL,
  `Three_ID` int(11) DEFAULT NULL,
  `RC_Name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`RC_ID`),
  KEY `R_ID` (`R_ID`),
  KEY `One_ID` (`One_ID`),
  KEY `Two_ID` (`Two_ID`),
  KEY `Three_ID` (`Three_ID`),
  CONSTRAINT `One_ID` FOREIGN KEY (`One_ID`) REFERENCES `class` (`Class_ID`),
  CONSTRAINT `R_ID` FOREIGN KEY (`R_ID`) REFERENCES `room` (`R_ID`),
  CONSTRAINT `Three_ID` FOREIGN KEY (`Three_ID`) REFERENCES `class` (`Class_ID`),
  CONSTRAINT `Two_ID` FOREIGN KEY (`Two_ID`) REFERENCES `class` (`Class_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of teach_class
-- ----------------------------
INSERT INTO `teach_class` VALUES ('1', '16', '15', '16', '17', '教学2班');
INSERT INTO `teach_class` VALUES ('2', '8', '18', '19', null, '教学1班');

-- ----------------------------
-- Table structure for teach_course
-- ----------------------------
DROP TABLE IF EXISTS `teach_course`;
CREATE TABLE `teach_course` (
  `TC_ID` int(11) NOT NULL AUTO_INCREMENT,
  `T_ID` int(11) DEFAULT NULL,
  `Course_ID` int(11) DEFAULT NULL,
  `Start_Week` int(11) DEFAULT '1',
  `Over_Week` int(11) DEFAULT '20',
  `Work_Load` int(11) DEFAULT '0',
  PRIMARY KEY (`TC_ID`),
  KEY `Course_ID` (`Course_ID`),
  KEY `T_ID` (`T_ID`),
  CONSTRAINT `Course_ID` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`),
  CONSTRAINT `T_ID` FOREIGN KEY (`T_ID`) REFERENCES `teacher` (`T_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of teach_course
-- ----------------------------
INSERT INTO `teach_course` VALUES ('9', '20', '35', '2', '5', '0');
INSERT INTO `teach_course` VALUES ('10', '17', '33', '1', '3', '0');
INSERT INTO `teach_course` VALUES ('11', '17', '36', '1', '8', '0');
INSERT INTO `teach_course` VALUES ('12', '18', '33', '2', '7', '3');
INSERT INTO `teach_course` VALUES ('13', '19', '34', '7', '12', '1');
INSERT INTO `teach_course` VALUES ('14', '21', '37', '11', '16', '0');
INSERT INTO `teach_course` VALUES ('15', '22', '38', '1', '12', '0');
INSERT INTO `teach_course` VALUES ('16', '23', '39', '13', '18', '0');
INSERT INTO `teach_course` VALUES ('17', '24', '40', '12', '17', '0');
INSERT INTO `teach_course` VALUES ('18', '25', '41', '11', '17', '0');
INSERT INTO `teach_course` VALUES ('19', '26', '43', '4', '8', '0');
INSERT INTO `teach_course` VALUES ('20', '25', '42', '11', '17', '0');
INSERT INTO `teach_course` VALUES ('21', '27', '44', '8', '19', '0');
INSERT INTO `teach_course` VALUES ('22', '28', '46', '4', '10', '0');
INSERT INTO `teach_course` VALUES ('23', '29', '46', '8', '16', '3');
INSERT INTO `teach_course` VALUES ('24', '30', '45', '1', '8', '0');
INSERT INTO `teach_course` VALUES ('25', '31', '45', '9', '17', '2');

-- ----------------------------
-- Table structure for time
-- ----------------------------
DROP TABLE IF EXISTS `time`;
CREATE TABLE `time` (
  `Time_ID` int(255) NOT NULL AUTO_INCREMENT,
  `Week` varchar(255) DEFAULT NULL,
  `Quarter` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Time_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of time
-- ----------------------------
INSERT INTO `time` VALUES ('1', '1', '1');
INSERT INTO `time` VALUES ('2', '1', '2');
INSERT INTO `time` VALUES ('3', '1', '3');
INSERT INTO `time` VALUES ('4', '1', '4');
INSERT INTO `time` VALUES ('5', '2', '1');
INSERT INTO `time` VALUES ('6', '2', '2');
INSERT INTO `time` VALUES ('7', '2', '3');
INSERT INTO `time` VALUES ('8', '2', '4');
INSERT INTO `time` VALUES ('9', '3', '1');
INSERT INTO `time` VALUES ('10', '3', '2');
INSERT INTO `time` VALUES ('11', '3', '3');
INSERT INTO `time` VALUES ('12', '3', '4');
INSERT INTO `time` VALUES ('13', '4', '1');
INSERT INTO `time` VALUES ('14', '4', '2');
INSERT INTO `time` VALUES ('15', '4', '3');
INSERT INTO `time` VALUES ('16', '4', '4');
INSERT INTO `time` VALUES ('17', '5', '1');
INSERT INTO `time` VALUES ('18', '5', '2');
INSERT INTO `time` VALUES ('19', '5', '3');
INSERT INTO `time` VALUES ('20', '5', '4');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_name` varchar(255) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `U_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Is_Admin` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`U_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=gbk;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('admin', '123', '1', '0');
