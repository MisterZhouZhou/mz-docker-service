let options = {
	swaggerDefinition: {
		info: {
			description: 'mz service api',
			title: 'Swagger',
			version: '1.0.0',
		},
		host: 'localhost:3000',
		basePath: '/api',
		produces: ['application/json', 'application/xml'],
		schemes: ['http', 'https'],
		securityDefinitions: {
			JWT: {
				type: 'apiKey',
				in: 'header',
				name: 'Authorization',
				description: '',
			},
		},
	},
	basedir: __dirname, //app absolute path
	files: ['../routes/**/*.js'], //Path to the API handle folder
}

module.exports = function(app) {
  const expressSwagger = require('express-swagger-generator')(app);
  expressSwagger(options);
}

// 访问： http://localhost:3000/api-docs
