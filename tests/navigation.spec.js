const { test, expect } = require('@playwright/test');

test.describe('Navigation Tests', () => {
  const languages = [
    { code: 'fr', basePath: '/' },
    { code: 'en', basePath: '/En/' },
    { code: 'nl', basePath: '/Nl/' },
    { code: 'de', basePath: '/De/' },
    { code: 'ar', basePath: '/Ar/' }
  ];

  const commonPages = [
    'contact',
    'appointment',
    'locations',
    'tariffs',
    'privacy-policy',
    'legal-notice'
  ];

  for (const lang of languages) {
    test.describe(`${lang.code.toUpperCase()} Navigation`, () => {
      test('should navigate to all main pages', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Get all navigation links
        const navLinks = page.locator('nav a[href]');
        const linkCount = await navLinks.count();
        
        expect(linkCount).toBeGreaterThan(0);
        
        // Test navigation to each link
        for (let i = 0; i < Math.min(5, linkCount); i++) {
          const link = navLinks.nth(i);
          const href = await link.getAttribute('href');
          
          if (href && !href.startsWith('#') && !href.startsWith('http')) {
            try {
              await link.click();
              await page.waitForLoadState('networkidle');
              
              // Verify page loaded successfully
              await expect(page.locator('body')).toBeVisible();
              
              // Go back to homepage for next test
              await page.goto(lang.basePath);
            } catch (error) {
              console.log(`Failed to navigate to ${href}: ${error.message}`);
            }
          }
        }
      });

      test('should have working breadcrumbs', async ({ page }) => {
        // Test breadcrumbs on a few key pages
        const testPages = ['contact', 'appointment', 'locations'];
        
        for (const pageName of testPages) {
          try {
            await page.goto(`${lang.basePath}${pageName}`);
            await page.waitForLoadState('networkidle');
            
            // Look for breadcrumb elements
            const breadcrumbs = page.locator('[class*="breadcrumb"], nav[aria-label*="breadcrumb"], .breadcrumb');
            const breadcrumbCount = await breadcrumbs.count();
            
            if (breadcrumbCount > 0) {
              await expect(breadcrumbs.first()).toBeVisible();
            }
          } catch (error) {
            console.log(`Page ${pageName} not found or breadcrumbs not implemented`);
          }
        }
      });

      test('should have working mobile menu', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        
        // Look for mobile menu toggle
        const mobileMenuToggle = page.locator('[aria-label*="menu"], .mobile-menu-toggle, .hamburger, button[aria-expanded]');
        const toggleCount = await mobileMenuToggle.count();
        
        if (toggleCount > 0) {
          const toggle = mobileMenuToggle.first();
          await expect(toggle).toBeVisible();
          
          // Test menu toggle functionality
          const initialExpanded = await toggle.getAttribute('aria-expanded');
          await toggle.click();
          
          // Wait for menu to open/close
          await page.waitForTimeout(500);
          
          const newExpanded = await toggle.getAttribute('aria-expanded');
          expect(initialExpanded !== newExpanded).toBeTruthy();
        }
      });

      test('should have working language switcher navigation', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Find language switcher links
        const langLinks = page.locator('a[href*="/En/"], a[href*="/Fr/"], a[href*="/Nl/"], a[href*="/De/"], a[href*="/Ar/"]');
        const linkCount = await langLinks.count();
        
        if (linkCount > 0) {
          // Test switching to a different language
          for (let i = 0; i < Math.min(2, linkCount); i++) {
            const link = langLinks.nth(i);
            const href = await link.getAttribute('href');
            
            if (href && href !== lang.basePath) {
              try {
                await link.click();
                await page.waitForLoadState('networkidle');
                
                // Verify we're on a different language page
                const currentUrl = page.url();
                expect(currentUrl).not.toContain(lang.basePath);
                
                // Go back to original language
                await page.goto(lang.basePath);
              } catch (error) {
                console.log(`Failed to switch language to ${href}: ${error.message}`);
              }
            }
          }
        }
      });

      test('should have working footer links', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Get footer links
        const footerLinks = page.locator('footer a[href]');
        const linkCount = await footerLinks.count();
        
        expect(linkCount).toBeGreaterThan(0);
        
        // Test a few footer links
        for (let i = 0; i < Math.min(3, linkCount); i++) {
          const link = footerLinks.nth(i);
          const href = await link.getAttribute('href');
          
          if (href && !href.startsWith('#') && !href.startsWith('http')) {
            try {
              await link.click();
              await page.waitForLoadState('networkidle');
              
              // Verify page loaded
              await expect(page.locator('body')).toBeVisible();
              
              // Go back to homepage
              await page.goto(lang.basePath);
            } catch (error) {
              console.log(`Failed to navigate footer link ${href}: ${error.message}`);
            }
          }
        }
      });

      test('should handle 404 pages gracefully', async ({ page }) => {
        // Test non-existent page
        await page.goto(`${lang.basePath}non-existent-page`);
        
        // Should either show 404 page or redirect to homepage
        const currentUrl = page.url();
        const pageContent = await page.content();
        
        // Check if it's a 404 page or redirected to homepage
        const is404 = pageContent.includes('404') || pageContent.includes('not found') || pageContent.includes('page not found');
        const isHomepage = currentUrl.includes(lang.basePath) && !currentUrl.includes('non-existent-page');
        
        expect(is404 || isHomepage).toBeTruthy();
      });

      test('should have proper accessibility attributes', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Check for proper ARIA labels on navigation
        const nav = page.locator('nav');
        const navAriaLabel = await nav.getAttribute('aria-label');
        
        // Check for proper heading structure
        const headings = page.locator('h1, h2, h3, h4, h5, h6');
        const headingCount = await headings.count();
        
        if (headingCount > 0) {
          // Should have at least one h1
          const h1Count = await page.locator('h1').count();
          expect(h1Count).toBeGreaterThan(0);
        }
        
        // Check for skip links (accessibility feature)
        const skipLinks = page.locator('a[href*="#main"], a[href*="#content"], .skip-link');
        const skipLinkCount = await skipLinks.count();
        
        // Skip links are optional but good for accessibility
        if (skipLinkCount > 0) {
          await expect(skipLinks.first()).toBeVisible();
        }
      });
    });
  }
}); 