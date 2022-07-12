/*
 * @Author: misterzhou
 * @Date: 2022-07-11 15:19:52
 * @LastEditTime: 2022-07-11 15:23:17
 * @LastEditors: misterzhou
 * @FilePath: /mz-service/backend/helpers/response.js
 * @Description: 数据响应封装
 */
const success = (data) => ({
	code: 200,
	data: data,
});

const failed = (code, msg) => ({
	code,
	msg,
})

module.exports = {
  success,
  failed,
}
