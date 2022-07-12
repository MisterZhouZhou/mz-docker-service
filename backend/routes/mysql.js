const express = require('express');
const mysql = require('promise-mysql');
const mySqlHelper = require('../helpers/mysql');
const responseHelper = require('../helpers/response');

let router = express.Router();

/**
 * 获取数据库列表
 * @route GET /db/list
 * @summary 获取数据库列表
 * @group db - 数据库模块
 * @returns {Array.<DataBase>}  200 - 数据库列表
 * @returns {Error}  default - Unexpected error
 */
router.get('/list', async (req, res) => {
  console.log('-mysql:', process.env.BACKEND_SERVER);
	const db = await mysql.createPool({
		host: 'mysql',
		port: 3306,
		user: 'root',
		password: '123456',
	});
	const resData = await db.query('show databases;');
	res.json(resData);
});

/**
 * 获取指定数据库中数据表记录
 * @route GET /db/table
 * @summary 获取指定数据库中数据表记录
 * @group db - 数据库模块
 * @returns {Array.<DataBaseModel>} 200 - 数据库中数据表记录
 * @returns {Error}  default - Unexpected error
 */
router.get('/table', async (_, res) => {
  try {
    const tableList = await mySqlHelper.query(`show tables`);
    const outTableList = tableList.map((table) => ({
			dbName: table.Tables_in_mz_service
		}))
    res.json(responseHelper.success(outTableList))
  } catch(err) {
		// 统一解析错误
		const errInfo = mySqlHelper.dbErrorHandler(err);
		const { code, msg } = errInfo;
		res.send(responseHelper.failed(code, msg));
	}
});

/**
 * 获取指定数据库表记录
 * @route GET /db/{dbName}
 * @summary 获取指定数据库表列表
 * @group db - 数据库模块
 * @param {string} dbName.path.required - 数据库名称
 * @returns {Array.<User>} 200 - 数据库表记录
 * @returns {Error}  default - Unexpected error
 */
router.get('/:dbName', async (req, res) => {
  const dbName = req.params.dbName;
  try {
    const dbList = await mySqlHelper.query(`select * from ${dbName} limit 10`)
    res.json(responseHelper.success(dbList));
  } catch(err) {
		// 统一解析错误
		const errInfo = mySqlHelper.dbErrorHandler(err);
		const { code, msg } = errInfo;
		res.send(responseHelper.failed(code, msg));
	}
});

/**
 * 删除数据库表
 * @route POST /db/delete
 * @summary 根据数据库名称删除数据库表
 * @group db - 数据库模块
 * @param {DataBaseModel.model} body.body.required - 数据库名称
 * @returns {string} 200 - 数据库表信息
 * @returns {Error}  default - Unexpected error
 */
router.post('/delete', async (req, res) => {
  const { dbName } = req.body
  try {
    const count = await mySqlHelper.query(`select * from ${dbName}`);
    if (count >= 0) { // 表示数据表存在
      // 删除数据
      const sql = `drop table ${dbName}`;
      await mySqlHelper.query(sql);
      res.json(responseHelper.success({ dbName }));
		}
  } catch(err) {
    // 统一解析错误
    const errInfo = mySqlHelper.dbErrorHandler(err);
    const { code, msg } = errInfo;
    res.send(responseHelper.failed(code, msg));
  }
});

router.get('/', (req, res) => {
  console.log('user');
  res.send('db');
});

/**
 * @typedef DataBase
 * @property {string} Database - 数据库名称 - eg: mysql
 */

/**
 * @typedef DataBaseModel
 * @property {string} dbName - 数据库名称 - eg: mysql
 */

/**
 * @typedef User
 * @property {number} id - 用户id - eg: 1
 * @property {string} name - 姓名 - eg: mz
 * @property {number} age - 年龄 - eg: 18
 */

module.exports = router;