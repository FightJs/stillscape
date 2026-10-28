# 最终交付版本技术验收（第二轮）

**本轮结果：16 幅图片场景、171 项断言全部通过，测试脚本捕获错误数组为空。** 浏览器控制台另有 1 条异步消息通道错误，来源未确认，详见下方单独记录；不能宣称浏览器日志零错误。此结论覆盖最终冻结代码的技术行为，不替代独立视觉评审，也不表示长期、多设备性能验收。

- 新版原始结果：[motion-qa-raw.json](motion-qa-raw.json)。
- 新版证明截图：[motion-qa-proof.png](motion-qa-proof.png)。
- 上一轮动效版本已归档为 [MOTION-TECHNICAL-QA-ROUND1.md](MOTION-TECHNICAL-QA-ROUND1.md)、[motion-qa-round1-raw.json](motion-qa-round1-raw.json)、[motion-qa-round1-proof.png](motion-qa-round1-proof.png)。更早的 [TECHNICAL-QA.md](TECHNICAL-QA.md) 与 [technical-qa-raw.json](technical-qa-raw.json) 也保留。
- 浏览器消息原始记录：[motion-qa-browser-log.json](motion-qa-browser-log.json)。

![新版171项完成结果](motion-qa-proof.png)

## 实际环境与范围

- 2026-10-28 15:13:02–15:14:17，Asia/Shanghai；原始 UTC：`2026-10-28T07:13:02.427Z` 至 `2026-10-28T07:14:17.668Z`，约 75.24 秒。
- CUA 在本机真实 Chrome 创建独立标签页，点击 `tests/technical-qa.html` 开始按钮执行。没有使用 CLI Playwright、headless 或其他浏览器控制路径。
- 浏览器上报 UA：`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36`。UA 不用于推断机器实际 CPU 或 macOS 版本。
- 窗口视口 1431×684，devicePixelRatio=2；测试设置 maxDpr=1、固定质量，画布实际 960×540。系统实际 reduced-motion=false。
- scenes.js 共 **17** 项。仅按 `kind !== 'embedded'` 选中 **16 幅图片场景**；`16-neon-drift`（kind=embedded）已在原始结果中明确排除，其独立 3D HTML、iframe、交互和性能需要单独验收。
- 每幅先解码原图和前景，再创建真实 WebGL 引擎，运行约 2.25 秒，并验证强度、暂停、导出、恢复和销毁。已经解码的资源进入缓存，指标不代表冷网络加载性能。
- 16 份 3840×2160 PNG 均仅在内存生成并通过 createImageBitmap 解码，未下载或写入磁盘。本轮只保存原始 JSON 与一张小尺寸截图。

## 着色器与逐幅结果

所有 16 个实际 WebGL 引擎创建/渲染成功，没有着色器编译、链接或上下文报错。每幅均通过 wind/water/cloud 的 **0、1、3** 强度参数传递；0 强度时对应 windTime/waterTime/cloudTime 不再增长。Soundscape 消费的参数与时钟也与渲染帧一致。

| 场景 | FPS | CPU ms | 0/1/3 与零强度时钟 | 暂停帧数 | PNG 内存尺寸 | 销毁 |
| --- | ---: | ---: | --- | --- | --- | --- |
| 00-tuscany-reborn | 58.3 | 0.28 | PASS | 186→186 | 3840×2160 | PASS |
| 01-impasto-night | 59.6 | 0.23 | PASS | 187→187 | 3840×2160 | PASS |
| 02-ink-mountains | 59.4 | 0.62 | PASS | 186→186 | 3840×2160 | PASS |
| 03-ukiyoe-wave | 59.5 | 0.23 | PASS | 187→187 | 3840×2160 | PASS |
| 04-pixel-rain | 59.9 | 0.24 | PASS | 188→188 | 3840×2160 | PASS |
| 05-lowpoly-islands | 59.6 | 0.29 | PASS | 187→187 | 3840×2160 | PASS |
| 06-cyberpunk-city | 59.8 | 0.24 | PASS | 187→187 | 3840×2160 | PASS |
| 07-minimal-gradient | 59.5 | 0.13 | PASS | 187→187 | 3840×2160 | PASS |
| 08-surreal-monolith | 59.7 | 0.90 | PASS | 187→187 | 3840×2160 | PASS |
| 09-film-coast | 59.8 | 0.22 | PASS | 188→188 | 3840×2160 | PASS |
| 10-deep-space | 59.7 | 0.30 | PASS | 185→185 | 3840×2160 | PASS |
| 11-underwater-blue | 59.7 | 0.49 | PASS | 184→184 | 3840×2160 | PASS |
| 12-aurora-lake | 59.9 | 0.22 | PASS | 185→185 | 3840×2160 | PASS |
| 13-desert-dunes | 60.0 | 1.09 | PASS | 185→185 | 3840×2160 | PASS |
| 14-papercut-forest | 59.7 | 0.14 | PASS | 185→185 | 3840×2160 | PASS |
| 15-dream-garden | 59.8 | 0.27 | PASS | 187→187 | 3840×2160 | PASS |

本轮所有场景短时 FPS 为 **58.3–60.0**。这些是创建后约两秒窗口中的引擎指标，不是纯稳态、4K 实时渲染或持续负载基准。cpuFrameMs 是 JS 绘制提交时间的平滑值，不是 GPU 完成时间。

16 张原图均为 **1672×941**，sourceIsNative4K=false；**3840×2160 是导出尺寸，不是原生 4K 画源**。前景图片也全部成功解码。

## 速度与声音时钟

快速切换完成后，以同一引擎分别设 speed=0.25、1、3，每次等待 160 ms 后观察约 650 ms。验证最后一帧 `delta = wallDelta × speed`，并验证场景时间与真实经过时间的斜率：

| 设定速度 | 实测 time / wall time | 最后一帧 wallDelta 秒 | 最后一帧 delta 秒 | 结果 |
| --- | ---: | ---: | ---: | --- |
| 0.25× | 0.249693× | 0.016600 | 0.004150 | PASS |
| 1× | 0.996778× | 0.016300 | 0.016300 | PASS |
| 3× | 2.993093× | 0.016700 | 0.050100 | PASS |

声音直接消费已经积分的 time、windTime、waterTime、cloudTime，**没有再次乘 speed**；声音中的 time 与渲染最后一帧相等。3× 状态下暂停后音频时间保持，playing=false；恢复后共享时间继续增长、playing=true。

这次使用音量 0 的真实 AudioContext，检查同步接口、连续 Worklet 初始化和资源释放，不是新的听感评分。既有 96 秒用户听审证据仍限于 [AUDIO-COLLECTION.md](AUDIO-COLLECTION.md) 记录的样本；本轮没有据数值测试扩展主观听感结论。

## 减少动态与显式恢复

测试页创建一个 **仅用于测试的 matchMedia stub**，返回 reduced-motion=true，真实系统设置没有改变。结果如下：

1. 创建后：reducedMotion=true、playing=false、activeRaf=false，已绘制 1 帧，声音 playing=false。
2. 普通 `setPlaying(true)`：仍 playing=false、reducedMotionOverridden=false、activeRaf=false。初始化播放请求没有绕过减少动态偏好。
3. `setPlaying(true,{userInitiated:true})`：playing=true、reducedMotionOverridden=true，帧数由 1 增至 17，声音恢复。

该测试证明代码分支的显式恢复协议，不等同于操作系统级媒体偏好模拟或实际设备辅助功能测试。

## 其余验证和最终释放

- 每幅暂停等待一次状态重绘后，260 ms 观察窗口内帧数不增长、pending RAF=0；恢复后帧数增长。
- 每幅 4K PNG 导出为非空 image/png、实际可解码为 3840×2160，之后原画布尺寸恢复并可继续播放。
- 并发请求 15-dream-garden → 01-impasto-night → 10-deep-space → 03-ukiyoe-wave → 07-minimal-gradient，最终场景及最后一帧均为最后请求，没有旧请求覆盖。
- 每幅 destroy 后跟踪的 texture/shader/program/buffer 均清零，RAF=0，overlay=0，无新回调；销毁后的 activeRaf=false。
- 最终 textures=0、shaders=0、programs=0、buffers=0、raf=0、overlayCount=0，AudioContext=closed。
- 原始 JSON 内 errors=[]，全部 171 条 checks.ok=true；浏览器控制台另有下节记录的 1 条消息，不能将脚本错误数组为空扩写成控制台零错误。

## 单独保留的浏览器消息

CUA `tab.dev.logs({levels:['error','warn']})` 在测试完成后返回 1 条 error：

> Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received

- 时间：2026-10-28T07:13:25.804Z，位于本轮测试执行期间。
- URL：`http://localhost:5173/tests/technical-qa.html`。
- 测试页的 `window.error`、`unhandledrejection` 及包装的 `console.error` 捕获数组为空，171 项断言未受影响；工具没有提供产品调用栈。
- 消息形态符合浏览器异步消息通道关闭的错误，常见于扩展通信，但**本次未确认来源**。不将其无证据归因为产品实现，也不将其删除或称为已解决。
- 按协调要求不为该条来源未确认消息重复运行或追加测试。完整查询结果保存在 [motion-qa-browser-log.json](motion-qa-browser-log.json)。

## 限制与后续边界

- 0/1/3 断言验证风、水、云参数和分层时钟的数值响应；动效是否明显、自然、边界准确由独立视觉评审判断。light 参数在测试中一起设置，但没有单独的 light 值回传断言。
- 未测试第 17 项 embedded 3D HTML，也未在本轮验证图库搜索、收藏、全屏或 iframe 生命周期；这些属于单独 UI/体验验收。
- 未进行跨浏览器、移动设备、真实减少动态系统设置、锁屏/后台、省电模式、30 分钟持续运行、网络失败、无 WebGL fallback 或 context 丢失恢复测试。
- WebGL 资源计数是对象与 RAF 的释放验证，不证明驱动显存立即回收，也不替代长时间泄漏检查；事件监听器没有独立数量断言。
- 现有断言未发现需要修复的实现缺陷；没有修改冻结产品代码，也未新增测试。完成后已通过 CUA 关闭独立自检标签页 1787176111，浏览器已释放。

## 本轮冻结指纹

- `engine.js`: `02145953ae1050cd467bdf36e6705d5537e004c56d65194481dda18f1e56df97`
- `motion-profiles.js`: `f6f00db8856968f5493badfde0d3ed0c6b52bd50ff73a3fba1eaad6e9792409e`
- `scenes.js`: `60dfa14f5ca7240c854b1dbdc84bd5dd287df1c8dd32cce7134ae7ae6ea31752`
- `soundscape.js`: `d68580bc9f3cf860e679c7b4821a9c4037ca288cdfb227c4844ce2cd02d7c72c`
- `gallery.js`: `1a42496bb8d65527655e88e6b3bfef437a5113fd420e6ca00c41c984ad02088e`
- `tests/technical-qa.js`: `c2574d3affe813e76eec9db5bf913f33048b57a458e605ff766652e12fe7d4f4`
