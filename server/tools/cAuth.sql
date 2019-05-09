/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo` (
  `open_id` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` VARCHAR(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cookies` VARCHAR(100),
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';
SET FOREIGN_KEY_CHECKS = 1;

DROP TABLE IF EXISTS `indexList`;
CREATE TABLE `indexList` (
    `id` INT NOT NULL auto_increment PRIMARY KEY,
    `title` VARCHAR(6) NOT NULL,
    `icon` VARCHAR(50) NOT NULL
);
INSERT INTO indexList VALUES(1, "卡片充值", "card.png"), (2, "空调充值", "conditioner.png"), (3, "照明充值", "light.png"), (4, "网络充值", "net.png");

DROP TABLE IF EXISTS `paymentInfo`;
CREATE TABLE paymentInfo
(
  `id` INT auto_increment PRIMARY KEY,
  `flowID` INT,
  `type` INT,
  `apptype` INT,
  `Url` VARCHAR(1),
  `sMenuName` VARCHAR(5),
  `sEMenuName` VARCHAR(15),
  `parm11` VARCHAR(1),
  `parm22` VARCHAR(1),
  `comeapp` VARCHAR(1),
  `headnames` VARCHAR(1),
  `freamenames` VARCHAR(1),
  `shownamess` VARCHAR(1),
  `merpagess` VARCHAR(1),
  `webheadhide` VARCHAR(1),
  CONSTRAINT `indexListId`FOREIGN KEY (id) REFERENCES indexList (id)
);

INSERT INTO paymentInfo 
(id, flowID, type, apptype, Url, sMenuName, sEMenuName, parm11, parm22, comeapp, headnames, freamenames, shownamess, merpagess, webheadhide) 
    VALUES (1, 13, 1, 1, '#', '卡片充值', 'Recharge', '', '', '', '', '', '', '', ''),
    (2, 31, 1, 36, '1', '宿舍电费', 'elec', '', '', '', '', '', '', '', ''),
    (3, 31, 1, 36, '1', '宿舍电费', 'elec', '', '', '', '', '', '', '', ''),
    (4, 32, 1, 136, '2', '交网费', 'network', '', '', '', '', '', '', '', '');
