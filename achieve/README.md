# maimemo-export
用于导出墨墨背单词的词库，并生成适用于 List 背单词，欧陆词典，不背单词等的自定义词库。
仓库内已经导出墨墨背单词所有自带词库（暂不包括云词库），多达 900 种词库，可以在仓库中选择需要的词库下载（[下载单个文件的方法](https://blog.csdn.net/u010801439/article/details/81478592)），也可以去 [蓝奏云（密码:666）](https://busiyi.lanzoux.com/b00ogbelc) 下载打包好的文件。
- csv 格式用于导入 List 背单词，自带中文释义
- csv\_en 文件夹中的文件为英文释义，同样可以导入 List 背单词，但效果不好
- txt 格式用于导入欧陆词典或不被单词，无中文解释
- list 文件夹中的文件带有 List 分组，可以批量分组导入欧陆词典

注：中文解释并非导出自墨墨背单词，而是使用 ECDICT 的数据，暂时无法做到与单词书上一致。

## Usage
由于 maimemo.db 和 stardict.db 太大，无法放入仓库中，你可以在 [release](https://github.com/ourongxing/maimemo-export/releases/tag/v1.0.0) 中下载并放入文件夹内，这是非常重要的两个数据库文件。

如果有最新的词库但数据库里没有的，也可以使用你手机中的数据库文件 `/data/data/com.maimemo.android.momo/databases/maimemo.v3_8_71.db`，**需要 Root 权限**。背过的单词也在里面，你可以使用 `export-plus.py` 脚本导出。云词库在 `/data/data/com.maimemo.android.momo/databases/notepad.db` 中，你同样可以使用 `export-plus`，注意修改数据库的名称。

```shell
> python main.py -h
usage: main.py [-h] [-t {csv,txt,list,all}] [-f] [-a | -l [LIST [LIST ...]]]

导出墨墨背单词词库，并生成适用于 List 背单词，不背单词，欧陆词典等的自定义词库

optional arguments:
  -h, --help            show this help message and exit
  -t {csv,txt,list,all}, --type {csv,csv_en,txt,list,all}
                        导出的文件类型
  -f, --force           覆盖已生成的文件
  -a, --all             导出墨墨背单词所有词库
  -l [LIST [LIST ...]], --list [LIST [LIST ...]]
                        词库名，可多个，与其他选项配合使用时，该选项必须放在最后
```
## Thanks
1. 导出方法来自于 [怎么把墨墨背单词里的词库导出来？ - 你说什么的回答](https://www.zhihu.com/question/392654371/answer/1345899232)
2. 词典来自于 [skywind3000/ECDICT](https://github.com/skywind3000/ECDICT)
3. 词库来自于 [墨墨背单词](https://www.maimemo.com/)

## License
MIT © ourongxing

## Buy something to eat for the kitten
如果我所做的事对你有所帮助，欢迎给小猫买点吃的。

也可以去 [这篇回答](https://www.zhihu.com/question/392654371/answer/1808941219) 下点点赞。

![](./donate.gif)
