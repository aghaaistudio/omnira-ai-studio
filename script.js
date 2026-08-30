// Helper Functions & UI Handlers for Omnira AI Studio

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.className = `toast ${type} show`;
    toast.textContent = message;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    if (show) {
        modal.classList.add('open');
    } else {
        modal.classList.remove('open');
    }
}

function switchTab(tabId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.classList.remove('active'));

    const activeSec = document.getElementById(tabId);
    if (activeSec) {
        activeSec.classList.add('active');
    }

    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(item => {
        if (item.getAttribute('onclick')?.includes(tabId)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Close sidebar on mobile after navigating
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function toggleTheme() {
    const root = document.getElementById('htmlRoot');
    if (!root) return;
    
    if (root.getAttribute('data-theme') === 'light') {
        root.removeAttribute('data-theme');
        showToast('Switched to Dark Mode', 'info');
    } else {
        root.setAttribute('data-theme', 'light');
        showToast('Switched to Light Mode', 'info');
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail')?.value;
    if (email) {
        showToast(`Welcome back to Omnira AI Studio! (${email})`, 'success');
        toggleModal('loginModal', false);
    } else {
        showToast('Please enter your email', 'error');
    }
}

function handleFileSelect(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const grid = document.getElementById('previewGrid');
    if (!grid) return;

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}" />
                <div class="overlay">
                    <button class="scene-action-btn" onclick="this.parentElement.parentElement.remove(); showToast('Asset removed', 'info');">Remove</button>
                </div>
            `;
            grid.appendChild(item);
        };
        reader.readAsDataURL(file);
    });

    showToast(`Uploaded ${files.length} asset(s)`, 'success');
}
