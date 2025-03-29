from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .chat import app as chat_app
from .audio import app as audio_app
from .file import app as file_app


def create_app():
    app = FastAPI(
        title="FACT API (FastAPI + React)",
        description="Full-Stack Template",
        version="0.0.1",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins
        allow_credentials=True,  # Allow cookies
        allow_methods=["*"],  # Allow all methods
        allow_headers=["*"],  # Allow all headers
    )
    app.include_router(chat_app)
    app.include_router(audio_app)
    app.include_router(file_app)
    return app
