
self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', function(event) {
  // Simple fetch handler for PWA requirements
});
