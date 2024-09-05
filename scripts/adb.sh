#!/bin/bash

databaseFolder=./database

device=$(adb devices | tail -n +2 | cut -f1)

if [ -z "$device" ]; then
  echo "请安装 ADB，连接好手机，打开手机上的 USB 调试选项"
  exit 1
fi

adb shell su -c "cp -rf /data/data/com.maimemo.android.momo/databases/momo.v*.db /sdcard/maimemo_base.db"
adb pull /sdcard/maimemo_base.db "$databaseFolder"
adb shell rm /sdcard/maimemo_base.db

adb shell su -c "cp -rf /data/data/com.maimemo.android.momo/databases/notepad.db /sdcard/maimemo_cloud.db"
adb pull /sdcard/maimemo_cloud.db "$databaseFolder"
adb shell rm /sdcard/maimemo_cloud.db
