import argparse
import codecs
import csv
import os
import sqlite3

class Generate(object):
    def __init__(self, path, force):
        self.path = path
        self.force = force
        # 连接数据库
        self.maimemo = sqlite3.connect("./maimemo.v4_0_20.db")
        self.stardict = sqlite3.connect("./ultimate.db")
        self.maimemo_cursor =self.maimemo.cursor()
        self.stardict_cursor = self.stardict.cursor()

    def exportAll(self, type):
        sql="""
        SELECT name
        FROM BK_TB
        ORDER BY name
        """
        result = self.maimemo_cursor.execute(sql).fetchall()
        list = []
        for book in result:
            list.append(book[0])
        self.export(list, type)

    # 导出词库
    def export(self, list, type):
        for num, book in enumerate(list):
            sql = """
            SELECT vc_vocabulary,title
            FROM VOC_TB
            INNER JOIN (
            SELECT title,voc_id,chapter_id,`order`
            FROM BK_VOC_TB V
            INNER JOIN BK_CHAPTER_TB C ON V.chapter_id= C.id AND V.book_id IN (
                SELECT original_id FROM BK_TB WHERE name = '%s' ) ) AS tmp ON VOC_TB.original_id = tmp.voc_id
            ORDER BY `order`
            """ % book
            result = self.maimemo_cursor.execute(sql).fetchall()
            self.generate(num, book, result, type)
        self.maimemo_cursor.close()
        self.maimemo.close()
        self.stardict_cursor.close()
        self.stardict.close()

    # 获取中文含义
    def get_exp(self, word):
        cursor = self.stardict_cursor
        # 去除单词中非字母的字符
        newword = word.replace("sth.", "").replace("sb.", "")
        newword = ''.join([n for n in newword if n.isalnum()])
        if word == newword:
            sql = """
            SELECT translation, word
            FROM stardict
            WHERE word = '%s'
            """ % word
        else:
            sql = """
            SELECT translation, word
            FROM stardict
            WHERE sw = '%s'
            """ % newword

        cursor.execute(sql)
        result = cursor.fetchall()
        _result = []
        exp = ""
        if result:
            # 去除空值
            for item in result:
                if item[0]:
                    _result.append(item)
            if not _result:
                return "无"
        else:
            return "无"

        for items in _result:
            if items[1] == word:
                exp = items[0]
                break
            else:
                exp = _result[0][0]

        if "\n" in exp:
            lines = exp.splitlines(True)
            for line in lines:
                if "[网络]" in line or "人名" in line:
                    lines.remove(line)
            exp = "".join(lines)
        return exp.replace('[网络]','')

    # 获取英文含义
    def get_exp_en(self, word):
        cursor = self.stardict_cursor
        # 去除单词中非字母的字符
        newword = word.replace("sth.", "").replace("sb.", "")
        newword = ''.join([n for n in newword if n.isalnum()])
        if word == newword:
            sql = """
            SELECT definition, word
            FROM stardict
            WHERE word = '%s'
            """ % word
        else:
            sql = """
            SELECT definition, word
            FROM stardict
            WHERE sw = '%s'
            """ % newword

        cursor.execute(sql)
        result = cursor.fetchall()
        _result = []
        exp = ""
        if result:
            # 去除空值
            for item in result:
                if item[0]:
                    _result.append(item)
            if not _result:
                return "none"
        else:
            return "none"

        for items in _result:
            if items[1] == word:
                exp = items[0]
                break
            else:
                exp = _result[0][0]

        return exp

    def gen_csv_en(self, book, result):
        if not os.path.exists(self.path + "/csv_en/"):
            os.makedirs(self.path + "/csv_en/")
        if not os.path.exists(self.path + "/csv_en/" + book + ".csv") or self.force:
            with codecs.open(self.path + "/csv_en/" + book + ".csv", "w",
                             "utf_8_sig") as csvfile:
                writer = csv.writer(csvfile)
                for word in result:
                    writer.writerows([[word[0], self.get_exp_en(word[0])]])

    def gen_csv(self, book, result):
        if not os.path.exists(self.path + "/csv/"):
            os.makedirs(self.path + "/csv/")

        if not os.path.exists(self.path + "/csv/" + book + ".csv") or self.force:
            with codecs.open(self.path + "/csv/" + book + ".csv", "w",
                             "utf_8_sig") as csvfile:
                writer = csv.writer(csvfile)
                for word in result:
                    writer.writerows([[word[0], self.get_exp(word[0])]])

    def gen_txt(self, book, result):
        if not os.path.exists(self.path + "/txt/"):
            os.makedirs(self.path + "/txt/")

        if not os.path.exists(self.path + "/txt/" + book + ".txt") or self.force:
            with codecs.open(self.path + "/txt/" + book + ".txt", "w",
                             "utf_8_sig") as txtfile:
                for word in result:
                    txtfile.write(word[0] + "\n")

    def gen_list(self, book, result):
        if not os.path.exists(self.path + "/list/"):
            os.makedirs(self.path + "/list/")
        if not os.path.exists(self.path + "/list/" + book + ".txt") or self.force:
            with codecs.open(self.path + "/list/" + book + ".txt", "w",
                             "utf_8_sig") as txtfile:
                list = ''
                for word in result:
                    tmp = word[1]
                    if list != tmp:
                        list = tmp
                        txtfile.write("#" + list + "\n")
                    txtfile.write(word[0] + "\n")

    # 创建文件
    def generate(self, num, book, result, _type):
        print("【" + str(num + 1) + "】", end='')
        if (result == []):
            print("未找到：" + book)
        else:
            if _type == "csv":
                self.gen_csv(book, result)
            if _type == "csv_en":
                self.gen_csv_en(book, result)
            elif _type == "txt":
                self.gen_txt(book, result)
            elif _type == "list":
                self.gen_list(book, result)
            else:
                self.gen_csv(book, result)
                self.gen_csv_en(book, result)
                self.gen_txt(book, result)
                self.gen_list(book, result)
            print("生成成功：" + book)

if __name__ == "__main__":
    #获取命令行传入的参数
    parser = argparse.ArgumentParser(
        description='导出墨墨背单词词库，并生成适用于 List 背单词，不背单词，欧陆词典等的自定义词库')
    parser.add_argument('-t',
                        '--type',
                        help='导出的文件类型',
                        default='all',
                        choices=['csv', 'csv_en','txt', 'list','all'])
    parser.add_argument('-f',
                        '--force',
                        help='覆盖已生成的文件', 
                        action="store_true")
    group = parser.add_mutually_exclusive_group()
    group.add_argument('-a', '--all', help='导出墨墨背单词所有词库', action="store_true")
    group.add_argument('-l',
                       '--list',
                       nargs='*',
                       help='词库名，可多个，与其他选项配合使用时，该选项必须放在最后')
    args = parser.parse_args()

    path = "./dict"
    g = Generate(path, args.force)
    if args.all:
        g.exportAll(args.type)
    elif args.list == None:
        print("必须输入一个词库名称，使用 -l 词库名")
    else:
        g.export(args.list, args.type)
