const { test, expect } = require('@playwright/test');

test.describe('Homepage Tests', () => {
  const languages = [
    { code: 'fr', path: '/', title: 'Diaeta - Nutritionniste à Bruxelles' },
    { code: 'en', path: '/En/', title: 'Diaeta - Nutritionist in Brussels' },
    { code: 'nl', path: '/Nl/', title: 'Diaeta - Diëtist in Brussel' },
    { code: 'de', path: '/De/', title: 'Diaeta - Ernährungsberater in Brüssel' },
    { code: 'ar', path: '/Ar/', title: 'دياتا - أخصائي تغذية في بروكسل' }
  ];

  for (const lang of languages) {
    test.describe(`${lang.code.toUpperCase()} Homepage`, () => {
      test('should load homepage successfully', async ({ page }) => {
        await page.goto(lang.path);
        
        // Check if page loads without errors
        await expect(page).toHaveTitle(new RegExp(lang.title));
        
        // Check for main navigation elements
        await expect(page.locator('nav')).toBeVisible();
        
        // Check for hero section
        await expect(page.locator('main')).toBeVisible();
        
        // Check for footer
        await expect(page.locator('footer')).toBeVisible();
      });

      test('should have working navigation links', async ({ page }) => {
        await page.goto(lang.path);
        
        // Test main navigation links
        const navLinks = page.locator('nav a[href]');
        const linkCount = await navLinks.count();
        
        expect(linkCount).toBeGreaterThan(0);
        
        // Test first few navigation links
        for (let i = 0; i < Math.min(3, linkCount); i++) {
          const link = navLinks.nth(i);
          const href = await link.getAttribute('href');
          
          if (href && !href.startsWith('#')) {
            await expect(link).toBeVisible();
          }
        }
      });

      test('should have responsive design', async ({ page }) => {
        await page.goto(lang.path);
        
        // Test desktop view
        await page.setViewportSize({ width: 1920, height: 1080 });
        await expect(page.locator('nav')).toBeVisible();
        
        // Test mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('nav')).toBeVisible();
        
        // Test tablet view
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('nav')).toBeVisible();
      });

      test('should have proper meta tags', async ({ page }) => {
        await page.goto(lang.path);
        
        // Check for essential meta tags
        await expect(page.locator('meta[name="viewport"]')).toBeAttached();
        await expect(page.locator('meta[charset]')).toBeAttached();
        
        // Check for language-specific meta tags
        const langMeta = page.locator(`html[lang="${lang.code}"]`);
        await expect(langMeta).toBeAttached();
      });

      test('should have working contact form or contact link', async ({ page }) => {
        await page.goto(lang.path);
        
        // Look for contact form or contact link
        const contactForm = page.locator('form');
        const contactLink = page.locator('a[href*="contact"], a[href*="kontakt"], a[href*="contact"], a[href*="contact"], a[href*="اتصل-بنا"]');
        
        // Either form or link should exist
        const formExists = await contactForm.count() > 0;
        const linkExists = await contactLink.count() > 0;
        
        expect(formExists || linkExists).toBeTruthy();
      });

      test('should have proper images with alt text', async ({ page }) => {
        await page.goto(lang.path);
        
        const images = page.locator('img');
        const imageCount = await images.count();
        
        if (imageCount > 0) {
          // Check that images have alt attributes
          for (let i = 0; i < Math.min(5, imageCount); i++) {
            const img = images.nth(i);
            const alt = await img.getAttribute('alt');
            expect(alt).toBeTruthy();
          }
        }
      });

      test('should have working language switcher', async ({ page }) => {
        await page.goto(lang.path);
        
        // Look for language switcher links
        const langSwitchers = page.locator('a[href*="/En/"], a[href*="/Fr/"], a[href*="/Nl/"], a[href*="/De/"], a[href*="/Ar/"]');
        const switcherCount = await langSwitchers.count();
        
        // Should have at least some language switchers
        expect(switcherCount).toBeGreaterThan(0);
      });
    });
  }
}); 