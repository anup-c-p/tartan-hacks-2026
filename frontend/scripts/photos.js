const photos = document.getElementById('photos');
const uploadBtn = document.getElementById('upload-photos');
const photoGrid = photos.querySelector('.photo-grid');
const photoOverview = document.getElementById('photos-overview-number');
const photoBadge = photos.querySelector('.container-badge');

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
      const thumb = document.createElement('div');
      thumb.className = 'photo-thumb';
      thumb.style.backgroundImage = 'url(' + e.target.result + ')';
      thumb.style.backgroundSize = 'cover';
      thumb.style.backgroundPosition = 'center';
      photoGrid.appendChild(thumb);
      updatePhotoCount();
      fileInput.addEventListener('change', async () => {
        const files = fileInput.files;

        // existing preview loop...
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const thumb = document.createElement('div');
            thumb.className = 'photo-thumb';
            thumb.style.backgroundImage = 'url(' + e.target.result + ')';
            thumb.style.backgroundSize = 'cover';
            thumb.style.backgroundPosition = 'center';

            // If plusThumb doesn't exist, just append
            photoGrid.appendChild(thumb);

            updatePhotoCount();
          };
          reader.readAsDataURL(files[i]);
        }

        // ✅ Upload to Flask
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("photos", files[i]); // MUST be "photos"
        }

        try {
          const res = await fetch("/api/upload-photos", {
            method: "POST",
            body: formData
            // IMPORTANT: do NOT set Content-Type manually
          });

          if (!res.ok) {
            console.error("Upload failed:", await res.text());
          } else {
            const data = await res.json();
            console.log("Saved on server:", data.urls);
          }
        } catch (e) {
          console.error("Upload error:", e);
        }

        fileInput.value = '';
      });
    };
    reader.readAsDataURL(files[i]);
  }
  fileInput.value = '';
});

function updatePhotoCount() {
  const count = photoGrid.querySelectorAll('.photo-thumb:not(.plus)').length;
  photoOverview.innerText = count;
  photoBadge.innerText = count + ' uploaded';
}

// Load photos when script runs
loadExistingPhotos();