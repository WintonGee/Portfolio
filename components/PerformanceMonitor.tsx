"use client";

import { useEffect } from "react";

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== "production") return;

    // Web Vitals monitoring
    const reportWebVitals = (metric: any) => {
      // Log to console in development
      console.log("Web Vital:", metric);

      // In production, you could send to analytics service
      // Example: gtag('event', metric.name, {
      //   value: Math.round(metric.value),
      //   event_category: 'Web Vitals',
      //   event_label: metric.id,
      //   non_interaction: true,
      // });
    };

    // Measure Core Web Vitals
    const measureWebVitals = () => {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        reportWebVitals({
          name: "LCP",
          value: lastEntry.startTime,
          id: "lcp",
        });
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as any; // Type assertion for FID-specific properties
          reportWebVitals({
            name: "FID",
            value: fidEntry.processingStart - fidEntry.startTime,
            id: "fid",
          });
        });
      }).observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const clsEntry = entry as any; // Type assertion for CLS-specific properties
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
          }
        });
        reportWebVitals({
          name: "CLS",
          value: clsValue,
          id: "cls",
        });
      }).observe({ entryTypes: ["layout-shift"] });

      // First Contentful Paint (FCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          reportWebVitals({
            name: "FCP",
            value: entry.startTime,
            id: "fcp",
          });
        });
      }).observe({ entryTypes: ["paint"] });
    };

    // Resource timing
    const measureResourceTiming = () => {
      window.addEventListener("load", () => {
        const resources = performance.getEntriesByType("resource");
        const totalLoadTime =
          performance.timing.loadEventEnd - performance.timing.navigationStart;

        reportWebVitals({
          name: "Total Load Time",
          value: totalLoadTime,
          id: "total-load-time",
        });

        // Log slow resources
        resources.forEach((resource) => {
          const resourceEntry = resource as any; // Type assertion for resource-specific properties
          if (resourceEntry.duration > 1000) {
            // Resources taking more than 1 second
            console.warn("Slow resource:", {
              name: resourceEntry.name,
              duration: resourceEntry.duration,
              size: resourceEntry.transferSize,
            });
          }
        });
      });
    };

    // Memory usage monitoring
    const measureMemoryUsage = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        reportWebVitals({
          name: "Memory Usage",
          value: memory.usedJSHeapSize / 1024 / 1024, // MB
          id: "memory-usage",
        });
      }
    };

    // Initialize monitoring
    measureWebVitals();
    measureResourceTiming();
    measureMemoryUsage();

    // Monitor memory usage periodically
    const memoryInterval = setInterval(measureMemoryUsage, 30000); // Every 30 seconds

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  return null; // This component doesn't render anything
}
