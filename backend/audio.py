from groq import AsyncGroq
from fastapi import APIRouter, UploadFile, File

app = APIRouter(prefix="/v1")
client = AsyncGroq()

@app.post("/voice")
async def transcribe_audio(file: UploadFile = File(...)):
	response = await client.audio.transcriptions.create(file=(file.filename,await file.read(), file.content_type),model="whisper-large-v3")
	return {"role":"user","content":response.text.strip()}