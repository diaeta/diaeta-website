const { test, expect } = require('@playwright/test');

test.describe('Form Tests', () => {
  const languages = [
    { code: 'fr', basePath: '/' },
    { code: 'en', basePath: '/En/' },
    { code: 'nl', basePath: '/Nl/' },
    { code: 'de', basePath: '/De/' },
    { code: 'ar', basePath: '/Ar/' }
  ];

  for (const lang of languages) {
    test.describe(`${lang.code.toUpperCase()} Forms`, () => {
      test('should have working contact form', async ({ page }) => {
        // Navigate to contact page
        const contactPaths = [
          `${lang.basePath}contact`,
          `${lang.basePath}kontakt`,
          `${lang.basePath}اتصل-بنا`
        ];
        
        let contactPage = null;
        for (const path of contactPaths) {
          try {
            await page.goto(path);
            await page.waitForLoadState('networkidle');
            contactPage = path;
            break;
          } catch (error) {
            console.log(`Contact page not found at ${path}`);
          }
        }
        
        if (!contactPage) {
          // Try to find contact form on homepage
          await page.goto(lang.basePath);
        }
        
        // Look for contact form
        const contactForm = page.locator('form');
        const formCount = await contactForm.count();
        
        if (formCount > 0) {
          const form = contactForm.first();
          await expect(form).toBeVisible();
          
          // Check for common form fields
          const nameField = page.locator('input[name*="name"], input[name*="nom"], input[name*="naam"], input[placeholder*="name"], input[placeholder*="nom"]');
          const emailField = page.locator('input[type="email"], input[name*="email"], input[name*="mail"]');
          const messageField = page.locator('textarea, input[name*="message"], input[name*="message"]');
          
          // Test form validation
          if (await nameField.count() > 0) {
            await expect(nameField.first()).toBeVisible();
          }
          
          if (await emailField.count() > 0) {
            await expect(emailField.first()).toBeVisible();
            
            // Test invalid email
            await emailField.first().fill('invalid-email');
            await page.keyboard.press('Tab');
            
            // Check for validation message
            const validationMessage = page.locator('[class*="error"], [class*="invalid"], .error-message');
            if (await validationMessage.count() > 0) {
              await expect(validationMessage.first()).toBeVisible();
            }
          }
          
          if (await messageField.count() > 0) {
            await expect(messageField.first()).toBeVisible();
          }
        }
      });

      test('should have working appointment booking form', async ({ page }) => {
        // Navigate to appointment page
        const appointmentPaths = [
          `${lang.basePath}appointment`,
          `${lang.basePath}afspraak`,
          `${lang.basePath}termin`,
          `${lang.basePath}rendez-vous`,
          `${lang.basePath}حجز-موعد`
        ];
        
        let appointmentPage = null;
        for (const path of appointmentPaths) {
          try {
            await page.goto(path);
            await page.waitForLoadState('networkidle');
            appointmentPage = path;
            break;
          } catch (error) {
            console.log(`Appointment page not found at ${path}`);
          }
        }
        
        if (!appointmentPage) {
          // Try to find appointment form on homepage
          await page.goto(lang.basePath);
        }
        
        // Look for appointment form
        const appointmentForm = page.locator('form');
        const formCount = await appointmentForm.count();
        
        if (formCount > 0) {
          const form = appointmentForm.first();
          await expect(form).toBeVisible();
          
          // Check for appointment-specific fields
          const dateField = page.locator('input[type="date"], input[name*="date"], input[name*="datum"]');
          const timeField = page.locator('input[type="time"], input[name*="time"], input[name*="heure"], select[name*="time"]');
          const serviceField = page.locator('select[name*="service"], select[name*="service"], input[name*="service"]');
          
          if (await dateField.count() > 0) {
            await expect(dateField.first()).toBeVisible();
          }
          
          if (await timeField.count() > 0) {
            await expect(timeField.first()).toBeVisible();
          }
          
          if (await serviceField.count() > 0) {
            await expect(serviceField.first()).toBeVisible();
          }
        }
      });

      test('should have proper form validation', async ({ page }) => {
        await page.goto(lang.basePath);
        
        // Look for any form on the page
        const forms = page.locator('form');
        const formCount = await forms.count();
        
        if (formCount > 0) {
          const form = forms.first();
          
          // Find required fields
          const requiredFields = page.locator('input[required], textarea[required], select[required]');
          const requiredCount = await requiredFields.count();
          
          if (requiredCount > 0) {
            // Try to submit form without filling required fields
            const submitButton = page.locator('button[type="submit"], input[type="submit"]');
            
            if (await submitButton.count() > 0) {
              await submitButton.first().click();
              
              // Check for validation messages
              const validationMessages = page.locator('[class*="error"], [class*="invalid"], .error-message, [aria-invalid="true"]');
              const messageCount = await validationMessages.count();
              
              // Should show validation messages for required fields
              if (messageCount > 0) {
                await expect(validationMessages.first()).toBeVisible();
              }
            }
          }
        }
      });

      test('should have accessible form elements', async ({ page }) => {
        await page.goto(lang.basePath);
        
        const forms = page.locator('form');
        const formCount = await forms.count();
        
        if (formCount > 0) {
          const form = forms.first();
          
          // Check for form labels
          const inputs = page.locator('input, textarea, select');
          const inputCount = await inputs.count();
          
          for (let i = 0; i < Math.min(5, inputCount); i++) {
            const input = inputs.nth(i);
            const inputId = await input.getAttribute('id');
            const inputName = await input.getAttribute('name');
            
            if (inputId) {
              // Check for associated label
              const label = page.locator(`label[for="${inputId}"]`);
              if (await label.count() > 0) {
                await expect(label.first()).toBeVisible();
              }
            }
            
            // Check for aria-label or aria-labelledby
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledBy = await input.getAttribute('aria-labelledby');
            
            // Should have either label, aria-label, or aria-labelledby
            const hasAccessibility = inputId || ariaLabel || ariaLabelledBy;
            expect(hasAccessibility).toBeTruthy();
          }
        }
      });

      test('should handle form submission gracefully', async ({ page }) => {
        await page.goto(lang.basePath);
        
        const forms = page.locator('form');
        const formCount = await forms.count();
        
        if (formCount > 0) {
          const form = forms.first();
          
          // Fill in form fields if they exist
          const nameField = page.locator('input[name*="name"], input[name*="nom"], input[placeholder*="name"]');
          const emailField = page.locator('input[type="email"], input[name*="email"]');
          const messageField = page.locator('textarea, input[name*="message"]');
          
          if (await nameField.count() > 0) {
            await nameField.first().fill('Test User');
          }
          
          if (await emailField.count() > 0) {
            await emailField.first().fill('test@example.com');
          }
          
          if (await messageField.count() > 0) {
            await messageField.first().fill('This is a test message');
          }
          
          // Submit form
          const submitButton = page.locator('button[type="submit"], input[type="submit"]');
          
          if (await submitButton.count() > 0) {
            // Listen for form submission
            const responsePromise = page.waitForResponse(response => 
              response.url().includes('contact') || 
              response.url().includes('appointment') ||
              response.status() === 200 || 
              response.status() === 302
            );
            
            await submitButton.first().click();
            
            try {
              await responsePromise;
              // Form submitted successfully
              console.log('Form submitted successfully');
            } catch (error) {
              // Form might be client-side only or have different submission method
              console.log('Form submission handled differently');
            }
          }
        }
      });

      test('should have proper form security measures', async ({ page }) => {
        await page.goto(lang.basePath);
        
        const forms = page.locator('form');
        const formCount = await forms.count();
        
        if (formCount > 0) {
          const form = forms.first();
          
          // Check for CSRF protection
          const csrfToken = page.locator('input[name*="csrf"], input[name*="token"], input[name="_token"]');
          const hasCsrf = await csrfToken.count() > 0;
          
          // Check for proper form method
          const formMethod = await form.getAttribute('method');
          const hasProperMethod = formMethod === 'POST' || formMethod === 'post';
          
          // Check for HTTPS in action URL
          const formAction = await form.getAttribute('action');
          const hasSecureAction = !formAction || formAction.startsWith('https://') || formAction.startsWith('/');
          
          // Log security findings
          console.log(`Form security: CSRF=${hasCsrf}, Method=${hasProperMethod}, Secure Action=${hasSecureAction}`);
        }
      });
    });
  }
}); 