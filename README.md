# maimemo-export
> 中文含义并非导出自墨墨背单词，而是使用 [ECDICT](https://github.com/skywind3000/ECDICT-ultimate) 的数据，无法做到与墨墨背单词一致。

用于导出墨墨背单词的词库，并生成适用于 List 背单词，不背单词，欧陆词典等的自定义词库

## Usage
> 必须使用 Android 手机，并且必须 Root，小白勿试。release 中有已经导出好的词库，可以直接下载使用。

#### Install
> 需要 node v18+
```shell
git clone https://github.com/ourongxing/maimemo-export.git
cd maimemo-export
pnpm i
```
#### Get Database
1. 下载词典数据库，[点击下载](ecdict-ultimate-sqlite.zip)，解压得到 `ultimate.db`，放入 `database` 文件夹中（没有就自己新建）。
2. 获取手机上的数据库文件，连接好手机，打开 USB 调试，命令行输入
    ```shell
    pnpm adb
    ```
#### Option
```ts
// src/index.ts
const exportThesaurus = async (
  // 词库名
  books: string[],
  // MaimemoDB 为本地词库，NotePad 为云词库
  db: MaimemoDB | NotePad,
  option?: ExportOpt
) => {
```

```ts
type ExportOpt = {
  // 导出文件类型
  types?: ("txt" | "csv" | "list")[] // default: ["txt","csv","list"]

  // 导出路径
  dir?: string // ./thesaurus

  // 1.词库中仅背过的单词 2.仅没背的单词 3. false 为全部
  memorized?: // default: false
    | {
        type: "memorized" | "unmemorized"
        data: string[]
      }
    | string[]
    | false

  // 1.仅单词 2.仅短语 3. true 为单词，false 为全部
  word?: "word" | "phrase" | boolean // default: false

  // 覆盖已有文件
  override?: boolean // default: false
  bookOpt?: BookOption
}
```
```ts
type BookOption = {
  // 1. 首字母 2. 书上默认顺序
  order?: "initials" | "book" // default: "book"

  // 顺序反转
  reverse?: boolean // default: false
}
```
#### Export
```shell
pnpm dev
```

## Download
仓库内已经导出墨墨背单词所有本地词库，包括联网更新的词库，不包括云词库，多达上千种词库，可以在仓库中选择需要的下载（[下载单个文件的方法](https://blog.csdn.net/u010801439/article/details/81478592)）。

- csv：带有中文含义，可导入 List 背单词。
- list：带有 List 分组，可导入欧陆词典。
- txt：仅单词，可导入不背单词。

## Acknowledgements
1. 导出方法来自于 [怎么把墨墨背单词里的词库导出来？ - 你说什么的回答](https://www.zhihu.com/question/392654371/answer/1345899232)
2. 词典来自于 [skywind3000/ECDICT-ultimate](https://github.com/skywind3000/ECDICT-ultimate)
3. 词库来自于 [墨墨背单词](https://www.maimemo.com/)

## License
MIT © ourongxing
