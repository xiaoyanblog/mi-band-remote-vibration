const WIDTH = 194;
const HEIGHT = 368;
const CMD_VIBRATE = "TRIGGER_VIBRATE";
const CMD_STOP = "STOP_VIBRATE";
const CMD_LOCK = "LOCK_SCREEN";

const TEXT_CONNECTED = "\u8fde\u63a5\u4e2d";
const TEXT_WAITING = "\u7b49\u5f85\u8fde\u63a5";
const TEXT_CONTROL = "\u8bf7\u901a\u8fc7APP\u63a7\u5236";
const TEXT_OPEN_APP = "\u8bf7\u5148\u6253\u5f00\u624b\u673a\u7aef";
const TEXT_LOCKED = "\u5df2\u9501\u5b9a";
const TEXT_UNLOCK_APP = "\u8bf7\u901a\u8fc7APP\u89e3\u9501";
const TEXT_STOPPED = "\u5df2\u505c\u6b62";

let widgets = [];
let isConnected = false;
let isLocked = false;
let modeText = null;
let lockLayer = [];
let vibrateSensor = null;
let messageBuilderRef = null;

function uiPx(value) {
  return value;
}

function remember(widget) {
  widgets.push(widget);
  return widget;
}

function removeWidget(widget) {
  if (widget) {
    hmUI.deleteWidget(widget);
  }
}

function clearWidgets() {
  widgets.forEach(removeWidget);
  widgets = [];
  lockLayer.forEach(removeWidget);
  lockLayer = [];
  modeText = null;
}

function setScreenKeep(keep) {
  if (typeof hmApp !== "undefined" && hmApp.setScreenKeep) {
    hmApp.setScreenKeep(!!keep);
  }
}

function drawStatus() {
  remember(hmUI.createWidget(hmUI.widget.FILL_RECT, {
    x: 0,
    y: 0,
    w: WIDTH,
    h: HEIGHT,
    color: 0x000000
  }));

  remember(hmUI.createWidget(hmUI.widget.FILL_RECT, {
    x: uiPx(66),
    y: uiPx(58),
    w: uiPx(62),
    h: uiPx(10),
    color: isConnected ? 0x20D060 : 0x666666
  }));

  remember(hmUI.createWidget(hmUI.widget.FILL_RECT, {
    x: uiPx(66),
    y: uiPx(78),
    w: uiPx(62),
    h: uiPx(10),
    color: isConnected ? 0x20D060 : 0x666666
  }));

  remember(hmUI.createWidget(hmUI.widget.TEXT, {
    x: 0,
    y: uiPx(112),
    w: WIDTH,
    h: uiPx(34),
    color: 0xffffff,
    text_size: uiPx(24),
    align_h: hmUI.align.CENTER_H,
    text: isConnected ? TEXT_CONNECTED : TEXT_WAITING
  }));

  modeText = remember(hmUI.createWidget(hmUI.widget.TEXT, {
    x: uiPx(8),
    y: uiPx(154),
    w: uiPx(178),
    h: uiPx(52),
    color: 0xcfcfcf,
    text_size: uiPx(18),
    text_style: hmUI.text_style.WRAP,
    align_h: hmUI.align.CENTER_H,
    text: isConnected ? TEXT_CONTROL : TEXT_OPEN_APP
  }));

  if (isLocked) {
    drawLockLayer();
  }
}

function drawLockLayer() {
  lockLayer.forEach(removeWidget);
  lockLayer = [];
  lockLayer.push(hmUI.createWidget(hmUI.widget.FILL_RECT, {
    x: 0,
    y: 0,
    w: WIDTH,
    h: HEIGHT,
    color: 0x000000
  }));
  lockLayer.push(hmUI.createWidget(hmUI.widget.TEXT, {
    x: 0,
    y: uiPx(84),
    w: WIDTH,
    h: uiPx(42),
    color: 0xffffff,
    text_size: uiPx(24),
    align_h: hmUI.align.CENTER_H,
    text: TEXT_LOCKED
  }));
  lockLayer.push(hmUI.createWidget(hmUI.widget.TEXT, {
    x: 0,
    y: uiPx(138),
    w: WIDTH,
    h: uiPx(44),
    color: 0x9ce8ff,
    text_size: uiPx(18),
    align_h: hmUI.align.CENTER_H,
    text_style: hmUI.text_style.WRAP,
    text: TEXT_UNLOCK_APP
  }));
  lockLayer.push(hmUI.createWidget(hmUI.widget.TEXT, {
    x: 0,
    y: uiPx(208),
    w: WIDTH,
    h: uiPx(32),
    color: 0xffffff,
    text_size: uiPx(18),
    align_h: hmUI.align.CENTER_H,
    text: "100%"
  }));
}

function setLocked(locked) {
  isLocked = !!locked;
  setScreenKeep(isLocked);
  if (isLocked) {
    drawLockLayer();
  } else {
    lockLayer.forEach(removeWidget);
    lockLayer = [];
    if (modeText) {
      modeText.setProperty(hmUI.prop.TEXT, isConnected ? TEXT_CONTROL : TEXT_OPEN_APP);
    }
  }
}

function ensureVibrateSensor() {
  if (!vibrateSensor && typeof hmSensor !== "undefined") {
    vibrateSensor = hmSensor.createSensor(hmSensor.id.VIBRATE);
  }
  return vibrateSensor;
}

function handleVibrateAction(action) {
  if (!action || !action.cmd) {
    return;
  }
  if (action.cmd === CMD_LOCK) {
    setLocked(action.scene === "1" || action.scene === 1 || action.value === "1" || action.value === 1);
    return;
  }
  const sensor = ensureVibrateSensor();
  if (!sensor) {
    return;
  }
  if (action.cmd === CMD_STOP) {
    sensor.stop();
    if (modeText && !isLocked) {
      modeText.setProperty(hmUI.prop.TEXT, TEXT_STOPPED);
    }
    return;
  }
  if (action.cmd === CMD_VIBRATE) {
    const scene = parseInt(action.scene || action.value || "25", 10);
    sensor.stop();
    sensor.start(scene);
    if (modeText && !isLocked) {
      modeText.setProperty(hmUI.prop.TEXT, "Scene ID " + scene);
    }
  }
}

Page({
  onInit() {
    const app = __$$hmAppManager$$__.currentApp;
    const messageBuilder = app && app._options && app._options.globalData && app._options.globalData.messageBuilder;
    if (messageBuilder) {
      messageBuilderRef = messageBuilder;
      messageBuilder.off && messageBuilder.off("call");
      messageBuilder.on("call", ({ payload }) => {
        handleVibrateAction(messageBuilder.buf2Json(payload));
      });
      if (messageBuilder.remoteVibrationConnected) {
        isConnected = true;
        clearWidgets();
        drawStatus();
      }
    }
  },
  build() {
    drawStatus();
  },
  onDestroy() {
    setScreenKeep(false);
    if (vibrateSensor) {
      vibrateSensor.stop();
    }
    if (messageBuilderRef && messageBuilderRef.off) {
      messageBuilderRef.off("call");
    }
    clearWidgets();
  }
});
