# Diaeta Website Test Suite

This directory contains comprehensive automated tests for the Diaeta multilingual website using Playwright.

## Test Structure

### 1. Homepage Tests (`homepage.spec.js`)
Tests the homepage functionality across all 5 languages:
- Page loading and basic structure
- Navigation elements
- Responsive design
- Meta tags and SEO basics
- Contact forms and links
- Language switchers
- Image optimization

### 2. Navigation Tests (`navigation.spec.js`)
Tests navigation functionality:
- Main navigation links
- Breadcrumbs
- Mobile menu functionality
- Language switcher navigation
- Footer links
- 404 page handling
- Accessibility attributes

### 3. Form Tests (`forms.spec.js`)
Tests form functionality:
- Contact forms
- Appointment booking forms
- Form validation
- Accessibility compliance
- Form submission handling
- Security measures

### 4. Performance Tests (`performance.spec.js`)
Tests performance and SEO:
- Page load times
- SEO meta tags
- Heading structure
- Image optimization
- Canonical URLs
- Sitemap and robots.txt
- Core Web Vitals
- Structured data
- Language and region tags

## Languages Supported

The test suite covers all 5 languages:
- **French (fr)**: `/`
- **English (en)**: `/En/`
- **Dutch (nl)**: `/Nl/`
- **German (de)**: `/De/`
- **Arabic (ar)**: `/Ar/`

## Running Tests

### Prerequisites
1. Install dependencies: `npm install`
2. Install Playwright browsers: `npx playwright install`

### Test Commands

```bash
# Run all tests
npm test

# Run tests with browser UI visible
npm run test:headed

# Run tests with Playwright UI
npm run test:ui

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

### Running Specific Tests

```bash
# Run only homepage tests
npx playwright test homepage.spec.js

# Run only navigation tests
npx playwright test navigation.spec.js

# Run only form tests
npx playwright test forms.spec.js

# Run only performance tests
npx playwright test performance.spec.js

# Run tests for specific language
npx playwright test --grep "FR Homepage"

# Run tests for specific browser
npx playwright test --project=chromium
```

## Test Configuration

The tests are configured in `playwright.config.js` with:
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile viewport testing
- Automatic dev server startup
- Screenshot and video capture on failure
- HTML report generation

## What the Tests Cover

### Functionality Testing
- ✅ Page loading and navigation
- ✅ Form submission and validation
- ✅ Language switching
- ✅ Responsive design
- ✅ Link functionality

### Performance Testing
- ✅ Page load times
- ✅ Core Web Vitals
- ✅ Image optimization
- ✅ Resource loading

### SEO Testing
- ✅ Meta tags
- ✅ Structured data
- ✅ Canonical URLs
- ✅ Sitemap and robots.txt
- ✅ Heading structure

### Accessibility Testing
- ✅ ARIA labels
- ✅ Form labels
- ✅ Alt text for images
- ✅ Keyboard navigation
- ✅ Screen reader compatibility

### Security Testing
- ✅ Form security measures
- ✅ CSRF protection
- ✅ Secure form submission

## Continuous Integration

The test suite is designed to run in CI/CD pipelines:
- Automatic retry on failure
- Parallel test execution
- Comprehensive reporting
- Screenshot and video artifacts

## Troubleshooting

### Common Issues

1. **Tests fail with "page not found"**
   - Ensure the development server is running: `npm start`
   - Check that the server is accessible at `http://localhost:8080`

2. **Language-specific tests fail**
   - Verify that all language directories exist in the build output
   - Check that language switcher links are properly configured

3. **Form tests fail**
   - Ensure forms have proper validation attributes
   - Check that form submission endpoints are working

4. **Performance tests fail**
   - Some performance metrics may vary based on system load
   - Consider adjusting thresholds in the test configuration

### Debug Mode

Use debug mode to step through tests:
```bash
npm run test:debug
```

This will open the browser in headed mode and pause execution at each step.

## Adding New Tests

To add new tests:

1. Create a new test file in the `tests/` directory
2. Follow the existing naming convention: `feature.spec.js`
3. Use the language configuration from existing tests
4. Add appropriate test descriptions and assertions
5. Update this README with new test information

## Test Maintenance

- Run tests regularly to catch regressions
- Update test selectors if the website structure changes
- Monitor test performance and adjust timeouts as needed
- Keep test data and fixtures up to date 