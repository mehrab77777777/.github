// حالت اصلی بازی
let gameState = {
    year: 2027,
    turn: 1,
    empire: {
        name: "امپراطوری ایران",
        population: 85000000,
        happiness: 75,
        industry: 65,
        stability: 80
    },
    resources: {
        gold: 100000,
        food: 80000,
        energy: 60000,
        production: 45000
    },
    resourceIncome: {
        gold: 15000,
        food: 12000,
        energy: 8000,
        production: 6000
    },
    military: {
        infantry: 50000,
        airforce: 250,
        navy: 150,
        missiles: 100
    },
    research: {
        points: 25000,
        technologies: []
    },
    diplomacy: {
        usa: 'neutral',
        russia: 'friendly',
        china: 'friendly'
    },
    projects: {
        built: []
    },
    regions: [
        { name: "تهران", population: 15000000, industry: 85, happiness: 80 },
        { name: "اصفهان", population: 5000000, industry: 70, happiness: 75 },
        { name: "مشهد", population: 3500000, industry: 60, happiness: 78 },
        { name: "شیراز", population: 2000000, industry: 65, happiness: 80 },
        { name: "تبریز", population: 1800000, industry: 68, happiness: 72 },
        { name: "کرمان", population: 800000, industry: 45, happiness: 70 }
    ]
};

// رویدادهای تصادفی
const randomEvents = [
    {
        title: "کشف ذخایر نفتی جدید",
        description: "ذخایر نفتی عظیمی در جنوب کشور کشف شده است. این می‌تواند درآمد شما را به طور قابل توجهی افزایش دهد.",
        choices: [
            { text: "استخراج فوری", effect: { gold: 50000, happiness: -5 } },
            { text: "استخراج تدریجی", effect: { gold: 25000, stability: 5 } }
        ]
    },
    {
        title: "بحران اقتصادی منطقه‌ای",
        description: "بحران اقتصادی در منطقه شروع شده است. چگونه با این وضعیت مقابله می‌کنید؟",
        choices: [
            { text: "حمایت از بازار", effect: { gold: -20000, happiness: 10 } },
            { text: "محافظت از ذخایر", effect: { gold: 5000, happiness: -10 } }
        ]
    },
    {
        title: "انقلاب فناوری",
        description: "دانشمندان کشور موفق به ساخت فناوری جدیدی شده‌اند که می‌تواند صنایع را متحول کند.",
        choices: [
            { text: "سرمایه‌گذاری در تحقیقات", effect: { production: 10000, gold: -15000 } },
            { text: "فروش فناوری", effect: { gold: 30000, research: -5000 } }
        ]
    },
    {
        title: "تظاهرات مردمی",
        description: "مردم خواستار بهبود شرایط زندگی هستند. واکنش شما چیست؟",
        choices: [
            { text: "پذیرش خواسته‌ها", effect: { happiness: 15, gold: -25000 } },
            { text: "سرکوب تظاهرات", effect: { stability: -10, happiness: -15 } }
        ]
    }
];

// اخبار جهان
const worldNews = [
    "تنش‌های اقتصادی در منطقه افزایش یافته است",
    "کشورهای همسایه به دنبال توافق‌های تجاری جدید هستند",
    "پیشرفت‌های فناوری در صنایع نظامی سراسر جهان",
    "بحران‌های زیست‌محیطی جهانی در حال تشدید است",
    "روابط دیپلماتیک بین قدرت‌های بزرگ در حال تغییر است"
];

// مقداردهی اولیه بازی
document.addEventListener('DOMContentLoaded', function() {
    updateUI();
    initializeRegions();
    setupTabSwitching();
    
    // نمایش پیام خوش‌آمدگویی
    setTimeout(() => {
        showEvent({
            title: "🎉 خوش آمدید به امپراطوری ایران ۲۰۲۷!",
            description: "شما فرمانده امپراطوری بزرگ ایران هستید. وظیفه شما هدایت کشور به سوی عظمت و قدرت است. آیا آماده این چالش بزرگ هستید؟",
            choices: [
                { text: "✊ آماده‌ام!", effect: { happiness: 5 } },
                { text: "🤔 نیاز به آماده‌سازی دارم", effect: { research: 2000 } }
            ]
        });
    }, 1000);
});

// بروزرسانی رابط کاربری
function updateUI() {
    // بروزرسانی هدر
    document.getElementById('current-year').textContent = toPersianNumber(gameState.year);
    document.getElementById('current-turn').textContent = toPersianNumber(gameState.turn);
    
    // بروزرسانی آمار امپراطوری
    document.getElementById('population').textContent = formatNumber(gameState.empire.population);
    document.getElementById('happiness').textContent = toPersianNumber(gameState.empire.happiness) + '٪';
    document.getElementById('industry').textContent = toPersianNumber(gameState.empire.industry) + '٪';
    document.getElementById('stability').textContent = toPersianNumber(gameState.empire.stability) + '٪';
    
    // بروزرسانی منابع
    document.getElementById('gold').textContent = formatNumber(gameState.resources.gold);
    document.getElementById('food').textContent = formatNumber(gameState.resources.food);
    document.getElementById('energy').textContent = formatNumber(gameState.resources.energy);
    document.getElementById('production').textContent = formatNumber(gameState.resources.production);
    
    // بروزرسانی نیروی نظامی
    document.getElementById('infantry').textContent = formatNumber(gameState.military.infantry);
    document.getElementById('air-force').textContent = formatNumber(gameState.military.airforce);
    document.getElementById('navy').textContent = formatNumber(gameState.military.navy);
    document.getElementById('missiles').textContent = formatNumber(gameState.military.missiles);
    
    // بروزرسانی امتیاز تحقیق
    document.getElementById('research-points').textContent = formatNumber(gameState.research.points);
    
    updateResourceWarnings();
}

// هشدارهای منابع
function updateResourceWarnings() {
    const cards = document.querySelectorAll('.resource-card, .stat-card');
    cards.forEach(card => {
        card.classList.remove('warning', 'highlight');
    });
    
    // بررسی منابع کم
    if (gameState.resources.gold < 20000) {
        document.querySelector('#gold').closest('.resource-card').classList.add('warning');
    }
    if (gameState.empire.happiness < 50) {
        document.querySelector('#happiness').closest('.stat-card').classList.add('warning');
    }
    if (gameState.empire.stability < 50) {
        document.querySelector('#stability').closest('.stat-card').classList.add('warning');
    }
}

// تنظیم تعویض تب‌ها
function setupTabSwitching() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // حذف کلاس active از همه دکمه‌ها و تب‌ها
            menuButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // افزودن کلاس active به دکمه و تب انتخاب شده
            button.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
}

// مقداردهی استان‌ها
function initializeRegions() {
    const regionsContainer = document.getElementById('regions-list');
    regionsContainer.innerHTML = '';
    
    gameState.regions.forEach((region, index) => {
        const regionCard = document.createElement('div');
        regionCard.className = 'region-card';
        regionCard.innerHTML = `
            <h4>🏙️ ${region.name}</h4>
            <div class="region-stats">
                <span>جمعیت: ${formatNumber(region.population)}</span>
                <span>صنعت: ${toPersianNumber(region.industry)}٪</span>
                <span>رضایت: ${toPersianNumber(region.happiness)}٪</span>
            </div>
        `;
        regionCard.addEventListener('click', () => selectRegion(index));
        regionsContainer.appendChild(regionCard);
    });
}

// انتخاب استان
function selectRegion(index) {
    const region = gameState.regions[index];
    showEvent({
        title: `🏙️ استان ${region.name}`,
        description: `جمعیت: ${formatNumber(region.population)}\nسطح صنعت: ${region.industry}٪\nرضایتمندی: ${region.happiness}٪\n\nچه اقدامی می‌خواهید انجام دهید؟`,
        choices: [
            { text: "سرمایه‌گذاری در صنعت", effect: { gold: -10000, production: 2000 } },
            { text: "بهبود رفاه مردم", effect: { gold: -8000, happiness: 5 } }
        ]
    });
}

// ساخت پروژه
function buildProject(projectType) {
    const projects = {
        bank: { cost: 20000, effect: { goldIncome: 3000 }, name: "بانک مرکزی" },
        farm: { cost: 15000, effect: { foodIncome: 3600 }, name: "توسعه کشاورزی" },
        powerplant: { cost: 25000, effect: { energyIncome: 2000 }, name: "نیروگاه برق" }
    };
    
    const project = projects[projectType];
    
    if (gameState.resources.gold >= project.cost) {
        gameState.resources.gold -= project.cost;
        
        if (project.effect.goldIncome) {
            gameState.resourceIncome.gold += project.effect.goldIncome;
        }
        if (project.effect.foodIncome) {
            gameState.resourceIncome.food += project.effect.foodIncome;
        }
        if (project.effect.energyIncome) {
            gameState.resourceIncome.energy += project.effect.energyIncome;
        }
        
        gameState.projects.built.push(projectType);
        
        showNotification(`✅ ${project.name} با موفقیت ساخته شد!`, 'success');
        updateUI();
    } else {
        showNotification('❌ طلای کافی برای این پروژه ندارید!', 'error');
    }
}

// استخدام نیرو
function recruitUnit(unitType) {
    const units = {
        infantry: { cost: 5000, amount: 1000, name: "پیاده نظام" },
        airforce: { cost: 20000, amount: 10, name: "جنگنده" },
        navy: { cost: 30000, amount: 5, name: "ناوشکن" }
    };
    
    const unit = units[unitType];
    
    if (gameState.resources.gold >= unit.cost) {
        gameState.resources.gold -= unit.cost;
        gameState.military[unitType] += unit.amount;
        
        showNotification(`✅ ${unit.amount} ${unit.name} استخدام شد!`, 'success');
        updateUI();
    } else {
        showNotification('❌ طلای کافی برای استخدام ندارید!', 'error');
    }
}

// تغییر روابط دیپلماتیک
function changeDiplomacy(country, action) {
    const actions = {
        alliance: 'متحد',
        trade: 'شریک تجاری',
        hostility: 'متخاصم'
    };
    
    const effects = {
        alliance: { gold: 5000, happiness: 5 },
        trade: { gold: 10000 },
        hostility: { military: 1000, happiness: -5 }
    };
    
    gameState.diplomacy[country] = action;
    
    if (effects[action].gold) {
        gameState.resources.gold += effects[action].gold;
    }
    if (effects[action].happiness) {
        gameState.empire.happiness += effects[action].happiness;
    }
    
    showNotification(`🤝 روابط با ${getCountryName(country)} به ${actions[action]} تغییر یافت!`, 'info');
    updateUI();
}

// تحقیق فناوری
function research(techType) {
    const technologies = {
        automation: { cost: 10000, effect: { production: 9000 }, name: "اتوماسیون صنعتی" },
        'smart-missiles': { cost: 15000, effect: { military: 500 }, name: "موشک‌های هوشمند" },
        'solar-energy': { cost: 8000, effect: { energy: 10000 }, name: "انرژی خورشیدی" }
    };
    
    const tech = technologies[techType];
    
    if (gameState.research.points >= tech.cost) {
        gameState.research.points -= tech.cost;
        
        if (tech.effect.production) {
            gameState.resourceIncome.production += tech.effect.production;
        }
        if (tech.effect.military) {
            gameState.military.infantry += tech.effect.military;
        }
        if (tech.effect.energy) {
            gameState.resourceIncome.energy += tech.effect.energy;
        }
        
        gameState.research.technologies.push(techType);
        
        showNotification(`🔬 ${tech.name} با موفقیت تحقیق شد!`, 'success');
        updateUI();
    } else {
        showNotification('❌ امتیاز تحقیق کافی ندارید!', 'error');
    }
}

// نوبت بعدی
function nextTurn() {
    gameState.turn++;
    
    // افزودن درآمد منابع
    gameState.resources.gold += gameState.resourceIncome.gold;
    gameState.resources.food += gameState.resourceIncome.food;
    gameState.resources.energy += gameState.resourceIncome.energy;
    gameState.resources.production += gameState.resourceIncome.production;
    
    // افزودن امتیاز تحقیق
    gameState.research.points += 3000;
    
    // تغییرات تصادفی
    applyRandomChanges();
    
    // رویداد تصادفی
    if (Math.random() < 0.3) {
        const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        showEvent(randomEvent);
    }
    
    // اگر سال جدید باشد
    if (gameState.turn % 4 === 0) {
        gameState.year++;
        showYearlyReport();
    }
    
    // اضافه کردن خبر جدید
    addWorldNews();
    
    updateUI();
}

// تغییرات تصادفی
function applyRandomChanges() {
    // تغییرات کوچک در آمار
    gameState.empire.happiness += Math.floor(Math.random() * 6) - 3;
    gameState.empire.stability += Math.floor(Math.random() * 4) - 2;
    
    // محدود کردن مقادیر
    gameState.empire.happiness = Math.max(0, Math.min(100, gameState.empire.happiness));
    gameState.empire.stability = Math.max(0, Math.min(100, gameState.empire.stability));
}

// گزارش سالانه
function showYearlyReport() {
    const report = `
    📊 گزارش سال ${toPersianNumber(gameState.year)}
    
    📈 رشد اقتصادی: +${toPersianNumber(Math.floor(Math.random() * 10) + 5)}٪
    👥 رشد جمعیت: +${formatNumber(Math.floor(Math.random() * 1000000) + 500000)}
    🏭 توسعه صنعتی: +${toPersianNumber(Math.floor(Math.random() * 5) + 2)}٪
    
    امپراطوری شما در حال پیشرفت است!
    `;
    
    showEvent({
        title: "📊 گزارش سالانه",
        description: report,
        choices: [
            { text: "ادامه", effect: { happiness: 2 } }
        ]
    });
}

// افزودن خبر جهان
function addWorldNews() {
    const newsContainer = document.getElementById('world-news');
    const randomNewsText = worldNews[Math.floor(Math.random() * worldNews.length)];
    
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    newsItem.innerHTML = `
        <span class="news-date">سال ${toPersianNumber(gameState.year)}</span>
        <span class="news-text">${randomNewsText}</span>
    `;
    
    newsContainer.insertBefore(newsItem, newsContainer.firstChild);
    
    // حداکثر ۵ خبر نگه‌داری
    while (newsContainer.children.length > 5) {
        newsContainer.removeChild(newsContainer.lastChild);
    }
}

// نمایش رویداد
function showEvent(event) {
    const modal = document.getElementById('event-modal');
    const title = document.getElementById('event-title');
    const description = document.getElementById('event-description');
    const choice1 = document.getElementById('choice-1');
    const choice2 = document.getElementById('choice-2');
    
    title.textContent = event.title;
    description.textContent = event.description;
    
    if (event.choices[0]) {
        choice1.textContent = event.choices[0].text;
        choice1.onclick = () => handleEventChoice(0, event);
        choice1.style.display = 'block';
    }
    
    if (event.choices[1]) {
        choice2.textContent = event.choices[1].text;
        choice2.onclick = () => handleEventChoice(1, event);
        choice2.style.display = 'block';
    } else {
        choice2.style.display = 'none';
    }
    
    modal.classList.remove('hidden');
}

// مدیریت انتخاب رویداد
function handleEventChoice(choiceIndex, event) {
    const choice = event.choices[choiceIndex];
    const effect = choice.effect;
    
    // اعمال تأثیرات
    if (effect.gold) gameState.resources.gold += effect.gold;
    if (effect.food) gameState.resources.food += effect.food;
    if (effect.energy) gameState.resources.energy += effect.energy;
    if (effect.production) gameState.resources.production += effect.production;
    if (effect.happiness) gameState.empire.happiness += effect.happiness;
    if (effect.stability) gameState.empire.stability += effect.stability;
    if (effect.research) gameState.research.points += effect.research;
    if (effect.military) gameState.military.infantry += effect.military;
    
    // محدود کردن مقادیر
    gameState.empire.happiness = Math.max(0, Math.min(100, gameState.empire.happiness));
    gameState.empire.stability = Math.max(0, Math.min(100, gameState.empire.stability));
    gameState.resources.gold = Math.max(0, gameState.resources.gold);
    
    document.getElementById('event-modal').classList.add('hidden');
    updateUI();
    
    showNotification('✅ تصمیم شما اجرا شد!', 'info');
}

// ذخیره بازی
function saveGame() {
    localStorage.setItem('iranEmpire2027', JSON.stringify(gameState));
    showNotification('💾 بازی ذخیره شد!', 'success');
}

// بارگذاری بازی
function loadGame() {
    const savedGame = localStorage.getItem('iranEmpire2027');
    if (savedGame) {
        gameState = JSON.parse(savedGame);
        updateUI();
        initializeRegions();
        showNotification('📁 بازی بارگذاری شد!', 'success');
    }
}

// تنظیمات
function openSettings() {
    showEvent({
        title: "⚙️ تنظیمات بازی",
        description: "چه کاری می‌خواهید انجام دهید؟",
        choices: [
            { text: "🔄 بارگذاری بازی", effect: {} },
            { text: "🔄 شروع مجدد", effect: {} }
        ]
    });
}

// انتخاب منطقه در نقشه جهان
function selectRegion(regionName) {
    const regions = {
        iran: "امپراطوری ایران - قدرت منطقه‌ای با تاریخ کهن",
        usa: "ایالات متحده - ابرقدرت جهانی",
        russia: "روسیه - قدرت بزرگ اروپا و آسیا",
        china: "چین - قدرت اقتصادی نوظهور"
    };
    
    showNotification(`🌍 ${regions[regionName]}`, 'info');
}

// توابع کمکی
function formatNumber(num) {
    return toPersianNumber(num.toLocaleString('fa-IR'));
}

function toPersianNumber(num) {
    const englishToPersian = {'0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'};
    return num.toString().replace(/[0-9]/g, digit => englishToPersian[digit]);
}

function getCountryName(countryCode) {
    const names = {
        usa: "ایالات متحده",
        russia: "روسیه",
        china: "چین"
    };
    return names[countryCode] || countryCode;
}

function showNotification(message, type) {
    // ایجاد نوتیفیکیشن
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 2000;
        animation: slideDown 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    // افزودن CSS انیمیشن
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // حذف خودکار پس از ۳ ثانیه
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// بارگذاری خودکار بازی در صورت وجود
window.addEventListener('load', () => {
    const savedGame = localStorage.getItem('iranEmpire2027');
    if (savedGame) {
        setTimeout(() => {
            const shouldLoad = confirm('بازی ذخیره شده‌ای پیدا شد. آیا می‌خواهید ادامه دهید؟');
            if (shouldLoad) {
                loadGame();
            }
        }, 2000);
    }
});

// ذخیره خودکار هر ۲ دقیقه
setInterval(() => {
    saveGame();
}, 120000);

// کیبورد شورتکات
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                saveGame();
                break;
            case 'l':
                e.preventDefault();
                loadGame();
                break;
            case ' ':
                e.preventDefault();
                nextTurn();
                break;
        }
    }
});