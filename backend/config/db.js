/*
 * @Author: misterzhou
 * @Date: 2022-07-11 14:28:50
 * @LastEditTime: 2022-07-11 15:13:25
 * @LastEditors: misterzhou
 * @FilePath: /mz-service/backend/config/db.js
 * @Description: 
 */
// 数据连接配置
const mySqlConfig = {
	host: 'mysql',
	port: 3306,
	user: 'root',
	password: process.env.MYSQL_ROOT_PASSWORD,
}

// 数据库配置
const dbConfig = Object.assign(mySqlConfig, {
	database: process.env.MYSQL_DATABASE,
});

module.exports = {
  mySqlConfig,
	dbConfig,
}