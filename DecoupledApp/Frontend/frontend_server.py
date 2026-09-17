"""
A simple frontend server using FastAPI to serve static files.
Run locally: fastapi dev frontend_server.py --port 3000
"""

from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Anchor directly to the frontend folder next to this file
FRONTEND_DIR = Path(__file__).resolve().parent / "static"  

# html=True serves index.html at "/" automatically
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="static")