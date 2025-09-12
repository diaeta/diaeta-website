document.addEventListener('DOMContentLoaded', () => {
    // Accessible dialog system for the Personalized Pathway
    const dialogs = Array.from(document.querySelectorAll('.dialog'));
    const nodes = Array.from(document.querySelectorAll('.node[aria-haspopup="dialog"]'));

    function getFocusableElements(container) {
        return Array.from(container.querySelectorAll(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));
    }

    function openDialog(dialog, trigger) {
        dialog.setAttribute('aria-hidden', 'false');
        dialog.dataset.triggerId = trigger ? trigger.id || '' : '';

        const panel = dialog.querySelector('.dialog__panel');
        const focusables = getFocusableElements(panel);
        (focusables[0] || panel).focus();

        function onKeydown(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeDialog(dialog);
            } else if (e.key === 'Tab') {
                // Focus trap
                const items = getFocusableElements(panel);
                if (items.length === 0) return;
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        dialog.addEventListener('keydown', onKeydown);
        dialog._onKeydown = onKeydown;
        document.body.style.overflow = 'hidden';
    }

    function closeDialog(dialog) {
        dialog.setAttribute('aria-hidden', 'true');
        if (dialog._onKeydown) dialog.removeEventListener('keydown', dialog._onKeydown);
        document.body.style.overflow = '';
        const triggerId = dialog.dataset.triggerId;
        if (triggerId) {
            const back = document.getElementById(triggerId);
            if (back) back.focus();
        }
    }

    // Wire node buttons
    nodes.forEach((btn, idx) => {
        // Assign IDs if missing for return focus
        if (!btn.id) btn.id = `wl-node-${idx+1}`;
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('aria-controls');
            const dialog = document.getElementById(targetId);
            if (dialog) {
                openDialog(dialog, btn);
                btn.setAttribute('aria-expanded', 'true');
            }
        });
        btn.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !e.defaultPrevented) {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // Close handlers
    dialogs.forEach(dialog => {
        const closeBtn = dialog.querySelector('[data-close]');
        if (closeBtn) closeBtn.addEventListener('click', () => closeDialog(dialog));
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) closeDialog(dialog);
        });
    });
});
