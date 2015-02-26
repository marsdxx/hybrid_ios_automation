'use strict';

var Base = require('..');
var wd = require('wd');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var TouchAction = wd.TouchAction;

chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

describe('hybrid ios test case', function () {
  this.timeout(300000);
  var driver;
  before(function () {
    driver = wd.promiseChainRemote(Base.remoteCfg);
    Base.logger.configure(driver);
    return driver.init(Base.driverCfg);
  });
  after(function() {
    return driver
      .sleep(1000)
      .quit();
  });
  it('should go to login page', function() {
    return driver
      .elementByName('Go')
      .tap()
      .sleep(1000);
  });
  it('should go to webview page', function() {
    return driver
      .elementByXPath('//UIATextField[@*]')
      .sendKeys('test')
      .sleep(1000)
      .elementByXPath('//UIATextField[last()]')
      .sendKeys('123456')
      .sleep(1000)
      .elementByName('login')
      .tap()
      .sleep(1000);
  });
  it('should has correct content in webview', function() {
    return driver.contexts().then(function (contexts) {
      return driver.context(contexts[1]);
    })
    .sleep(1000)
    .waitForElementByName('test', 5000)
    .getAttribute('value')
    .then(function(value) {
      value.should.containEql('content');
    })
  });
});
