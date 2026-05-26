from __future__ import annotations

import asyncio
from uuid import uuid4

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import AsyncSessionLocal
from app.models.product import Product
from app.models.tenant import Tenant
from app.models.user import User
from app.services.rbac import Role


async def main() -> None:
    async with AsyncSessionLocal() as db:
        # tenant
        tenant_id = str(uuid4())
        tenant = Tenant(id=tenant_id, company_name="Demo Retailer", contact_email="demo@retailer.com", status="active")
        db.add(tenant)

        # users
        admin = User(
            id=str(uuid4()),
            tenant_id=tenant_id,
            name="Retailer Admin",
            email="admin@demo.com",
            password_hash=hash_password("Password123!"),
            role=str(Role.RETAILER_ADMIN),
            is_active=True,
        )
        manager = User(
            id=str(uuid4()),
            tenant_id=tenant_id,
            name="Inventory Manager",
            email="manager@demo.com",
            password_hash=hash_password("Password123!"),
            role=str(Role.INVENTORY_MANAGER),
            is_active=True,
        )
        super_admin = User(
            id=str(uuid4()),
            tenant_id=None,
            name="Super Admin",
            email="superadmin@stockpilot.com",
            password_hash=hash_password("Password123!"),
            role=str(Role.SUPER_ADMIN),
            is_active=True,
        )
        db.add_all([admin, manager, super_admin])

        # products
        products = [
            Product(
                id=str(uuid4()),
                tenant_id=tenant_id,
                product_name="Laptop Pro 14",
                sku="LTP-14-PRO",
                category="Electronics",
                brand="StockPilot",
                quantity=8,
                price=129999.00,
                supplier="Acme Supplies",
                warehouse_location="Warehouse A",
                description="Demo laptop",
            ),
            Product(
                id=str(uuid4()),
                tenant_id=tenant_id,
                product_name="Wireless Mouse",
                sku="MSE-WL-001",
                category="Electronics",
                brand="StockPilot",
                quantity=120,
                price=999.00,
                supplier="Acme Supplies",
                warehouse_location="Warehouse A",
                description="Demo mouse",
            ),
        ]
        db.add_all(products)

        await db.commit()

        # print tenant id for login
        print("Seed complete")
        print(f"Tenant ID: {tenant_id}")
        print("Retailer admin: admin@demo.com / Password123!")
        print("Inventory manager: manager@demo.com / Password123!")
        print("Super admin: superadmin@stockpilot.com / Password123! (no tenant)")


if __name__ == "__main__":
    asyncio.run(main())

