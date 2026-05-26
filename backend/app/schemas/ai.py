from pydantic import BaseModel


class ChatIn(BaseModel):
    message: str


class ChatOut(BaseModel):
    answer: str


class NLSearchIn(BaseModel):
    query: str


class NLSearchOut(BaseModel):
    filters: dict
    products: list[dict]


class SummaryOut(BaseModel):
    summary: str


class AskDocumentIn(BaseModel):
    question: str


class AskDocumentOut(BaseModel):
    answer: str
    citations: list[dict]


class InvoiceExtractOut(BaseModel):
    items: list[dict]

