# 📱 راهنمای ساخت اپلیکیشن اندروید

این راهنما مراحل تبدیل بازی وب "امپراطوری ایران ۲۰۲۷" به اپلیکیشن اندروید را شرح می‌دهد.

## 🔧 پیش‌نیازها

### نرم‌افزارهای مورد نیاز:

1. **Node.js** (ورژن ۱۶ یا بالاتر)
   ```bash
   # بررسی ورژن
   node --version
   npm --version
   ```

2. **Android Studio** 
   - دانلود از [developer.android.com](https://developer.android.com/studio)
   - نصب Android SDK
   - تنظیم متغیر محیطی `ANDROID_HOME`

3. **Java Development Kit (JDK)** 
   - JDK 8 یا بالاتر
   - تنظیم متغیر محیطی `JAVA_HOME`

4. **Apache Cordova**
   ```bash
   npm install -g cordova
   ```

## 🚀 روش‌های نصب روی اندروید

### روش ۱: PWA (Progressive Web App) - آسان‌ترین روش

#### مرحله ۱: راه‌اندازی سرور محلی
```bash
# نصب وابستگی‌ها
npm install

# شروع سرور محلی
npm start
```

#### مرحله ۲: نصب PWA روی گوشی
1. بازی را در مرورگر Chrome باز کنید: `http://localhost:8000`
2. منوی مرورگر (سه نقطه) → "Add to Home screen" → "Install"
3. بازی به عنوان اپلیکیشن مستقل نصب می‌شود

**مزایا:**
- ✅ نصب آسان و سریع
- ✅ بروزرسانی خودکار
- ✅ کارکرد آفلاین
- ✅ دسترسی کامل به ویژگی‌های بازی

### روش ۲: ساخت APK با Cordova - برای انتشار

#### مرحله ۱: آماده‌سازی پروژه
```bash
# ایجاد پروژه Cordova
cordova create iran-empire-android com.iranempire.game2027 "امپراطوری ایران ۲۰۲۷"

# کپی فایل‌های بازی
cp -r *.html *.css *.js assets/ iran-empire-android/www/
cp config.xml iran-empire-android/

# رفتن به پوشه پروژه
cd iran-empire-android
```

#### مرحله ۲: افزودن پلتفرم اندروید
```bash
# افزودن پلتفرم اندروید
cordova platform add android

# بررسی پیش‌نیازها
cordova requirements android
```

#### مرحله ۳: تولید آیکون‌ها
```bash
# بازگشت به پوشه اصلی
cd ..

# تولید آیکون‌ها
npm run build:icons

# کپی آیکون‌ها به پروژه Cordova
cp -r assets/ iran-empire-android/www/
```

#### مرحله ۴: ساخت APK
```bash
cd iran-empire-android

# ساخت APK برای تست
cordova build android

# ساخت APK نهایی (Release)
cordova build android --release
```

#### مرحله ۵: امضای APK (برای انتشار)
```bash
# ایجاد کلید امضا
keytool -genkey -v -keystore iran-empire.keystore -alias iran-empire -keyalg RSA -keysize 2048 -validity 10000

# امضای APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore iran-empire.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk iran-empire

# بهینه‌سازی APK
zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk iran-empire-2027.apk
```

## 📱 روش ۳: نصب مستقیم با ADB

اگر Android SDK نصب کرده‌اید:

```bash
# فعال‌سازی Developer Options روی گوشی
# Settings > About Phone > Build Number (7 بار ضربه بزنید)

# فعال‌سازی USB Debugging
# Settings > Developer Options > USB Debugging

# نصب APK
adb install iran-empire-2027.apk
```

## 🔧 تنظیمات پیشرفته

### بهینه‌سازی عملکرد

#### 1. فشرده‌سازی فایل‌ها
```bash
# نصب ابزار فشرده‌سازی
npm install -g uglify-js clean-css-cli html-minifier

# فشرده‌سازی JavaScript
uglifyjs script.js -o script.min.js -c -m

# فشرده‌سازی CSS
cleancss style.css -o style.min.css

# فشرده‌سازی HTML
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
```

#### 2. بهینه‌سازی تصاویر
```bash
# نصب ابزار بهینه‌سازی
npm install -g imagemin-cli

# بهینه‌سازی PNG
imagemin assets/icons/*.png --out-dir=assets/icons/optimized/
```

### تنظیمات امنیت

#### فایل `security.xml` در `res/xml/`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">iranempire.game</domain>
    </domain-config>
    <base-config cleartextTrafficPermitted="false" />
</network-security-config>
```

### پیکربندی ProGuard (کاهش حجم APK)

#### فایل `proguard.cfg`:
```
-keep class org.apache.cordova.** { *; }
-keep class com.iranempire.** { *; }
-dontwarn org.apache.**
-optimizationpasses 5
```

## 🧪 تست و بررسی کیفیت

### تست عملکرد
```bash
# تست Lighthouse
npm run test:lighthouse

# تست PWA
npm run test:pwa
```

### تست روی دستگاه‌های مختلف
- **Android 8+**: تست عملکرد کلی
- **Android 12+**: تست Material You themes
- **تبلت**: تست رابط کاربری واکنش‌گرا

## 📦 انتشار در Google Play Store

### آماده‌سازی فایل‌ها

1. **AAB Bundle** (توصیه Google):
```bash
cordova build android --release -- --packageType=bundle
```

2. **تصاویر Store Listing**:
   - آیکون: ۵۱۲×۵۱۲ پیکسل
   - اسکرین‌شات‌ها: حداقل ۲ تصویر
   - Banner: ۱۰۲۴×۵۰۰ پیکسل

3. **اطلاعات ضروری**:
   - شرح کوتاه (۸۰ کاراکتر)
   - شرح کامل (۴۰۰۰ کاراکتر)
   - دسته‌بندی: Games > Strategy

### فرآیند انتشار

1. **ایجاد حساب Google Play Developer** ($25)
2. **آپلود AAB** در Google Play Console
3. **تکمیل اطلاعات** Store Listing
4. **تنظیم قیمت** (رایگان/پولی)
5. **ارسال برای بررسی** (۲-۷ روز)

## 🐛 رفع مشکلات متداول

### خطای "Android SDK not found"
```bash
# تنظیم متغیر محیطی (Linux/Mac)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Windows
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

### خطای "JAVA_HOME not set"
```bash
# Linux/Mac
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk

# Windows
set JAVA_HOME=C:\Program Files\Java\jdk1.8.0_XXX
```

### مشکل اندازه فونت‌ها
```css
/* اضافه کردن به CSS */
@media screen and (max-width: 480px) {
    html {
        font-size: 14px;
    }
}
```

### مشکل نمایش در حالت Landscape
```js
// اضافه کردن به JavaScript
screen.orientation.lock('portrait');
```

## 📊 آمار و Analytics

### Google Analytics
```html
<!-- اضافه به index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Firebase Analytics (توصیه شده برای موبایل)
```bash
# نصب plugin
cordova plugin add cordova-plugin-firebase-analytics

# تنظیم در config.xml
```

## 🔄 بروزرسانی اپلیکیشن

### بروزرسانی PWA
- خودکار از طریق Service Worker
- کاربر پیام بروزرسانی دریافت می‌کند

### بروزرسانی APK
1. افزایش `versionCode` در `config.xml`
2. ساخت APK جدید
3. آپلود در Google Play Console

## 🎯 نکات بهینه‌سازی

### عملکرد
- استفاده از LazyLoading برای تصاویر
- کش کردن assets در Service Worker
- فشرده‌سازی JavaScript و CSS

### باتری
- محدود کردن انیمیشن‌ها
- استفاده از requestAnimationFrame
- غیرفعال کردن vibration در صورت عدم نیاز

### حافظه
- مدیریت صحیح Event Listeners
- پاک‌سازی متغیرها در زمان مناسب
- بهینه‌سازی DOM queries

---

## 🆘 پشتیبانی

اگر با مشکلی مواجه شدید:

1. **مستندات Cordova**: [cordova.apache.org](https://cordova.apache.org/docs)
2. **راهنمای PWA**: [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps/)
3. **Android Developer Guide**: [developer.android.com](https://developer.android.com/guide)

**موفق باشید! 🇮🇷**