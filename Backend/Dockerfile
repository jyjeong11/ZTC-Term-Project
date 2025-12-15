FROM python:3.12.3

WORKDIR /code
 
COPY ./requirements.txt /code/requirements.txt
 
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libgomp1 \
    libxext6 \
    libsm6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*
 
COPY . /code

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]