from __future__ import annotations

from typing import Any

from app.core.config import settings


class LLMProvider:
    async def chat(self, *, system: str, user: str, tools: list[dict[str, Any]] | None = None) -> dict[str, Any]:
        """
        Provider abstraction. This repo ships with a no-network safe fallback.
        Replace with OpenAI Responses API client in production.
        """
        _ = tools
        return {"output_text": f"{system}\n\n(user)\n{user}\n\n[LLM not configured: set OPENAI_API_KEY]"}


provider = LLMProvider()


def llm_enabled() -> bool:
    return bool(settings.openai_api_key)

