from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    env: str = Field(default="dev")
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8000)

    database_url: str = Field(default="postgresql+asyncpg://postgres:postgres@db:5432/stockpilot")
    redis_url: str = Field(default="redis://redis:6379/0")

    jwt_secret_key: str = Field(default="CHANGE_ME")
    jwt_algorithm: str = Field(default="HS256")
    access_token_minutes: int = Field(default=30)
    refresh_token_days: int = Field(default=14)

    cors_allow_origins: list[str | AnyHttpUrl] = Field(default=["http://localhost:5173"])

    rate_limit_per_minute: int = Field(default=120)

    openai_api_key: str | None = Field(default=None)
    openai_model: str = Field(default="gpt-4o")
    qdrant_url: str = Field(default="http://qdrant:6333")
    qdrant_api_key: str | None = Field(default=None)

    upload_dir: str = Field(default="/data/uploads")
    max_upload_mb: int = Field(default=20)


settings = Settings()

