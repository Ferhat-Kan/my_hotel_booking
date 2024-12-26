// src/reportWebVitals.js
import { onCLS, onFCP, onFID, onLCP } from 'web-vitals';

export function reportWebVitals(metric) {
  switch (metric.name) {
    case 'CLS':
      console.log('Cumulative Layout Shift:', metric);
      break;
    case 'FCP':
      console.log('First Contentful Paint:', metric);
      break;
    case 'FID':
      console.log('First Input Delay:', metric);
      break;
    case 'LCP':
      console.log('Largest Contentful Paint:', metric);
      break;
    default:
      break;
  }
}

// Bu fonksiyonu kullanarak her metrik verisini alabilirsiniz.
onCLS(reportWebVitals);
onFCP(reportWebVitals);
onFID(reportWebVitals);
onLCP(reportWebVitals);
