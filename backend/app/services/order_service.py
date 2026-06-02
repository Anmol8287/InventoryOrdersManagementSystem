from decimal import Decimal

from sqlalchemy.orm import Session, joinedload

from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate
from app.services.exceptions import InsufficientStockError, NotFoundError


def list_orders(db: Session, skip: int = 0, limit: int = 100) -> list[Order]:
    return (
        db.query(Order)
        .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
        .order_by(Order.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_order(db: Session, order_id: int) -> Order:
    order = (
        db.query(Order)
        .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise NotFoundError("Order not found")
    return order


def create_order(db: Session, payload: OrderCreate) -> Order:
    if not db.get(Customer, payload.customer_id):
        raise NotFoundError("Customer not found")

    merged: dict[int, int] = {}
    for item in payload.items:
        merged[item.product_id] = merged.get(item.product_id, 0) + item.quantity

    products = (
        db.query(Product)
        .filter(Product.id.in_(merged.keys()))
        .with_for_update()
        .all()
    )
    products_by_id = {product.id: product for product in products}

    missing = set(merged.keys()) - set(products_by_id.keys())
    if missing:
        raise NotFoundError(f"Product not found: {min(missing)}")

    total = Decimal("0.00")
    order_items: list[OrderItem] = []
    try:
        order = Order(customer_id=payload.customer_id, total_amount=Decimal("0.00"))
        db.add(order)
        db.flush()

        for product_id, quantity in merged.items():
            product = products_by_id[product_id]
            if product.quantity_in_stock < quantity:
                raise InsufficientStockError(f"Insufficient stock for {product.product_name}")

            product.quantity_in_stock -= quantity
            line_price = Decimal(product.price)
            total += line_price * quantity
            order_items.append(
                OrderItem(order_id=order.id, product_id=product.id, quantity=quantity, price=line_price)
            )

        order.total_amount = total
        db.add_all(order_items)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return get_order(db, order.id)


def delete_order(db: Session, order_id: int) -> None:
    order = get_order(db, order_id)
    db.delete(order)
    db.commit()
