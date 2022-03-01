import codecs
import csv
res = []
with codecs.open("./英语二考研真题单词.csv", "r", "utf_8_sig") as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:  # 将csv 文件中的数据保存到birth_data中
        res.append(row)
def takeSecond(elem):
    return elem[0]
res.sort(key=takeSecond)
with codecs.open("./英语二考研真题单词.csv", "w", "utf_8_sig") as csvfile:
    writer = csv.writer(csvfile)
    for word in res:
        writer.writerows([[word[0], word[1]]])
