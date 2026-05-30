(() => {
  const KEY_CUSTOM = "vibration_scene_custom";
  const KEY_ACTION = "ACTION_TRIGGER";
  const KEY_LOCKED = "SCREEN_LOCKED";
  const METHOD_VIBRATE = "TRIGGER_VIBRATE";
  const METHOD_STOP = "STOP_VIBRATE";
  const METHOD_LOCK = "LOCK_SCREEN";

  const VIBRATION_PRESETS = [
    { name: "轻微振动", value: "24" },
    { name: "中等振动", value: "23" },
    { name: "高强度振动", value: "25" },
    { name: "高强度 1000ms", value: "27" },
    { name: "高强度 600ms", value: "28" },
    { name: "消息振动", value: "0" },
    { name: "持续振动", value: "1" },
    { name: "持续振动2", value: "5" },
    { name: "强振动", value: "9" }
  ];

  function sendAction(settingsStorage, payload) {
    settingsStorage.setItem(KEY_ACTION, JSON.stringify({
      ...payload,
      ts: Date.now()
    }));
  }

  AppSettingsPage({
    state: {
      customValue: "25",
      locked: false
    },
    build(props) {
      const savedLock = props.settingsStorage.getItem(KEY_LOCKED);
      this.state.customValue = props.settingsStorage.getItem(KEY_CUSTOM) || "25";
      this.state.locked = savedLock === "true";

      return View({
        style: {
          padding: "12px",
          backgroundColor: "#F5F5F7",
          minHeight: "100vh"
        }
      }, [
        View({
          style: {
            padding: "16px",
            marginBottom: "12px",
            background: "linear-gradient(135deg, #99CCFF, #6B8CED)",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }
        }),
        Section({
          title: "设备控制",
          style: { background: "white", borderRadius: "12px", padding: "8px" }
        }, [
          Toggle({
            label: "屏幕锁定",
            settingsKey: KEY_LOCKED,
            value: this.state.locked,
            onChange: (val) => {
              const locked = !!val;
              this.state.locked = locked;
              props.settingsStorage.setItem(KEY_LOCKED, locked ? "true" : "false");
              sendAction(props.settingsStorage, {
                method: METHOD_LOCK,
                value: locked ? "1" : "0"
              });
            }
          })
        ]),
        Section({
          title: "快捷预设",
          style: { background: "white", borderRadius: "12px", padding: "8px", marginTop: "12px" }
        }, [
          Select({
            label: "选择振动模式",
            options: VIBRATION_PRESETS,
            settingsKey: KEY_CUSTOM,
            value: this.state.customValue
          })
        ]),
        Section({
          title: "手动微调",
          style: { background: "white", borderRadius: "12px", padding: "8px", marginTop: "12px" }
        }, [
          TextInput({
            label: "Scene ID (0-28)",
            placeholder: "请输入数值",
            settingsKey: KEY_CUSTOM,
            value: this.state.customValue,
            onChange: (val) => { this.state.customValue = val; }
          })
        ]),
        View({
          style: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "24px"
          }
        }, [
          Button({
            label: "开始振动",
            style: {
              width: "48%",
              backgroundColor: "#34C759",
              color: "white",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: "bold"
            },
            onClick: () => {
              const currentVal = props.settingsStorage.getItem(KEY_CUSTOM) || this.state.customValue;
              sendAction(props.settingsStorage, {
                method: METHOD_VIBRATE,
                value: currentVal
              });
            }
          }),
          Button({
            label: "停止振动",
            style: {
              width: "48%",
              backgroundColor: "#FF3B30",
              color: "white",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: "bold"
            },
            onClick: () => {
              sendAction(props.settingsStorage, {
                method: METHOD_STOP
              });
            }
          })
        ])
      ]);
    }
  });
})();
