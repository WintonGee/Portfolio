// Service Worker for Portfolio Website
const CACHE_NAME = "portfolio-v1.0.0";
const STATIC_CACHE_NAME = "portfolio-static-v1.0.0";
const DYNAMIC_CACHE_NAME = "portfolio-dynamic-v1.0.0";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/headshot.jpg",
  "/images/projects/foodmanager/foodmanager-cover.png",
  "/images/projects/foodmanager/foodmanager-interface.png",
  "/images/projects/foodmanager/foodmanager-overview.png",
  "/images/projects/foodmanager/foodmanager-cost-dashboard.png",
  "/logos/companies/mercor.png",
  "/logos/companies/cochat.png",
  "/logos/companies/afterquery.png",
  "/logos/companies/calpoly-mustangs.png",
  "/logos/companies/ricoh.png",
  "/logos/companies/tribot.png",
  "/logos/companies/square.png",
  "/logos/companies/linkedin.png",
  "/logos/companies/ccsf.png",
  "/logos/companies/default.png",
  "/resume/AIML_Resume_WintonGee.pdf",
  "/manifest.json",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Installation complete");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Installation failed", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activation complete");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (request.destination === "image") {
    event.respondWith(handleImageRequest(request));
  } else if (request.destination === "document") {
    event.respondWith(handleDocumentRequest(request));
  } else {
    event.respondWith(handleOtherRequest(request));
  }
});

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Service Worker: Image fetch failed", error);
    // Return a placeholder image or fallback
    return new Response("Image not available", { status: 404 });
  }
}

// Handle document requests with network-first strategy
async function handleDocumentRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Service Worker: Document fetch failed", error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page
    return caches.match("/") || new Response("Offline", { status: 503 });
  }
}

// Handle other requests with cache-first strategy
async function handleOtherRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Service Worker: Request failed", error);
    return new Response("Resource not available", { status: 404 });
  }
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log("Service Worker: Background sync triggered");
  // Implement background sync logic here
  // For example, sync form submissions when back online
}

// Push notifications (if needed in the future)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/logos/companies/default.png",
      badge: "/logos/companies/default.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
