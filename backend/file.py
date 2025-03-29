from fastapi import APIRouter, UploadFile, File
from anydocs import load_document
from fastapi.responses import StreamingResponse


app = APIRouter(prefix="/v1")

@app.get("/files")
async def process_files(file:UploadFile=File(...)):
    return StreamingResponse(load_document(file))