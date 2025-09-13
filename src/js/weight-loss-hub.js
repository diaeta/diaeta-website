document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('knowledge-network');
    if (!container) return;

    const centerNode = document.getElementById('node-center');
    const categoryNodes = Array.from(container.querySelectorAll('.network-node.category'));
    const articlePanels = Array.from(container.querySelectorAll('.article-panel'));
    const svg = document.getElementById('network-svg');

    let positions = {};
    let activeCategory = null;

    function calculatePositions() {
        // Defensive defaults in case CSS hasn't applied yet
        container.style.position = container.style.position || 'relative';
        let containerRect = container.getBoundingClientRect();
        if (containerRect.height < 420) {
            container.style.minHeight = container.style.minHeight || '680px';
            // force a reflow and re-read rect
            containerRect = container.getBoundingClientRect();
        }
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        // Guard: if container is too small (e.g., styles not loaded yet), fall back to stacked layout
        if (containerRect.width < 600 || containerRect.height < 420) {
            container.classList.add('network-stacked');
            return false;
        } else {
            container.classList.remove('network-stacked');
        }

        const radius = Math.min(centerX, centerY) * 0.68; // slightly reduced to avoid edge clipping
        const angleStep = (2 * Math.PI) / categoryNodes.length;

        // Center node
        positions.center = { x: centerX, y: centerY };

        // Category nodes
        categoryNodes.forEach((node, i) => {
            const angle = angleStep * i - (Math.PI / 2); // Start from top
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            positions[node.id] = { x, y };
        });

        // Article panels - position them near their corresponding category node
        articlePanels.forEach(panel => {
            const categoryId = 'node-' + panel.id.replace('panel-', '');
            const nodePos = positions[categoryId];
            if(!nodePos) return;

            // Position panel to the side of the node, considering viewport edges
            let panelX = nodePos.x + 80;
            let panelY = nodePos.y - 100;
            
            if (panelX + 320 > containerRect.width) {
                panelX = nodePos.x - 320 - 80;
            }

            positions[panel.id] = { x: panelX, y: panelY };
        });
        return true;
    }

    function applyPositions() {
        // Ensure absolute positioning for nodes (fallback if CSS missing)
        if (centerNode && getComputedStyle(centerNode).position === 'static') {
            centerNode.style.position = 'absolute';
        }
        categoryNodes.forEach(n => {
            if (getComputedStyle(n).position === 'static') {
                n.style.position = 'absolute';
            }
        });

        // Position center node
        if (centerNode) {
            centerNode.style.left = `${positions.center.x - centerNode.offsetWidth / 2}px`;
            centerNode.style.top = `${positions.center.y - centerNode.offsetHeight / 2}px`;
        }

        // Position category nodes
        categoryNodes.forEach(node => {
            if (positions[node.id]) {
                node.style.left = `${positions[node.id].x - node.offsetWidth / 2}px`;
                node.style.top = `${positions[node.id].y - node.offsetHeight / 2}px`;
            }
        });

        // Position article panels
        articlePanels.forEach(panel => {
             if (positions[panel.id]) {
                panel.style.left = `${positions[panel.id].x}px`;
                panel.style.top = `${positions[panel.id].y}px`;
            }
        });
    }
    
    function drawLines() {
        svg.innerHTML = '';
        const centerPos = positions.center;
        if (!centerPos) return;
        
        categoryNodes.forEach(node => {
            const nodePos = positions[node.id];
            if (!nodePos) return;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', centerPos.x);
            line.setAttribute('y1', centerPos.y);
            line.setAttribute('x2', nodePos.x);
            line.setAttribute('y2', nodePos.y);
            line.setAttribute('class', 'network-line');
            svg.appendChild(line);
        });
    }

    function setExpanded(node, expanded) {
        if (!node) return;
        node.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    function togglePanel(categoryId, show = true) {
        if (window.innerWidth <= 992) { // Mobile view logic
            const node = document.getElementById(`node-${categoryId}`);
            const panel = document.getElementById(`panel-${categoryId}`);
            if (!node || !panel) return;

            if (activeCategory === categoryId) {
                node.classList.remove('active');
                panel.style.display = 'none';
                panel.setAttribute('hidden', '');
                setExpanded(node, false);
                activeCategory = null;
            } else {
                 // Close previously active one
                if(activeCategory) {
                    const prevNode = document.getElementById(`node-${activeCategory}`);
                    const prevPanel = document.getElementById(`panel-${activeCategory}`);
                    if (prevNode) prevNode.classList.remove('active');
                    if (prevPanel) { prevPanel.style.display = 'none'; prevPanel.setAttribute('hidden', ''); }
                    setExpanded(prevNode, false);
                }
                node.classList.add('active');
                panel.style.display = 'block';
                panel.removeAttribute('hidden');
                setExpanded(node, true);
                activeCategory = categoryId;
            }
        } else { // Desktop view logic
            const panel = document.getElementById(`panel-${categoryId}`);
            if (!panel) return;
            
            // Hide all panels and deactivate all nodes first
            articlePanels.forEach(p => { p.classList.remove('visible'); p.setAttribute('hidden', ''); });
            categoryNodes.forEach(n => { n.classList.remove('active'); setExpanded(n, false); });

            if (show) {
                const node = document.getElementById(`node-${categoryId}`);
                panel.classList.add('visible');
                panel.removeAttribute('hidden');
                if (node) { node.classList.add('active'); setExpanded(node, true); }
            }
        }
    }


    function setupEventListeners() {
        categoryNodes.forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                const categoryId = node.dataset.category;
                if (window.innerWidth <= 992) { // Mobile toggle
                     togglePanel(categoryId);
                } else { // Desktop show
                    togglePanel(categoryId, true);
                }
            });
        });

        // Close buttons for desktop
        container.querySelectorAll('.close-panel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePanel(btn.dataset.category, false);
            });
        });

        // Close when clicking outside on desktop
        document.addEventListener('click', (e) => {
            if (window.innerWidth > 992) {
                if (!container.contains(e.target)) {
                    // Hide all panels and reset nodes
                    articlePanels.forEach(p => { p.classList.remove('visible'); p.setAttribute('hidden', ''); });
                    categoryNodes.forEach(n => { n.classList.remove('active'); setExpanded(n, false); });
                }
            }
        });
    }

    function init() {
        // Default to stacked layout, then upgrade to radial when safe
        container.classList.add('network-stacked');
        if (window.innerWidth > 992) {
            const ok = calculatePositions();
            if (ok) {
                applyPositions();
                drawLines();
                container.classList.remove('network-stacked');
            }
        }
        setupEventListeners();
    }
    
    init();

    // Recalculate on resize, but only for desktop view
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            init();
        }
    });
});
