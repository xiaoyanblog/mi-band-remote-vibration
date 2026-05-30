(() => {
  const KEY_CUSTOM = "vibration_scene_custom";
  const KEY_ACTION = "ACTION_TRIGGER";
  const KEY_LOCKED = "SCREEN_LOCKED";
  const METHOD_VIBRATE = "TRIGGER_VIBRATE";
  const METHOD_STOP = "STOP_VIBRATE";
  const METHOD_LOCK = "LOCK_SCREEN";

  const T_DEVICE = "\u8bbe\u5907\u63a7\u5236";
  const T_LOCK = "\u9501\u5b9a\u5c4f\u5e55";
  const T_UNLOCK = "\u89e3\u9664\u9501\u5b9a";
  const T_PRESET = "\u5feb\u6377\u9884\u8bbe";
  const T_SELECT = "\u9009\u62e9\u632f\u52a8\u6a21\u5f0f";
  const T_MANUAL = "\u624b\u52a8\u5fae\u8c03";
  const T_INPUT = "\u8bf7\u8f93\u5165\u6570\u503c";
  const T_START = "\u5f00\u59cb\u632f\u52a8";
  const T_STOP = "\u505c\u6b62\u632f\u52a8";

  const VIBRATION_PRESETS = [
    { name: "\u8f7b\u5fae\u632f\u52a8", value: "24" },
    { name: "\u4e2d\u7b49\u632f\u52a8", value: "23" },
    { name: "\u9ad8\u5f3a\u5ea6\u632f\u52a8", value: "25" },
    { name: "\u9ad8\u5f3a\u5ea6 1000ms", value: "27" },
    { name: "\u9ad8\u5f3a\u5ea6 600ms", value: "28" },
    { name: "\u6d88\u606f\u632f\u52a8", value: "0" },
    { name: "\u6301\u7eed\u632f\u52a8", value: "1" },
    { name: "\u6301\u7eed\u632f\u52a82", value: "5" },
    { name: "\u5f3a\u632f\u52a8", value: "9" }
  ];

  function sendAction(settingsStorage, payload) {
    payload.ts = Date.now();
    settingsStorage.setItem(KEY_ACTION, JSON.stringify(payload));
  }

  function setLocked(settingsStorage, locked) {
    settingsStorage.setItem(KEY_LOCKED, locked ? "true" : "false");
    sendAction(settingsStorage, {
      method: METHOD_LOCK,
      value: locked ? "1" : "0"
    });
  }

  AppSettingsPage({
    state: {
      customValue: "25"
    },
    build(props) {
      this.state.customValue = props.settingsStorage.getItem(KEY_CUSTOM) || "25";

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
          title: T_DEVICE,
          style: { background: "white", borderRadius: "12px", padding: "8px" }
        }, [
          View({
            style: {
              flexDirection: "row",
              justifyContent: "space-between"
            }
          }, [
            Button({
              label: T_LOCK,
              style: {
                width: "48%",
                backgroundColor: "#007AFF",
                color: "white",
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "bold"
              },
              onClick: () => setLocked(props.settingsStorage, true)
            }),
            Button({
              label: T_UNLOCK,
              style: {
                width: "48%",
                backgroundColor: "#8E8E93",
                color: "white",
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "bold"
              },
              onClick: () => setLocked(props.settingsStorage, false)
            })
          ])
        ]),
        Section({
          title: T_PRESET,
          style: { background: "white", borderRadius: "12px", padding: "8px", marginTop: "12px" }
        }, [
          Select({
            label: T_SELECT,
            options: VIBRATION_PRESETS,
            settingsKey: KEY_CUSTOM,
            value: this.state.customValue
          })
        ]),
        Section({
          title: T_MANUAL,
          style: { background: "white", borderRadius: "12px", padding: "8px", marginTop: "12px" }
        }, [
          TextInput({
            label: "Scene ID (0-28)",
            placeholder: T_INPUT,
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
            label: T_START,
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
            label: T_STOP,
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
