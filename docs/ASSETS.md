# 资产与来源记录

## 本项目自有生成文件

`public/wallpapers/` 中00–15号原画：本次任务通过 OpenAI image generation 工具原创生成。用户要求创作，提示词按公开参考的风格规律转译；没有下载原壁纸作为新作品底图，没有使用参考作中的商标、角色或构图复刻。

`public/layers/tuscany-cypress.png`：同一工具基于本任务生成的原始油画制作的独立透明柏树。
`public/tuscany.png`：本任务早期油画生成原稿，保留用于历史验证。

逐幅提示词、原始工具输出位置、日期、实际尺寸和参考链接在 `production/`。图像均应明确标注“AI生成艺术”；摄影感图像不是实地摄影。

## 风格研究

`research/references.json` 中的Steam、Apple、Microsoft及Wallpaper Engine Space链接仅用于来源说明与风格研究。原参考作品的版权、商标和作者权利归其各自权利人所有；参考作品未打包分发，不推断其许可可用于商业复制。热度数字是记录日期的观察值，不代表实时榜单。

## 音频、字体与代码

`soundscape.js` 是本项目编写的算法合成音频，不含外部录音/歌曲/采样。`audio-audition.wav`是该引擎的离线渲染测试样本，不是第三方音乐。

最终画廊使用操作系统自带字体，不随项目分发字体文件。Vite及其依赖许可见node_modules对应LICENSE与package-lock.json；部署产物不依赖远程字体服务。

## 商用边界

本记录提供可追溯的创作过程，不构成第三方版权清理保证、法律意见或官方奖项认证。生成内容的具体商业使用权应以创作账户适用的服务条款与合同为准；本地项目无法核实账户合同、独占性或各司法辖区对AI生成内容的版权认定。不要对外承诺“全球独占版权”“已获奖”或“已完成法律审查”。

## 尺寸

主画原生1672×941，透明柏树1024×1536。WebGL截图可输出3840×2160合成帧；该操作是放大输出，不能标注为原生4K原画。


分层返修：03-pine-clean.png/03-pine-layer.png、04-rain-clean.png、05-clean.png/05-rotor.png均通过本任务image generation工具生成并保留原始输出，分别记录在production/03-pine-revision.json、04-rain-revision.json、05-layer-revision.json。原图仍保存在public/wallpapers/。

## 用户提供的第17项

`public/experiences/neon-drift-3d.html` 为用户提供的独立三维网页，原始副本在 `production/neon-drift-3d-original.html`。本轮仅对嵌入时的布局做适配；`public/wallpapers/neon-drift-preview.png` 来自该网页的真实浏览器截图，属于用户作品的预览，不是本次AI生成的原画。接入与文件指纹见 `docs/NEON-INTEGRATION.md`。

## 人物与幻想扩展 · 2026-10-28

17–22 号为本次通过 image_gen 生成的六幅原创艺术图像，不使用现有动漫角色、商标或第三方壁纸底图。详见 `production/expansion-a.md`、`expansion-b.md`、`expansion-c.md`。其中19号1659×948，其余1672×941，保留生成原始尺寸。展示器为项目原创程序动画，独立于用户提供的 NEON DRIFT 页面；这批作品默认无声，不沿用此前音频试听结论。

新增展示器保持 sandbox 隔离。三款局部 WebGL 形变所用图像由宿主读取当前清单内的本地文件，以 Data URL 传入当前 iframe；消息校验来源窗口、场景 ID 和切换令牌，不允许子页指定任意文件路径。若纹理上传不可用，回退至原画和 Canvas 光效；加载超时提供重试。

## 强动态三维扩展 · 2026-10-28

23–25号（午夜超驰、星环远征、棱镜回廊）为原创程序化实时几何场景，无外部模型或图片依赖。Three.js r160 从 npm 正规包安装并本地托管，许可证位于 `public/vendor/THREE-LICENSE.txt`。原生画面随视口实时渲染，封面通过实际浏览器中的截帧按钮导出，不是效果图。

Steam Workshop 8项参考链接、作者说明与证据边界见 `research/steam-motion-2026-10-28.md`。只借鉴空间穿行、稳定主体和多尺度运动等设计原则，未复制或分发原作品资产。
