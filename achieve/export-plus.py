import argparse
import codecs
import csv
import os
import sqlite3

class Generate(object):
    def __init__(self, path, force, notrem):
        self.path = path
        # 强制覆盖已生成的文件
        self.force = force
        # 只导出没背过的单词
        self.notrem = True
        #  背过的单词
        self.rem = []

        if notrem:
            if os.path.exists(self.path + "/txt/背过的单词.txt"):
                with open(self.path+"/txt/背过的单词.txt", "r", encoding='utf-8') as f:
                    self.rem = f.readlines()
                for i,j in enumerate(self.rem):
                    self.rem[i] = self.rem[i].strip('\n')
            else:
                print("【警告】请先导出背过的单词")
                os._exit(0)

        # 连接数据库
        self.maimemo = sqlite3.connect("./maimemo.v4_0_30.db")
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

    def export_notepad(self, list, type):
        notepad = sqlite3.connect("./notepad.db")
        notepad_cursor = notepad.cursor()
        for num, book in enumerate(list):
            sql = """
            SELECT ubv_voc_id,ubv_tag
            FROM UB_TB
            INNER JOIN UB_VOC_TB ON ub_id=ubv_userbook_id
            WHERE ub_name LIKE '%s'
            ORDER BY ubv_order
            """ % book
            notepad_cursor.execute(sql)
            result = notepad_cursor.fetchall()
            __result = []
            for word in result:
                sql = """
                    SELECT vc_vocabulary
                    FROM VOC_TB
                    WHERE vc_id = '%s'
                """ % word[0]
                self.maimemo_cursor.execute(sql)
                _result = self.maimemo_cursor.fetchall()
                __result.append((_result[0][0], word[1]))
            self.generate(num, book, __result, type)
        notepad_cursor.close()
        notepad.close()
        self.maimemo_cursor.close()
        self.maimemo.close()
        self.stardict_cursor.close()
        self.stardict.close()

    def export_rem(self, type):
        sql = """
        SELECT vc_vocabulary
        FROM LSR_TB LT
        INNER JOIN VOC_TB VT ON LT.lsr_new_voc_id=VT.vc_id
        ORDER BY vc_vocabulary
        """
        #  ORDER BY lsr_first_study_date DESC
        result = self.maimemo_cursor.execute(sql).fetchall()
        self.generate(0, "背过的单词", result, type)
        self.maimemo_cursor.close()
        self.maimemo.close()
        self.stardict_cursor.close()
        self.stardict.close()

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
            #  ORDER BY vc_frequency DESC
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
                    if self.notrem and word[0] in self.rem:
                        continue
                    else:
                        writer.writerows([[word[0], self.get_exp_en(word[0])]])

    def gen_csv(self, book, result):
        if not os.path.exists(self.path + "/csv/"):
            os.makedirs(self.path + "/csv/")
        if not os.path.exists(self.path + "/csv/" + book + ".csv") or self.force:
            with codecs.open(self.path + "/csv/" + book + ".csv", "w",
                             "utf_8_sig") as csvfile:
                writer = csv.writer(csvfile)
                for word in result:
                    if self.notrem and word[0] in self.rem:
                        continue
                    else:
                        writer.writerows([[word[0], self.get_exp(word[0])]])

    def gen_list(self, book, result):
        if not os.path.exists(self.path + "/text_list/"):
            os.makedirs(self.path + "/text_list/")
        if not os.path.exists(self.path + "/text_list/" + book + ".txt") or self.force:
            with codecs.open(self.path + "/text_list/" + book + ".txt", "w",
                             "utf_8_sig") as txtfile:
                list = ''
                for word in result:
                    if self.notrem and word[0] in self.rem:
                        continue
                    else:
                        tmp = word[1]
                        if list != tmp:
                            list = tmp
                            txtfile.write("#" + list + "\n")
                        txtfile.write(word[0] + "\n")

    def gen_txt(self, book, result):
        if not os.path.exists(self.path + "/txt/"):
            os.makedirs(self.path + "/txt/")
        if not os.path.exists(self.path + "/txt/" + book + ".txt") or self.force:
            with codecs.open(self.path + "/txt/" + book + ".txt", "w",
                             "utf_8_sig") as txtfile:
                for word in result:
                    #  newword = word[0].replace("sth.", "").replace("sb.", "")
                    #  newword = (''.join([n for n in newword if n.isalnum()])).lower()
                    #  if word[0] == newword:
                    if self.notrem and word[0] in self.rem:
                        continue
                    else:
                        txtfile.write(word[0] + "\n")

    # 创建文件
    def generate(self, num, book, result, _type):
        print("【" + str(num + 1) + "】", end='')
        if (result == []):
            print("未找到：" + book)
        else:
            if _type == "csv":
                self.gen_csv(book, result)
            elif _type == "csv_en":
                self.gen_csv_en(book, result)
            elif _type == "txt":
                self.gen_txt(book, result)
            elif _type == "list":
                if len(result[0]) == 2:
                    self.gen_list(book, result)
                else:
                    print("无 List，生成失败")
                    return
            else:
                self.gen_csv(book, result)
                self.gen_csv_en(book, result)
                self.gen_list(book, result)
                self.gen_txt(book, result)
            print("生成成功：" + book)


if __name__ == "__main__":
    path = "./dict"

    #  覆盖以生成的文件
    force = True
    #  只导出没背过的单词
    notrem = False
    g = Generate(path, force, notrem)
    #  导出全部词库，参数 list，txt，csv，all
    #  g.exportAll('csv')

    #  导出指定词库
    #  g.export(['2021硕士研究生英语（一）大纲词汇'], 'csv')
    #  print(g.get_exp_en("state"))

    #  导出云词库
    g.export_notepad(['22田静老师真题词汇（阅读单词短语）每日一句 句句真研'], 'all')

    #  导出背过的单词
    #  g.export_rem("csv")
