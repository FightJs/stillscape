const scenes = [
  {
    "id": "00-tuscany-reborn",
    "title": "托斯卡纳的呼吸",
    "subtitle": "A BREATH OF TUSCANY",
    "style": "oil",
    "category": "绘画艺术",
    "image": "./wallpapers/00-tuscany-reborn.png",
    "palette": [
      "#cf9347",
      "#525d3b",
      "#eed8aa"
    ],
    "effects": [
      "water",
      "clouds",
      "wind"
    ],
    "description": "让风真正掠过独立的柏树枝冠，让夕阳在湖面缓慢展开。",
    "fit": "contain",
    "water": {
      "polygon": [
        [
          0.008,
          0.633
        ],
        [
          0.17,
          0.629
        ],
        [
          0.34,
          0.626
        ],
        [
          0.48,
          0.637
        ],
        [
          0.55,
          0.649
        ],
        [
          0.595,
          0.657
        ],
        [
          0.551,
          0.699
        ],
        [
          0.49,
          0.753
        ],
        [
          0.41,
          0.788
        ],
        [
          0.34,
          0.827
        ],
        [
          0.27,
          0.817
        ],
        [
          0.21,
          0.797
        ],
        [
          0.17,
          0.768
        ],
        [
          0.12,
          0.754
        ],
        [
          0.1,
          0.724
        ],
        [
          0.07,
          0.71
        ],
        [
          0.04,
          0.692
        ],
        [
          0.008,
          0.69
        ]
      ]
    },
    "sky": {
      "bottom": 0.3,
      "advect": true
    },
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "referenceId": null,
    "foreground": [
      {
        "image": "./layers/tuscany-cypress.png",
        "anchor": [
          0.075,
          1.03
        ],
        "width": 0.33,
        "height": 0.88,
        "pivot": [
          0.5,
          1
        ],
        "sway": 0.007
      }
    ],
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8.025,
      "highCount": 7,
      "scores": {
        "风格还原": 8.6,
        "创意惊艳": 7.4,
        "动效工艺": 8,
        "设计排版": 8.2,
        "质感细节": 8.5,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "修正后的太阳与湖光主轴一致，油画天空、金色远野及独立柏树材质自然统一，较首轮更完整。",
        "默认及180%风力下多时刻树冠轮廓有变化，无旧版横条、分叉或黑边；根部保持稳定且与花丛融合改善，天空和湖光也在缓慢变化。",
        "隐藏界面后直接检查树根/树顶/左边缘，未见明显贴片矩形；增强参数仍克制。枝级弹性与多层云的复杂性仍不属卓越，动效按8基线而非9。",
        "题材仍熟悉，新增一致阵风节奏改善完整性但不构成独特叙事突破，创意保留7.4。",
        "深色标题底板略重，但可隐藏且恢复操作有效。"
      ],
      "evidence": [
        "审核员亲自view_image查看光轴修正后的00原图。",
        "Chrome1431×628，12:23默认；UI确认风力及云流180%；12:23与随后沉浸截图对照；亲测隐藏/恢复界面和恢复自然节奏。",
        "用户已实听油画24秒片段及96秒全集对应段，短样本平顺舒适；实时声画精度和长周期仍为局限。",
        "本次评分对应光轴修正+弹性树冠修订，不追溯改变第一轮失败事实。"
      ],
      "report": "reviews/00-tuscany-reborn.md"
    },
    "motionReview": {
      "id": "00-tuscany-reborn",
      "title": "托斯卡纳的呼吸",
      "status": "passed",
      "defaultObservation": "默认云层、树冠与湖纹在3秒内清楚变化。",
      "maxObservation": "最大云水与树摆加强；首轮左右天空拉伸条在第二轮采样未再出现。",
      "zeroControlObservation": "逐项只开树300、只开水300、只开云300：其余零档对应区域静止，开启项运动明确；首轮全零静止，本轮暂停/恢复亦实看通过。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:49–13:50 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "01-impasto-night",
    "title": "潮汐星原",
    "subtitle": "TIDAL CONSTELLATIONS",
    "style": "oil",
    "category": "绘画艺术",
    "image": "./wallpapers/01-impasto-night.png",
    "palette": [
      "#102D59",
      "#2F67A1",
      "#F2C75C"
    ],
    "effects": [
      "stars",
      "water",
      "clouds"
    ],
    "description": "月轮悬在厚涂的星空里，一座小灯塔守着弧形海湾，海面轻轻接住金色星光。",
    "fit": "contain",
    "referenceId": "01-impasto-night",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=863123048",
    "popularityEvidence": "Steam作品页：426,007 当前订阅，28,997 收藏。属于长期高订阅参考，不代表当周趋势。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.49,
      "vortex": {
        "center": [
          0.24,
          0.22
        ],
        "radius": 0.65,
        "strength": 0.007
      }
    },
    "water": {
      "polygon": [
        [
          0,
          0.65
        ],
        [
          0.55,
          0.65
        ],
        [
          0.71,
          0.68
        ],
        [
          0.9,
          0.75
        ],
        [
          0.84,
          0.85
        ],
        [
          0.65,
          0.92
        ],
        [
          0.59,
          1
        ],
        [
          0,
          1
        ]
      ]
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8,
      "highCount": 7,
      "scores": {
        "风格还原": 8.4,
        "创意惊艳": 7.4,
        "动效工艺": 8,
        "设计排版": 8.2,
        "质感细节": 8.5,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "厚涂星空原稿的色彩/笔触和创意评价保持首轮，不因返修无关项加分。",
        "复审可见围绕月心的云彩笔触位置轻变，月轮主体、灯塔与海岸保持固定；与星点微闪、水面金纹共同形成三层动态，达到8分动效基线。",
        "未见旋涡导致月轮变形、全图拉丝或海岸接缝；移动幅度克制，仍非卓越复杂动态。",
        "动态已比仅星点闪烁丰富，独特性仍主要来自熟悉的后印象派星海题材。"
      ],
      "evidence": [
        "原图已亲自view_image。",
        "Chrome1431×628，12:25和12:26修订后真实网页截图，默认风/云/水参数已先恢复。",
        "人工全集音频已覆盖该段；源码新增vortex与实看笔触变化相符，代码仅作机制补充。"
      ],
      "report": "reviews/01-impasto-night.md"
    },
    "motionReview": {
      "id": "01-impasto-night",
      "title": "潮汐星原",
      "status": "passed",
      "defaultObservation": "默认旋涡笔触与金色水纹运动明确。",
      "maxObservation": "最终补验：速度3×、星点300且水/云0时星点明暗变化，月轮保持完整圆形及绘画纹理，未再见矩形亮白补丁；水/云/星点全300时旋涡与水纹强烈运动，月轮和画缘干净。",
      "zeroControlObservation": "前轮海湾金纹、旋涡云流、星点明暗分别隔离0/300可启停；最终面板已无阵风，只保留三项有效强度。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:51 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。",
        "最终补验2026-10-28 15:06–15:10 Asia/Shanghai，真实Chrome 1431×684；01月面隔离/最大，02默认布局，06/08/09全零与隔离300，12最终面板/默认；各动态状态约3秒截图实看，截图仅在本agent工具记录。"
      ],
      "resolvedIssues": [
        "星点300使月轮出现块状高亮补丁，需保护月轮后复验。",
        "待移除难以独立辨认的阵风滑杆并核对最终面板。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "02-ink-mountains",
    "title": "听山",
    "subtitle": "LISTEN TO THE MOUNTAINS",
    "style": "ink",
    "category": "东方意境",
    "image": "./wallpapers/02-ink-mountains.png",
    "palette": [
      "#ECE8DE",
      "#797C77",
      "#1F2827"
    ],
    "effects": [
      "mist",
      "water"
    ],
    "description": "山峦从浓墨退入淡雾，一叶小舟停在留白之间，听见远处瀑布的回声。",
    "fit": "contain",
    "referenceId": "02-ink-mountains",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=2113406377",
    "popularityEvidence": "Steam作品页：50,095 当前订阅，2,858 收藏。万级受欢迎作品；非百万级爆款。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.4
    },
    "water": {
      "polygon": [
        [
          0,
          0.78
        ],
        [
          0.63,
          0.78
        ],
        [
          0.63,
          0.86
        ],
        [
          0.74,
          0.86
        ],
        [
          0.74,
          0.78
        ],
        [
          1,
          0.78
        ],
        [
          1,
          1
        ],
        [
          0,
          1
        ]
      ],
      "strength": 0.3
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "flowColumn": {
      "top": [
        0.228,
        0.455
      ],
      "bottom": [
        0.25,
        0.684
      ],
      "width": 0.016,
      "kind": "waterfall"
    },
    "boat": {
      "center": [
        0.69,
        0.825
      ],
      "radii": [
        0.05,
        0.05
      ]
    },
    "previousReview": {
      "status": "passed",
      "average": 8,
      "highCount": 7,
      "scores": {
        "风格还原": 8.5,
        "创意惊艳": 7.4,
        "动效工艺": 8.1,
        "设计排版": 8.1,
        "质感细节": 8.4,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "水墨构图、材质与原创性保持上一轮评分，不因门槛差额抬升静态项。",
        "最终版本中瀑布内部细流、落水点淡雾与近湖轻纹形成衔接，小舟/倒影的极小起伏没有造成岸线或舟身碎裂；动态比上一轮孤立白瀑完整。",
        "各变化幅度极低，适合留白水墨，仍不属于复杂标杆级物理模拟；动效从7.8复评8.1。",
        "亮图可读性缺陷已修复，默认底板仍较重；淡雾与细流/舟影的精细变化限于当前视口判断。"
      ],
      "evidence": [
        "原图已亲自view_image。",
        "Chrome1431×628，12:57与13:00最终flowColumn/boat版两时刻截图。",
        "用户96秒全集该ink段实际听感平顺舒适，实时同步与长周期未全面覆盖。"
      ],
      "report": "reviews/02-ink-mountains.md"
    },
    "motionReview": {
      "id": "02-ink-mountains",
      "title": "听山",
      "status": "passed",
      "defaultObservation": "最终默认1×复验：文案位于右上留白，瀑布下段及落点完整可见；约3秒内瀑流亮纹、舟与倒影及低雾变化可辨，整体克制。",
      "maxObservation": "最大瀑布流纹、舟与倒影位移、横向薄雾更明确，画面无明显撕裂。",
      "zeroControlObservation": "水0/雾300时瀑布、舟、倒影静止而雾移动；水300/雾0时瀑流、舟、水纹运动而雾停止。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:51–13:52 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。",
        "最终补验2026-10-28 15:06–15:10 Asia/Shanghai，真实Chrome 1431×684；01月面隔离/最大，02默认布局，06/08/09全零与隔离300，12最终面板/默认；各动态状态约3秒截图实看，截图仅在本agent工具记录。"
      ],
      "resolvedIssues": [
        "默认说明卡片覆盖部分主要瀑布下段与落点，需移到留白区后复验默认可见性。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "03-ukiyoe-wave",
    "title": "松风潮汐",
    "subtitle": "TIDES IN WOODCUT",
    "style": "ukiyoe",
    "category": "东方意境",
    "image": "./layers/03-pine-clean.png",
    "palette": [
      "#133F60",
      "#4D7793",
      "#EBDDBD"
    ],
    "effects": [
      "water",
      "clouds"
    ],
    "description": "松枝、朱月与靛蓝潮纹，在温润纸色上展开一幅安静的木版海景。",
    "fit": "contain",
    "referenceId": "03-ukiyoe-wave",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=1340469439",
    "popularityEvidence": "Steam作品页：49,205 当前订阅，2,549 收藏；作品注明北斋原画。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.455,
      "advectionRect": [
        0.42,
        0.345,
        1,
        0.455
      ],
      "protectCircle": [
        0.78,
        0.22,
        0.15
      ]
    },
    "water": {
      "polygon": [
        [
          0.24,
          0.52
        ],
        [
          1,
          0.52
        ],
        [
          1,
          1
        ],
        [
          0,
          1
        ],
        [
          0,
          0.76
        ],
        [
          0.21,
          0.7
        ],
        [
          0.26,
          0.6
        ]
      ],
      "strength": 0.35
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "foreground": [
      {
        "image": "./layers/03-pine-layer.png",
        "anchor": [
          0.0404,
          0.3587
        ],
        "width": 0.75,
        "height": 0.75,
        "pivot": [
          0.05382775119617225,
          0.4675876726886291
        ],
        "sway": 0.006,
        "bend": 0.003,
        "baseFade": 0
      }
    ],
    "previousReview": {
      "status": "passed",
      "average": 8.0125,
      "highCount": 7,
      "scores": {
        "风格还原": 8.5,
        "创意惊艳": 7.5,
        "动效工艺": 8.2,
        "设计排版": 8.1,
        "质感细节": 8.3,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "版画线条、靛蓝与朱红、纸张纹理统一；静态风格、创意和质感保留首轮评分，不因动态返修提升无关维度。",
        "最终版本已将原松枝从底图分离。默认与风/云180%多时刻观察中，松梢轮廓、低空云带和海面潮纹均有变化，松根贴合岩体、红日和岩石主体稳定。",
        "在本次页面尺寸下未见明显松枝撕裂、矩形贴片或粗糙遮罩；树、云、水的运动均克制且符合版画线条语言，动效从缺失必要表现的6.0复评为8.2。",
        "标题与顶栏对比改善，排版8.0→8.1；标题底板仍偏重，浪峰的复杂物理演化不是本版强项。",
        "本次多时刻样本不能证明所有周期连续性或连续60fps；旧版失败事实保留在previous报告。"
      ],
      "evidence": [
        "审核员亲自view_image查看原稿及public/layers/03-pine-clean.png、03-pine-layer.png，确认分离素材与版画风格匹配。",
        "Chrome真实页1431×628：13:01默认、13:04与13:06风/云180%样本；DOM确认控制值180，结束时恢复100%自然节奏并关闭独立审查标签。",
        "用户实听96秒audio-collection-audition.wav每款6秒后反馈“已听完，各段平顺舒适，无明显异常”（主agent转达）；此证据不等于本幅实时同步或长周期已验证。"
      ],
      "report": "reviews/03-ukiyoe-wave.md"
    },
    "motionReview": {
      "id": "03-ukiyoe-wave",
      "title": "松风潮汐",
      "status": "passed",
      "defaultObservation": "默认松枝、低云与潮纹均有清楚变化。",
      "maxObservation": "最大运动增强；首轮底边异常拉伸在本轮采样未再见。",
      "zeroControlObservation": "分别仅开松枝300、潮纹300、低云300，其余0：各控制对应区域运动/停止明确。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:52 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "04-pixel-rain",
    "title": "凌晨便利店",
    "subtitle": "AFTER HOURS",
    "style": "pixel",
    "category": "数字幻想",
    "image": "./layers/04-rain-clean.png",
    "palette": [
      "#171D35",
      "#425A81",
      "#F2B66E"
    ],
    "effects": [
      "rain",
      "neon"
    ],
    "description": "凌晨的街角便利店还亮着灯。细雨落进像素铺成的水洼，夜色缓慢流过屋檐。",
    "fit": "contain",
    "referenceId": "04-pixel-rain",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=2908791635",
    "popularityEvidence": "Steam作品页：231,272 当前订阅，13,421 收藏。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.4
    },
    "water": {
      "polygon": [
        [
          0,
          0.7
        ],
        [
          0.28,
          0.7
        ],
        [
          0.4,
          0.75
        ],
        [
          1,
          0.81
        ],
        [
          1,
          1
        ],
        [
          0,
          1
        ]
      ],
      "strength": 0.1
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8,
      "highCount": 7,
      "scores": {
        "风格还原": 8.5,
        "创意惊艳": 7.5,
        "动效工艺": 8,
        "设计排版": 8,
        "质感细节": 8.5,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "新版清洁底稿已消除不动粗雨条；像素雨语言与街道建筑、玻璃、金色水洼更加统一，风格/细节分别改善。",
        "多时刻雨条明确重新分布，地面有少量短促像素光点/水纹回应；没有原来一层静雨一层动雨的矛盾，达到基本精修动态8分。",
        "建筑/灯光几何稳定；雨层近远尺度仍偏均一，动效不评9。",
        "便利店夜雨题材的原创性仍保留7.5，不因工艺修复提升创意。"
      ],
      "evidence": [
        "亲自view_image查看新版public/layers/04-rain-clean.png，确认无烘焙雨条。",
        "Chrome真实页1431×628，12:33与12:35两时刻新版截图。",
        "用户全集实听pixel段平顺舒适；短段基础听感而非所有实时同步。"
      ],
      "report": "reviews/04-pixel-rain.md"
    },
    "motionReview": {
      "id": "04-pixel-rain",
      "title": "凌晨便利店",
      "status": "passed",
      "defaultObservation": "默认像素雨线持续落下，地面反光和店灯明暗可辨，建筑稳定。",
      "maxObservation": "最大雨线长度、倾角、亮度与雨幕强度显著增加，肉眼差异明确；所看时刻无明显破图。",
      "zeroControlObservation": "倾角0雨线垂直，300雨线明显倾斜；雨幕与溅水0后雨线/地面动态消失，店灯300仍有轻微暖光明暗；店灯0时雨幕保持运动而店面光稳定。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:52–13:53 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "05-lowpoly-islands",
    "title": "浮岛邮局",
    "subtitle": "THE FLOATING POST",
    "style": "lowpoly",
    "category": "数字幻想",
    "image": "./layers/05-clean.png",
    "palette": [
      "#B5E1DC",
      "#F0EEDC",
      "#65A28E"
    ],
    "effects": [
      "clouds"
    ],
    "description": "薄荷色天空里，三座几何岛屿由细桥相连。一封信正在风车旁等待出发。",
    "fit": "contain",
    "referenceId": "05-lowpoly-islands",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=1808443523",
    "popularityEvidence": "Steam作品页：224,122 当前订阅，11,944 收藏；标签Approved。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.4
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "foreground": [
      {
        "image": "./layers/05-rotor.png",
        "anchor": [
          0.67584,
          0.23911
        ],
        "width": 0.09569377990430622,
        "height": 0.17003188097768332,
        "pivot": [
          0.5,
          0.4944
        ],
        "rotationSpeed": 0.25,
        "sway": 0,
        "bend": 0,
        "baseFade": 0
      }
    ],
    "previousReview": {
      "status": "passed",
      "average": 8.075,
      "highCount": 8,
      "scores": {
        "风格还原": 8.6,
        "创意惊艳": 8,
        "动效工艺": 7.9,
        "设计排版": 8.1,
        "质感细节": 8.5,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "切面岛屿、树、桥与屋顶风车的几何语言一致，三岛逐层展开的空中小社会具有清楚记忆点。",
        "新版独立风车叶片两时刻角度不同，轮轴固定、建筑不形变；页面尺寸未见透明素材矩形或显著边缘杂色。",
        "原稿下方切面云层基本静止，动态最强证据集中在风车；后续可加强几何云层平移。",
        "明亮留白与空间构图完整，标题衬底略重但不遮核心风车与主岛。"
      ],
      "evidence": [
        "亲自view_image查看原图及05-clean.png、05-rotor.png新资产。",
        "Chrome1431×628，12:40与12:41实际两时刻截图，风车转角改变而轮轴固定。",
        "用户全集实听lowpoly段平顺舒适。"
      ],
      "report": "reviews/05-lowpoly-islands.md"
    },
    "motionReview": {
      "id": "05-lowpoly-islands",
      "title": "浮岛邮局",
      "status": "passed",
      "defaultObservation": "默认风车叶片转动和底部云团漂移可辨，岛屿和桥保持稳定。",
      "maxObservation": "补约0/0.5/1秒相位：默认叶片缓转，单独速度3×和单独转速300%均有更大角度推进，最大组合更快；避免了3秒端点接近整圈的混叠误判。",
      "zeroControlObservation": "风车0时叶片固定而云300可漂移；云0时云团固定而风车300转动。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:53 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "06-cyberpunk-city",
    "title": "雨港第七码头",
    "subtitle": "RAIN AT PIER SEVEN",
    "style": "cyberpunk",
    "category": "数字幻想",
    "image": "./wallpapers/06-cyberpunk-city.png",
    "palette": [
      "#09151f",
      "#294047",
      "#cb9b66"
    ],
    "effects": [
      "rain",
      "mist",
      "water",
      "neon"
    ],
    "description": "雨幕穿过高架港口，琥珀色驾驶室在深蓝工业轮廓之间亮着。",
    "fit": "contain",
    "referenceId": "06-cyberpunk-city",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=1747779570",
    "popularityEvidence": "Steam作品页：531,213 当前订阅，36,141 收藏。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.4
    },
    "styleLabel": "工业赛博朋克",
    "water": {
      "polygon": [
        [
          0,
          0.66
        ],
        [
          0.59,
          0.65
        ],
        [
          0.61,
          0.73
        ],
        [
          0.89,
          0.79
        ],
        [
          1,
          0.79
        ],
        [
          1,
          1
        ],
        [
          0,
          1
        ]
      ]
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8.0625,
      "highCount": 8,
      "scores": {
        "风格还原": 8.5,
        "创意惊艳": 8,
        "动效工艺": 7.7,
        "设计排版": 8.2,
        "质感细节": 8.6,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "工业赛博朋克声明已准确匹配画面；吊舱暖灯/深冷巨构/湿润金属形成鲜明情绪。",
        "两时刻可见细雨位置和水纹变化；建筑、吊机、码头轮廓稳固，未见贴片裂缝。",
        "雨雾偏均一前景叠加，近远雨粒尺度/遮挡、港口水面落雨回应仍可加强；未证明所有循环与连续平滑。",
        "画面具备较强尺度叙事和记忆点，但灯光、列车等潜在情绪事件未参与动态。",
        "界面在暗底可读；局部衬底热更新已撤回为更轻呈现，不计热更新为作品故障。"
      ],
      "evidence": [
        "审核员亲自view_image查看原稿。",
        "Chrome实际页1431×684，11:37与11:41多时刻截图。",
        "用户试听audio-audition.wav中8–16秒赛博雨段平顺舒适；共享gust联动由代码核查，未实听本幅实时交互全过程。"
      ],
      "report": "reviews/06-cyberpunk-city.md"
    },
    "motionReview": {
      "id": "06-cyberpunk-city",
      "title": "雨港第七码头",
      "status": "passed",
      "defaultObservation": "默认细雨、港面反光变化清楚，可辨港雾亮暗变化；建筑结构稳定。",
      "maxObservation": "最大雨幕更长更斜、更亮，港雾和反光变化明显增强；所看时刻建筑无明显撕裂。",
      "zeroControlObservation": "最终面板为雨幕倾角、雨幕与湿反光、港口薄雾，独立霓虹已移除。速度3×全部强度0约3秒静止；水300/雾0时雨幕、水纹及湿反光变化，雾不流动；水0/雾300时仅雾带移动，雨与水纹静止。倾角0垂直/300斜雨沿用前轮实看。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:53–13:54 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。",
        "最终补验2026-10-28 15:06–15:10 Asia/Shanghai，真实Chrome 1431×684；01月面隔离/最大，02默认布局，06/08/09全零与隔离300，12最终面板/默认；各动态状态约3秒截图实看，截图仅在本agent工具记录。"
      ],
      "resolvedIssues": [
        "独立霓虹控件效果过弱，待并入雨水组并复验最终启停。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "07-minimal-gradient",
    "title": "呼吸之环",
    "subtitle": "RINGS OF BREATH",
    "style": "minimal",
    "category": "极简空间",
    "image": "./wallpapers/07-minimal-gradient.png",
    "palette": [
      "#bc7656",
      "#e5c8af",
      "#ad9cad"
    ],
    "effects": [
      "glow"
    ],
    "description": "珊瑚色陶瓷环与两枚碎片，在杏色与雾紫色之间留下安静的空隙。",
    "fit": "contain",
    "referenceId": "07-minimal-gradient",
    "referenceUrl": "https://blogs.windows.com/windowsexperience/2021/10/06/windows-11-blossoms-with-bloom-a-new-symbol-for-a-new-operating-system/",
    "popularityEvidence": "微软官方2021年文章确认Bloom为Windows 11首次呈现的桌面壁纸及系统符号。依据为官方系统分发与标志性地位；没有可核实的单图下载数，不能称2026实时爆款。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0
    },
    "styleLabel": "极简陶瓷雕塑",
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8.025,
      "highCount": 7,
      "scores": {
        "风格还原": 8.6,
        "创意惊艳": 7.4,
        "动效工艺": 7.8,
        "设计排版": 8.1,
        "质感细节": 8.8,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "静态材质、创意与排版保持首轮评分，不因动态修复提升无关维度。",
        "新版局部柔光沿暖色曲面改变，环底和内壁在两个时刻明暗不同，背景基本稳定；比初版几乎全静态更可感知。",
        "形体与接地阴影位置保持稳定，没有软胶变形；高光未见刺眼硬点或突变，但局部光照/环境回应仍较简化，动效7.8。",
        "默认标题衬底略重，仍保留改善建议。"
      ],
      "evidence": [
        "原图已亲自view_image。",
        "Chrome1431×628，12:44及12:45新glow版本两时刻截图。",
        "用户全集6秒该段听感平顺舒适；实时/长期局限仍保留。"
      ],
      "report": "reviews/07-minimal-gradient.md"
    },
    "motionReview": {
      "id": "07-minimal-gradient",
      "title": "呼吸之环",
      "status": "passed",
      "defaultObservation": "默认3秒内高光由陶瓷环上部/侧部移向下部，光区位置变化清楚，主体轮廓稳定。",
      "maxObservation": "最大光区更亮、更强，3秒内亮斑从环右侧移向左上；所看时刻无明显破图。",
      "zeroControlObservation": "光影0约3秒陶瓷表面保持静止，300恢复局部亮区移动，轮廓稳定。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:54 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "08-surreal-monolith",
    "title": "寂静的重量",
    "subtitle": "THE WEIGHT OF SILENCE",
    "style": "surreal",
    "category": "数字幻想",
    "image": "./wallpapers/08-surreal-monolith.png",
    "palette": [
      "#b8795b",
      "#435258",
      "#d4c4b1"
    ],
    "effects": [
      "dust",
      "mist"
    ],
    "description": "巨大的玄武岩圆盘悬在盐盆上方，一间微小的屋子丈量着不可能的重量。",
    "fit": "contain",
    "referenceId": "08-surreal-monolith",
    "referenceUrl": "https://www.wallpaperengine.space/wallpaper/wake-up",
    "popularityEvidence": "独立索引Wallpaper Engine Space的Steam统计快照（2026-10-16）：2,095,740当前订阅、144,001收藏。此项使用第三方统计，不称实时官方数据。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.4
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "sandColumn": {
      "top": [
        0.735,
        0.3
      ],
      "bottom": [
        0.73,
        0.64
      ],
      "width": 0.055
    },
    "previousReview": {
      "status": "passed",
      "average": 8.1625,
      "highCount": 8,
      "scores": {
        "风格还原": 8.7,
        "创意惊艳": 8.7,
        "动效工艺": 7.7,
        "设计排版": 8.1,
        "质感细节": 8.6,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "巨型玄武岩盘、盐盆、小屋的尺度关系建立了明确可记忆的超现实意象，光影材质统一。",
        "新版沙柱内部色纹与空气尘点有轻变化，轮廓和悬盘刚体保持稳定；柱体外侧大片烟尘仍偏静，体积滚动不充分。",
        "没有发现透明边缘贴片/岩盘扭曲；近处荒地与远景尺度细节成熟。"
      ],
      "evidence": [
        "审核员亲自view_image看原稿。",
        "Chrome实际页面1431×628，11:55与11:57新版sandColumn两时刻。",
        "用户全集实听已覆盖本幅6秒音色，基础舒适性有实证，实时声画/长时未覆盖。",
        "12:46实际Chrome复看：标题已移至左上天空，小屋完整露出。设计排版7.6→8.1，其余分数不变。"
      ],
      "report": "reviews/08-surreal-monolith.md"
    },
    "motionReview": {
      "id": "08-surreal-monolith",
      "title": "寂静的重量",
      "status": "passed",
      "defaultObservation": "默认落沙柱内部下行短纹和明暗变化现已可辨。",
      "maxObservation": "最大落沙流纹显著加强，石体、房屋稳定。",
      "zeroControlObservation": "最终面板为落沙流速、薄雾与浮尘。速度3×两项0约3秒全画面静止；落沙0/雾尘300时沙柱流纹静止，薄雾和小浮尘移动。落沙300/雾0的下行流纹沿用前轮实看。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:54 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。",
        "最终补验2026-10-28 15:06–15:10 Asia/Shanghai，真实Chrome 1431×684；01月面隔离/最大，02默认布局，06/08/09全零与隔离300，12最终面板/默认；各动态状态约3秒截图实看，截图仅在本agent工具记录。"
      ],
      "resolvedIssues": [
        "实现审查发现散尘仍由未展示wind控制，父任务将归入cloud组；需最终全零复验。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "09-film-coast",
    "title": "盐蓝海岸",
    "subtitle": "SALT & BLUE",
    "style": "film",
    "category": "自然光影",
    "image": "./wallpapers/09-film-coast.png",
    "palette": [
      "#263238",
      "#7D9299",
      "#D4D9D6"
    ],
    "effects": [
      "water",
      "mist"
    ],
    "description": "盐灰色海湾、褪蓝浪线与远处灯塔，仿佛一帧被海风留下的胶片。",
    "fit": "contain",
    "referenceId": "09-film-coast",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=3341326865",
    "popularityEvidence": "Steam作品页：34,171 当前订阅，1,758 收藏。作者声明图源为Freepik且由AI生成，因此仅作为摄影感构图参考，不称实拍胶片作品。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.19
    },
    "styleLabel": "胶片摄影感",
    "water": {
      "polygon": [
        [
          0,
          0.27
        ],
        [
          0.44,
          0.27
        ],
        [
          0.5,
          0.31
        ],
        [
          0.52,
          0.34
        ],
        [
          0.6,
          0.37
        ],
        [
          0.68,
          0.41
        ],
        [
          0.73,
          0.46
        ],
        [
          0.77,
          0.5
        ],
        [
          0.73,
          0.54
        ],
        [
          0.69,
          0.59
        ],
        [
          0.66,
          0.65
        ],
        [
          0.67,
          0.71
        ],
        [
          0.7,
          0.75
        ],
        [
          0.65,
          0.79
        ],
        [
          0.6,
          0.85
        ],
        [
          0.53,
          0.9
        ],
        [
          0.46,
          0.96
        ],
        [
          0.31,
          1
        ],
        [
          0,
          1
        ]
      ],
      "protectWarm": true,
      "excludePolygons": [
        [
          [
            0.2,
            0.67
          ],
          [
            0.3,
            0.65
          ],
          [
            0.43,
            0.68
          ],
          [
            0.47,
            0.72
          ],
          [
            0.41,
            0.75
          ],
          [
            0.32,
            0.77
          ],
          [
            0.21,
            0.74
          ]
        ],
        [
          [
            0.44,
            0.83
          ],
          [
            0.5,
            0.82
          ],
          [
            0.56,
            0.86
          ],
          [
            0.53,
            0.91
          ],
          [
            0.45,
            0.9
          ]
        ],
        [
          [
            0.55,
            0.75
          ],
          [
            0.59,
            0.74
          ],
          [
            0.63,
            0.78
          ],
          [
            0.6,
            0.82
          ],
          [
            0.55,
            0.8
          ]
        ]
      ]
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8.0125,
      "highCount": 8,
      "scores": {
        "风格还原": 8.5,
        "创意惊艳": 7.6,
        "动效工艺": 7.8,
        "设计排版": 8,
        "质感细节": 8.7,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "静态摄影感/构图/材质维持初轮分数。",
        "新版海域长纹变化比高频抖动更符合海岸尺度，白色泡沫强弱和局部边线有推进变化；前景岩台、暖色悬崖保持稳定，没有明显被水拖动。",
        "大尺度拍岸浪仍主要来自原稿定格，不能等同完整流体重建；局部推进/消散改善足够，但动效保留7.8而非8以上。",
        "标题对比与灯塔构图保持可用，未见新接缝。"
      ],
      "evidence": [
        "原图已亲自view_image。",
        "Chrome1431×628，12:47与12:49新版长浪两时刻截图，重点检查岩台和近岸白水。",
        "人工全集film听感有效；完整循环、实时细致同步未覆盖。"
      ],
      "report": "reviews/09-film-coast.md"
    },
    "motionReview": {
      "id": "09-film-coast",
      "title": "盐蓝海岸",
      "status": "passed",
      "defaultObservation": "默认海浪与泡沫起伏可辨。",
      "maxObservation": "最大保留了摄影泡沫/水面纹理，首轮大片平涂斑块不再出现；增强较首轮温和但可见。",
      "zeroControlObservation": "最终面板仅海浪与泡沫、海雾流动；阵风已移除。速度3×两项0约3秒静止；水0/雾300时岸壁与远海雾带移动而泡沫形状稳定；水300/雾0时海浪泡沫推进，雾不再移动。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:54–13:55 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。",
        "最终补验2026-10-28 15:06–15:10 Asia/Shanghai，真实Chrome 1431×684；01月面隔离/最大，02默认布局，06/08/09全零与隔离300，12最终面板/默认；各动态状态约3秒截图实看，截图仅在本agent工具记录。"
      ],
      "resolvedIssues": [
        "需要新增海雾流动控制并验证0档，移除间接阵风控制。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "10-deep-space",
    "title": "蓝色寂静",
    "subtitle": "THE BLUE SILENCE",
    "style": "space",
    "category": "自然光影",
    "image": "./wallpapers/10-deep-space.png",
    "palette": [
      "#071426",
      "#18558B",
      "#94DBE2"
    ],
    "effects": [
      "stars"
    ],
    "description": "银青色星云在蓝黑暗区中弯折，极少量铜色尘埃为宇宙标记尺度。",
    "fit": "contain",
    "referenceId": "10-deep-space",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=1449131353",
    "popularityEvidence": "Steam作品页：394,703 当前订阅，16,885 收藏；作者说明是图像加小幅运动效果。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.4
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8.0875,
      "highCount": 8,
      "scores": {
        "风格还原": 8.6,
        "创意惊艳": 7.8,
        "动效工艺": 7.8,
        "设计排版": 8.2,
        "质感细节": 8.8,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "弧形星云以右上明亮星核和左上暗腔形成良好负空间；尘带、细星与色温层次丰富。",
        "多时刻亮星/细星强弱有轻微变化，位置稳定，没有无关漂浮大粒子和星云液化；与安静深空的艺术节奏相符。",
        "动态表达以微弱闪烁为主，缺少更有辨识度的局部气体层次，但不强制太空场景加入水/树/云运动。",
        "深空题材熟悉，弧线构图成熟而非标杆级原创；界面可读。"
      ],
      "evidence": [
        "亲自view_image看原图。",
        "Chrome实际页1431×628，11:59与12:02两时刻；观察亮点与暗腔位置。",
        "全集人工试听覆盖space音色，只声称短段平顺舒适，不声称物理真实太空声音。"
      ],
      "report": "reviews/10-deep-space.md"
    },
    "motionReview": {
      "id": "10-deep-space",
      "title": "蓝色寂静",
      "status": "passed",
      "defaultObservation": "默认星云主轮廓在3秒内有清楚漂流弯折，较首轮实质改善。",
      "maxObservation": "最大星云运动更明显，亮核保持干净圆形，未再见首轮小矩形亮块。",
      "zeroControlObservation": "星云0/星点300：星云轮廓固定且亮星明暗变化；星云300/星点0：星云明显移动而星点不再独立明灭。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:55 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "11-underwater-blue",
    "title": "浅海回声",
    "subtitle": "SHALLOW ECHOES",
    "style": "underwater",
    "category": "自然光影",
    "image": "./wallpapers/11-underwater-blue.png",
    "palette": [
      "#052F51",
      "#137FA1",
      "#81D8D4"
    ],
    "effects": [
      "caustics",
      "bubbles"
    ],
    "description": "穿过青蓝色海洞，光束落在细沙上，远处的鱼群与海草沉入寂静，微粒缓缓上浮。",
    "fit": "contain",
    "referenceId": "11-underwater-blue",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=1424044565",
    "popularityEvidence": "Steam作品页：84,944 当前订阅，3,425 收藏；标签Approved。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.4
    },
    "water": {
      "polygon": [
        [
          0.4,
          0.24
        ],
        [
          0.79,
          0.22
        ],
        [
          0.89,
          0.31
        ],
        [
          0.84,
          0.41
        ],
        [
          0.7,
          0.47
        ],
        [
          0.66,
          0.65
        ],
        [
          0.49,
          0.66
        ],
        [
          0.4,
          0.54
        ]
      ],
      "strength": 0.3
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8.0375,
      "highCount": 8,
      "scores": {
        "风格还原": 8.6,
        "创意惊艳": 7.6,
        "动效工艺": 7.8,
        "设计排版": 8.2,
        "质感细节": 8.6,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "原稿视觉风格、构图和材质分数维持首轮。",
        "新版扇形光束在水体内呈局部强弱变化，与海床焦散明暗呼应；两时刻气泡仍有位置变化，岩壁/海草几何稳定。",
        "鱼群与海草仍为静态，文案现已如实描述为沉入寂静，不再宣称小鱼游过。",
        "动态通过光和水体建立更完整的节奏，仍缺独立生命运动，动效保守7.8；并非完整水下物理模拟。"
      ],
      "evidence": [
        "亲自view_image看原稿。",
        "Chrome1431×628，12:50与12:52新光影版本两时刻，DOM确认文案修正。",
        "用户24秒与96秒样本均覆盖水下并反馈平顺舒适，长时/实时精确同步未覆盖。"
      ],
      "report": "reviews/11-underwater-blue.md"
    },
    "motionReview": {
      "id": "11-underwater-blue",
      "title": "浅海回声",
      "status": "passed",
      "defaultObservation": "默认气泡上浮与扇形水光横移明确，海洞和海草主体轮廓稳定。",
      "maxObservation": "最大水光区域、焦散和气泡明显增强，强光扫过范围显著变化；所看时刻无主体撕裂。",
      "zeroControlObservation": "气泡水纹0/焦散300时气泡位置不变、光束移动；水纹300/焦散0时气泡上浮、原始水光稳定。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:55–13:56 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "12-aurora-lake",
    "title": "极夜信号",
    "subtitle": "POLAR SIGNAL",
    "style": "aurora",
    "category": "自然光影",
    "image": "./wallpapers/12-aurora-lake.png",
    "palette": [
      "#071B2D",
      "#41BD9B",
      "#A694CC"
    ],
    "effects": [
      "aurora",
      "stars",
      "water"
    ],
    "description": "极光垂落在寂静的湖面，岸边一盏观测站的暖灯，回应漫长的极夜。",
    "fit": "contain",
    "referenceId": "12-aurora-lake",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=1275921440",
    "popularityEvidence": "Steam作品页：1,981,102 当前订阅，91,253 收藏，19,418条评分；标签Approved。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.46
    },
    "water": {
      "polygon": [
        [
          0.41,
          0.66
        ],
        [
          1,
          0.66
        ],
        [
          1,
          1
        ],
        [
          0.4,
          1
        ],
        [
          0.3,
          0.9
        ],
        [
          0.19,
          0.82
        ],
        [
          0.13,
          0.76
        ],
        [
          0.24,
          0.71
        ]
      ]
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8.025,
      "highCount": 8,
      "scores": {
        "风格还原": 8.4,
        "创意惊艳": 7.6,
        "动效工艺": 7.8,
        "设计排版": 8.2,
        "质感细节": 8.7,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "冷极夜与小观测站暖灯形成明确对比；极光、湖光、山体层次精致。",
        "多时刻可辨天空低幅光带变化和湖面反光细纹；岸线、山体和小屋保持稳定。",
        "叠加动态光带与原稿垂落光幕的方向/层次仍可更统一，原稿主光幕变化不明显；已有动态轻而不刺眼。",
        "典型极光湖题材成熟，独特性主要在暖观测站的尺度点，未达到卓越原创。"
      ],
      "evidence": [
        "亲自view_image查看原稿。",
        "Chrome实际页1431×628，12:09与12:10两时刻截图。",
        "全集人工听感覆盖aurora声景，短段平顺舒适，未声称长循环通过。"
      ],
      "report": "reviews/12-aurora-lake.md"
    },
    "motionReview": {
      "id": "12-aurora-lake",
      "title": "极夜信号",
      "status": "passed",
      "defaultObservation": "默认紫色光带位移和湖面反光变化可辨，绿色主极光相对克制，山岸稳定。",
      "maxObservation": "最大绿紫光带横跨天空移动，亮度与位移明显增强，湖纹更明显。",
      "zeroControlObservation": "前轮全零静止，湖面光纹300时湖纹起伏，归零停止；极光与星点0无叠加光带；亮度300且帘波动0时紫光带位置固定，帘波动300后紫绿光带推进。最终面板已移除阵风，仅保留湖面光纹、极光帘波动、极光与星点。默认1×再次采样，紫色光带及湖面反光仍可辨。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:56 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。",
        "最终补验2026-10-28 15:06–15:10 Asia/Shanghai，真实Chrome 1431×684；01月面隔离/最大，02默认布局，06/08/09全零与隔离300，12最终面板/默认；各动态状态约3秒截图实看，截图仅在本agent工具记录。"
      ],
      "resolvedIssues": [
        "待移除间接阵风滑杆并核对最终面板。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "13-desert-dunes",
    "title": "琥珀呼吸",
    "subtitle": "AMBER BREATH",
    "style": "desert",
    "category": "自然光影",
    "image": "./wallpapers/13-desert-dunes.png",
    "palette": [
      "#C58B56",
      "#E7C697",
      "#5C7290"
    ],
    "effects": [
      "heat",
      "dust"
    ],
    "description": "粉金色沙脊向远处延伸，冷蓝阴影在弧线之间呼吸，清晨还没有脚印。",
    "fit": "contain",
    "referenceId": "13-desert-dunes",
    "referenceUrl": "https://www.apple.com/ca/newsroom/2018/09/macos-mojave-is-available-today/",
    "popularityEvidence": "Apple官方2018年发布文确认系统Dynamic Desktop使用Mojave沙丘，并随本地时间从晨光过渡到夜晚。依据为系统内置代表作；无单图下载统计，不称实时榜单爆款。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0.24
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8,
      "highCount": 7,
      "scores": {
        "风格还原": 8.5,
        "创意惊艳": 7.4,
        "动效工艺": 7.8,
        "设计排版": 8.1,
        "质感细节": 8.7,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "新版天空不再出现全幅漂浮白点，细尘限制在沙脊附近，沙漠材质和运动语言比首轮统一，风格8.3→8.5。",
        "两时刻沙脊附近薄尘/短纹有微弱变化，主体沙丘边界和沙纹不液化；低矮掠沙比通用漂点更符合场景。",
        "动效仍很克制、尺度层次有限，保守7.8，不把它说成大风沙模拟；无需为无水场景强加水波。",
        "构图、细节与原创性维持原评分，系统沙丘题材仍较熟悉。"
      ],
      "evidence": [
        "原图已亲自view_image。",
        "Chrome1431×628，12:53与12:55新版desert两时刻截图，直接检查天空白点已去除及沙脊薄尘。",
        "人工全集对应desert听感覆盖，实时/长期限制保留。"
      ],
      "report": "reviews/13-desert-dunes.md"
    },
    "motionReview": {
      "id": "13-desert-dunes",
      "title": "琥珀呼吸",
      "status": "passed",
      "defaultObservation": "默认已有沿沙脊的宽尘带与近景薄沙变化，3秒可辨。",
      "maxObservation": "最大薄沙条带更宽更明显，山脊本体稳定。",
      "zeroControlObservation": "掠沙0时整个沙丘画面静止，300恢复贴脊薄沙推进。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:56–13:57 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "14-papercut-forest",
    "title": "纸间森林",
    "subtitle": "FOREST BETWEEN PAGES",
    "style": "papercut",
    "category": "绘画艺术",
    "image": "./wallpapers/14-papercut-forest.png",
    "palette": [
      "#236D6F",
      "#E9E0CB",
      "#CF744F"
    ],
    "effects": [
      "paper"
    ],
    "description": "苔绿与奶油白的厚纸层层相叠，一条小径通向林间的暖色月轮。",
    "fit": "contain",
    "referenceId": "14-papercut-forest",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=3003287638",
    "popularityEvidence": "Steam作品页：17,029 当前订阅，1,047 收藏。属于有一定受众的细分风格参考，证据不足以称全平台火爆。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8.0625,
      "highCount": 7,
      "scores": {
        "风格还原": 8.8,
        "创意惊艳": 8.1,
        "动效工艺": 7.1,
        "设计排版": 8.1,
        "质感细节": 8.9,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "厚纸断面、层叠树干/蕨叶、纸纤维和浅景深可信；暖圆月/小径引导强化了手工剧场的独特材质表达。",
        "两时刻整体照明仅轻微变化，纸层形体稳定；这是纸雕而非真实树林，不强制将每棵树吹动。",
        "动效仍缺层间光影的可见推进；建议极克制的分层灯光扫过，利用纸边投影加强空间，避免全图液化。",
        "亮底文字对比已处理，深衬底稍重但核心路径/月轮保持完整。"
      ],
      "evidence": [
        "亲自view_image看原稿。",
        "Chrome真实页面1431×628，12:14与12:16两时刻截图。",
        "全集人类试听覆盖papercut，短段舒适性有证据；实时/长时未覆盖。"
      ],
      "report": "reviews/14-papercut-forest.md"
    },
    "motionReview": {
      "id": "14-papercut-forest",
      "title": "纸间森林",
      "status": "passed",
      "defaultObservation": "默认宽光束从左中扫向右侧纸层，局部明暗与层间阴影改变明显，主体位置稳定。",
      "maxObservation": "最大光束更亮、明暗对照更强，3秒内从中央亮区移动到左侧树干，所看时刻无明显撕裂。",
      "zeroControlObservation": "流动光影0时纸层明暗保持固定，300后宽光束从中心扫向左侧树层，主体保持稳定。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:57–13:58 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "15-dream-garden",
    "title": "月下温室",
    "subtitle": "THE MOONLIT CONSERVATORY",
    "style": "garden",
    "category": "数字幻想",
    "image": "./wallpapers/15-dream-garden.png",
    "palette": [
      "#082D39",
      "#2E7476",
      "#A7E4D0"
    ],
    "effects": [
      "fireflies",
      "petals"
    ],
    "description": "月光穿过玻璃温室，白色铃兰挂着细露，萤火在花间留下短暂的光。",
    "fit": "contain",
    "referenceId": "15-dream-garden",
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=943626696",
    "popularityEvidence": "Steam作品页：43,695 当前订阅，2,796 收藏。WES将其索引为Glowing Fantasy Flower Garden。",
    "review": {
      "status": "recheck",
      "note": "动效增强版正在重新验证，上一版评分不代表本版动效已通过。"
    },
    "sky": {
      "bottom": 0
    },
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "previousReview": {
      "status": "passed",
      "average": 8.05,
      "highCount": 7,
      "scores": {
        "风格还原": 8.6,
        "创意惊艳": 8.2,
        "动效工艺": 7.1,
        "设计排版": 8.2,
        "质感细节": 8.8,
        "声音同步": 7.8,
        "技术规格": 8,
        "商用完成度": 7.7
      },
      "issues": [
        "铃兰特写、湿润叶面、温室金属拱顶与远门/月光形成辨识度较强的封闭梦境，细节成熟。",
        "两时刻可见细微漂浮光点/花屑变化，但原稿最亮的数个萤火点固定，花叶仍静止；动画贡献小于静态底稿。",
        "建议分离主要萤火，形成近远有遮挡的短暂点亮与熄灭；避免仅增加全幅粒子数量。",
        "植物与水滴材质清楚、构图主次合理；暗底白字可读，未遮挡主要铃兰花簇。"
      ],
      "evidence": [
        "审核员亲自view_image查看原稿。",
        "Chrome真实页1431×628，12:16与12:18两时刻截图；原稿亮点与动态微小点分别观察。",
        "全集人工实听覆盖garden段，基础平顺舒适，实时同步/长期疲劳未验证。"
      ],
      "report": "reviews/15-dream-garden.md"
    },
    "motionReview": {
      "id": "15-dream-garden",
      "title": "月下温室",
      "status": "passed",
      "defaultObservation": "默认花叶摆动与萤火轨迹可辨，首轮白花双轮廓/透明残影本轮未再出现。",
      "maxObservation": "最大花叶摆幅增强，轮廓连续，未见首轮重影撕开。",
      "zeroControlObservation": "花叶轨迹0后花叶停止，光效可独立保留；光效0时花叶继续摆动；全零画面稳定。暂停3秒保持静止、显式点击播放恢复摆动。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:58 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "默认与全部有效强度300%/速度3×分别采样约3秒，实际截图逐幅肉眼对照；未用数值变化代替视觉。",
        "截图显示于本次agent工具记录，尚未另存图片文件。",
        "第二轮2026-10-28约14:08–15:02 Asia/Shanghai，真实Chrome逐项设置并约3秒多时刻截图实看；截图仅在本agent工具记录，未另存图片文件。",
        "共享暂停/恢复在00及15抽查；逐场有效强度启停观察见zeroControlObservation。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "本轮已对默认运动、最大档差异、对应控制停止与画面完整性进行专项复验。"
    }
  },
  {
    "id": "16-neon-drift",
    "title": "霓虹夜航",
    "subtitle": "NEON DRIFT · DENSE CITY",
    "style": "webgl3d",
    "styleLabel": "交互式三维都市",
    "category": "交互三维",
    "kind": "embedded",
    "src": "./experiences/neon-drift-3d.html?embed=1",
    "image": "./wallpapers/neon-drift-preview.png",
    "palette": [
      "#090f1e",
      "#7cf7e3",
      "#ff6b9b"
    ],
    "description": "驾驶浮空车穿越霓虹楼群。拖动环视、滚轮缩放，切换雨幕与车体特写，在城市上空自由夜航。",
    "credit": "用户提供的 NEON DRIFT 独立 WebGL 作品",
    "review": {
      "status": "pending",
      "note": "用户提供的交互作品；保留原有控制，独立验证接入与运行。"
    },
    "motionReview": {
      "id": "16-neon-drift",
      "title": "霓虹夜航",
      "status": "passed",
      "defaultObservation": "打开独立3D iframe后3秒城市与车辆相对位置明显推进；返回后再次打开仍从初始航程正常运动。",
      "maxObservation": "N/A：第17项本轮硬门槛为独立3D可动及生命周期；未测航速最大差异。",
      "zeroControlObservation": "暂停后3秒画面保持不变且航程维持1.05KM；点击继续后城市重新推进、航程增至1.20KM。返回两次均通过DOM只读确认iframe数量为0。",
      "issues": [],
      "evidence": [
        "2026-10-28 13:58–13:59 Asia/Shanghai，CUA真实Chrome，localhost:5173。",
        "CUA实际打开、暂停、继续、返回、再次打开；画面多时刻实看与返回后iframe DOM计数相互印证。",
        "截图显示于本次agent工具记录，尚未另存图片文件。"
      ],
      "round": "2026-10-28-motion-final-targeted-pass",
      "note": "独立三维播放、暂停恢复、退出卸载及再次打开已实看验证。"
    },
    "embedControls": [
      {
        "key": "rain",
        "label": "雨幕",
        "type": "toggle",
        "default": true
      },
      {
        "key": "closeup",
        "label": "车体特写",
        "type": "toggle",
        "default": false
      },
      {
        "key": "hud",
        "label": "飞行信息",
        "type": "toggle",
        "default": false
      },
      {
        "key": "reset",
        "label": "复位视角",
        "type": "button"
      }
    ]
  },
  {
    "id": "17-electric-idol",
    "title": "电光心跳",
    "subtitle": "ELECTRIC HEARTBEAT",
    "style": "character-art",
    "styleLabel": "鲜彩动漫 · 电音偶像",
    "category": "动漫人物",
    "kind": "embedded",
    "isNew": true,
    "src": "./experiences/art-motion.html?art=17-electric-idol&embed=1",
    "image": "./wallpapers/17-electric-idol.png",
    "palette": [
      "#ddff21",
      "#00dcf4",
      "#f52e9d"
    ],
    "description": "荧光色与耳机节拍交汇，光环、频谱和色彩碎片一起跃动。",
    "credit": "AI生成原创艺术 · 定制程序动效",
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "review": {
      "status": "pending",
      "note": "新作独立动效复验中。"
    },
    "motionReview": {
      "status": "passed",
      "evidence": [
        "耳机青色光脉冲、左侧彩环旋转、浮点和下方频谱变化；3档更亮更快。 默认及最大3×/3均观察到变化；暂停跨时刻静止、恢复、沉浸进入退出、返回作品集均通过。"
      ],
      "report": "reviews/character-review.md",
      "note": "仅动效与交互复验，不代表艺术入围评分通过。"
    },
    "artReview": {
      "scores": {
        "风格还原": 8.2,
        "创意惊艳": 7.5,
        "动效工艺": 7.4,
        "设计排版": 8,
        "质感细节": 8,
        "声音同步": 5,
        "技术规格": 7.2,
        "商用完成度": 7
      },
      "average": 7.2875,
      "highCount": 3,
      "status": "revision",
      "report": "reviews/character-review.md"
    }
  },
  {
    "id": "18-solar-mecha",
    "title": "日冕机甲",
    "subtitle": "SOLAR TITAN",
    "style": "character-art",
    "styleLabel": "硬表面科幻 · 橙蓝机甲",
    "category": "未来机械",
    "kind": "embedded",
    "isNew": true,
    "src": "./experiences/art-motion.html?art=18-solar-mecha&embed=1",
    "image": "./wallpapers/18-solar-mecha.png",
    "palette": [
      "#ff742a",
      "#183c8b",
      "#74f6f4"
    ],
    "description": "橙蓝装甲中的能量核心持续呼吸，扫描光与推进火花掠过工业宇宙。",
    "credit": "AI生成原创艺术 · 定制程序动效",
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "review": {
      "status": "pending",
      "note": "新作独立动效复验中。"
    },
    "motionReview": {
      "status": "passed",
      "evidence": [
        "胸部反应堆光变化，蓝色扫描线不同高度移动，HUD与微粒增强；机体硬表面未拉扯。 默认及最大3×/3均观察到变化；暂停跨时刻静止、恢复、沉浸进入退出、返回作品集均通过。"
      ],
      "report": "reviews/character-review.md",
      "note": "仅动效与交互复验，不代表艺术入围评分通过。"
    },
    "artReview": {
      "scores": {
        "风格还原": 8.1,
        "创意惊艳": 7.4,
        "动效工艺": 7.2,
        "设计排版": 8,
        "质感细节": 8.2,
        "声音同步": 5,
        "技术规格": 7.2,
        "商用完成度": 7
      },
      "average": 7.2625,
      "highCount": 3,
      "status": "revision",
      "report": "reviews/character-review.md"
    }
  },
  {
    "id": "19-moon-witch",
    "title": "月相魔女",
    "subtitle": "LUNAR ARCANUM",
    "style": "character-art",
    "styleLabel": "华丽动漫 · 魔法幻想",
    "category": "动漫人物",
    "kind": "embedded",
    "isNew": true,
    "src": "./experiences/art-motion.html?art=19-moon-witch&embed=1",
    "image": "./wallpapers/19-moon-witch.png",
    "palette": [
      "#9c61ed",
      "#eac77b",
      "#9be9ff"
    ],
    "description": "银发魔女与悬浮纸牌，旋转法阵和星尘编织月光中的咒语。",
    "credit": "AI生成原创艺术 · 定制程序动效",
    "dimensions": {
      "width": 1659,
      "height": 948
    },
    "review": {
      "status": "pending",
      "note": "新作独立动效复验中。"
    },
    "motionReview": {
      "status": "passed",
      "evidence": [
        "星点位置及亮度变化、法阵环转动，发丝及衣饰有细微局部变化；脸部保持稳定。 默认及最大3×/3均观察到变化；暂停跨时刻静止、恢复、沉浸进入退出、返回作品集均通过。"
      ],
      "report": "reviews/character-review.md",
      "note": "仅动效与交互复验，不代表艺术入围评分通过。"
    },
    "artReview": {
      "scores": {
        "风格还原": 8.2,
        "创意惊艳": 7.5,
        "动效工艺": 7.6,
        "设计排版": 8,
        "质感细节": 8.2,
        "声音同步": 5,
        "技术规格": 7.2,
        "商用完成度": 7
      },
      "average": 7.3375,
      "highCount": 4,
      "status": "revision",
      "report": "reviews/character-review.md"
    }
  },
  {
    "id": "20-pop-skater",
    "title": "超频街头",
    "subtitle": "POP OVERDRIVE",
    "style": "character-art",
    "styleLabel": "丝网波普 · 滑板潮流",
    "category": "潮流图形",
    "kind": "embedded",
    "isNew": true,
    "src": "./experiences/art-motion.html?art=20-pop-skater&embed=1",
    "image": "./wallpapers/20-pop-skater.png",
    "palette": [
      "#f63727",
      "#2143b5",
      "#f6db25"
    ],
    "description": "鲜红、钴蓝与柠檬黄的街头切面，速度线和跳跃图形冲出画框。",
    "credit": "AI生成原创艺术 · 定制程序动效",
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "review": {
      "status": "pending",
      "note": "新作独立动效复验中。"
    },
    "motionReview": {
      "status": "passed",
      "evidence": [
        "三角与方形转动，彩色速度线连续改变位置；3档更密更亮更快。 默认及最大3×/3均观察到变化；暂停跨时刻静止、恢复、沉浸进入退出、返回作品集均通过。"
      ],
      "report": "reviews/character-review.md",
      "note": "仅动效与交互复验，不代表艺术入围评分通过。"
    },
    "artReview": {
      "scores": {
        "风格还原": 8.3,
        "创意惊艳": 7.7,
        "动效工艺": 7.3,
        "设计排版": 8,
        "质感细节": 8,
        "声音同步": 5,
        "技术规格": 7.2,
        "商用完成度": 7
      },
      "average": 7.3125,
      "highCount": 4,
      "status": "revision",
      "report": "reviews/character-review.md"
    }
  },
  {
    "id": "21-jelly-dream",
    "title": "琉璃浮梦",
    "subtitle": "CHROMATIC DRIFT",
    "style": "character-art",
    "styleLabel": "超现实三维 · 珠光水母",
    "category": "超现实艺术",
    "kind": "embedded",
    "isNew": true,
    "src": "./experiences/art-motion.html?art=21-jelly-dream&embed=1",
    "image": "./wallpapers/21-jelly-dream.png",
    "palette": [
      "#fd93c7",
      "#7fe7e5",
      "#ac86f1"
    ],
    "description": "透明水母与悬浮珠宝，气泡、折射光和梦幻色彩在深空中升腾。",
    "credit": "AI生成原创艺术 · 定制程序动效",
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "review": {
      "status": "pending",
      "note": "新作独立动效复验中。"
    },
    "motionReview": {
      "status": "passed",
      "evidence": [
        "修复后立即显示，气泡位置与流线相位变化，触须局部起伏；0档原画无新增气泡流线，3档显著增强。 默认及最大3×/3均观察到变化；暂停跨时刻静止、恢复、沉浸进入退出、返回作品集均通过。"
      ],
      "report": "reviews/character-review.md",
      "note": "仅动效与交互复验，不代表艺术入围评分通过。"
    },
    "artReview": {
      "scores": {
        "风格还原": 8.4,
        "创意惊艳": 7.8,
        "动效工艺": 7.8,
        "设计排版": 8,
        "质感细节": 8.3,
        "声音同步": 5,
        "技术规格": 7.2,
        "商用完成度": 7
      },
      "average": 7.4375,
      "highCount": 5,
      "status": "revision",
      "report": "reviews/character-review.md"
    }
  },
  {
    "id": "22-crimson-swordswoman",
    "title": "绯月剑歌",
    "subtitle": "CRIMSON REQUIEM",
    "style": "character-art",
    "styleLabel": "和风动漫 · 红月剑士",
    "category": "动漫人物",
    "kind": "embedded",
    "isNew": true,
    "src": "./experiences/art-motion.html?art=22-crimson-swordswoman&embed=1",
    "image": "./wallpapers/22-crimson-swordswoman.png",
    "palette": [
      "#ca302b",
      "#161b24",
      "#d9b66b"
    ],
    "description": "红月之下，女剑士的金色刀光与风中银杏构成一首鲜明的夜之歌。",
    "credit": "AI生成原创艺术 · 定制程序动效",
    "dimensions": {
      "width": 1672,
      "height": 941
    },
    "review": {
      "status": "pending",
      "note": "新作独立动效复验中。"
    },
    "motionReview": {
      "status": "passed",
      "evidence": [
        "修复后正常加载，金色碎叶跨时刻飞移、衣发局部缓动；0档去掉动态碎叶，3档增强；脸部与手部未见明显变形。 默认及最大3×/3均观察到变化；暂停跨时刻静止、恢复、沉浸进入退出、返回作品集均通过。"
      ],
      "report": "reviews/character-review.md",
      "note": "仅动效与交互复验，不代表艺术入围评分通过。"
    },
    "artReview": {
      "scores": {
        "风格还原": 8.3,
        "创意惊艳": 7.7,
        "动效工艺": 7.7,
        "设计排版": 8,
        "质感细节": 8.3,
        "声音同步": 5,
        "技术规格": 7.2,
        "商用完成度": 7
      },
      "average": 7.4,
      "highCount": 5,
      "status": "revision",
      "report": "reviews/character-review.md"
    }
  },
  {
    "id": "23-midnight-overdrive",
    "title": "午夜超驰",
    "subtitle": "MIDNIGHT OVERDRIVE",
    "style": "realtime3d",
    "styleLabel": "霓虹公路 · 实时追车",
    "category": "实时三维",
    "kind": "embedded",
    "isNew": true,
    "featured": true,
    "src": "./experiences/midnight-overdrive.html?embed=1",
    "image": "./wallpapers/23-midnight-overdrive-preview.png",
    "palette": [
      "#14172e",
      "#f2488f",
      "#67eaff"
    ],
    "description": "追随跑车驶过雨夜高架，街灯、车流与霓虹楼群在近处飞掠。",
    "credit": "原创程序化三维场景 · Three.js 实时渲染",
    "resolution": "实时渲染 · 自适应视口",
    "embedControls": [
      {
        "key": "reset",
        "label": "复位镜头",
        "type": "button"
      }
    ],
    "motionReview": {
      "status": "passed",
      "note": "独立桌面浏览器动效与交互复验；非获奖或全设备性能认证。",
      "evidence": [
        "真实Chrome多时刻可见道路弯曲、车流与楼群推进，3倍速度增强；暂停跨时刻截图一致，强度0视觉冻结；设置、隐藏恢复、实际截帧通过。第二轮跑车轮廓、玻璃和道路湿反光升级后再次实看并复测暂停。"
      ],
      "report": "reviews/unified-motion-review.md"
    },
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=2911967662",
    "referenceNote": "研究参考仅用于动态设计原则，具体证据与原创推导见research/steam-motion-2026-10-28.md。"
  },
  {
    "id": "24-orbital-voyage",
    "title": "星环远征",
    "subtitle": "ORBITAL VOYAGE",
    "style": "realtime3d",
    "styleLabel": "深空航行 · 轨道巨构",
    "category": "实时三维",
    "kind": "embedded",
    "isNew": true,
    "featured": false,
    "src": "./experiences/orbital-voyage.html?embed=1",
    "image": "./wallpapers/24-orbital-voyage-preview.png",
    "palette": [
      "#10213f",
      "#8bbdf5",
      "#f4b478"
    ],
    "description": "驾驶探索飞船穿越空间站与巨型轨道环，在行星和星云之间不断前行。",
    "credit": "原创程序化三维场景 · Three.js 实时渲染",
    "resolution": "实时渲染 · 自适应视口",
    "embedControls": [
      {
        "key": "reset",
        "label": "复位镜头",
        "type": "button"
      }
    ],
    "motionReview": {
      "status": "passed",
      "note": "独立桌面浏览器动效与交互复验；非获奖或全设备性能认证。",
      "evidence": [
        "真实Chrome可见巨环从远处扩大并穿过视野，空间站与飞船位置变化；暂停及强度0跨时刻截图一致，截帧通过。第二轮星云和厚重环门已实际查看。"
      ],
      "report": "reviews/unified-motion-review.md"
    },
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=2348914357",
    "referenceNote": "研究参考仅用于动态设计原则，具体证据与原创推导见research/steam-motion-2026-10-28.md。"
  },
  {
    "id": "25-prism-corridor",
    "title": "棱镜回廊",
    "subtitle": "PRISM CORRIDOR",
    "style": "realtime3d",
    "styleLabel": "动能雕塑 · 几何穿行",
    "category": "实时三维",
    "kind": "embedded",
    "isNew": true,
    "featured": false,
    "src": "./experiences/prism-corridor.html?embed=1",
    "image": "./wallpapers/25-prism-corridor-preview.png",
    "palette": [
      "#151225",
      "#9d6aff",
      "#80ede6"
    ],
    "description": "穿过旋转的实体光环与镀铬机械构件，在彩色光影和层叠空间中持续深入。",
    "credit": "原创程序化三维场景 · Three.js 实时渲染",
    "resolution": "实时渲染 · 自适应视口",
    "embedControls": [
      {
        "key": "reset",
        "label": "复位镜头",
        "type": "button"
      }
    ],
    "motionReview": {
      "status": "passed",
      "note": "独立桌面浏览器动效与交互复验；非获奖或全设备性能认证。",
      "evidence": [
        "真实Chrome默认与最大速度均见纵深穿越与实体环旋转，暂停及强度0跨时刻截图一致。第二轮彩色光条和多形态层级实际可见，截帧通过。"
      ],
      "report": "reviews/unified-motion-review.md"
    },
    "referenceUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=1962488668",
    "referenceNote": "研究参考仅用于动态设计原则，具体证据与原创推导见research/steam-motion-2026-10-28.md。"
  }
];
export default scenes;
