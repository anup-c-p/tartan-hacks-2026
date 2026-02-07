from flask import Flask, request, send_from_directory, redirect, url_for, jsonify, abort
from pathlib import Path
from werkzeug.utils import secure_filename
import uuid

import util.jsonHandler as jsh

dataStore = jsh.Store("0", "0")

app = Flask(__name__)

PROJECT_ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIR = PROJECT_ROOT / "frontend"
PAGES_DIR = FRONTEND_DIR / "pages"
SCRIPTS_DIR = FRONTEND_DIR / "scripts"
STYLES_DIR = FRONTEND_DIR / "styles"
IMAGES_DIR = FRONTEND_DIR / "images"

# New: where uploaded files will be stored
UPLOADS_DIR = FRONTEND_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXT = {"png", "jpg", "jpeg", "gif", "webp"}


def allowed_file(filename: str) -> bool:
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_EXT


@app.get("/")
def root():
    return send_from_directory(PAGES_DIR, "index.html")


@app.get("/client")
def client_page():
    return send_from_directory(PAGES_DIR, "client.html")


@app.get("/customer")
def customer_page():
    return send_from_directory(PAGES_DIR, "customer.html")


@app.get("/scripts/<path:filename>")
def scripts(filename: str):
    return send_from_directory(SCRIPTS_DIR, filename)


@app.get("/styles/<path:filename>")
def styles(filename: str):
    return send_from_directory(STYLES_DIR, filename)


@app.get("/images/<path:filename>")
def images(filename: str):
    return send_from_directory(IMAGES_DIR, filename)


# ---------------------------
# New: Upload API
# ---------------------------
@app.post("/api/upload-photos")
def upload_photos():
    # Frontend should send multipart/form-data with field name "photos"
    files = request.files.getlist("photos")
    if not files:
        abort(400, "No files uploaded. Use form field name 'photos'.")

    urls = []
    saved = []

    for f in files:
        if not f or not f.filename:
            continue

        if not allowed_file(f.filename):
            abort(400, f"File type not allowed: {f.filename}")

        safe = secure_filename(f.filename)
        unique = f"{uuid.uuid4().hex}_{safe}"
        f.save(UPLOADS_DIR / unique)

        url = f"/uploads/{unique}"
        urls.append(url)
        saved.append(unique)

    # Optional: store in your JSON store if you want persistence/listing
    # (only do this if your Store supports it)
    # dataStore.add_photos(urls)  # <-- example

    return jsonify({"ok": True, "urls": urls, "files": saved})


# New: Serve uploaded files
@app.get("/uploads/<path:filename>")
def uploads(filename: str):
    return send_from_directory(UPLOADS_DIR, filename)


# Optional: list uploaded photos (useful for reloading page and showing existing uploads)
@app.get("/api/photos")
def list_photos():
    files = [p.name for p in UPLOADS_DIR.iterdir() if p.is_file()]
    # You can filter by extension if you want
    urls = [f"/uploads/{name}" for name in sorted(files)]
    return jsonify({"ok": True, "urls": urls})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
