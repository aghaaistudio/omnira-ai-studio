// ============================================================
// STATE
// ============================================================
let savedProjects = [];
let generatedCount = 0;

// ============================================================
// TOAST
// ============================================================
let toastTimeout = null;

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.classList.add('show'); });
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ============================================================
// SIDEBAR
// ============================================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page) {
    if (window.innerWidth < 1024) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('open');
    }
    document.querySelectorAll('.sidebar-nav .item').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.page === page) el.classList.add('active');
    });
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    else document.getElementById('page-dashboard').classList.add('active');
    document.getElementById('contentArea').scrollTop = 0;
}

// ============================================================
// THEME
// ============================================================
let isDark = false;

function toggleTheme() {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    isDark = !isDark;
    if (isDark) {
        root.setAttribute('data-theme', 'dark');
        toggle.classList.remove('active');
        localStorage.setItem('agha-theme', 'dark');
        showToast('🌙 Dark mode enabled', 'info');
    } else {
        root.removeAttribute('data-theme');
        toggle.classList.add('active');
        localStorage.setItem('agha-theme', 'light');
        showToast('☀️ Light mode enabled', 'info');
    }
}

(function() {
    const saved = localStorage.getItem('agha-theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').classList.remove('active');
        isDark = true;
    }
})();

// ============================================================
// SETTINGS TABS
// ============================================================
function switchSettingsTab(tab) {
    document.querySelectorAll('.settings-tabs button').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.settings-tab').forEach(el => el.classList.remove('active'));
    const tabMap = {
        general: 'settings-general',
        providers: 'settings-providers',
        models: 'settings-models',
        security: 'settings-security',
        billing: 'settings-billing',
        about: 'settings-about'
    };
    const target = document.getElementById(tabMap[tab]);
    if (target) target.classList.add('active');
    document.querySelectorAll('.settings-tabs button').forEach(el => {
        if (el.textContent.toLowerCase().includes(tab)) el.classList.add('active');
    });
}

// ============================================================
// LOGIN
// ============================================================
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    if (email) {
        document.getElementById('loginModal').classList.remove('open');
        showToast(`✅ Welcome back, ${email.split('@')[0]}!`, 'success');
    } else {
        showToast('⚠️ Please enter email and password.', 'error');
    }
}

// ============================================================
// PROVIDER — EXPAND / COLLAPSE
// ============================================================
function toggleProvider(id) {
    const body = document.getElementById('body-' + id);
    const card = document.getElementById('provider-' + id);
    const icon = card.querySelector('.expand-icon');
    if (body.classList.contains('open')) {
        body.classList.remove('open');
        icon.classList.remove('open');
    } else {
        body.classList.add('open');
        icon.classList.add('open');
    }
}

// ============================================================
// PROVIDER — KEY VISIBILITY TOGGLE
// ============================================================
function toggleKeyVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// ============================================================
// PROVIDER — ACTIONS
// ============================================================
function saveProvider(name) {
    showToast(`💾 ${name} configuration saved!`, 'success');
    const cards = document.querySelectorAll('.provider-card');
    cards.forEach(card => {
        const header = card.querySelector('.provider-header');
        const nameEl = header.querySelector('.name');
        if (nameEl && nameEl.textContent === name) {
            const status = header.querySelector('.status');
            if (status) {
                status.className = 'status connected';
                status.textContent = '● Connected';
            }
        }
    });
}

function testProvider(name) {
    showToast(`🔌 Testing connection to ${name}...`, 'info');
    setTimeout(() => {
        showToast(`✅ ${name} connection successful!`, 'success');
    }, 1200);
}

function disconnectProvider(name) {
    showToast(`🔗 ${name} disconnected.`, 'error');
    const cards = document.querySelectorAll('.provider-card');
    cards.forEach(card => {
        const header = card.querySelector('.provider-header');
        const nameEl = header.querySelector('.name');
        if (nameEl && nameEl.textContent === name) {
            const status = header.querySelector('.status');
            if (status) {
                status.className = 'status disconnected';
                status.textContent = '● Not connected';
            }
            const keyInput = card.querySelector('input[type="password"]');
            if (keyInput) keyInput.value = '';
        }
    });
}

// ============================================================
// CREATE MODAL
// ============================================================
let currentCreateType = 'product';

function openCreateModal(type) {
    currentCreateType = type || 'product';
    const modal = document.getElementById('createModal');
    const body = document.getElementById('createModalBody');
    const title = document.getElementById('createModalTitle');

    const typeLabels = {
        product: '📹 Product Ad',
        image: '🖼️ Image Ad',
        video: '🎬 Video Ad',
        script: '📝 Script to Ad',
        'image-to-ad': '🖼️→📱 Image to Ad',
        ugc: '🎭 UGC Ad',
        social: '📱 Social Ad',
        'script-generator': '📝 Ad Script'
    };
    title.textContent = '✨ ' + (typeLabels[type] || 'Create Ad');

    let html = '';
    if (type === 'product' || type === 'video') {
        html = `
            <div class="form-group"><label>Brand Name</label><input type="text" id="modalBrand" value="Aura Sound" /></div>
            <div class="form-group"><label>Product / Service</label><input type="text" id="modalProduct" value="Premium Headphones" /></div>
            <div class="form-group"><label>Description</label><textarea id="modalDesc" rows="2">Premium wireless headphones with studio-grade sound.</textarea></div>
            <div class="form-row">
                <div class="form-group"><label>Target Audience</label><input type="text" id="modalAudience" value="Young professionals" /></div>
                <div class="form-group"><label>Platform</label><select id="modalPlatform"><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="tiktok">TikTok</option><option value="youtube">YouTube</option></select></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Duration</label><select id="modalDuration"><option value="15">15 sec</option><option value="30" selected>30 sec</option><option value="60">60 sec</option></select></div>
                <div class="form-group"><label>CTA</label><input type="text" id="modalCTA" value="Shop Now" /></div>
            </div>
        `;
    } else if (type === 'image' || type === 'image-to-ad') {
        html = `
            <div class="form-group"><label>Brand</label><input type="text" id="modalBrand" value="Aura Sound" /></div>
            <div class="form-group"><label>Product</label><input type="text" id="modalProduct" value="Premium Headphones" /></div>
            <div class="form-row">
                <div class="form-group"><label>Platform</label><select id="modalPlatform"><option value="instagram">Instagram</option><option value="facebook">Facebook</option></select></div>
                <div class="form-group"><label>Aspect Ratio</label><select id="modalRatio"><option value="1:1">1:1 Square</option><option value="4:5">4:5 Social</option><option value="16:9">16:9 Landscape</option></select></div>
            </div>
            <div class="form-group"><label>CTA</label><input type="text" id="modalCTA" value="Shop Now" /></div>
        `;
    } else if (type === 'script' || type === 'script-generator') {
        html = `
            <div class="form-group"><label>Brand</label><input type="text" id="modalBrand" value="Aura Sound" /></div>
            <div class="form-group"><label>Product</label><input type="text" id="modalProduct" value="Premium Headphones" /></div>
            <div class="form-group"><label>Description</label><textarea id="modalDesc" rows="2">Premium wireless headphones with active noise cancellation.</textarea></div>
            <div class="form-row">
                <div class="form-group"><label>Tone</label><select id="modalTone"><option value="professional">Professional</option><option value="premium">Premium</option><option value="friendly">Friendly</option><option value="bold">Bold</option></select></div>
                <div class="form-group"><label>Duration</label><select id="modalDuration"><option value="15">15 sec</option><option value="30" selected>30 sec</option></select></div>
            </div>
            <div class="form-group"><label>CTA</label><input type="text" id="modalCTA" value="Shop Now" /></div>
        `;
    } else if (type === 'ugc') {
        html = `
            <div class="form-group"><label>Product</label><input type="text" id="modalProduct" value="Aura Sound Pro" /></div>
            <div class="form-group"><label>Target Audience</label><input type="text" id="modalAudience" value="Young adults, 18-35" /></div>
            <div class="form-row">
                <div class="form-group"><label>UGC Style</label><select id="modalUgcStyle"><option value="honest-review">Honest Review</option><option value="testimonial">Testimonial</option><option value="reaction">Reaction</option></select></div>
                <div class="form-group"><label>Platform</label><select id="modalPlatform"><option value="tiktok">TikTok</option><option value="instagram">Instagram</option></select></div>
            </div>
            <div class="form-group"><label>Hook</label><input type="text" id="modalHook" value="I've been using these..." /></div>
        `;
    } else if (type === 'social') {
        html = `
            <div class="form-group"><label>Brand</label><input type="text" id="modalBrand" value="Aura Sound" /></div>
            <div class="form-group"><label>Product</label><input type="text" id="modalProduct" value="Premium Headphones" /></div>
            <div class="form-row">
                <div class="form-group"><label>Platform</label><select id="modalPlatform"><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="tiktok">TikTok</option></select></div>
                <div class="form-group"><label>Objective</label><select id="modalObjective"><option value="awareness">Brand Awareness</option><option value="sales">Sales</option><option value="engagement">Engagement</option></select></div>
            </div>
            <div class="form-group"><label>CTA</label><input type="text" id="modalCTA" value="Shop Now" /></div>
        `;
    } else {
        html = `<p style="color:var(--text-secondary);">Select an ad type to get started.</p>`;
    }

    body.innerHTML = html;
    modal.classList.add('open');
}

function closeCreateModal() {
    document.getElementById('createModal').classList.remove('open');
}

function handleCreateSubmit() {
    const type = currentCreateType;
    const brand = document.getElementById('modalBrand')?.value || 'Aura Sound';
    const product = document.getElementById('modalProduct')?.value || 'Premium Product';
    const desc = document.getElementById('modalDesc')?.value || 'Premium product description.';
    const platform = document.getElementById('modalPlatform')?.value || 'instagram';
    const cta = document.getElementById('modalCTA')?.value || 'Shop Now';
    const duration = document.getElementById('modalDuration')?.value || '30';

    const platformLabels = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube' };
    const typeLabels = {
        product: 'Product Ad',
        image: 'Image Ad',
        video: 'Video Ad',
        script: 'Script to Ad',
        'image-to-ad': 'Image to Ad',
        ugc: 'UGC Ad',
        social: 'Social Ad',
        'script-generator': 'Ad Script'
    };

    closeCreateModal();
    const label = typeLabels[type] || 'Ad';
    const platformLabel = platformLabels[platform] || platform;
    generatedCount++;

    document.getElementById('statAds').textContent = parseInt(document.getElementById('statAds').textContent) + 1;
    if (type === 'video' || type === 'script') {
        document.getElementById('statVideos').textContent = parseInt(document.getElementById('statVideos').textContent) + 1;
    }
    if (type === 'image' || type === 'image-to-ad') {
        document.getElementById('statImages').textContent = parseInt(document.getElementById('statImages').textContent) + 1;
    }

    showToast(`✅ "${product}" - ${label} generated! (${duration}s, ${platformLabel})`, 'success');

    const pageMap = {
        script: 'ad-script',
        'script-generator': 'ad-script',
        image: 'image-ad',
        'image-to-ad': 'image-ad',
        video: 'video-ad',
        ugc: 'ugc-ad',
        social: 'social-ad'
    };
    if (pageMap[type]) navigateTo(pageMap[type]);
    else navigateTo('dashboard');
}

// ============================================================
// GENERATION FUNCTIONS
// ============================================================

function generateScript() {
    const brand = document.getElementById('scriptBrand').value || 'Aura Sound';
    const product = document.getElementById('scriptProduct').value || 'Product';
    const desc = document.getElementById('scriptDesc').value || 'Premium product.';
    const audience = document.getElementById('scriptAudience').value || 'Everyone';
    const platform = document.getElementById('scriptPlatform').value || 'instagram';
    const tone = document.getElementById('scriptTone').value || 'professional';
    const duration = document.getElementById('scriptDuration').value || '30';
    const cta = document.getElementById('scriptCTA').value || 'Shop Now';

    const result = document.getElementById('scriptResult');
    const content = document.getElementById('scriptResultContent');
    result.classList.remove('hidden');
    content.innerHTML = `<div class="generating"><div class="spinner"></div><div class="label">Generating ad script...</div><div class="stage">✍️ Writing hook → problem → solution → CTA</div></div>`;

    setTimeout(() => {
        const script = `
🎯 AD SCRIPT — ${brand} · ${product}

📌 HOOK (0-3s)
"${tone === 'premium' ? 'Experience the difference.' : tone === 'bold' ? 'This changes everything.' : 'Tired of the ordinary?'}"

🔥 PROBLEM (3-6s)
Most products fail to deliver. ${audience} deserve better.

💡 SOLUTION (6-12s)
Introducing ${product}. ${desc.substring(0, 80)}...

✨ BENEFITS (12-18s)
• Premium quality
• Designed for ${audience}
• Trusted by thousands

🎯 CTA (18-${duration}s)
${cta.toUpperCase()} — visit our website today.

📱 PLATFORM: ${platform.toUpperCase()}
⏱️ DURATION: ${duration}s
🎭 TONE: ${tone.charAt(0).toUpperCase() + tone.slice(1)}

--- SCENE BREAKDOWN ---
Scene 01: Hook — Visual: Hero shot
Scene 02: Problem — Visual: Frustrated user
Scene 03: Solution — Visual: Product showcase
Scene 04: Benefits — Visual: Product features
Scene 05: CTA — Visual: Brand + CTA overlay
        `;
        content.textContent = script;
        showToast('✅ Ad script generated!', 'success');
    }, 1200);
}

function generateImageAd() {
    const brand = document.getElementById('imgBrand').value || 'Aura Sound';
    const product = document.getElementById('imgProduct').value || 'Premium Product';
    const style = document.getElementById('imgStyle').value || 'modern';
    const platform = document.getElementById('imgPlatform').value || 'instagram';
    const ratio = document.getElementById('imgRatio').value || '1:1';
    const cta = document.getElementById('imgCTA').value || 'Shop Now';

    const result = document.getElementById('imgResult');
    result.classList.remove('hidden');
    document.getElementById('imgResultTitle').textContent = `${brand} · ${product}`;
    document.getElementById('imgResultCTA').textContent = cta.toUpperCase();
    document.getElementById('imgResultFormat').textContent = `${platform.charAt(0).toUpperCase() + platform.slice(1)} · ${ratio}`;
    showToast('🖼️ Image ad generated!', 'success');
}

function downloadImageAd() {
    showToast('⬇️ Downloading image ad...', 'info');
    const link = document.createElement('a');
    link.download = 'image-ad.png';
    link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    link.click();
    showToast('✅ Image downloaded!', 'success');
}

function generateVideoAd() {
    const brand = document.getElementById('vidBrand').value || 'Aura Sound';
    const product = document.getElementById('vidProduct').value || 'Premium Product';
    const desc = document.getElementById('vidDesc').value || 'Premium product.';
    const audience = document.getElementById('vidAudience').value || 'Everyone';
    const platform = document.getElementById('vidPlatform').value || 'instagram';
    const style = document.getElementById('vidStyle').value || 'cinematic';
    const duration = document.getElementById('vidDuration').value || '30';

    const result = document.getElementById('vidResult');
    result.classList.remove('hidden');
    document.getElementById('vidResultTitle').textContent = `${brand} · ${product}`;
    document.getElementById('vidResultDesc').textContent = desc.substring(0, 60) + '...';
    document.getElementById('vidResultDuration').textContent = `${duration}s · ${style}`;
    showToast('🎬 Video ad generated!', 'success');
}

function downloadVideoAd() {
    showToast('⬇️ Downloading video...', 'info');
    const link = document.createElement('a');
    link.download = 'video-ad.mp4';
    link.href = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAQxtZGF0AAAAMgAAACh3cnZrbG9n';
    link.click();
    showToast('✅ Video downloaded!', 'success');
}

function generateScriptToVideo() {
    const script = document.getElementById('stvScript').value || 'Sample script.';
    const style = document.getElementById('stvStyle').value || 'cinematic';
    const ratio = document.getElementById('stvRatio').value || '16:9';

    const result = document.getElementById('stvResult');
    result.classList.remove('hidden');
    document.getElementById('stvResultTitle').textContent = `Script to Video · ${style} · ${ratio}`;
    showToast('📹 Video from script generated!', 'success');
}

function generateUgcAd() {
    const product = document.getElementById('ugcProduct').value || 'Product';
    const audience = document.getElementById('ugcAudience').value || 'Everyone';
    const style = document.getElementById('ugcStyle').value || 'honest-review';
    const platform = document.getElementById('ugcPlatform').value || 'tiktok';
    const hook = document.getElementById('ugcHook').value || "I've been using this...";

    const result = document.getElementById('ugcResult');
    const content = document.getElementById('ugcResultContent');
    result.classList.remove('hidden');
    content.textContent = `
🎭 UGC AD — ${style.replace('-', ' ').toUpperCase()}

🎬 HOOK: "${hook}"

💬 SCRIPT:
"Hey everyone! I've been using ${product} for the past week and I have to share my honest thoughts.

First off, the quality is amazing. Perfect for ${audience}.

The ${platform} community is going to love this.

If you're looking for something that actually works, this is it.

Check the link in my bio — you won't regret it."

📱 PLATFORM: ${platform.toUpperCase()}
🎭 STYLE: ${style.replace('-', ' ').toUpperCase()}
⏱️ DURATION: 15-30s

🏷️ SUGGESTED HASHTAGS:
#${product.replace(/\s/g,'')} #${style} #${platform} #honestreview
    `;
    showToast('🎭 UGC ad generated!', 'success');
}

function generateSocialAd() {
    const brand = document.getElementById('socialBrand').value || 'Aura Sound';
    const product = document.getElementById('socialProduct').value || 'Premium Product';
    const desc = document.getElementById('socialDesc').value || 'Premium product.';
    const platform = document.getElementById('socialPlatform').value || 'instagram';
    const objective = document.getElementById('socialObjective').value || 'awareness';

    const result = document.getElementById('socialResult');
    const content = document.getElementById('socialResultContent');
    result.classList.remove('hidden');
    content.textContent = `
📱 SOCIAL MEDIA AD — ${platform.toUpperCase()}

🎯 OBJECTIVE: ${objective.replace('-', ' ').toUpperCase()}

📌 HEADLINE:
${brand} — Premium ${product}

📝 COPY:
${desc}

🔥 BENEFITS:
• Premium quality
• Designed for you
• Trusted by thousands

🎯 CTA:
Shop Now → ${brand}.com

📸 VISUAL CONCEPT:
Hero shot of ${product} with ${brand} branding.
Lifestyle imagery showing real people using the product.

🏷️ HASHTAGS:
#${brand.replace(/\s/g,'')} #${product.replace(/\s/g,'')} #${platform} #ad
    `;
    showToast('📱 Social ad generated!', 'success');
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function copyResult(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        navigator.clipboard.writeText(el.textContent).then(() => {
            showToast('📋 Copied to clipboard!', 'success');
        }).catch(() => {
            const range = document.createRange();
            range.selectNode(el);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            showToast('📋 Copied to clipboard!', 'success');
        });
    }
}

function downloadText(elementId, filename) {
    const el = document.getElementById(elementId);
    if (el) {
        const blob = new Blob([el.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'ad-content.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('⬇️ File downloaded!', 'success');
    }
}

function saveToProject(type, elementId) {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : null;
    const content = el ? el.textContent : type + ' content saved.';
    const project = {
        id: Date.now(),
        name: type + ' - ' + new Date().toLocaleDateString(),
        type: type,
        content: content.substring(0, 200) + '...',
        date: new Date().toISOString()
    };
    savedProjects.push(project);
    try { localStorage.setItem('agha-saved-projects', JSON.stringify(savedProjects)); } catch (e) {}
    showToast(`💾 Saved to Projects! (${type})`, 'success');
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openCreateModal('product');
    }
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(el => el.classList.remove('open'));
    }
});

// ============================================================
// INIT
// ============================================================
console.log('🎬 Agha AI Ad Studio - Light Pink Theme');
console.log('📧 Email: aghaaistoudio@gmail.com | 📱 Phone: +923100008262');

setTimeout(() => {
    showToast('🌸 Welcome to Agha AI Ad Studio! Click any provider to configure.', 'info');
}, 600);
