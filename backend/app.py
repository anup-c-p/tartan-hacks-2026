from flask import Flask, request, send_from_directory, redirect, url_for, jsonify, abort, render_template
from pathlib import Path
from werkzeug.utils import secure_filename
import uuid
import json

import util.jsonHandler as jsh

dataStore = jsh.Store("0", "0")

# Load from data.json if exists
DATA_FILE = Path(__file__).parent / "util" / "data.json"
if DATA_FILE.exists():
    dataStore.loadFromJSON(str(DATA_FILE))

PROJECT_ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIR = PROJECT_ROOT / "frontend"
PAGES_DIR = FRONTEND_DIR / "pages"
SCRIPTS_DIR = FRONTEND_DIR / "scripts"
STYLES_DIR = FRONTEND_DIR / "styles"
IMAGES_DIR = FRONTEND_DIR / "images"
TEMPLATE_DIR = FRONTEND_DIR / "pages"

app = Flask(__name__, template_folder=TEMPLATE_DIR)

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
    return render_template("client.html", name=dataStore.getName(), desc=dataStore.getDescription(), categories=dataStore.getCategories(), tags=dataStore.getTags(), price=dataStore.getPriceRange(), address=dataStore.getLocation(), phone=dataStore.getPhone())


@app.get("/customer")
def customer_page():
    return send_from_directory(PAGES_DIR, "customer.html")
    
@app.get("/szechuan")
def szechuan_page():
    return send_from_directory(PAGES_DIR, "szechuan.html")


@app.get("/home")
def home_page():
    return send_from_directory(PAGES_DIR, "home.html")

@app.get("/orders")
def orders_page():
    return send_from_directory(PAGES_DIR, "orders.html")


@app.get("/favorites")
def favorites_page():
    return send_from_directory(PAGES_DIR, "favorites.html")


@app.get("/settings")
def settings_page():
    return send_from_directory(PAGES_DIR, "settings.html")


@app.get("/bella-italia")
def bella_italia_page():
    return send_from_directory(PAGES_DIR, "bella_italia.html")


@app.get("/burger-joint")
def burger_joint_page():
    return send_from_directory(PAGES_DIR, "burger_joint.html")


@app.get("/sushi-zen")
def sushi_zen_page():
    return send_from_directory(PAGES_DIR, "sushi_zen.html")


@app.get("/taco-fiesta")
def taco_fiesta_page():
    return send_from_directory(PAGES_DIR, "taco_fiesta.html")


@app.get("/green-leaf")
def green_leaf_page():
    return send_from_directory(PAGES_DIR, "green_leaf.html")


@app.get("/curry-house")
def curry_house_page():
    return send_from_directory(PAGES_DIR, "curry_house.html")


@app.get("/steakhouse")
def steakhouse_page():
    return send_from_directory(PAGES_DIR, "steakhouse.html")


@app.get("/morning-brew")
def morning_brew_page():
    return send_from_directory(PAGES_DIR, "morning_brew.html")


@app.get("/pizza-slice")
def pizza_slice_page():
    return send_from_directory(PAGES_DIR, "pizza_slice.html")

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
    print("Upload photos endpoint called")
    print("Request files:", request.files)
    # Frontend should send multipart/form-data with field name "photos"
    files = request.files.getlist("photos")
    print("Files list:", files)
    if not files:
        print("No files uploaded")
        abort(400, "No files uploaded. Use form field name 'photos'.")

    urls = []
    saved = []

    for f in files:
        if not f or not f.filename:
            continue

        if not allowed_file(f.filename):
            print(f"File type not allowed: {f.filename}")
            abort(400, f"File type not allowed: {f.filename}")

        safe = secure_filename(f.filename)
        unique = f"{uuid.uuid4().hex}_{safe}"
        f.save(UPLOADS_DIR / unique)
        print(f"Saved file: {unique}")

        url = f"/uploads/{unique}"
        urls.append(url)
        saved.append(unique)

        # Add to dataStore
        photo_id = f"photo_{uuid.uuid4().hex}"
        dataStore.addPhoto(photo_id, url, "uploaded", "")
        print(f"Added photo to dataStore: {photo_id}")

    # Save to data.json
    dataStore.saveToJSON(str(DATA_FILE))
    print(f"Saved dataStore to {DATA_FILE}")

    return jsonify({"ok": True, "urls": urls, "files": saved})


# New: Serve uploaded files
@app.get("/uploads/<path:filename>")
def uploads(filename: str):
    return send_from_directory(UPLOADS_DIR, filename)


# Optional: list uploaded photos (useful for reloading page and showing existing uploads)
@app.get("/api/photos")
def list_photos():
    photos = [{"id": pid, **pdata} for pid, pdata in dataStore.photos.items()]
    print(f"Listing photos: {len(photos)} photos")
    return jsonify({"ok": True, "photos": photos})


# Get store info
@app.get("/api/store-info")
def get_store_info():
    info = {
        "name": dataStore.name,
        "description": dataStore.description,
        "categories": ", ".join(dataStore.categories),
        "tags": ", ".join(dataStore.tags),
        "priceRange": dataStore.priceRange,
        "address": f"{dataStore.location['addressLine1']}, {dataStore.location['city']}, {dataStore.location['state']} {dataStore.location['zip']}",
        "phone": dataStore.phone
    }
    return jsonify({"ok": True, "info": info})


# Update store info
@app.post("/api/update-store-info")
def update_store_info():
    data = request.get_json(silent=True)
    if not data:
        abort(400, "No data provided")

    def split_csv(s: str):
        # Accept: "Burgers, Fast Casual, American" or "Burgers,Fast Casual,American"
        if not s:
            return []
        return [x.strip() for x in s.split(",") if x.strip()]

    # ---- basic fields ----
    dataStore.editName((data.get("name") or "").strip())
    dataStore.editDescription((data.get("description") or "").strip())
    dataStore.editPriceRange((data.get("priceRange") or "").strip())
    dataStore.editPhone((data.get("phone") or "").strip())

    # ---- list fields (categories/tags) ----
    dataStore.editCategories(split_csv(data.get("categories") or ""))
    dataStore.editTags(split_csv(data.get("tags") or ""))

    # ---- address parsing ----
    # Expect something like: "123 Main St, Springfield, IL 62701"
    address_raw = (data.get("address") or "").strip()
    if address_raw:
        parts = [p.strip() for p in address_raw.split(",") if p.strip()]

        addressLine1 = parts[0] if len(parts) >= 1 else ""
        city = parts[1] if len(parts) >= 2 else ""

        state = ""
        zip_code = ""

        # The third chunk is usually "IL 62701" (but could be just "IL" or just "62701")
        if len(parts) >= 3:
            state_zip = parts[2].split()
            if len(state_zip) >= 1:
                state = state_zip[0]
            if len(state_zip) >= 2:
                zip_code = state_zip[1]

        # Only write location if we have at least address + city
        if addressLine1 and city:
            dataStore.editLocation(addressLine1, city, state, zip_code)

    # Save to data.json
    dataStore.saveToJSON(str(DATA_FILE))
    return jsonify({"ok": True})


# Get menu
@app.get("/api/menu")
def get_menu():
    menu_data = dataStore.to_dict()["menu"]
    return jsonify({"ok": True, "menu": menu_data})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
