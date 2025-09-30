import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from 'web-vitals';

// Performance monitoring utility
export const reportWebVitals = (metric: Metric) => {
  // Only report in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Web Vitals:', metric);
  }

  // Send to analytics service (example)
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    timestamp: Date.now(),
    url: window.location.href,
  });

  // Use sendBeacon for better performance
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body);
  } else {
    // Fallback to fetch
    fetch('/api/analytics', {
      body,
      method: 'POST',
      keepalive: true,
    });
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Core Web Vitals
  onCLS(reportWebVitals);
  onFCP(reportWebVitals);
  onINP(reportWebVitals);
  onLCP(reportWebVitals);
  onTTFB(reportWebVitals);

  // Custom performance metrics
  if ('performance' in window) {
    // Measure React render time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        if (perfData) {
          const loadTime = perfData.loadEventEnd - perfData.fetchStart;
          const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.fetchStart;

          console.log('Custom Performance Metrics:', {
            loadTime: `${loadTime}ms`,
            domContentLoaded: `${domContentLoaded}ms`,
            firstByte: `${perfData.responseStart - perfData.fetchStart}ms`,
          });
        }
      }, 0);
    });
  }
};

// Bundle size monitoring
export const getBundleSize = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    const jsFiles = resources.filter(resource =>
      resource.name.includes('.js') && !resource.name.includes('node_modules')
    );

    const totalSize = jsFiles.reduce((total, file) => total + (file.transferSize || 0), 0);

    console.log(`Total JS Bundle Size: ${(totalSize / 1024).toFixed(2)} KB`);
    return totalSize;
  }
  return 0;
};

// Memory usage monitoring (if available)
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
    });

    return memory;
  }
  return null;
};
