import typing as tp
from fastapi import APIRouter, Query, UploadFile, HTTPException, File
from bs4 import BeautifulSoup
from anydocs import load_document


app = APIRouter(prefix="/v1")

@app.post("/document")
async def process_files(url:str):
	return {"role":"user","content":BeautifulSoup("\n".join(load_document(url)),"lxml").get_text()}