# Mi Band Remote Vibration

一个面向小米手环 / Amazfit Band 7（ZeppOS 1.0，Bari 194x368）的远程振动控制小程序。手机端通过 Zepp 开发者模式安装后，可以在设置页触发手环振动、停止振动，并打开屏幕锁定。

## 功能

- 手机端选择振动模式并发送到手环
- 支持停止振动
- 新增屏幕锁定开关
- 锁定后手环端显示“已锁定”，并调用 `hmApp.setScreenKeep(true)` 尽量保持亮屏
- 关闭锁定后取消常亮并恢复普通控制界面

## 安装

可优先使用仓库内由 `zeus preview` 生成的预览包：

`release/mi-band-remote-vibration-1.0.8-preview.zab`

如果你的安装方式只接受 `.zpk`，可以再尝试：

`release/mi-band-remote-vibration-1.0.8-preview.zpk`

根据 Zepp 官方文档，真机预览推荐使用 `zeus preview` 生成的二维码在 Zepp App 开发者模式中扫码安装。

## 构建

```bash
npm install
npm run build:bari
```

构建产物会生成在 `dist/` 目录下。

真机预览建议执行：

```bash
zeus preview -t bari
```

## 说明

当前目标设备为 `bari`，对应原包中的 `Bari(国际标准版本)` / `deviceSource: 254` / `designWidth: 194`。项目保留原始远程振动通信逻辑，并在此基础上增加屏幕锁定指令 `LOCK_SCREEN`。
