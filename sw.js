// Service Worker برای امپراطوری ایران ۲۰۲۷
const CACHE_NAME = 'iran-empire-2027-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  // Google Fonts
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700&display=swap',
  // Assets
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png'
];

// نصب Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker: نصب شده');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: فایل‌ها کش شدند');
        return cache.addAll(urlsToCache);
      })
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker: فعال شده');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // حذف کش‌های قدیمی
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: کش قدیمی حذف شد:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// رهگیری درخواست‌ها
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // اگر فایل در کش موجود است، آن را برگردان
        if (response) {
          return response;
        }

        // در غیر این صورت از شبکه دریافت کن
        return fetch(event.request).then(
          function(response) {
            // بررسی اینکه آیا پاسخ معتبر است
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // کپی پاسخ برای کش
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(function() {
        // اگر آفلاین هستیم و فایل در کش نیست، صفحه آفلاین نمایش بده
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// مدیریت پیام‌ها از اپلیکیشن اصلی
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// نوتیفیکیشن‌های Push
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'رویداد جدید در امپراطوری شما!',
    icon: './assets/icons/icon-192x192.png',
    badge: './assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'مشاهده',
        icon: './assets/icons/view.png'
      },
      {
        action: 'close',
        title: 'بستن',
        icon: './assets/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('امپراطوری ایران ۲۰۲۷', options)
  );
});

// کلیک روی نوتیفیکیشن
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    // باز کردن بازی
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// آپدیت خودکار
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // همگام‌سازی داده‌های بازی
  return new Promise(function(resolve) {
    // اینجا می‌توانید داده‌های بازی را با سرور همگام کنید
    console.log('Background sync انجام شد');
    resolve();
  });
}