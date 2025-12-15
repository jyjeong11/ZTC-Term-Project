from ultralytics import YOLO

# 1. YOLO 모델 로드
# Load a COCO-pretrained YOLOv8n model
model = YOLO("yolov8n.pt")

# 2. 학습 수행
model.train(
    data="./dataset/data.yaml",  # yaml 경로 입력
    epochs=100,
    imgsz=640,
    batch=64,
    workers=0,
    device=[0,1],  # GPU 사용, CPU 사용 시 "cpu"로 변경
    project="results",
    name="id_v2",
    exist_ok=True,
    lrf=0.001,
    weight_decay=0.0007,
    dropout=0.3,
    # resume=True,
    # save_period=10         
)