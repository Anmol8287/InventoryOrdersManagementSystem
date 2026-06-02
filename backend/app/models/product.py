from sqlalchemy import CheckConstraint, Column, DateTime, Integer, Numeric, String, func
from sqlalchemy.orm import relationship

from app.database.session import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(255), nullable=False, index=True)
    sku = Column(String(80), nullable=False, unique=True, index=True)
    price = Column(Numeric(12, 2), nullable=False)
    quantity_in_stock = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    order_items = relationship("OrderItem", back_populates="product", passive_deletes=True)

    __table_args__ = (
        CheckConstraint("quantity_in_stock >= 0", name="ck_products_quantity_non_negative"),
        CheckConstraint("price >= 0", name="ck_products_price_non_negative"),
    )
