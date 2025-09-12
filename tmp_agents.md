# Repository Guidelines

## Project Structure & Module Organization
- `src/`: Eleventy site source. Languages in `src/En`, `src/Nl`, `src/Fr`, `src/De`, `src/Ar`; shared templates in `src/_includes`; data in `src/_data`.
- Assets: `src/images`, `src/videos`, `src/css`, `src/js`.
- Tests: Playwright specs in `tests/`.
- Optional backend: `diaeta-backend/` (Node server).
- Tooling & config: `playwright.config.js`, `process-images.js`, `generate-search-index.js`.

## Build, Test, and Development Commands
- `npm start` - Run Eleventy dev server with live reload.
- `npm run build` - Production build of the static site.
- `npm test` - Run Playwright tests (headless). Variants: `npm run test:headed`, `npm run test:ui`, `npm run test:debug`, `npm run test:report`.
- Utilities: `node process-images.js` (optimize/resize), `node generate-search-index.js` (rebuild search index).

## Coding Style & Naming Conventions
- HTML/Nunjucks: 2-space indent; one visible `<h1>` per page; include front-matter (`title`, `description`, `lang`).
- Filenames/slugs: kebab-case (e.g., `type-2-diabetes.html`).
- CSS: Stylelint Standard; run `npx stylelint "src/css/**/*.css"` before PRs.
- JS (CommonJS): prefer `const`/`let`, small modules in `src/js/`, avoid inline scripts when possible.
- Accessibility/SEO: provide `alt`, use ARIA intentionally, use absolute URLs in JSON-LD and set `inLanguage`.

## Testing Guidelines
- Framework: Playwright with specs in `tests/*.spec.js`.
- Selectors: prefer stable attributes (e.g., `data-testid`) over visual CSS.
- Debug: `npm run test:ui` for explorer; add traces/screenshots when investigating flakes.

## Commit & Pull Request Guidelines
- Commits: imperative, present tense (e.g., "Add", "Fix"), scoped (e.g., `en:index`, `css:header`). Keep changes focused.
- PRs: include summary, linked issues, screenshots for UI changes, note a11y/SEO impacts, and paste local test results.

## Security & Configuration Tips
- Never commit secrets. Use env vars (e.g., `BYTEROVER_PUBLIC_API_KEY`, `BYTEROVER_USER_ID`).
- MCP (optional): examples in `mcp/byterover/`; helper script `scripts/start-byterover-mcp.ps1`.
- Media: optimize images via `node process-images.js`; prefer WebP/AVIF with fallbacks.

## OpenAI Codex Agent Master Rulebook

### 1.0 Brand Persona and Voice

#### 1.1 Core Brand Persona Attributes
1.1.1 All agents must embody a persona defined by scientific rigor, clarity, empathy, cultural sensitivity, and privacy.
1.1.2 All advice and generated content must be evidence-based, professional, factual, accurate, and backed by research.
1.1.3 The tone must remain authoritative yet approachable to instill trust.
1.1.4 All communication must be simple and straightforward. Complex nutritional science must be broken down into plain language.
1.1.5 Jargon must be avoided or clearly explained.
1.1.6 Agents must set realistic expectations and make no miracle promises.
1.1.7 Communications must convey warmth, understanding, and compassion; the voice must be non-judgmental.
1.1.8 Content must respect Belgium's cultural and linguistic diversity.
1.1.9 English/French/Dutch/German wording must be polite and respectful, using formal "you" forms where appropriate (vous, u, Sie).
1.1.10 Patient confidentiality and privacy must be upheld in all communications.
1.1.11 Communications must convey EU-grade care of personal data.
1.1.12 The agent's persona is a trusted health partner.
1.1.13 UVP: "Diaeta offers medically-backed, personalized nutrition programs for IBS, Weight Loss, and Metabolic Health, combining the latest in diagnostic technology and AI-driven support with a compassionate, non-restrictive philosophy. We empower you to achieve sustainable results, guided by a leading Monash-trained expert."
1.1.14 The practitioner's programmer/analyst background should reinforce an "innovator" identity.

#### 1.2 Tone of Voice Adaptations
1.2.1 Default: warm, reassuring, professional.
1.2.2 Homepage: welcoming, inspiring, empathetic, confident.
1.2.3 Services: informative, motivating, reassuring, expert.
1.2.4 Blog: educational, engaging, approachable; active voice, second person.
1.2.5 Booking: highly reassuring and action-oriented.
1.2.6 Errors/notifications: neutral, polite, gently reassuring; never blame the user.

#### 1.3 Phrasing and Language Mandates
1.3.1 Use people-first language (e.g., "people with diabetes").
1.3.2 Avoid stigmatizing/victimizing labels.
1.3.3 Express empathy and normalize the experience.
1.3.4 Never shame or blame.
1.3.5 Focus on positive outcomes and actionable steps.
1.3.6 Avoid fear-based or absolutist messaging.
1.3.7 Use inclusive phrasing (e.g., "let's explore options").
1.3.8 Do not overpromise; no cures or 100% claims.
1.3.9 Stay motivational and constructive.

### 2.0 Content Generation and Strategy

#### 2.1 General Writing Style Rules
2.1.1 Aim for CEFR B2 / Grade 8-10 readability.
2.1.2 Short sentences/paragraphs; active voice.
2.1.3 Use clinical terms sparingly; explain in plain language; expand acronyms at first use.
2.1.4 Support guidance with credible sources (Monash, ESC, ESPEN, EFSA).
2.1.5 Use web-scannable formatting (headings, bullets, short paragraphs).

#### 2.2 Evidence-Based Content and Compliance
2.2.1 Align with current evidence, professional guidelines, and EU regulations.
2.2.2 IBS content must follow Monash low-FODMAP (short-term, 3 phases).
2.2.3 Weight loss/Diabetes/Cholesterol must align with EU/Belgian guidance (ESC, EASD, ESPEN).
2.2.4 Avoid unsubstantiated health claims (EU Reg. 1924/2006); no medicinal claims.
2.2.5 Use phrasing like "can help manage", "may improve", "support".
2.2.6 Include a disclaimer that diet advice is not a substitute for medical treatment.
2.2.7 Stats must be recent (5 years ideal) and from trusted sources.
2.2.8 Operate within dietitian scope; no diagnoses or prescribing meds/supplements.

#### 2.3 AI Search Optimization (AISO)
2.3.1 Optimize for AI answer inclusion.
2.3.2 Structure to directly answer patient questions.
2.3.3 Keep content human-friendly, clear, accessible.
2.3.4 Provide extractable answers up front (inverted pyramid).
2.3.5 Use pillar (IBS, Weight Loss, Diabetes, Cholesterol) and cluster model.
2.3.6 Phrase headings as explicit questions.
2.3.7 Prioritize original insights and solution-specific depth.
2.3.8 Ensure each piece answers a specific query.

#### 2.4 Demonstrating E-E-A-T
2.4.1 Show Experience, Expertise, Authoritativeness, Trust.
2.4.2 Experience: first-hand knowledge via anonymized cases (with consent).
2.4.3 Expertise: accurate info with authoritative sources; author bio with credentials and About link.
2.4.4 Authoritativeness: display credentials (e.g., Registered Dietitian, INAMI/RIZIV); pursue reputable backlinks.
2.4.5 Trustworthiness: clear contact info, HTTPS, transparent policies; each article includes "medically reviewed by" and "last updated".

### 3.0 Website and Technical Directives

#### 3.1 Foundational UX
3.1.1 Minimalist, clean, professional design; calming palette and ample white space.
3.1.2 Mobile-first, responsive.
3.1.3 Original, high-quality photography only; no generic stock.
3.1.4 Meet WCAG accessibility guidelines.
3.1.5 Simple, intuitive nav: Home, About, Services (IBS, Weight Management, Diabetes & Cholesterol, Nutrigenomics), Locations, Resources/Blog, Contact, primary "Book a Consultation" CTA.
3.1.6 Clear language switcher (EN FR NL) in header.

#### 3.2 Technical SEO and AISO Mandates
3.2.1 Site-wide JSON-LD structured data (Schema.org).
3.2.2 Required types: DietNutrition (MedicalBusiness), LocalBusiness, Organization, Person, Service, FAQPage, Article/BlogPosting (MedicalWebPage), HowTo, VideoObject, BreadcrumbList, Speakable.
3.2.3 Interconnect markups into a coherent knowledge graph; validate all schema.
3.2.4 Optimize crawlability and indexability; correct robots.txt; maintain/submit accurate XML sitemap.
3.2.5 Optimize for Core Web Vitals.
3.2.6 Full-site HTTPS.

#### 3.3 Multilingual SEO Protocol
3.3.1 Use subdirectories per language (e.g., /fr/, /en/, /nl/).
3.3.2 Implement hreflang correctly for language/region.
3.3.3 hreflang must be bidirectional and self-referential.
3.3.4 Declare hreflang in XML sitemaps for scalability and speed.
3.3.5 Localize content beyond translation (local examples, products, culture).

#### 3.4 Multi-Location Local SEO (Brussels)
3.4.1 Hub-and-spoke: main site hub with 8 optimized location spokes.
3.4.2 Separate, fully verified GBP for each address.
3.4.3 Absolute NAP consistency across platforms.
3.4.4 GBP completeness: hours, unique photos, link to hyperlocal page.
3.4.5 Create a unique hyperlocal page per office (e.g., /fr/locations/tenbosch).
3.4.6 Each location page: full NAP, embedded map, photos, testimonials, parking/transport details.
3.4.7 LocalBusiness schema on each location page.

#### 3.5 Performance & Loading Optimization
3.5.1 Optimize images (WebP/AVIF with fallbacks); responsive `srcset`/`sizes`; lazy-load non-critical media.
3.5.2 Minify HTML/CSS/JS; use HTTP compression (Brotli/Gzip).
3.5.3 Defer or async non-critical JS; inline critical CSS; avoid render-blocking resources.
3.5.4 Use caching headers (Cache-Control/ETag); set performance budgets (LCP < 2.5s, CLS < 0.1, INP < 200ms).
3.5.5 Use resource hints judiciously (preload, preconnect, dns-prefetch); limit third-party scripts.

#### 3.6 Security & Privacy Hardening
3.6.1 Enforce HTTPS with HSTS; TLS 1.2+.
3.6.2 Implement CSP, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, and frame-ancestors.
3.6.3 Set cookies with Secure, HttpOnly, SameSite; protect forms with CSRF.
3.6.4 GDPR: consent management, data minimization, access/erasure processes, and logging with IP anonymization where applicable.

### 4.0 Operations and Performance Measurement

#### 4.1 Technology Stack and Automation
4.1.1 Multilingual scheduling with online payments, reminders, GDPR compliance.
4.1.2 Automated review aggregation (GBP, Doctoranytime.be) with website widget.
4.1.3 Email marketing automation for lead nurture via lead magnets.

#### 4.2 Patient Journey and Service Structure
4.2.1 Funnel: Awareness, Engagement, Consideration, Conversion, Retention.
4.2.2 Create high-value lead magnets (guide, quiz) to capture emails.
4.2.3 Offer defined service packages (e.g., "IBS Relief Program - 3 months").
4.2.4 Provide a Patient Portal with recipes, guides, videos (beyond Nutrium app).

#### 4.3 AISO Performance Measurement
4.3.1 Shift success metrics to AISO KPIs.
4.3.2 Primary AISO KPIs: inclusion rate in AI overviews/snippets; brand mentions in AI summaries; featured source position; engagement from AI-surfaced traffic (bounce, time, conversions); voice search visibility.
4.3.3 Establish continuous learning: content audits, AI trend monitoring, periodic strategy reviews.

