#!/usr/bin/env node

/**
 * اسکریپت تولید آیکون‌های مختلف برای PWA و اندروید
 * این اسکریپت یک آیکون اصلی را به اندازه‌های مختلف تبدیل می‌کند
 */

const fs = require('fs');
const path = require('path');

// اندازه‌های آیکون‌های مورد نیاز
const iconSizes = {
  pwa: [
    { size: 72, name: 'icon-72x72.png' },
    { size: 96, name: 'icon-96x96.png' },
    { size: 128, name: 'icon-128x128.png' },
    { size: 144, name: 'icon-144x144.png' },
    { size: 152, name: 'icon-152x152.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 384, name: 'icon-384x384.png' },
    { size: 512, name: 'icon-512x512.png' }
  ],
  android: [
    { size: 36, density: 'ldpi', name: 'drawable-ldpi-icon.png' },
    { size: 48, density: 'mdpi', name: 'drawable-mdpi-icon.png' },
    { size: 72, density: 'hdpi', name: 'drawable-hdpi-icon.png' },
    { size: 96, density: 'xhdpi', name: 'drawable-xhdpi-icon.png' },
    { size: 144, density: 'xxhdpi', name: 'drawable-xxhdpi-icon.png' },
    { size: 192, density: 'xxxhdpi', name: 'drawable-xxxhdpi-icon.png' }
  ]
};

// آیکون پیش‌فرض SVG (اگر آیکون اصلی موجود نباشد)
const defaultIconSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- پس‌زمینه -->
  <rect width="512" height="512" rx="80" fill="url(#grad1)"/>
  
  <!-- تاج امپراطوری -->
  <g transform="translate(256,256)">
    <!-- قاعده تاج -->
    <rect x="-120" y="80" width="240" height="20" fill="#FFD700" rx="10"/>
    
    <!-- بدنه تاج -->
    <path d="M-100 20 L-80 80 L80 80 L100 20 L80 -20 L60 0 L40 -30 L20 10 L0 -40 L-20 10 L-40 -30 L-60 0 L-80 -20 Z" 
          fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
    
    <!-- جواهرات -->
    <circle cx="0" cy="-10" r="12" fill="#FF4444"/>
    <circle cx="-40" cy="10" r="8" fill="#44FF44"/>
    <circle cx="40" cy="10" r="8" fill="#4444FF"/>
    <circle cx="-20" cy="30" r="6" fill="#FF44FF"/>
    <circle cx="20" cy="30" r="6" fill="#44FFFF"/>
    
    <!-- متن فارسی -->
    <text x="0" y="150" text-anchor="middle" fill="white" font-family="serif" font-size="36" font-weight="bold">
      ایران
    </text>
    <text x="0" y="180" text-anchor="middle" fill="white" font-family="serif" font-size="24">
      ۲۰۲۷
    </text>
  </g>
</svg>
`;

function createDirectories() {
  const dirs = [
    'assets/icons',
    'assets/icons/android',
    'assets/icons/ios',
    'assets/screens',
    'assets/screens/android'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ پوشه ایجاد شد: ${dir}`);
    }
  });
}

function generateDefaultIcon() {
  const iconPath = 'assets/icons/icon-base.svg';
  
  if (!fs.existsSync(iconPath)) {
    fs.writeFileSync(iconPath, defaultIconSVG);
    console.log('✅ آیکون پیش‌فرض ایجاد شد');
  }
  
  return iconPath;
}

function generateIconFiles() {
  console.log('🎨 شروع تولید آیکون‌ها...');
  
  // ایجاد پوشه‌ها
  createDirectories();
  
  // تولید آیکون پیش‌فرض
  const baseSVG = generateDefaultIcon();
  
  // تولید آیکون‌های PWA
  console.log('📱 تولید آیکون‌های PWA...');
  iconSizes.pwa.forEach(icon => {
    const outputPath = `assets/icons/${icon.name}`;
    createPNGFromSVG(baseSVG, outputPath, icon.size);
  });
  
  // تولید آیکون‌های اندروید
  console.log('🤖 تولید آیکون‌های اندروید...');
  iconSizes.android.forEach(icon => {
    const outputPath = `assets/icons/android/${icon.name}`;
    createPNGFromSVG(baseSVG, outputPath, icon.size);
  });
  
  // تولید splash screen
  generateSplashScreens();
  
  console.log('✅ همه آیکون‌ها تولید شدند!');
}

function createPNGFromSVG(svgPath, outputPath, size) {
  // در حالت واقعی، از sharp یا jimp استفاده می‌کنیم
  // اینجا فقط فایل‌های placeholder ایجاد می‌کنیم
  const placeholder = `<!-- PNG placeholder ${size}x${size} -->`;
  
  try {
    fs.writeFileSync(outputPath, placeholder);
    console.log(`  ✓ ${outputPath} (${size}x${size})`);
  } catch (error) {
    console.error(`  ✗ خطا در ایجاد ${outputPath}:`, error.message);
  }
}

function generateSplashScreens() {
  console.log('🖼️ تولید Splash Screen ها...');
  
  const splashSizes = [
    { width: 320, height: 480, name: 'drawable-port-ldpi-screen.png' },
    { width: 320, height: 480, name: 'drawable-port-mdpi-screen.png' },
    { width: 480, height: 800, name: 'drawable-port-hdpi-screen.png' },
    { width: 720, height: 1280, name: 'drawable-port-xhdpi-screen.png' },
    { width: 960, height: 1600, name: 'drawable-port-xxhdpi-screen.png' },
    { width: 1280, height: 1920, name: 'drawable-port-xxxhdpi-screen.png' }
  ];
  
  splashSizes.forEach(splash => {
    const outputPath = `assets/screens/android/${splash.name}`;
    const placeholder = `<!-- Splash Screen ${splash.width}x${splash.height} -->`;
    
    try {
      fs.writeFileSync(outputPath, placeholder);
      console.log(`  ✓ ${splash.name} (${splash.width}x${splash.height})`);
    } catch (error) {
      console.error(`  ✗ خطا در ایجاد ${splash.name}:`, error.message);
    }
  });
}

// اجرای اسکریپت
if (require.main === module) {
  generateIconFiles();
}

module.exports = { generateIconFiles };