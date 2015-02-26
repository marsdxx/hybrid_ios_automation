## 移动端测试分享 ios-Hybrid-真机 篇

> 本文用自己写的一个软件为例，总结一下hybrid移动端测试流程

### [软件地址](https://github.com/xudafeng/hybrid_sample_ios)

### 测试流程



### 展现效果

![flow](https://raw.githubusercontent.com/iscanner/hybrid_ios_automation/master/screenshot/flow.gif)

### 全部测试代码 [下载](https://github.com/xudafeng/hybrid_ios_automation)

### Appium

Appium 就不介绍了，[官网](http://appium.io/)，本文使用1.3.x版本

### node.js

使用 0.10.x, 0.11.x 都可以，推荐使用 io.js，这里有详细介绍和安装文档。

也可以关注 [io.js 中文官网](https://iojs.org/cn/index.html)

### 步骤

#### 配置项

```javascript

var driverCfg = {
  'appium-version': '1.3',
  platformName: 'iOS',
  platformVersion: '8.1',
  deviceName: 'iPhone Simulator',
  app: 'com.xudafeng.hybrid-sample-ios' //这里是 bundleId
};

var remoteCfg = {
  host: 'localhost',
  port: 4723
};

```

#### 建立连接

```bash
$ appium -U udid
```
推荐使用启动参数加手机 udid 启动 appium，会看到系统与手机开始建立 session
连接，方便在 session 存活期内向手机端发送请求。

注意：如果发现脚本执行不成功的话，不妨先检测连接是否还在。

#### 启动代理

对webview进行测试需要启动代理 `ios-webkit-debug-proxy`

没有安装过可以使用一下命令安装：

```bash
$ brew update
$ brew install ios-webkit-debug-proxy
```

开启：

```bash
$ ios_webkit_debug_proxy -c udid:27753
```

#### mocha

推荐使用 mocha 测试框架，稳定且功能足够了

```bash
--require should
--reporter spec
```

这里依赖了 should 断言库和 spec 报告器，推荐使用 mocha.opts
隐式配置，会显得干净一些

#### 执行测试脚本

```bash
$ make test
```

```javascript
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
  it('should go to login page', function() {
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

```

### 查看结果

在命令行中就可以看到最终测试报告

```bash
  hybrid ios test case
    ✓ should go to login page (3329ms)
    ✓ should go to webview page (17702ms)
    ✓ should has correct content in webview (1194ms)


  3 passing (35s)
```

有问题请直接留言，大家互相学习
github: https://github.com/xudafeng
