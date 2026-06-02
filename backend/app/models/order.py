from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, func
from sqlalchemy.orm import relationship

from app.database.session import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="RESTRICT"), nullable=False, index=True)
    total_amount = Column(Numeric(12, 2), nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
