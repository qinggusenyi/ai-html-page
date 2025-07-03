const templates = [
  {
    id: "panda-apology",
    name: "熊猫道歉信",
    coverImage: "assets/images/panda-cover.gif",
    view: {
      backgroundImage: "assets/images/panda-template-bg.png",
      gif: "assets/images/panda-template-gif-1.gif"
    },
    fields: [
      {
        id: "title",
        label: "标题:",
        type: "text",
        defaultValue: "可以跟我好吗？"
      },
      {
        id: "message",
        label: "你想说的话:",
        type: "textarea",
        defaultValue: "对不起，我真的知道错了..."
      }
    ],
    rejectWords: [
      "对不起我错了",
      "给你买了零食",
      "你就原谅我嘛",
      "我以后都听你的",
      "再也不惹你生气了"
    ],
    successImages: [
      "assets/images/panda-template-gif-1.gif",
      "assets/images/panda-template-gif-2.gif",
      "assets/images/panda-template-gif-3.gif"
    ]
  },
  {
    id: "cat-confession",
    name: "猫咪表白信",
    coverImage: "assets/images/cat-cover.png",
    view: {
      backgroundImage: "assets/images/cat-template-bg.png",
      initialGif: "assets/images/cat-confession-begging-1.gif"
    },
    fields: [
      {
        id: "title",
        label: "标题:",
        type: "text",
        defaultValue: "喜欢你喵！"
      },
      {
        id: "message",
        label: "你想说的话:",
        type: "textarea",
        defaultValue: "遇见你是我最幸运的事~"
      }
    ],
    rejectWordsCat: [
      "再想想嘛...",
      "别急着拒绝呀~",
      "你再考虑考虑嘛~",
      "是不是还有机会呢？",
      "给个机会嘛喵！"
    ],
    beggingGifs: [
      "assets/images/cat-confession-begging-1.gif",
      "assets/images/cat-confession-begging-2.gif",
      "assets/images/cat-confession-begging-3.gif"
    ],
    successImagesCat: [
      "assets/images/cat-confession-success-1.gif",
      "assets/images/cat-confession-success-2.gif"
    ],
    finalConfessionText: "我也喜欢你，永远在一起！"
  }
]; 