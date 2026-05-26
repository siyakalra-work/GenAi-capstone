from __future__ import annotations

from enum import StrEnum


class Role(StrEnum):
    SUPER_ADMIN = "super_admin"
    RETAILER_ADMIN = "retailer_admin"
    INVENTORY_MANAGER = "inventory_manager"


ROLE_HIERARCHY: dict[Role, set[Role]] = {
    Role.SUPER_ADMIN: {Role.SUPER_ADMIN, Role.RETAILER_ADMIN, Role.INVENTORY_MANAGER},
    Role.RETAILER_ADMIN: {Role.RETAILER_ADMIN, Role.INVENTORY_MANAGER},
    Role.INVENTORY_MANAGER: {Role.INVENTORY_MANAGER},
}


def role_allows(role: str, required: Role) -> bool:
    try:
        current = Role(role)
    except ValueError:
        return False
    return required in ROLE_HIERARCHY.get(current, set())

