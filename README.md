# ZTC-Term-Project

## How to use in local machine
### Backend
1. install required packages
```bash
pip install -r requirements.txt
```

2. Virtual Environment Setting
```bash
python3 -m venv .venv # install
source .venv/bin/activate # run the virtual environment
```

3. Run the Server
```bash
uvicorn app:ap --reload
```

4. model usage
- 파인튜닝된 모델을 Backend/model 폴더에 넣는다.

### Frontend
```bash
npm run dev
```
- [localhost:4000](http://localhost:4000/)에서 접속 가능 

## How to deployment in kubernetes
1. Requirements
- kubernetes
- docker

2. Docker Image
- Frontend, Backend 폴더 각각에서 이미지 생성
```bash
docker build -t [dockerHub/imageName:tag] . # image build
docker push [dockerHub/imageName:tag] # image push
```

3. Deployment
- yaml 폴더 내 Front.yaml, Back.yaml을 사용하여 빌드한 이미지를 자신의 쿠버네티스 노드에 배포
- nginx.conf 파일의 upstream backend의 server을 자신이 배포한 백엔드 서비스 IP로 수정