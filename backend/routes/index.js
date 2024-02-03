const express = require('express');
const router = express.Router();
const userRoute = require('./userRoute')
const authRoute = require('./authRoutes')
const locationRoute = require('./locationRoute')
const doctorRoute = require('./doctorRoutes');


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
    },
    {
      path: '/doctor',
      route: doctorRoute
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