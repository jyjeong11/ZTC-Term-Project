from ultralytics import YOLO
import os
from pathlib import Path # Pathlib 사용 권장

BASE_DIR = Path(os.getcwd()) # FastAPI 실행 디렉토리 (CWD) = Backend
UPLOAD_DIR = "Uploads"  # 업로드된 이미지 저장 디렉토리

def analyze_image(filename):
    # Load a trained YOLO model
    model = YOLO("./model/best.pt")

    source_list = [
        f"{BASE_DIR}/{UPLOAD_DIR}/{filename}"
    ]

    # Run inference on the list of sources
    results = model(
        source_list,  # <-- 수정된 부분: 리스트를 전달
        save=True,
        project='./model/results',
        # name="batch_prediction" # 이름을 하나로 지정하면 해당 폴더 안에 모든 결과가 저장됩니다.
        )

    if results and hasattr(results[0], 'save_dir'):
        result_dir = results[0].save_dir # 예: './model/results/predict2'
        
        absolute_result_dir = Path(os.getcwd()) / result_dir 

        image_files = [p.name for p in absolute_result_dir.iterdir() 
                       if p.is_file() and p.suffix.lower() in ('.jpg', '.png', '.jpeg')]

        return result_dir, image_files
        
    return None, [] # 실패 시 빈 값 반환
