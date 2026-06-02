from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.database.init_db import init_db
from app.middleware.error_handlers import register_exception_handlers
from app.routes import customers, health, orders, products


settings = get_settings()

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(health.router)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
