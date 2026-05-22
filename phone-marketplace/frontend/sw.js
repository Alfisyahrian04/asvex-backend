const CACHE_NAME =
'marketplace-v1';

const urlsToCache = [

  '/',

  '/index.html',

  '/css/style.css'

];

self.addEventListener(
  'install',
  event => {

    event.waitUntil(

      caches.open(CACHE_NAME)

      .then(cache => {

        return cache.addAll(
          urlsToCache
        );

      })

    );

  }
);
