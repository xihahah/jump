## 构思
这是基于three.js在微信开发平台上直接开发的，到目前实现了基本的玩法，但动画效果尚未添加，还有贴图之类的，都没有上，本来是想尝试把跳一跳游戏效果完全还原出来，但由于时间原因，我不再往下继续做了。

## 开发日志
### 2019.11.11
- 摄像机跟随游戏进程移动
- 实现基本游戏逻辑  
发现问题：在手机端玩的时候画面过于粗糙，模型边界呈锯齿状  

### 2019.10.21
- 简单判断游戏状态
- 根据游戏状态创建方块
- 角色水平方向移动
- 使用requstAnimationFrame代替setIntaval
- 把main函数式改为class

### 2019.10.16
- 实现随机创建方块
- 角色蓄力动画


## 源码目录介绍
```
./js
├── libs
│   ├── symbol.js                          // ES6 Symbol简易兼容
│   └── weapp-adapter.js                   // 小游戏适配器
├── camera                              // 摄像机
├── light                               // 游戏灯光
├── mesh                               
│   ├── createCube.js                   // 创建模型
│   └── cube.js                         // 模型
├── player                              // 玩家
├── renderer                            // 渲染器
├── scene                               // 场景
└── main.js                                // 游戏入口主函数

```
