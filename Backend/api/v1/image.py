from typing import Annotated, List, Optional

from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, File
from fastapi.responses import FileResponse # FileResponse 임포트

from utils.image import analyze_image

import os
from pathlib import Path # Pathlib 사용 권장

router = APIRouter(
    prefix='/images',
    tags=['images'],
    responses={404: {'description': 'Not found'}},
)

LAST_RESULT_DIR = None
BASE_DIR = Path(os.getcwd()) # FastAPI 실행 디렉토리 (CWD) = Backend
UPLOAD_DIR = "Uploads"  # 업로드된 이미지 저장 디렉토리

#image processing
@router.get("/health-check")
async def health_check():
    print("BASE_DIR:", BASE_DIR)
    return {"status": "Image API is healthy"}

@router.get("/analyze/{filename}")
async def start_analyze_image(filename: str):
    global LAST_RESULT_DIR
    print("Starting image analysis for file:", filename)
    
    relative_dir, file_list = analyze_image(filename)
    
    if relative_dir and file_list:
        LAST_RESULT_DIR = relative_dir
        
        return {"result_dir": relative_dir, "file_names": file_list}
    
    raise HTTPException(status_code=500, detail="Image analysis failed to generate results.")

@router.get("/result/{file_name}")
async def get_image(file_name: str):
    """
    특정 파일 이름의 이미지를 반환하는 엔드포인트
    """
    print("Fetching image with file name:", file_name)
    print("Last result directory:", LAST_RESULT_DIR)
    if LAST_RESULT_DIR is None:
        raise HTTPException(status_code=404, detail="Analysis result not found. Run analyze first.")
    media_type = "image/png" if file_name.lower().endswith(".png") else "image/jpeg"
    file_path = f"{LAST_RESULT_DIR}/{file_name}"

    print("Requested file path:", file_path)
    
    if not Path(file_path).is_file():
        raise HTTPException(status_code=404, detail=f"Image file not found at {file_path}")
        
    return FileResponse(file_path, media_type="image/jpg")

@router.post("/upload") # POST로 변경
async def upload_image(file: Annotated[UploadFile, File]): 
    print(f"Received file: {file.filename}, content type: {file.content_type}")
    
    # Path 객체를 사용하여 파일 저장 위치를 안전하게 지정합니다.
    file_location = f"{UPLOAD_DIR}/{file.filename}"

    print(f"Attempting to upload file to: {file_location}")

    try:
        # 파일을 비동기적으로 읽고 저장합니다.
        with open(file_location, "wb+") as file_object:
            content = await file.read()
            file_object.write(content)
                
        media_type = "image/png" if file.filename.lower().endswith(".png") else "image/jpeg"
        
        return FileResponse(file_location, media_type=media_type)

    except Exception as e:
        print(f"File save error: {e}")
        raise HTTPException(status_code=500, detail="Could not save file or return file response.")