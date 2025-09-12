param(
  [string]$Path = 'src\En\index.html'
)

if (-not (Test-Path -LiteralPath $Path)) {
  Write-Error "File not found: $Path"; exit 1
}

# Create timestamped backup
$ts = Get-Date -Format 'yyyyMMdd-HHmm'
$backup = Join-Path (Split-Path $Path) ("index.backup.$ts.html")
Copy-Item -LiteralPath $Path -Destination $backup -Force

# Read file
$t = Get-Content -LiteralPath $Path -Raw

function ReplaceRegex([string]$pattern, [string]$replacement) {
  $script:t = [System.Text.RegularExpressions.Regex]::Replace($script:t, $pattern, $replacement)
}

# 1) Desktop H1
ReplaceRegex '(?s)(<h1 class="hero-headline[^"]*"[^>]*>).*?(</h1>)' '$1Personalized Nutrition, Backed by Medical Science$2'

# 2) Desktop tagline
$newTag = 'We help you build sustainable habits for IBS, Weight Management, Type 2 Diabetes, and Cholesterol - clear guidance, compassion, and no fad promises.'
ReplaceRegex '(?s)(<p class="hero-tagline[^>]*>)[\s\S]*?(</p>)' ('$1' + $newTag + '$2')

# 3) Mobile H1 text (keep aria-hidden)
ReplaceRegex '<h1 class="hero-headline-mobile"[^>]*>[^<]*</h1>' '<h1 class="hero-headline-mobile" aria-hidden="true">Personalized Nutrition,<br>Backed by Medical Science</h1>'

# 4) CTA text swaps
$t = $t.Replace('Book Your Consultation','Book a Consultation')
$t = $t.Replace('>Learn More<','>Explore Our Services<')
$t = $t.Replace('>Discover our approach<','>Explore Our Services<')

# 5) Section titles to question style
$t = $t.Replace('Why Trust Diaeta with Your Nutrition?','Why choose Diaeta? What makes our approach different?')
$t = $t.Replace('Specialized Nutritional Guidance in Brussels','Which nutrition services do we offer in Brussels?')
$t = $t.Replace('Real People, Real Results: What Our Patients Say About Their Experience','What do patients say about their experience?')
$t = $t.Replace('Find a Dietitian Near You: Convenient Locations Across Brussels','Where can you find us in Brussels?')
$t = $t.Replace('Your Unique Genetic Profile: The Key to Your Optimal Nutrition','Could DNA insights inform your choices?')
$t = $t.Replace('Knowledge You Can Use: Practical Health Insights from Your Dietitian','What practical health insights can you use today?')
$t = $t.Replace('Clear, Transparent Dietitian Pricing','How much do consultations cost?')

# 6) Philosophy subtitle -> UVP paragraph
$uvp = 'Diaeta offers medically-supported, personalized nutrition programs for IBS, Weight Loss, and Metabolic Health - combining diagnostic insights and AI-assisted support with a compassionate, non-restrictive approach. Led by a Registered Dietitian (INAMI/RIZIV) and Monash-trained in Low-FODMAP for IBS; your privacy and cultural respect are central to our care.'
ReplaceRegex '(?s)(<p class="section-subtitle">)Our practice is led by a registered dietitian[\s\S]*?(</p>)' ('$1' + $uvp + '$2')

# 7) Services intro subtitle
$oldSrv = "Struggling with weight loss, IBS, or diabetes? You're not alone. As specialized dietitians in Brussels, we design supportive, evidence-based eating plans that you can follow with confidence and without judgment."
$newSrv = 'Looking for help with weight loss, IBS, or diabetes? We design supportive, evidence-based plans you can follow with confidence and without judgment.'
$t = $t.Replace($oldSrv, $newSrv)

# 8) Panel summaries (replace by first sentence match)
$wlNew = 'We focus on building habits that fit your life - not strict rules. Together, we align portions, meal rhythm, and food quality so progress feels steady and sustainable.'
ReplaceRegex '(?s)<p class="panel-summary"[^>]*>Tried every diet and still struggling\?[\s\S]*?</p>' ('<p class="panel-summary" itemprop="description">' + $wlNew + '</p>')

$ibsNew = 'Living with IBS can feel unpredictable. We follow the Monash Low-FODMAP protocol (elimination, reintroduction, personalization) to identify your triggers and help you find more comfortable meals. You get practical steps and follow-up support.'
ReplaceRegex '(?s)<p class="panel-summary"[^>]*>Frequent bloating, unpredictable digestion[\s\S]*?</p>' ('<p class="panel-summary" itemprop="description">' + $ibsNew + '</p>')

$t2dNew = 'We adapt your plan to your labs, medications, and routine. Balanced meals, fiber, protein timing, and movement can help improve glycemic control - aligned with EU guidance.'
ReplaceRegex '(?s)<p class="panel-summary"[^>]*>It can feel daunting when you[\s\S]*?</p>' ('<p class="panel-summary" itemprop="description">' + $t2dNew + '</p>')

$cvNew = 'We personalize proven patterns (e.g., DASH, Portfolio) to your preferences. Small, consistent changes can support LDL, blood pressure, and long-term heart health.'
ReplaceRegex '(?s)<p class="panel-summary"[^>]*>Has your doctor told you your cholesterol or blood pressure is high\?[\s\S]*?</p>' ('<p class="panel-summary" itemprop="description">' + $cvNew + '</p>')

# 9) FAQ JSON-LD (active block) absolute URLs
$t = $t.Replace('Book via /en/appointment/.','Book via https://diaeta.be/en/appointment/.')
$t = $t.Replace('See /en/locations/ for the full list and map.','See https://diaeta.be/en/locations/ for the full list and map.')
$t = $t.Replace('see /en/tariffs/ for details.','see https://diaeta.be/en/tariffs/ for details.')

# Write back
Set-Content -LiteralPath $Path -Value $t -NoNewline
Write-Host "Applied text optimizations. Backup: $backup"

