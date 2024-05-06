import path from "node:path"
import { $ } from "@cspotcode/zx"
// 有 bug，adb shell 无法执行
// import { $ } from "bun"

// 必须要有 Root 权限
async function getDatabaseFromPhone() {
  try {
    const device = (await $`adb devices`).toString()
    if (!/device\s*$/.test(device))
      throw "请安装 ADB，连接好手机，打开手机上的 USB 调试选项"
    const databaseFolder = path.resolve(__dirname, "..", "database")
    await $`adb shell su -c "cp -rf /data/data/com.maimemo.android.momo/databases/momo.v*.db /sdcard/maimemo.db"`
    await $`adb pull /sdcard/maimemo.db ${databaseFolder}`
    await $`adb shell rm /sdcard/maimemo.db`
    await $`adb shell su -c "cp -rf /data/data/com.maimemo.android.momo/databases/notepad.db /sdcard/notepad.db"`
    await $`adb pull /sdcard/notepad.db ${databaseFolder}`
    await $`adb shell rm /sdcard/notepad.db`
  } catch (err) {
    console.error(err)
  }
}

getDatabaseFromPhone()
