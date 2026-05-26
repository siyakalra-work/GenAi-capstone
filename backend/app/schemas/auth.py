from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    company_name: str | None = None
    name: str
    email: EmailStr
    password: str = Field(min_length=8)
    role: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str
    tenant_id: str | None = None


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class ProfileOut(BaseModel):
    id: str
    tenant_id: str | None
    name: str
    email: EmailStr
    role: str


class ChangePasswordIn(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)

