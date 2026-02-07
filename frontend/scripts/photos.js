const photos = document.getElementById('photos');
const uploadBtn = document.getElementById('upload-photos');
const photoGrid = photos.querySelector('.photo-grid');
const photoOverview = document.getElementById('photos-overview-number');
const photoBadge = photos.querySelector('.container-badge');
const plusThumb = photos.querySelector('.photo-thumb.plus');

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.multiple = true;
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// Load existing photos on page load
async function loadExistingPhotos() {
  try {
    const res = await fetch("/api/photos");
    const data = await res.json();
    if (data.ok) {
      data.photos.forEach(photo => {
        addPhotoThumb(photo.url);
      });
      updatePhotoCount();
    }
  } catch (err) {
    console.error("Failed to load photos:", err);
  }
}

function addPhotoThumb(url) {
  const thumb = document.createElement('div');
  thumb.className = 'photo-thumb';
  thumb.style.backgroundImage = `url(${url})`;
  thumb.style.backgroundSize = 'cover';
  thumb.style.backgroundPosition = 'center';
  photoGrid.insertBefore(thumb, plusThumb);
}

uploadBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', async () => {
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      addPhotoThumb(e.target.result);
      updatePhotoCount();
      const form = new FormData();
      for (const f of fileInput.files) form.append("photos", f);
      try {
        const res = await fetch("/api/upload-photos", { method: "POST", body: form });
        const data = await res.json();
        // Photos are now persisted in data.json
      } catch (err) {
        console.error("Upload failed:", err);
      }
    };
    reader.readAsDataURL(files[i]);
  }
  fileInput.value = '';
});

function updatePhotoCount() {
  const count = photoGrid.querySelectorAll('.photo-thumb:not(.plus)').length;
  photoOverview.innerText = count;
  photoBadge.innerText = count + ' uploaded';
  plusThumb.innerText = '+' + Math.max(0, count - 5);
}

// Load photos when script runs
loadExistingPhotos();