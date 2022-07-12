const Express = require('express');
const bodyParser = require('body-parser');
const swagger = require('./helpers/swagger');

const app = Express();

// 初始化swagger
swagger(app);

// 中间件
app.use(Express.static('static'));
// app.use(Express.urlencoded({ extended: false }));
// // www-form-urlencoded
// app.use(
// 	bodyParser.urlencoded({
// 		extended: true,
// 	})
// );
// json
app.use(bodyParser.json());

// 定义中间件函数
// const mw = (req, res, next) => {
//     console.log('调用第一个中间件', req.path)
//     //调用中间件函数
//     next()
// }
// //设置全局生效的中间件
// app.use(mw);

// const mt = (req, res, next) => {
//   console.log('调用了局部生效中间件');
//   next()
// }

app.use((_, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With')
	res.header('Access-Control-Allow-Headers', 'Content-Type')
	next()
});

// 路由
app.get('/', (req, res) => {
	res.end('hello world!');
});

//添加两个路由到应用上
app.use('/api/user', require('./routes/user'));
app.use('/api/db', require('./routes/mysql'));

app.listen(3000, () => {
  console.log('服务运行于: http://localhost:3000');
});