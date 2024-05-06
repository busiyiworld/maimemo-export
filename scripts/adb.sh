#!/bin/bash

databaseFolder=./database

device=$(adb devices | tail -n +2 | cut -f1)

if [ -z "$device" ]; then
  echo "请安装 ADB，连接好手机，打开手机上的 USB 调试选项"
  exit 1
fi

adb shell su -c "cp -rf /data/data/com.maimemo.android.momo/databases/momo.v*.db /sdcard/maimemo.db"
adb pull /sdcard/maimemo.db "$databaseFolder"
adb shell rm /sdcard/maimemo.db

adb shell su -c "cp -rf /data/data/com.maimemo.android.momo/databases/notepad.db /sdcard/notepad.db"
adb pull /sdcard/notepad.db "$databaseFolder"
adb shell rm /sdcard/notepad.db
