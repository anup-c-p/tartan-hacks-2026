from flask import Flask
from flask import request, send_from_directory, redirect, url_for
from pathlib import Path

import util.jsonHandler as jsh

dataStore = jsh.Store("0", "0")

app = Flask(__name__)

PROJECT_ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIR = PROJECT_ROOT / "frontend"
PAGES_DIR = FRONTEND_DIR / "pages"
SCRIPTS_DIR = FRONTEND_DIR / "scripts"
STYLES_DIR = FRONTEND_DIR / "styles"


@app.get("/")
def root():
    # Choose a default landing page (change if you want)
    return redirect(url_for("client_page"))


@app.get("/client")
def client_page():
    return send_from_directory(PAGES_DIR, "client.html")


@app.get("/customer")
def customer_page():
    return send_from_directory(PAGES_DIR, "customer.html")


# Static assets (so your HTML can reference /scripts/client.js, /styles/theme.css, etc.)
@app.get("/scripts/<path:filename>")
def scripts(filename: str):
    return send_from_directory(SCRIPTS_DIR, filename)


@app.get("/styles/<path:filename>")
def styles(filename: str):
    return send_from_directory(STYLES_DIR, filename)


if __name__ == "__main__":
    # host=0.0.0.0 allows access from other devices on your network if needed
    app.run(host="0.0.0.0", port=5000, debug=True)
