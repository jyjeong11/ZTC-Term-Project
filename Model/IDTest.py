from ultralytics import YOLO

# Load a trained YOLO model
model = YOLO("./results/id_v2/weights/best.pt")

# 추론할 이미지 파일 경로 리스트 정의
# 예시: 'image1.png', 'image2.png', 'image3.png'에 대해 추론하고 싶을 경우
source_list = [
    "./dataset/test/imgs/image.png",
    "./dataset/test/imgs/image1.png"
]

# Run inference on the list of sources
# model() 함수는 리스트의 모든 이미지에 대해 순차적으로 추론을 실행합니다.
results = model(
    source_list,  # <-- 수정된 부분: 리스트를 전달
    save=True,
    project='./dataset/results',
    name="batch_prediction" # 이름을 하나로 지정하면 해당 폴더 안에 모든 결과가 저장됩니다.
)

# results 변수에는 각 이미지에 대한 Results 객체가 리스트 형태로 담겨 있습니다. 