from groq import AsyncGroq
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import PlainTextResponse

app = APIRouter(prefix="/v1")
client = AsyncGroq()

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
	response = await client.audio.transcriptions.create(file=file.file,model="whisper-large-v3")
	return PlainTextResponse(response.text)