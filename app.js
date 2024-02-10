const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
// const AppCheck = require('../nodev1/api/model/app_check');
// const basicAuth = require('express-basic-auth');
const app = express();


const PlayStoreAppsRoute = require('./api/routes/playstore_apps');
const UserRoute = require('./api/routes/users');
const ValidateIp = require('./api/routes/validate_ip');
const OtpRoute = require('./api/routes/otp');



const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pwd = 'zysPz6ifrWXETmPV';
const url = `mongodb+srv://Meemanshoo:${pwd}@cluster0.x44mmbb.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

mongoose.connection.on('error',err => {
    console.log('connection failed');
});

mongoose.connection.on('connected',connected => {
    console.log('connection successfull');
});



app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/api',PlayStoreAppsRoute);
app.use('/api',UserRoute);
app.use('/api',ValidateIp);
app.use('/api',OtpRoute);



// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specify the version of OpenAPI (Swagger) you are using
    info: {
      title: 'Your API Documentation', // Title of your API
      version: '1.0.0', // Version of your API
      description: 'Documentation for your API',
    },
  },
  // Paths to API docs and your API endpoints
  apis: ['./api/routes/*.js','./api/routes/admin/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

  // Serve Swagger documentation using Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use((req,res,next) => {
    res.status(404).json({
        error:"bad request"
    });
});




app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({  status:false, error: 'Invalid JSON payload' });
    }
    next(err);
  });


module.exports = app;