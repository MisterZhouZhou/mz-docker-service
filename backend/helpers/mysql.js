/*
 * @Author: misterzhou
 * @Date: 2022-07-11 11:40:43
 * @LastEditTime: 2022-07-11 16:28:11
 * @LastEditors: misterzhou
 * @FilePath: /mz-service/backend/helpers/mysql.js
 * @Description: mysql helper
 */
const mysql = require('promise-mysql');
const dbConfig = require('../config/db');
const Promise = require('bluebird');

// 建立连接池, 使用pool.query 快速连接
const pool = mysql.createPool(dbConfig.dbConfig);

// 用using/dispsoer 模式构建连接
const getSqlConnection = async () => {
  return (await pool).getConnection().disposer((connection) => {
    // pool.release(connection); 报错
    connection.release();
  });
}

// 使用bluebird 封装具有dispsoer功能的promise对象
const query = (sql) => {
  return Promise.using(getSqlConnection(), (connection) => {
		return sql ? connection.query(sql) : con;
	})
}

// 数据库错误提示
const dbErrorHandler = (err) => {
  const { code } = err;
	if (code === 'ER_NO_SUCH_TABLE') {
		res.send(responseHelper.failed(500, '服务器内部错误'))
		return { code: 500, msg: '服务器内部错误' };
	}
}

module.exports = {
	pool,
	getSqlConnection,
	query,
	dbErrorHandler,
}
