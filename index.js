'use strict';

var logger = require('./lib/logger');
var path = require('path');
var program = require('commander');

program.option('-s, --sim',  'point launch simulator')
.parse(process.argv);

var realDriverCfg = {
  'appium-version': '1.3',
  platformName: 'iOS',
  platformVersion: '8.1',
  deviceName: 'iPhone Simulator',
  udid: '43a5ca00429ce1832ce3d17ca2f8bb1d43b7c416',
  app: 'com.xudafeng.hybrid-sample-ios'
};

var simulatorDriverCfg = {
  'appium-version': '1.3',
  platformName: 'iOS',
  platformVersion: '8.1',
  deviceName: 'iPhone Simulator',
  app: path.resolve('./apps/hybrid_sample_ios.app.zip')
};

var remoteCfg = {
  host: 'localhost',
  port: 4723
};

exports.logger = logger;
exports.driverCfg = program.sim ? simulatorDriverCfg : realDriverCfg;
exports.remoteCfg = remoteCfg;
