const express = require('express');
const router = express.Router();
const userRoute = require('./userRoute')
const authRoute = require('./authRoutes')


const defaultRoutes = [
    {
      path: '/auth',
      route: authRoute,
    },
    {
      path: '/users',
      route: userRoute,
    }
  ];

  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  // /* istanbul ignore next */
  // if (config.env === 'development') {
  //   devRoutes.forEach((route) => {
  //     router.use(route.path, route.route);
  //   });
  // }
  
  module.exports = router;