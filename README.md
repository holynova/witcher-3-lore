# 巫师三 · 寻女之旅与长者之血

用六幕中文视频回顾杰洛特寻找希里、凯尔莫罕之战与狂猎终局。

A six-chapter Chinese video following Geralt’s search for Ciri and the Wild Hunt finale.

[在线体验](https://witcher-3-lore.xiaosang.cc/) · [源码](https://github.com/holynova/witcher-3-lore)

![巫师三 · 寻女之旅与长者之血：真实页面截图](./assets/readme/screenshot.png)

## 可以做什么

- 视频播放器与剧情章节说明放在同一页面。
- 旁白、图像和时间线源码支持后续修改。

## 观看与工程

打开在线页面播放，或选择章节定位观看。包含主线与结局剧透。

[打开成片](https://witcher-3-lore.xiaosang.cc/witcher_3_lore.mp4) · [仓库中的视频](./witcher_3_lore.mp4)

实测成片：1920 × 1080，30 fps，H.264 + AAC；时长 3:58，文件约 13.0 MiB。

`index.html` 是公开播放器；`composition.html` 与 `compositions/` 保留视频合成源码。旁白和配乐在 `assets/`。

## 本地预览

```bash
python3 -m http.server 8080
```

打开 http://localhost:8080/。播放器直接使用仓库成片，无需先渲染。

重新渲染需安装工程依赖和可用的 Chrome；在 HyperFrames 中使用 `composition.html` 合成入口，避免把播放器页面当作视频时间线。

影视化剧情是作者的剪辑与解释，游戏角色、官方素材及相关商标归各自权利人；这是非官方项目。

<img src="./assets/readme/qr.png" width="144" alt="扫码打开https://witcher-3-lore.xiaosang.cc/">

## 发布

```bash
npx --yes wrangler@4.128.0 deploy --dry-run --config wrangler.jsonc
npx --yes wrangler@4.128.0 deploy --config wrangler.jsonc
```

从 `main` 同一提交在本地手动发布到Cloudflare Workers。正式地址：[https://witcher-3-lore.xiaosang.cc/](https://witcher-3-lore.xiaosang.cc/)。 `.assetsignore` 限定公开播放器/站点资源，排除合成工程、开发文件与未供页面使用的大体积音频/字体。

视频通过 `worker/media.mjs` 提供HTTP字节范围读取，支持章节跳转；运行 `npm run test:media` 检查范围与校验器处理。
