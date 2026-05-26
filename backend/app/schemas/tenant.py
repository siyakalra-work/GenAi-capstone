from pydantic import BaseModel, EmailStr


class TenantCreate(BaseModel):
    company_name: str
    contact_email: EmailStr
    status: str = "active"


class TenantUpdate(BaseModel):
    company_name: str | None = None
    contact_email: EmailStr | None = None
    status: str | None = None


class TenantOut(BaseModel):
    id: str
    company_name: str
    contact_email: EmailStr
    status: str

