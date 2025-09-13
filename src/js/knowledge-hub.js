/**
 * Knowledge Hub UX Enhancement System
 * Comprehensive content relationship mapping and user experience optimization
 */

class KnowledgeHub {
    constructor() {
        this.userProgress = this.loadUserProgress();
        this.contentRelationships = this.initializeContentRelationships();
        this.userPreferences = this.loadUserPreferences();
        this.analytics = new AnalyticsTracker();
        
        this.initializeComponents();
        this.bindEvents();
    }

    initializeComponents() {
        this.setupProgressTracking();
        this.setupContentRelationships();
        this.setupPersonalizedRecommendations();
        this.setupInteractiveElements();
        this.setupAccessibilityFeatures();
    }

    // Content Relationship Mapping
    initializeContentRelationships() {
        return {
            'ibs-basics': {
                prerequisites: [],
                related: ['ibs-symptoms', 'ibs-causes', 'fodmap-intro'],
                nextSteps: ['ibs-diagnosis', 'ibs-treatment'],
                difficulty: 'beginner',
                estimatedTime: 8,
                category: 'ibs'
            },
            'ibs-symptoms': {
                prerequisites: ['ibs-basics'],
                related: ['ibs-causes', 'ibs-diagnosis', 'ibs-treatment'],
                nextSteps: ['ibs-management', 'ibs-lifestyle'],
                difficulty: 'beginner',
                estimatedTime: 10,
                category: 'ibs'
            },
            'fodmap-intro': {
                prerequisites: ['ibs-basics'],
                related: ['fodmap-foods', 'fodmap-diet', 'ibs-treatment'],
                nextSteps: ['fodmap-elimination', 'fodmap-reintroduction'],
                difficulty: 'intermediate',
                estimatedTime: 12,
                category: 'ibs'
            },
            'diabetes-basics': {
                prerequisites: [],
                related: ['diabetes-types', 'diabetes-symptoms', 'diabetes-causes'],
                nextSteps: ['diabetes-diagnosis', 'diabetes-management'],
                difficulty: 'beginner',
                estimatedTime: 10,
                category: 'diabetes'
            },
            'weight-loss-basics': {
                prerequisites: [],
                related: ['nutrition-basics', 'exercise-basics', 'metabolism'],
                nextSteps: ['weight-loss-strategies', 'meal-planning'],
                difficulty: 'beginner',
                estimatedTime: 8,
                category: 'weight-loss'
            }
        };
    }

    setupContentRelationships() {
        // Add related content sections to articles
        this.addRelatedContentSections();
        this.addPrerequisitesIndicators();
        this.addNextStepsGuidance();
        this.addContentDifficultyIndicators();
    }

    addRelatedContentSections() {
        const articles = document.querySelectorAll('article, .content-section');
        
        articles.forEach(article => {
            const articleId = this.getArticleId(article);
            if (articleId && this.contentRelationships[articleId]) {
                const related = this.contentRelationships[articleId].related;
                if (related.length > 0) {
                    this.createRelatedContentSection(article, related);
                }
            }
        });
    }

    createRelatedContentSection(container, relatedIds) {
        const relatedSection = document.createElement('div');
        relatedSection.className = 'related-content-section';
        relatedSection.innerHTML = `
            <div class="related-content-header" style="margin: 2rem 0 1rem 0; padding: 1rem; background: var(--accent-50); border-radius: 15px; border-left: 4px solid var(--accent-500);">
                <h3 style="color: var(--accent-700); font-weight: 600; margin-bottom: 0.5rem;">
                    <i class="fas fa-link me-2"></i>Related Articles
                </h3>
                <p style="color: var(--neutral-600); margin: 0; font-size: 0.95rem;">
                    Continue your learning journey with these related topics
                </p>
            </div>
            <div class="related-content-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                ${relatedIds.map(id => this.createRelatedContentCard(id)).join('')}
            </div>
        `;
        
        container.appendChild(relatedSection);
    }

    createRelatedContentCard(articleId) {
        const relationship = this.contentRelationships[articleId];
        if (!relationship) return '';
        
        return `
            <div class="related-content-card" style="background: white; border: 1px solid var(--neutral-200); border-radius: 15px; padding: 1.5rem; transition: all 0.3s ease; hover: transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
                <div class="card-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div class="difficulty-badge" style="background: ${this.getDifficultyColor(relationship.difficulty)}; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem; font-weight: 600;">
                        ${relationship.difficulty}
                    </div>
                    <div class="time-estimate" style="color: var(--neutral-600); font-size: 0.9rem;">
                        <i class="fas fa-clock me-1"></i>${relationship.estimatedTime} min
                    </div>
                </div>
                <h4 style="color: var(--primary-600); font-weight: 600; margin-bottom: 0.5rem;">
                    <a href="/en/${this.getArticleUrl(articleId)}" style="color: inherit; text-decoration: none;">
                        ${this.getArticleTitle(articleId)}
                    </a>
                </h4>
                <p style="color: var(--neutral-700); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1rem;">
                    ${this.getArticleSummary(articleId)}
                </p>
                <div class="card-actions" style="display: flex; gap: 0.5rem;">
                    <a href="/en/${this.getArticleUrl(articleId)}" class="btn btn-sm btn-primary" style="background: var(--primary-500); color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-size: 0.9rem; font-weight: 600;">
                        Read Article
                    </a>
                    <button class="btn btn-sm btn-outline bookmark-btn" data-article="${articleId}" style="border: 1px solid var(--neutral-300); background: white; padding: 0.5rem 1rem; border-radius: 20px; color: var(--neutral-700); font-size: 0.9rem;">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Progress Tracking System
    setupProgressTracking() {
        this.createProgressIndicator();
        this.trackReadingProgress();
        this.setupAchievementSystem();
    }

    createProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress-indicator';
        progressContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: var(--neutral-200);
            z-index: 1000;
        `;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, var(--primary-500), var(--accent-500));
            width: 0%;
            transition: width 0.3s ease;
        `;
        
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
        
        this.progressBar = progressBar;
    }

    trackReadingProgress() {
        let ticking = false;
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            this.progressBar.style.width = Math.min(scrollPercent, 100) + '%';
            
            // Track completion
            if (scrollPercent > 90 && !this.userProgress.currentArticle?.completed) {
                this.markArticleCompleted();
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        });
    }

    markArticleCompleted() {
        const articleId = this.getCurrentArticleId();
        if (!articleId) return;
        
        if (!this.userProgress.completedArticles.includes(articleId)) {
            this.userProgress.completedArticles.push(articleId);
            this.saveUserProgress();
            this.showCompletionCelebration();
            this.updateRecommendations();
        }
    }

    showCompletionCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'completion-celebration';
        celebration.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 20px; padding: 2rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); z-index: 10000; text-align: center; max-width: 400px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--accent-500), var(--primary-500)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: white; font-size: 2rem;">
                    <i class="fas fa-trophy"></i>
                </div>
                <h3 style="color: var(--primary-600); margin-bottom: 0.5rem;">Article Completed!</h3>
                <p style="color: var(--neutral-600); margin-bottom: 1.5rem;">Great job! You've completed this article and earned 10 points.</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary continue-btn" style="background: var(--primary-500); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 25px; font-weight: 600;">
                        Continue Learning
                    </button>
                    <button class="btn btn-outline close-btn" style="border: 2px solid var(--neutral-300); background: white; padding: 0.75rem 1.5rem; border-radius: 25px; color: var(--neutral-700); font-weight: 600;">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(celebration);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.remove();
            }
        }, 5000);
        
        // Manual close
        celebration.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn') || e.target.classList.contains('continue-btn')) {
                celebration.remove();
            }
        });
    }

    // Personalized Recommendations
    setupPersonalizedRecommendations() {
        this.createRecommendationsSection();
        this.updateRecommendations();
    }

    createRecommendationsSection() {
        const recommendationsContainer = document.createElement('div');
        recommendationsContainer.className = 'personalized-recommendations';
        recommendationsContainer.innerHTML = `
            <div class="recommendations-header" style="margin: 2rem 0 1rem 0; padding: 1.5rem; background: linear-gradient(135deg, var(--primary-50), var(--accent-50)); border-radius: 20px; border: 2px solid var(--primary-200);">
                <h3 style="color: var(--primary-700); font-weight: 700; margin-bottom: 0.5rem;">
                    <i class="fas fa-lightbulb me-2"></i>Recommended for You
                </h3>
                <p style="color: var(--neutral-600); margin: 0; font-size: 0.95rem;">
                    Based on your learning progress and interests
                </p>
            </div>
            <div class="recommendations-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <!-- Recommendations will be populated here -->
            </div>
        `;
        
        // Insert at the end of the main content
        const mainContent = document.querySelector('main, .content-section');
        if (mainContent) {
            mainContent.appendChild(recommendationsContainer);
        }
    }

    updateRecommendations() {
        const recommendationsGrid = document.querySelector('.recommendations-grid');
        if (!recommendationsGrid) return;
        
        const recommendations = this.generateRecommendations();
        recommendationsGrid.innerHTML = recommendations.map(rec => this.createRecommendationCard(rec)).join('');
    }

    generateRecommendations() {
        const userLevel = this.getUserLevel();
        const userInterests = this.getUserInterests();
        const completedArticles = this.userProgress.completedArticles;
        
        // Filter content based on user preferences
        const availableContent = Object.entries(this.contentRelationships)
            .filter(([id, content]) => {
                // Not already completed
                if (completedArticles.includes(id)) return false;
                
                // Matches user interests
                if (userInterests.length > 0 && !userInterests.includes(content.category)) return false;
                
                // Appropriate difficulty level
                if (userLevel === 'beginner' && content.difficulty === 'advanced') return false;
                if (userLevel === 'advanced' && content.difficulty === 'beginner') return false;
                
                return true;
            })
            .map(([id, content]) => ({ id, ...content }))
            .sort((a, b) => {
                // Prioritize by relevance and difficulty match
                let scoreA = 0, scoreB = 0;
                
                // Difficulty match bonus
                if (a.difficulty === userLevel) scoreA += 10;
                if (b.difficulty === userLevel) scoreB += 10;
                
                // Interest match bonus
                if (userInterests.includes(a.category)) scoreA += 5;
                if (userInterests.includes(b.category)) scoreB += 5;
                
                return scoreB - scoreA;
            })
            .slice(0, 6); // Top 6 recommendations
        
        return availableContent;
    }

    createRecommendationCard(recommendation) {
        return `
            <div class="recommendation-card" style="background: white; border: 2px solid var(--accent-200); border-radius: 20px; padding: 1.5rem; transition: all 0.3s ease; hover: transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div class="card-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div class="difficulty-badge" style="background: ${this.getDifficultyColor(recommendation.difficulty)}; color: white; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem; font-weight: 600;">
                        ${recommendation.difficulty}
                    </div>
                    <div class="category-badge" style="background: var(--primary-100); color: var(--primary-700); padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem; font-weight: 600;">
                        ${recommendation.category}
                    </div>
                </div>
                <h4 style="color: var(--primary-600); font-weight: 600; margin-bottom: 0.5rem;">
                    <a href="/en/${this.getArticleUrl(recommendation.id)}" style="color: inherit; text-decoration: none;">
                        ${this.getArticleTitle(recommendation.id)}
                    </a>
                </h4>
                <p style="color: var(--neutral-700); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1rem;">
                    ${this.getArticleSummary(recommendation.id)}
                </p>
                <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="time-estimate" style="color: var(--neutral-600); font-size: 0.9rem;">
                        <i class="fas fa-clock me-1"></i>${recommendation.estimatedTime} min read
                    </div>
                    <a href="/en/${this.getArticleUrl(recommendation.id)}" class="btn btn-primary" style="background: var(--accent-500); color: white; padding: 0.5rem 1rem; border-radius: 20px; text-decoration: none; font-size: 0.9rem; font-weight: 600;">
                        Start Reading
                    </a>
                </div>
            </div>
        `;
    }

    // Interactive Elements
    setupInteractiveElements() {
        this.setupBookmarking();
        this.setupNotes();
        this.setupKnowledgeChecks();
        this.setupGamification();
    }

    setupBookmarking() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('bookmark-btn')) {
                const articleId = e.target.dataset.article;
                this.toggleBookmark(articleId);
            }
        });
    }

    toggleBookmark(articleId) {
        const bookmarks = this.userProgress.bookmarks || [];
        const index = bookmarks.indexOf(articleId);
        
        if (index > -1) {
            bookmarks.splice(index, 1);
            this.showNotification('Article removed from bookmarks', 'info');
        } else {
            bookmarks.push(articleId);
            this.showNotification('Article added to bookmarks', 'success');
        }
        
        this.userProgress.bookmarks = bookmarks;
        this.saveUserProgress();
        this.updateBookmarkUI(articleId);
    }

    setupNotes() {
        // Add note-taking functionality
        this.createNotesInterface();
    }

    createNotesInterface() {
        const notesContainer = document.createElement('div');
        notesContainer.className = 'notes-interface';
        notesContainer.innerHTML = `
            <div class="notes-panel" style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); padding: 1rem; width: 300px; z-index: 1000; display: none;">
                <div class="notes-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h4 style="color: var(--primary-600); margin: 0;">My Notes</h4>
                    <button class="close-notes" style="background: none; border: none; color: var(--neutral-500); cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <textarea class="notes-textarea" placeholder="Add your notes here..." style="width: 100%; height: 200px; border: 1px solid var(--neutral-200); border-radius: 10px; padding: 0.75rem; resize: vertical; font-family: inherit;"></textarea>
                <button class="save-notes btn btn-primary" style="width: 100%; margin-top: 0.5rem; background: var(--primary-500); color: white; border: none; padding: 0.75rem; border-radius: 10px; font-weight: 600;">
                    Save Notes
                </button>
            </div>
            <button class="notes-toggle" style="position: fixed; right: 20px; bottom: 20px; background: var(--primary-500); color: white; border: none; border-radius: 50%; width: 60px; height: 60px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); cursor: pointer; z-index: 999;">
                <i class="fas fa-sticky-note"></i>
            </button>
        `;
        
        document.body.appendChild(notesContainer);
        this.bindNotesEvents();
    }

    bindNotesEvents() {
        const notesToggle = document.querySelector('.notes-toggle');
        const notesPanel = document.querySelector('.notes-panel');
        const closeNotes = document.querySelector('.close-notes');
        const saveNotes = document.querySelector('.save-notes');
        const textarea = document.querySelector('.notes-textarea');
        
        notesToggle.addEventListener('click', () => {
            notesPanel.style.display = notesPanel.style.display === 'none' ? 'block' : 'none';
        });
        
        closeNotes.addEventListener('click', () => {
            notesPanel.style.display = 'none';
        });
        
        saveNotes.addEventListener('click', () => {
            const articleId = this.getCurrentArticleId();
            if (articleId) {
                this.saveNotes(articleId, textarea.value);
                this.showNotification('Notes saved successfully', 'success');
            }
        });
        
        // Load existing notes
        const articleId = this.getCurrentArticleId();
        if (articleId) {
            const notes = this.loadNotes(articleId);
            if (notes) {
                textarea.value = notes;
            }
        }
    }

    // Accessibility Features
    setupAccessibilityFeatures() {
        this.createAccessibilityControls();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
    }

    createAccessibilityControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'accessibility-controls';
        controlsContainer.innerHTML = `
            <div class="accessibility-panel" style="position: fixed; top: 20px; left: 20px; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); padding: 1rem; z-index: 1000; display: none;">
                <h4 style="color: var(--primary-600); margin-bottom: 1rem;">Accessibility Options</h4>
                <div class="control-group" style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Font Size</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="font-size-btn" data-size="small" style="padding: 0.5rem; border: 1px solid var(--neutral-300); background: white; border-radius: 5px;">A-</button>
                        <button class="font-size-btn" data-size="normal" style="padding: 0.5rem; border: 1px solid var(--neutral-300); background: white; border-radius: 5px;">A</button>
                        <button class="font-size-btn" data-size="large" style="padding: 0.5rem; border: 1px solid var(--neutral-300); background: white; border-radius: 5px;">A+</button>
                    </div>
                </div>
                <div class="control-group" style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Contrast</label>
                    <button class="contrast-toggle" style="padding: 0.5rem 1rem; border: 1px solid var(--neutral-300); background: white; border-radius: 5px; width: 100%;">
                        Toggle High Contrast
                    </button>
                </div>
                <div class="control-group">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Reading Mode</label>
                    <button class="reading-mode-toggle" style="padding: 0.5rem 1rem; border: 1px solid var(--neutral-300); background: white; border-radius: 5px; width: 100%;">
                        Enable Reading Mode
                    </button>
                </div>
            </div>
            <button class="accessibility-toggle" style="position: fixed; top: 20px; left: 20px; background: var(--accent-500); color: white; border: none; border-radius: 50%; width: 50px; height: 50px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); cursor: pointer; z-index: 999;">
                <i class="fas fa-universal-access"></i>
            </button>
        `;
        
        document.body.appendChild(controlsContainer);
        this.bindAccessibilityEvents();
    }

    bindAccessibilityEvents() {
        const toggle = document.querySelector('.accessibility-toggle');
        const panel = document.querySelector('.accessibility-panel');
        const fontSizeBtns = document.querySelectorAll('.font-size-btn');
        const contrastToggle = document.querySelector('.contrast-toggle');
        const readingModeToggle = document.querySelector('.reading-mode-toggle');
        
        toggle.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        
        fontSizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const size = btn.dataset.size;
                this.setFontSize(size);
            });
        });
        
        contrastToggle.addEventListener('click', () => {
            this.toggleHighContrast();
        });
        
        readingModeToggle.addEventListener('click', () => {
            this.toggleReadingMode();
        });
    }

    // Utility Methods
    getCurrentArticleId() {
        const path = window.location.pathname;
        const match = path.match(/\/([^\/]+)\.html$/);
        return match ? match[1] : null;
    }

    getArticleUrl(articleId) {
        // Map article IDs to URLs
        const urlMap = {
            'ibs-basics': 'irritable-bowel-syndrome-fodmap.html',
            'ibs-symptoms': 'irritable-bowel-syndrome-fodmap.html#symptoms',
            'fodmap-intro': 'irritable-bowel-syndrome-fodmap.html#what-are-fodmaps',
            'diabetes-basics': 'diabetes-management.html',
            'weight-loss-basics': 'weight-loss.html'
        };
        return urlMap[articleId] || `${articleId}.html`;
    }

    getArticleTitle(articleId) {
        const titleMap = {
            'ibs-basics': 'Understanding IBS: The Complete Guide',
            'ibs-symptoms': 'IBS Symptoms: What You Need to Know',
            'fodmap-intro': 'FODMAP Diet: A Beginner\'s Guide',
            'diabetes-basics': 'Diabetes Management: Essential Information',
            'weight-loss-basics': 'Weight Loss: Science-Based Approaches'
        };
        return titleMap[articleId] || 'Article Title';
    }

    getArticleSummary(articleId) {
        const summaryMap = {
            'ibs-basics': 'Learn about irritable bowel syndrome, its causes, symptoms, and management strategies.',
            'ibs-symptoms': 'Discover the common symptoms of IBS and how to identify them.',
            'fodmap-intro': 'Understand the FODMAP diet and how it can help manage IBS symptoms.',
            'diabetes-basics': 'Essential information about diabetes types, management, and lifestyle changes.',
            'weight-loss-basics': 'Evidence-based approaches to sustainable weight loss and health improvement.'
        };
        return summaryMap[articleId] || 'Article summary';
    }

    getDifficultyColor(difficulty) {
        const colors = {
            'beginner': 'var(--success-500)',
            'intermediate': 'var(--warning-500)',
            'advanced': 'var(--primary-500)'
        };
        return colors[difficulty] || 'var(--neutral-500)';
    }

    getUserLevel() {
        const completedCount = this.userProgress.completedArticles.length;
        if (completedCount < 3) return 'beginner';
        if (completedCount < 8) return 'intermediate';
        return 'advanced';
    }

    getUserInterests() {
        const interests = [];
        this.userProgress.completedArticles.forEach(articleId => {
            const relationship = this.contentRelationships[articleId];
            if (relationship && !interests.includes(relationship.category)) {
                interests.push(relationship.category);
            }
        });
        return interests;
    }

    // Data Persistence
    loadUserProgress() {
        try {
            return JSON.parse(localStorage.getItem('diaeta_user_progress') || '{}');
        } catch {
            return {
                completedArticles: [],
                bookmarks: [],
                notes: {},
                achievements: [],
                preferences: {}
            };
        }
    }

    saveUserProgress() {
        localStorage.setItem('diaeta_user_progress', JSON.stringify(this.userProgress));
    }

    loadUserPreferences() {
        try {
            return JSON.parse(localStorage.getItem('diaeta_user_preferences') || '{}');
        } catch {
            return {
                fontSize: 'normal',
                highContrast: false,
                readingMode: false,
                language: 'en'
            };
        }
    }

    saveUserPreferences() {
        localStorage.setItem('diaeta_user_preferences', JSON.stringify(this.userPreferences));
    }

    loadNotes(articleId) {
        return this.userProgress.notes[articleId] || '';
    }

    saveNotes(articleId, notes) {
        this.userProgress.notes[articleId] = notes;
        this.saveUserProgress();
    }

    // Event Binding
    bindEvents() {
        // Global event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
        });
        
        // Track user interactions
        this.trackUserInteractions();
    }

    trackUserInteractions() {
        // Track time spent on articles
        let startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.analytics.trackTimeSpent(this.getCurrentArticleId(), timeSpent);
        });
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100);
            maxScroll = Math.max(maxScroll, scrollPercent);
        });
        
        window.addEventListener('beforeunload', () => {
            this.analytics.trackScrollDepth(this.getCurrentArticleId(), maxScroll);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-500)' : type === 'error' ? 'var(--error-500)' : 'var(--primary-500)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Analytics Tracker
class AnalyticsTracker {
    constructor() {
        this.events = [];
    }

    trackEvent(eventName, data = {}) {
        this.events.push({
            event: eventName,
            data,
            timestamp: Date.now()
        });
        
        // In a real implementation, you'd send this to your analytics service
        console.log('Analytics Event:', eventName, data);
    }

    trackTimeSpent(articleId, seconds) {
        this.trackEvent('time_spent', { articleId, seconds });
    }

    trackScrollDepth(articleId, percentage) {
        this.trackEvent('scroll_depth', { articleId, percentage });
    }

    trackArticleCompletion(articleId) {
        this.trackEvent('article_completed', { articleId });
    }

    trackSearch(query, results) {
        this.trackEvent('search', { query, resultsCount: results.length });
    }
}

// Initialize Knowledge Hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Knowledge Hub JS loaded!");

    // --- Mock Data ---
    const recommendations = [
        {
            title: "The Role of Fiber in Weight Management",
            category: "Nutrition Science",
            icon: "fas fa-seedling",
            url: "#",
            color: "primary"
        },
        {
            title: "Mindful Eating: A Beginner's Guide",
            category: "Behavioral Tips",
            icon: "fas fa-brain",
            url: "#",
            color: "accent"
        },
        {
            title: "High-Protein Breakfast Ideas",
            category: "Recipes",
            icon: "fas fa-utensils",
            url: "#",
            color: "success"
        }
    ];

    const achievements = [
        { name: "First Article Read", icon: "fas fa-book-reader", unlocked: true },
        { name: "5-Day Streak", icon: "fas fa-fire", unlocked: true },
        { name: "Completed First Path", icon: "fas fa-flag-checkered", unlocked: false },
        { name: "Bookmarked 10 Articles", icon: "fas fa-bookmark", unlocked: true },
        { name: "Early Bird", icon: "fas fa-sun", unlocked: true, description: "Learned before 9 AM" },
        { name: "Night Owl", icon: "fas fa-moon", unlocked: false, description: "Learned after 9 PM" },
        { name: "Weekend Warrior", icon: "fas fa-calendar-alt", unlocked: false, description: "Learned on a weekend" },
        { name: "Perfect Week", icon: "fas fa-star", unlocked: false, description: "Learned every day for a week" }
    ];

    // --- DOM Elements ---
    const recommendationsGrid = document.querySelector('.recommendations-grid');
    const achievementsGrid = document.querySelector('.achievements-grid');

    // --- Functions ---
    function renderRecommendations() {
        if (!recommendationsGrid) return;
        recommendationsGrid.innerHTML = recommendations.map(rec => `
            <a href="${rec.url}" class="recommendation-card card-hover-effect">
                <div class="rec-icon rec-icon--${rec.color}">
                    <i class="${rec.icon}"></i>
                </div>
                <div class="rec-content">
                    <span class="rec-category">${rec.category}</span>
                    <h4 class="rec-title">${rec.title}</h4>
                </div>
                <div class="rec-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
            </a>
        `).join('');
    }

    function renderAchievements() {
        if (!achievementsGrid) return;
        achievementsGrid.innerHTML = achievements.map(ach => `
            <div class="achievement-card ${ach.unlocked ? 'unlocked' : ''}" title="${ach.description || ach.name}">
                <div class="achievement-icon">
                    <i class="${ach.icon}"></i>
                </div>
                <p class="achievement-name">${ach.name}</p>
            </div>
        `).join('');
    }

    // --- Initial Render ---
    renderRecommendations();
    renderAchievements();

    // --- Add some styles for the dynamic content ---
    const style = document.createElement('style');
    style.textContent = `
        .recommendation-card {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            background: white;
            padding: 1.5rem;
            border-radius: 20px;
            text-decoration: none;
            color: inherit;
            box-shadow: 0 10px 30px rgba(0,0,0,0.07);
            border: 2px solid transparent;
        }
        .rec-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            flex-shrink: 0;
        }
        .rec-icon--primary { background: linear-gradient(135deg, var(--primary-500), var(--accent-500)); }
        .rec-icon--accent { background: linear-gradient(135deg, var(--accent-500), var(--secondary-500)); }
        .rec-icon--success { background: linear-gradient(135deg, var(--success-500), var(--warning-500)); }

        .rec-category {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--neutral-500);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .rec-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--primary-700);
            margin: 0.25rem 0 0;
        }
        .rec-arrow {
            margin-left: auto;
            color: var(--neutral-400);
            transition: all 0.3s ease;
        }
        .recommendation-card:hover .rec-arrow {
            color: var(--primary-500);
            transform: translateX(5px);
        }

        .achievement-card {
            background: var(--neutral-100);
            border-radius: 20px;
            padding: 1.5rem;
            text-align: center;
            opacity: 0.5;
            filter: grayscale(80%);
            transition: all 0.3s ease;
        }
        .achievement-card.unlocked {
            opacity: 1;
            filter: grayscale(0%);
            background: white;
            border: 2px solid var(--accent-200);
            box-shadow: 0 10px 30px rgba(0,0,0,0.07);
        }
        .achievement-icon {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            background: var(--neutral-300);
            color: var(--neutral-500);
            font-size: 2rem;
        }
        .achievement-card.unlocked .achievement-icon {
            background: linear-gradient(135deg, var(--warning-500), var(--accent-500));
            color: white;
        }
        .achievement-name {
            font-weight: 600;
            color: var(--neutral-700);
            margin: 0;
        }
        .card-hover-effect {
            transition: all 0.3s ease;
        }
        .card-hover-effect:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(style);
}); 