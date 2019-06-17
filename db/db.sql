-- 数据库表设计

-- ----------------------------
-- 表结构
-- ----------------------------

CREATE DATABASE IF NOT EXISTS moyu_lab;

USE moyu_lab;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NUll AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL UNIQUE,
  `password` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `avatar` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `role` int(1) NOT NUll COMMENT '角色：0 —— 管理员；1 —— 普通用户；',
  `createTime` TIMESTAMP DEFAULT current_timestamp COMMENT '创建时间'
)
COMMENT='用户表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;