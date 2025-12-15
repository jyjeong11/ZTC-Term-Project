from fastapi import FastAPI

from core.config import settings

from api.v1 import image

# app = FastAPI()
app = FastAPI(title=settings.PROJECT_NAME,
              openapi_url=f"{settings.API_V1_STR}/openapi.json")

app.include_router(image.router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {"message": "Hello World"}