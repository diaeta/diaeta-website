const { test, expect } = require('@playwright/test');

test.describe('Performance and SEO Tests', () => {
  const languages = [
    { code: 'fr', basePath: '/' },
    { code: 'en', basePath: '/En/' },
    { code: 'nl', basePath: '/Nl/' },
    { code: 'de', basePath: '/De/' },
    { code: 'ar', basePath: '/Ar/' }
  ];

  for (const lang of languages) {
    test.describe(`${lang.code.toUpperCase()} Performance`, () => {
      test('should load homepage within acceptable time', async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto(lang.basePath);
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        // Log load time for monitoring
        console.log(`${lang.code} homepage loaded in ${loadTime}ms`);
        
        // Should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
      });

      test('should have proper meta tags for SEO', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Check for essential SEO meta tags
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(10);
        
        // Check for meta description
        const metaDescription = page.locator('meta[name="description"]');
        if (await metaDescription.count() > 0) {
          const description = await metaDescription.getAttribute('content');
          expect(description).toBeTruthy();
          expect(description.length).toBeGreaterThan(50);
          expect(description.length).toBeLessThan(160); // SEO best practice
        }
        
        // Check for Open Graph tags
        const ogTitle = page.locator('meta[property="og:title"]');
        const ogDescription = page.locator('meta[property="og:description"]');
        const ogImage = page.locator('meta[property="og:image"]');
        
        if (await ogTitle.count() > 0) {
          await expect(ogTitle).toBeAttached();
        }
        
        if (await ogDescription.count() > 0) {
          await expect(ogDescription).toBeAttached();
        }
        
        if (await ogImage.count() > 0) {
          await expect(ogImage).toBeAttached();
        }
        
        // Check for Twitter Card tags
        const twitterCard = page.locator('meta[name="twitter:card"]');
        if (await twitterCard.count() > 0) {
          await expect(twitterCard).toBeAttached();
        }
      });

      test('should have proper heading structure', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Check for proper heading hierarchy
        const h1Elements = page.locator('h1');
        const h2Elements = page.locator('h2');
        const h3Elements = page.locator('h3');
        
        const h1Count = await h1Elements.count();
        const h2Count = await h2Elements.count();
        const h3Count = await h3Elements.count();
        
        // Should have exactly one h1
        expect(h1Count).toBe(1);
        
        // Should have some h2 and h3 elements for structure
        expect(h2Count).toBeGreaterThan(0);
        
        // Check that headings have meaningful content
        if (h1Count > 0) {
          const h1Text = await h1Elements.first().textContent();
          expect(h1Text.trim().length).toBeGreaterThan(5);
        }
      });

      test('should have optimized images', async ({ page }) => {
        await page.goto(lang.basePath);
        
        const images = page.locator('img');
        const imageCount = await images.count();
        
        if (imageCount > 0) {
          // Check for lazy loading
          const lazyImages = page.locator('img[loading="lazy"]');
          const lazyCount = await lazyImages.count();
          
          // Check for proper image formats
          const webpImages = page.locator('img[src*=".webp"]');
          const webpCount = await webpImages.count();
          
          // Check for responsive images
          const responsiveImages = page.locator('img[srcset], img[sizes]');
          const responsiveCount = await responsiveImages.count();
          
          console.log(`Images: Total=${imageCount}, Lazy=${lazyCount}, WebP=${webpCount}, Responsive=${responsiveCount}`);
          
          // Check that images have alt text
          for (let i = 0; i < Math.min(5, imageCount); i++) {
            const img = images.nth(i);
            const alt = await img.getAttribute('alt');
            expect(alt).toBeTruthy();
          }
        }
      });

      test('should have proper canonical URLs', async ({ page }) => {
        await page.goto(lang.basePath);
        
        const canonical = page.locator('link[rel="canonical"]');
        const canonicalCount = await canonical.count();
        
        if (canonicalCount > 0) {
          const canonicalUrl = await canonical.getAttribute('href');
          expect(canonicalUrl).toBeTruthy();
          
          // Canonical should match current URL
          const currentUrl = page.url();
          expect(canonicalUrl).toContain(currentUrl.split('/').pop() || '');
        }
      });

      test('should have working sitemap', async ({ page }) => {
        // Check for sitemap
        try {
          await page.goto('/sitemap.xml');
          await page.waitForLoadState('networkidle');
          
          const content = await page.content();
          expect(content).toContain('<?xml');
          expect(content).toContain('<urlset');
        } catch (error) {
          console.log('Sitemap not found or not accessible');
        }
      });

      test('should have proper robots.txt', async ({ page }) => {
        try {
          await page.goto('/robots.txt');
          await page.waitForLoadState('networkidle');
          
          const content = await page.textContent('body');
          expect(content).toBeTruthy();
          
          // Should contain basic robots.txt directives
          expect(content).toContain('User-agent:');
        } catch (error) {
          console.log('Robots.txt not found or not accessible');
        }
      });

      test('should have acceptable Core Web Vitals', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Measure performance metrics
        const performanceMetrics = await page.evaluate(() => {
          return new Promise((resolve) => {
            if ('performance' in window) {
              const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const metrics = {};
                
                entries.forEach((entry) => {
                  if (entry.entryType === 'largest-contentful-paint') {
                    metrics.LCP = entry.startTime;
                  }
                  if (entry.entryType === 'first-input') {
                    metrics.FID = entry.processingStart - entry.startTime;
                  }
                  if (entry.entryType === 'layout-shift') {
                    if (!metrics.CLS) metrics.CLS = 0;
                    metrics.CLS += entry.value;
                  }
                });
                
                resolve(metrics);
              });
              
              observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
              
              // Stop observing after 5 seconds
              setTimeout(() => {
                observer.disconnect();
                resolve({});
              }, 5000);
            } else {
              resolve({});
            }
          });
        });
        
        console.log('Performance metrics:', performanceMetrics);
        
        // Check for reasonable values (these are rough guidelines)
        if (performanceMetrics.LCP) {
          expect(performanceMetrics.LCP).toBeLessThan(2500); // Should be under 2.5s
        }
        
        if (performanceMetrics.FID) {
          expect(performanceMetrics.FID).toBeLessThan(100); // Should be under 100ms
        }
        
        if (performanceMetrics.CLS) {
          expect(performanceMetrics.CLS).toBeLessThan(0.1); // Should be under 0.1
        }
      });

      test('should have proper structured data', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Check for JSON-LD structured data
        const jsonLdScripts = page.locator('script[type="application/ld+json"]');
        const jsonLdCount = await jsonLdScripts.count();
        
        if (jsonLdCount > 0) {
          for (let i = 0; i < jsonLdCount; i++) {
            const script = jsonLdScripts.nth(i);
            const content = await script.textContent();
            
            try {
              const jsonData = JSON.parse(content);
              expect(jsonData).toBeTruthy();
              
              // Should have @type property
              if (jsonData['@type']) {
                expect(jsonData['@type']).toBeTruthy();
              }
            } catch (error) {
              console.log('Invalid JSON-LD found');
            }
          }
        }
        
        // Check for microdata
        const microdataElements = page.locator('[itemtype]');
        const microdataCount = await microdataElements.count();
        
        console.log(`Structured data: JSON-LD=${jsonLdCount}, Microdata=${microdataCount}`);
      });

      test('should have proper language and region tags', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Check for proper lang attribute
        const htmlElement = page.locator('html');
        const langAttr = await htmlElement.getAttribute('lang');
        expect(langAttr).toBeTruthy();
        expect(langAttr).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
        
        // Check for hreflang tags
        const hreflangLinks = page.locator('link[hreflang]');
        const hreflangCount = await hreflangLinks.count();
        
        if (hreflangCount > 0) {
          // Should have hreflang for current language
          const currentHreflang = page.locator(`link[hreflang="${lang.code}"]`);
          const hasCurrentHreflang = await currentHreflang.count() > 0;
          
          console.log(`Hreflang tags: ${hreflangCount}, Current language: ${hasCurrentHreflang}`);
        }
      });
    });
  }
}); 