let currentTool = 'Text to Video';

function showDashboard() {
  document.getElementById('dashboard-view').style.display = 'block';
  document.getElementById('studio-view').style.display = 'none';
  resetUploader();
}

function openStudio(title) {
  currentTool = title;
  document.getElementById('dashboard-view').style.display = 'none';
  document.getElementById('studio-view').style.display = 'block';
  document.getElementById('studio-title').innerText = title;

  // Reset Sections Visibility
  document.getElementById('default-uploader').style.display = (title === 'Remove BG & Watermark') ? 'none' : 'block';
  document.getElementById('remove-bg-uploader').style.display = (title === 'Remove BG & Watermark') ? 'block' : 'none';
  document.getElementById('prompt-section').style.display = (title === 'Remove BG & Watermark') ? 'none' : 'block';
  document.getElementById('bg-templates-section').style.display = (title === 'Remove BG & Watermark') ? 'block' : 'none';
  document.getElementById('voice-settings').style.display = (title === 'AI Voice Studio') ? 'block' : 'none';
  document.getElementById('duration-container').style.display = (title.includes('Video')) ? 'block' : 'none';

  resetUploader();
}

function triggerFileInput(type) {
  if (type === 'single') document.getElementById('media-file-input').click();
  if (type === 'img') document.getElementById('bg-img-input').click();
  if (type === 'vid') document.getElementById('bg-vid-input').click();
}

function handleFileSelect(event, type) {
  const file = event.target.files[0];
  if (!file) return;

  const previewContainer = (type === 'single') ? document.getElementById('media-preview') : document.getElementById('bg-media-preview');
  previewContainer.innerHTML = '';
  previewContainer.style.display = 'block';

  const fileURL = URL.createObjectURL(file);

  if (file.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = fileURL;
    previewContainer.appendChild(img);
  } else if (file.type.startsWith('video/')) {
    const video = document.createElement('video');
    video.src = fileURL;
    video.controls = true;
    previewContainer.appendChild(video);
  }
}

function selectSwatch(element) {
  const siblings = element.parentElement.children;
  for (let child of siblings) child.classList.remove('selected');
  element.classList.add('selected');
}

function generateAsset() {
  const outputSection = document.getElementById('output-section');
  const mediaContainer = document.getElementById('output-media-container');
  const downloadBtn = document.getElementById('download-btn');

  outputSection.style.display = 'block';
  mediaContainer.innerHTML = '<p style="color: var(--accent-green);">⏳ Processing AI Generation...</p>';

  setTimeout(() => {
    if (currentTool.includes('Video')) {
      mediaContainer.innerHTML = '<video controls width="100%" style="border-radius: 8px;"><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video>';
      downloadBtn.href = 'https://www.w3schools.com/html/mov_bbb.mp4';
    } else if (currentTool === 'AI Voice Studio') {
      mediaContainer.innerHTML = '<audio controls style="width:100%;"><source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg"></audio>';
      downloadBtn.href = 'https://www.w3schools.com/html/horse.mp3';
    } else {
      mediaContainer.innerHTML = '<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" style="max-width:100%; border-radius:8px;">';
      downloadBtn.href = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600';
    }
  }, 1500);
}

function resetUploader() {
  document.getElementById('output-section').style.display = 'none';
  document.getElementById('media-preview').style.display = 'none';
  document.getElementById('bg-media-preview').style.display = 'none';
}

function toggleMenu() {
  const modal = document.getElementById('options-modal');
  modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

function openApiModal() {
  toggleMenu();
  document.getElementById('api-modal').style.display = 'flex';
}

function closeApiModal() {
  document.getElementById('api-modal').style.display = 'none';
}

function toggleTheme() {
  if (document.body.getAttribute('data-theme') === 'light') {
    document.body.removeAttribute('data-theme');
  } else {
    document.body.setAttribute('data-theme', 'light');
  }
  toggleMenu();
}
