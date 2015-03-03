## 移动端测试分享 ios-Hybrid-模拟器 篇

> 本文用自己写的一个示例 App 为例，总结一下hybrid移动端测试流程

### [App 地址](https://github.com/xudafeng/hybrid_sample_ios)

### 测试流程

-> 启动模拟器
-> 启动 App
-> 进入欢迎界面
-> 进入登录界面
-> 输入正确用户名密码
-> 进入 webview 界面
-> 验证 webview 中内容是否符合预期
-> 查看终端报告器

### 展现效果

![flow](https://raw.githubusercontent.com/xudafeng/hybrid_ios_automation/master/screenshot/flow-sim.gif)

### 全部测试代码 [下载](https://github.com/xudafeng/hybrid_ios_automation)

### Appium

Appium 就不介绍了，[官网](http://appium.io/)，本文使用1.3.x版本

### node.js

使用 0.10.x, 0.11.x 都可以，推荐使用 io.js，这里有详细介绍和安装文档。

也可以关注 [io.js 中文官网](https://iojs.org/cn/index.html)

### 步骤

#### 配置项

真机运行与模拟器运行主要是配置项的差异，详见[这篇文章](http://testerhome.com/topics/2063)

```javascript

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

```

#### 建立连接

```bash
$ appium
```
推荐使用启动参数加手机 udid 启动 appium，会看到系统与手机开始建立 session
连接，方便在 session 存活期内向手机端发送请求。

注意：如果发现脚本执行不成功的话，不妨先检测连接是否还在。

#### 开启权限

运行测试脚本前需要开启 `simulator` 的执行权限，见代码 [authorize_ios 授权](https://github.com/xudafeng/hybrid_ios_automation/blob/master/Makefile#L10)

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
$ make testsim
```

```javascript
'use strict';

var wd = require('wd');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var Base = require('..');

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
      .elementByXPath('//UIATextField[1]')
      .sendKeys('test')
      .sleep(1000)
      .elementByXPath('//UIATextField[2]')
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
