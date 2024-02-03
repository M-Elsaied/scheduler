const express = require('express');
const router = express.Router();
const userRoute = require('./userRoute')
const authRoute = require('./authRoutes')
const locationRoute = require('./locationRoute')


const defaultRoutes = [
    {
      path: '/auth',
      route: authRoute,
    },
    {
      path: '/users',
      route: userRoute,
    },
    {
      path: '/location',
      route: locationRoute
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