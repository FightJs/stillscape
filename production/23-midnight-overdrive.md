# 午夜超驰 / Midnight Overdrive

独立原创实时 THREE.js 场景：`public/experiences/midnight-overdrive.html`。本地依赖 `/vendor/three.min.js` 与统一宿主桥 `wallpaper-bridge.js`，无联网资源。

实体追尾视角跑车包含金属车体、车顶、倾斜前挡风玻璃、车窗、后视镜、尾翼、四轮轮毂、贯穿式尾灯、排气与底盘灯。三车道雨夜高架使用随时间连续变化的道路曲线；实体楼群、护栏、灯杆、霓虹标牌与跨路门架产生分层视差，九辆交通车辆不断被超越。道路高光采用半透明程序纹理条带，雨线为动态线段，所有窗口与招牌均在 Canvas 中生成。

InstancedMesh 批量处理楼群、灯杆、反射、路标与护栏；像素比上限 1.6，ACES 色调映射及距离雾。普通与窄屏采用不同跟随镜头距离；embed=1 完全隐藏装饰 UI。

宿主协议：setPlaying、setSettings（speed .25–3、power 0–3）、reset、snapshot、getState。暂停完全冻结模拟，power=0 停止 RAF，隐藏页面停止 RAF，恢复时重置帧时钟。preserveDrawingBuffer 配合同步渲染截图。WebGL 初始化失败给出明确中文提示。

验证：JavaScript 语法静态检查；需由主任务浏览器实测并检验视觉效果与宿主集成。

## 第二轮视觉精修

依据真实首轮截图，重制车辆为分段雕塑几何楔形车身、低矮斜面玻璃座舱、宽后肩、分组尾灯、发动机散热槽、圆形双排气与扩散器鳍片。新增程序全景环境经 PMREM 生成真实材质反射，改善车漆与玻璃的黑塑料感。路面添加细颗粒/水痕粗糙度贴图及 UV；楼群增加退台塔冠和高低错落的顶部灯标。未更改宿主桥协议与公共 UI。
