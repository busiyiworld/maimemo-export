import { $ } from "@cspotcode/zx"
import path from "path"
// windows 上有 bug
$.quote = k => k

// 必须要有 Root 权限
export const getDatabaseFromPhone = async () => {
  try {
    const device = (await $`adb devices`).toString()
    if (!/device\s*$/.test(device))
      throw "请安装 ADB，连接好手机，打开手机上的 USB 调试选项"
    const databaseFolder = path.resolve(__dirname, "..", "database")
    const cpMaimemo = async () => {
      await $`adb shell su -c "cp -rf /data/data/com.maimemo.android.momo/databases/maimemo.v*.db /sdcard"`
      await $`adb shell mv /sdcard/maimemo.v*.db /sdcard/maimemo.db`
      await $`adb pull /sdcard/maimemo.db ${databaseFolder}`
      await $`adb shell rm /sdcard/maimemo.db`
    }
    const cpNotePad = async () => {
      await $`adb shell su -c "cp -rf /data/data/com.maimemo.android.momo/databases/notepad.db /sdcard"`
      await $`adb pull /sdcard/notepad.db ${databaseFolder}`
      await $`adb shell rm /sdcard/notepad.db`
    }
    await cpMaimemo()
    await cpNotePad()
  } catch (err) {
    console.error(err)
  }
}

getDatabaseFromPhone()
