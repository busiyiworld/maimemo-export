![](screenshots/preview.light.png#gh-light-mode-only)
![](screenshots/preview.dark.png#gh-dark-mode-only)

> [!IMPORTANT]
> 中文翻译并非导出自墨墨背单词，而是使用 [ECDICT](https://github.com/skywind3000/ECDICT-ultimate) 的数据，无法做到与墨墨背单词一致。

用于导出墨墨背单词的词库，并生成适用于 List 背单词，不背单词，欧陆词典等的自定义词库。

## 下载已导出的词库

仓库内已经导出墨墨背单词所有本地词库，包括联网更新的词库，但不包括云词库，多达上千种词库。

预览+下载：[词库列表](./词库.md)

## 使用
> [!NOTE]
> 需要安装 Node v20 及以上。只在 macOS 上测试。 获取最新数据库必须使用 Android 手机，并且 Root，小白勿试。

```shell
git clone https://github.com/ourongxing/maimemo-export.git
cd maimemo-export
corepack enable
pnpm i
```

### 获取数据库

1. 获取手机上的数据库文件，连接好手机，打开 USB 调试，命令行输入
   ```shell
   pnpm adb
   ```

2. 如果需要单词中文翻译，请下载 [skywind3000/ECDICT-ultimate](https://github.com/skywind3000/ECDICT-ultimate/releases/download/1.0.0/ecdict-ultimate-sqlite.zip) 词典，解压得到 `ultimate.db`，重命名为 `ecdict_ultimate.db` ，放入 `database`。

### 启动 WebUI

```shell
pnpm dev
```

打开：[http://localhost:3000](http://localhost:3000)

## Acknowledgements

1. 导出方法来自于 ~~[怎么把墨墨背单词里的词库导出来？ - 你说什么的回答](https://www.zhihu.com/question/392654371/answer/1345899232)~~
2. 词典来自于 [skywind3000/ECDICT-ultimate](https://github.com/skywind3000/ECDICT-ultimate)
3. 词库来自于 [墨墨背单词](https://www.maimemo.com/)

## License

> [!CAUTION]
> 仅用于学习，禁止用于商业用途。词库版权归 [墨墨背单词](https://www.maimemo.com/) 所有。

MIT © ourongxing
