from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = 'ZTC - API'
    API_STR: str = '/api'
    API_V1_STR: str = '/api/v1'


settings = Settings()