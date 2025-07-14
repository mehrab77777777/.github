# Makefile برای پروژه امپراطوری ایران ۲۰۲۷

# متغیرها
APP_NAME = iran-empire-2027
PACKAGE_ID = com.iranempire.game2027
BUILD_DIR = build
ANDROID_DIR = $(BUILD_DIR)/android
PWA_DIR = $(BUILD_DIR)/pwa

# رنگ‌های مختلف برای خروجی
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: help install build clean serve test deploy android pwa icons

# راهنما
help:
	@echo "$(BLUE)🏛️  امپراطوری ایران ۲۰۲۷ - راهنمای ساخت$(NC)"
	@echo ""
	@echo "دستورات موجود:"
	@echo "  $(GREEN)make install$(NC)     - نصب وابستگی‌ها"
	@echo "  $(GREEN)make serve$(NC)       - اجرای سرور محلی"
	@echo "  $(GREEN)make build$(NC)       - ساخت همه نسخه‌ها"
	@echo "  $(GREEN)make pwa$(NC)         - ساخت PWA"
	@echo "  $(GREEN)make android$(NC)     - ساخت APK اندروید"
	@echo "  $(GREEN)make icons$(NC)       - تولید آیکون‌ها"
	@echo "  $(GREEN)make test$(NC)        - اجرای تست‌ها"
	@echo "  $(GREEN)make clean$(NC)       - پاک‌سازی فایل‌های build"
	@echo "  $(GREEN)make deploy$(NC)      - انتشار PWA"
	@echo ""

# نصب وابستگی‌ها
install:
	@echo "$(YELLOW)📦 نصب وابستگی‌ها...$(NC)"
	npm install
	@which cordova > /dev/null || npm install -g cordova
	@echo "$(GREEN)✅ وابستگی‌ها نصب شدند$(NC)"

# اجرای سرور محلی
serve:
	@echo "$(BLUE)🚀 شروع سرور محلی...$(NC)"
	@echo "$(YELLOW)🌐 بازی در آدرس http://localhost:8000 در دسترس است$(NC)"
	python3 -m http.server 8000

# تولید آیکون‌ها
icons:
	@echo "$(YELLOW)🎨 تولید آیکون‌ها...$(NC)"
	node scripts/generate-icons.js
	@echo "$(GREEN)✅ آیکون‌ها تولید شدند$(NC)"

# ساخت PWA
pwa: icons
	@echo "$(YELLOW)📱 ساخت PWA...$(NC)"
	@mkdir -p $(PWA_DIR)
	@cp -r *.html *.css *.js *.json assets/ $(PWA_DIR)/
	@cp sw.js $(PWA_DIR)/
	@echo "$(GREEN)✅ PWA آماده است در: $(PWA_DIR)$(NC)"

# ساخت APK اندروید
android: icons
	@echo "$(YELLOW)🤖 ساخت اپلیکیشن اندروید...$(NC)"
	@mkdir -p $(ANDROID_DIR)
	
	# بررسی نصب Cordova
	@which cordova > /dev/null || (echo "$(RED)❌ Cordova نصب نیست. لطفاً ابتدا 'npm install -g cordova' اجرا کنید$(NC)" && exit 1)
	
	# ایجاد پروژه Cordova
	@if [ ! -d "$(ANDROID_DIR)/cordova" ]; then \
		cordova create $(ANDROID_DIR)/cordova $(PACKAGE_ID) "$(APP_NAME)"; \
	fi
	
	# کپی فایل‌ها
	@cp -r *.html *.css *.js assets/ $(ANDROID_DIR)/cordova/www/
	@cp config.xml $(ANDROID_DIR)/cordova/
	
	# افزودن پلتفرم اندروید
	@cd $(ANDROID_DIR)/cordova && cordova platform add android --save
	
	# ساخت APK
	@cd $(ANDROID_DIR)/cordova && cordova build android
	
	# کپی APK نهایی
	@cp $(ANDROID_DIR)/cordova/platforms/android/app/build/outputs/apk/debug/app-debug.apk $(BUILD_DIR)/$(APP_NAME)-debug.apk
	
	@echo "$(GREEN)✅ APK ساخته شد: $(BUILD_DIR)/$(APP_NAME)-debug.apk$(NC)"

# ساخت APK نهایی برای انتشار
android-release: android
	@echo "$(YELLOW)📦 ساخت APK نهایی...$(NC)"
	@cd $(ANDROID_DIR)/cordova && cordova build android --release
	@cp $(ANDROID_DIR)/cordova/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk $(BUILD_DIR)/$(APP_NAME)-release-unsigned.apk
	@echo "$(GREEN)✅ APK نهایی ساخته شد: $(BUILD_DIR)/$(APP_NAME)-release-unsigned.apk$(NC)"
	@echo "$(YELLOW)⚠️  برای انتشار، APK را امضا کنید$(NC)"

# ساخت همه نسخه‌ها
build: pwa android
	@echo "$(GREEN)🎉 همه نسخه‌ها آماده شدند!$(NC)"
	@ls -la $(BUILD_DIR)/

# اجرای تست‌ها
test:
	@echo "$(YELLOW)🧪 اجرای تست‌ها...$(NC)"
	@echo "$(BLUE)📊 تست Lighthouse...$(NC)"
	-lighthouse http://localhost:8000 --output json --output-path $(BUILD_DIR)/lighthouse-report.json
	@echo "$(BLUE)✅ تست‌ها کامل شد$(NC)"

# بهینه‌سازی فایل‌ها
optimize:
	@echo "$(YELLOW)⚡ بهینه‌سازی فایل‌ها...$(NC)"
	
	# بهینه‌سازی JavaScript
	@if which uglifyjs > /dev/null; then \
		uglifyjs script.js -o script.min.js -c -m; \
		echo "$(GREEN)✓ JavaScript بهینه شد$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  uglifyjs نصب نیست$(NC)"; \
	fi
	
	# بهینه‌سازی CSS
	@if which cleancss > /dev/null; then \
		cleancss style.css -o style.min.css; \
		echo "$(GREEN)✓ CSS بهینه شد$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  cleancss نصب نیست$(NC)"; \
	fi

# نصب ابزارهای بهینه‌سازی
install-tools:
	@echo "$(YELLOW)🔧 نصب ابزارهای بهینه‌سازی...$(NC)"
	npm install -g uglify-js clean-css-cli html-minifier lighthouse
	@echo "$(GREEN)✅ ابزارها نصب شدند$(NC)"

# انتشار PWA در GitHub Pages
deploy: pwa
	@echo "$(YELLOW)🚀 انتشار PWA...$(NC)"
	@if which gh-pages > /dev/null; then \
		gh-pages -d $(PWA_DIR); \
		echo "$(GREEN)✅ PWA منتشر شد$(NC)"; \
	else \
		echo "$(RED)❌ gh-pages نصب نیست. 'npm install -g gh-pages' اجرا کنید$(NC)"; \
	fi

# پاک‌سازی فایل‌های build
clean:
	@echo "$(YELLOW)🧹 پاک‌سازی فایل‌های build...$(NC)"
	rm -rf $(BUILD_DIR)
	rm -rf node_modules/.cache
	@echo "$(GREEN)✅ پاک‌سازی کامل شد$(NC)"

# نصب APK روی گوشی متصل
install-apk: android
	@echo "$(YELLOW)📱 نصب APK روی گوشی...$(NC)"
	@if which adb > /dev/null; then \
		adb install -r $(BUILD_DIR)/$(APP_NAME)-debug.apk; \
		echo "$(GREEN)✅ APK نصب شد$(NC)"; \
	else \
		echo "$(RED)❌ ADB نصب نیست یا گوشی متصل نیست$(NC)"; \
	fi

# بررسی وضعیت سیستم
check:
	@echo "$(BLUE)🔍 بررسی وضعیت سیستم...$(NC)"
	@echo ""
	
	@echo "$(YELLOW)Node.js:$(NC)"
	@which node > /dev/null && node --version || echo "$(RED)❌ نصب نیست$(NC)"
	
	@echo "$(YELLOW)NPM:$(NC)"
	@which npm > /dev/null && npm --version || echo "$(RED)❌ نصب نیست$(NC)"
	
	@echo "$(YELLOW)Cordova:$(NC)"
	@which cordova > /dev/null && cordova --version || echo "$(RED)❌ نصب نیست$(NC)"
	
	@echo "$(YELLOW)ADB:$(NC)"
	@which adb > /dev/null && adb version || echo "$(RED)❌ نصب نیست$(NC)"
	
	@echo "$(YELLOW)Java:$(NC)"
	@which java > /dev/null && java -version || echo "$(RED)❌ نصب نیست$(NC)"
	
	@echo ""
	@echo "$(BLUE)💡 برای نصب ابزارهای مفقود، مراجعه کنید به BUILD_GUIDE.md$(NC)"

# راه‌اندازی کامل پروژه
setup: install icons
	@echo "$(GREEN)🎉 پروژه آماده است!$(NC)"
	@echo "$(BLUE)💡 دستورات مفید:$(NC)"
	@echo "  make serve     - شروع سرور محلی"
	@echo "  make build     - ساخت همه نسخه‌ها"
	@echo "  make android   - ساخت APK"

# نمایش اطلاعات پروژه
info:
	@echo "$(BLUE)📋 اطلاعات پروژه$(NC)"
	@echo "نام: امپراطوری ایران ۲۰۲۷"
	@echo "نوع: بازی استراتژیک PWA"
	@echo "زبان: فارسی"
	@echo "پلتفرم: وب، اندروید، iOS"
	@echo "مجوز: MIT"
	@echo ""
	@echo "$(GREEN)🚀 برای شروع: make serve$(NC)"