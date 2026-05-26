from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    product_name: str
    sku: str
    category: str | None = None
    brand: str | None = None
    quantity: int = Field(default=0, ge=0)
    price: float | None = Field(default=None, ge=0)
    supplier: str | None = None
    warehouse_location: str | None = None
    description: str | None = None


class ProductUpdate(BaseModel):
    product_name: str | None = None
    category: str | None = None
    brand: str | None = None
    quantity: int | None = Field(default=None, ge=0)
    price: float | None = Field(default=None, ge=0)
    supplier: str | None = None
    warehouse_location: str | None = None
    description: str | None = None


class ProductOut(BaseModel):
    id: str
    tenant_id: str
    product_name: str
    sku: str
    category: str | None
    brand: str | None
    quantity: int
    price: float | None
    supplier: str | None
    warehouse_location: str | None
    description: str | None

