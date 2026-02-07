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

uploadBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const thumb = document.createElement('div');
      thumb.className = 'photo-thumb';
      thumb.style.backgroundImage = 'url(' + e.target.result + ')';
      thumb.style.backgroundSize = 'cover';
      thumb.style.backgroundPosition = 'center';
      photoGrid.insertBefore(thumb, plusThumb);
      updatePhotoCount();
      const form = new FormData();
      for (const f of fileInput.files) form.append("photos", f);
      const res = await fetch("/api/upload-photos", { method: "POST", body: form });
      const data = await res.json(); // data.urls are now fetchable (served by Flask)
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