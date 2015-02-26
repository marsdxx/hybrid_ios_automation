'use strict';

var logger = require('./lib/logger');

var driverCfg = {
  'appium-version': '1.3',
  platformName: 'iOS',
  platformVersion: '8.1',
  deviceName: 'iPhone Simulator',
  app: 'com.xudafeng.hybrid-sample-ios'
};

var remoteCfg = {
  host: 'localhost',
  port: 4723
};

exports.logger = logger;
exports.driverCfg = driverCfg;
exports.remoteCfg = remoteCfg;
