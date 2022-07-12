const express = require('express');
const mySqlHelper = require('../helpers/mysql');
const responseHelper = require('../helpers/response');

let router = express.Router()

/**
 * 获取所有用户记录
 * @route GET /user/list
 * @summary 获取所有用户记录
 * @group user - 用户模块
 * @returns {Array.<User>} 200 - 用户列表
 * @returns {Error}  default - Unexpected error
 */
router.get('/list', async (req, res) => {
  try {
    const userList = await mySqlHelper.query(`select * from user`);
    res.json(responseHelper.success(userList));
  } catch(err) {
    // 统一解析错误
    const errInfo = mySqlHelper.dbErrorHandler(err);
    const { code, msg } = errInfo;
    res.send(responseHelper.failed(code, msg));
  }
})

/**
 * 获取指定用户信息
 * @route GET /user/{userId}
 * @summary 获取指定用户信息
 * @group user - 用户模块
 * @param {number} userId.path.required - 用户id
 * @returns {User.model} 200 - 用户信息
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const users = await mySqlHelper.query(`select * from user where id=${id}`);
    const resUser = users.length > 0 ? users[0] : []
    res.json(responseHelper.success(resUser))
  } catch(err) {
    // 统一解析错误
    const errInfo = mySqlHelper.dbErrorHandler(err);
    const { code, msg } = errInfo;
    res.send(responseHelper.failed(code, msg));
  }
})

/**
 * 新增用户
 * @route POST /user/create
 * @summary 新增用户
 * @group user - 用户模块
 * @param {CreateUser.model} body.body.required - 用户信息
 * @returns {User.model} 200 - 用户信息
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/create', async (req, res) => {
	const { name, age } = req.body
	if (!name) {
		res.send(responseHelper.failed(400, '用户名称必须'))
	}
	try {
		// 查询用户信息
		const createUser = await mySqlHelper.query(
			`select * from user where name='${name}'`
		)
		if (createUser.length > 0) {
			// 用户存在
			return res.json(responseHelper.failed(400, '用户已存在'))
		}
		// 不存在，新增用户
		await mySqlHelper.query(`insert into user (name, age) values('${name}', ${age})`)
		// 返回结果
		// const resUser = createUser[0]
    const newUser = await mySqlHelper.query(
			`select * from user where name='${name}'`
		);
		res.json(responseHelper.success(newUser[0]))
	} catch (err) {
		// 统一解析错误
		const errInfo = mySqlHelper.dbErrorHandler(err)
		const { code, msg } = errInfo
		res.send(responseHelper.failed(code, msg))
	}
})

/**
 * 更新用户信息
 * @route POST /user/update
 * @summary 更新用户信息
 * @group user - 用户模块
 * @param {User.model} body.body.required - 用户信息
 * @returns {User.model} 200 - 用户信息
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/update', async (req, res) => {
	const { id, name, age } = req.body
	if (!id) {
		res.send(responseHelper.failed(400, '用户id必填'))
	}
	try {
		// 查询用户信息
		const updateUser = await mySqlHelper.query(
			`select * from user where id=${id}`
		)
		if (updateUser.length === 0) {
			// 用户不存在
			return res.json(responseHelper.failed(400, '用户不存在'))
		}
    // 用户信息
    const resUser = updateUser[0];
		// 存在，更新用户信息
		await mySqlHelper.query(
			`update user set name='${name}',age=${age} where id=${resUser.id}`
		);
		// 返回结果
    resUser.name = name;
    resUser.age = age;
		res.json(responseHelper.success(resUser));
	} catch (err) {
		// 统一解析错误
		const errInfo = mySqlHelper.dbErrorHandler(err)
		const { code, msg } = errInfo
		res.send(responseHelper.failed(code, msg))
	}
})

/**
 * 删除指定用户
 * @route POST /user/delete
 * @summary 删除指定用户
 * @group user - 用户模块
 * @param {User.model} body.body.required - 用户信息
 * @returns {User.model} 200 - 用户信息
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.send(responseHelper.failed(400, '用户id必须'));
  }
  try {
    // 查询用户信息
    const deleteUser = await mySqlHelper.query(
			`select * from user where id=${id}`
		);
    if (deleteUser.length === 0) { // 没有该用户
      res.json(responseHelper.failed(550, '用户不存在'));
      return;
		}
    // 删除用户
    await mySqlHelper.query(`delete from user where id=${id}`);
    // 返回结果
    const resUser = deleteUser[0];
    res.json(responseHelper.success(resUser));
  } catch(err) {
    // 统一解析错误
    const errInfo = mySqlHelper.dbErrorHandler(err);
    const { code, msg } = errInfo;
    res.send(responseHelper.failed(code, msg));
  }
})

/**
 * This function comment is parsed by doctrine
 * @route GET /api
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
exports.foo = function() {}

/**
 * @typedef Product
 * @property {integer} id
 * @property {string} name.required - Some description for product
 * @property {Array.<Point>} Point
 */

/**
 * @typedef Point
 * @property {integer} x.required
 * @property {integer} y.required - Some description for point - eg: 1234
 * @property {string} color
 * @property {enum} status - Status values that need to be considered for filter - eg: available,pending
 */

/**
 * @typedef Error
 * @property {string} code.required
 */

/**
 * @typedef Response
 * @property {[integer]} code
 */

/**
 * This function comment is parsed by doctrine
 * sdfkjsldfkj
 * @route POST /user
 * @param {Point.model} point.body.required - the new point
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email
 * @param {string} password.query.required - user's password.
 * @param {enum} status.query.required - Status values that need to be considered for filter - eg: available,pending
 * @operationId retrieveFooInfo
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {Response.model} 200 - An array of user info
 * @returns {Product.model}  default - Unexpected error
 * @returns {Array.<Point>} Point - Some description for point
 * @headers {integer} 200.X-Rate-Limit - calls per hour allowed by the user
 * @headers {string} 200.X-Expires-After - 	date in UTC when token expires
 * @security JWT
 */
router.post('/', (req, res) => {
  console.log(req.body, req.headers);
})

/**
 * @typedef User
 * @property {integer} id.required - 用户id - eg: 1
 * @property {string} name - 名称 - eg: mz
 * @property {integer} age - 年龄 - eg: 18
 */

/**
 * @typedef CreateUser
 * @property {string} name.required - 名称 - eg: mz
 * @property {integer} age - 年龄 - eg: 18
 */


//导出该路由
module.exports = router;
