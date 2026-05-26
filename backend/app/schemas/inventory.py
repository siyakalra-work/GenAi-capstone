from pydantic import BaseModel, Field


class StockChangeIn(BaseModel):
    product_id: str
    quantity: int = Field(gt=0)
    notes: str | None = None


class AdjustmentIn(BaseModel):
    product_id: str
    new_quantity: int = Field(ge=0)
    notes: str | None = None


class InventoryTransactionOut(BaseModel):
    id: str
    tenant_id: str
    product_id: str
    transaction_type: str
    quantity: int
    updated_by: str
    notes: str | None

