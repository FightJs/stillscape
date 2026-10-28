# Stillscape 环境声

`soundscape.js` 是独立的 ES module，不请求或引用外部音频。所有风声、水声、雨声、气泡和和声均由 Web Audio 实时算法合成。默认静音，用户点击声音按钮后才应调用 `enable()`；默认音量为 0.22。

## 接入

```js
import { Soundscape } from './soundscape.js';
const soundscape = new Soundscape();
soundscape.setScene(scene);

// 必须由点击/触摸直接触发；处理 reject，并保持按钮状态与返回值一致。
const enabled = await soundscape.enable();
soundscape.disable();
soundscape.setVolume(0.22); // 0…1

// 与 renderer 的 onFrame 使用同一份参数。
soundscape.update({ time, windTime, waterTime, cloudTime, speed, wind, water, cloud, gust, playing });

// 卸载时：声音短暂释放后关闭 AudioContext、定时器、所有节点及事件监听。
await soundscape.destroy();
```

- `time` 为场景时间，单位秒；暂停时保持不变。引擎已将 speed 积入时间，Soundscape 不累计 delta，也不再次乘 speed。
- 可选 `windTime/waterTime/cloudTime` 为渲染器已积分的分层时钟。水流起伏消费 waterTime，未提供 gust 时的风包络消费 windTime；旧调用没有这些字段时回退 time。cloudTime 和 speed 保留为同步状态，既有音色与音高不随 speed 改变。
- 仅更新 playing 时保留上一帧的时钟和 gust，避免暂停/恢复接口调用暂时切换到备用风包络。暂停淡出和恢复渐入仍按 AudioContext 的真实时钟计时，不因 3× 播放变成骤停。
- `wind`、`water`、`cloud` 为强度，默认 1，支持 0…3；渲染器的 0…1.8 可直接传入。
- `gust` 为渲染器计算的瞬时阵风包络。推荐 0.1…1.0，当前渲染器约 0.72 起步。只要提供该值，引擎就直接使用，不另叠一组风周期。
- 未提供 `gust` 时，才使用三个不同速度正弦的低频合成包络。
- `playing: false` 会在约 1 秒内渐弱至接近静音，恢复平滑渐入。隐藏标签页也静音；声音开启状态不被这一操作改变。
- `setScene(scene)` 接收 `{ style, effects }` 或直接传风格字符串。场景切换平滑修改滤波、音量与音高，不重建音频节点。
- `effects` 可为字符串、数组或对象；`rain`、`water`/`river`/`ocean`、`snow` 提供可选音色调整。对象中 `wind/water/rain/tone: false` 可禁用对应层及关联瞬态。
- `enabled` 是用户声音开关状态；`noiseMode` 在初始化后为 `continuous-worklet` 或 `long-buffer-fallback`。初始化失败会抛错供 UI 提示。

## 合成结构

1. 三路独立立体声粉红噪声：AudioWorklet 逐采样生成，无短音频循环。每个声道使用独立伪随机序列和三极点粉红滤波，生成连续频谱。风层通过高低通形成温和空气感，水层保留更高频的流动感，雨层保留较轻的高频沙沙声。
2. 风的音量与低通截止频率共同跟随传入的 `gust × √wind`。水层跟随 `√water` 与共享场景时间的缓慢起伏；雨层跟随云量和阵风。参数按最高 24 Hz 更新，再用 AudioParam 平滑，避免逐帧阶跃产生爆音。
3. 水滴、雨滴、气泡和轻铃使用低音量正弦短音，带毫秒级起音、指数衰减和窄范围随机声像。水滴向下滑音，气泡向上滑音；出现时间遵循泊松概率，不按固定节拍重复。暂停、静音、隐藏时不再产生新瞬态。
4. 四条极轻正弦形成根音、纯五度、轻微失谐八度与低八度。不同场景改变音高和存在感，慢呼吸由共享场景时间驱动。无需混响卷积样本。
5. 总线移除 28 Hz 以下低频，再经过温和动态压缩和主音量。所有开关、场景、运动参数均使用渐变；最终响度取决于设备和用户音量。

| 风格 | 主体声音 | 和声 / 瞬态 |
| --- | --- | --- |
| oil / 油画 | 暖风、柔和流水 | 稀疏水滴、很轻的 D 音基础 |
| ink | 较暗的风、近处流水 | 清疏水滴、低存在感和声 |
| pixel | 窄频柔风、小溪 | 低音量离散铃音，不使用刺耳方波 |
| lowpoly | 开阔风声、少量流水 | A 音基础 |
| cyberpunk | 低沉空气、细雨 | 稀疏雨滴与较低和声 |
| minimal | 极轻空气 | 留白较多的纯音，无水滴 |
| surreal | 柔风、流动水 | 漂浮的轻铃与和声 |
| film | 暗色风声、微雨 | 温暖低音 |
| space | 极低空气层 | 主要为缓慢低音和声；艺术化声音 |
| underwater | 低通水流 | 轻微上滑气泡、低频基础 |
| aurora | 清凉柔风 | 极轻铃音和缓慢和声 |
| desert | 干燥较亮的风 | 细沙质噪声，无流水 |
| papercut | 轻薄风声 | 纸感沙沙声与零星轻铃 |
| garden | 明亮树叶风声、流水 | 小水滴、轻和声 |
| ukiyoe | 风与较强水流 | 稀疏水滴、D 音基础 |

## 兼容性和限制

- 现代 Chrome / Edge / Safari 可运行。AudioWorklet 需要安全上下文（HTTPS 或 localhost），并可能受 CSP 的 `blob:` 脚本限制。
- 无 Worklet 或加载失败时，使用三段不同长度（约 37、50、63 秒）的独立立体声噪声缓冲，并在循环边界做等功率交叠。这是兼容降级：存在长循环，不能声称无限不重复；三层不共享 12 秒周期。48 kHz 下缓冲约占 57 MB，Worklet 路径不占用这批长缓冲。
- 手机浏览器仍可能因系统锁屏、来电或省电挂起 AudioContext；系统不允许自动恢复时需要用户再次点击声音按钮。
- 稀疏瞬态属于抽象声景，不声称与每一滴视觉雨点逐个对应。风、水强弱和播放状态使用统一运动参数。
- `disable()` 保留音频图以便快速恢复；长期不使用应调用 `destroy()` 释放资源。
- 没有音乐录音、第三方音源、采样素材或版权曲目，也不声称模拟真实场地的空间声学。

## 实际验证与试听

在本机 Google Chrome headless 上实际运行引擎：

- 安全上下文：`continuous-worklet` 初始化成功；非安全上下文：`long-buffer-fallback` 初始化成功。
- 15 个风格完成切换，参数全部有限，无浏览器 pageerror。
- 暂停、恢复、快速开启/关闭通过；销毁后 AudioContext 状态为 `closed`。
- `audio-audition.wav` 由此模块的真实 Web Audio 图在 OfflineAudioContext 渲染，24 秒、32 kHz、16-bit stereo；离线渲染使用长缓冲兼容路径。
- 试听顺序：0–8 秒油画、8–16 秒赛博雨、16–24 秒水下，23 秒触发暂停淡出。阵风使用渲染器同一公式，离线每 0.5 秒更新一次，指定少量瞬态以供比较。
- 为便于审听，试听音量为 **0.65**，高于产品默认 **0.22**；未对文件额外做响度归一化。该次渲染峰值约 0.1684（−15.5 dBFS）、RMS 约 0.0245（−32.2 dBFS），没有削波。
- 已检查程序输出和数值；**未进行主观听觉审听**。试听文件用于用户或人工审听，不把无错误或数值检查等同于音质验收。
