from pydantic import BaseModel, ConfigDict


class APIModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class PageMeta(APIModel):
    page: int
    page_size: int
    total: int


class Page(APIModel):
    meta: PageMeta
    items: list

