from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate
from app.services.exceptions import ConflictError, NotFoundError


def list_customers(db: Session, search: str | None = None, skip: int = 0, limit: int = 100) -> list[Customer]:
    query = db.query(Customer).order_by(Customer.created_at.desc())
    if search:
        like = f"%{search}%"
        query = query.filter((Customer.full_name.ilike(like)) | (Customer.email.ilike(like)))
    return query.offset(skip).limit(limit).all()


def get_customer(db: Session, customer_id: int) -> Customer:
    customer = db.get(Customer, customer_id)
    if not customer:
        raise NotFoundError("Customer not found")
    return customer


def create_customer(db: Session, payload: CustomerCreate) -> Customer:
    customer = Customer(**payload.model_dump())
    db.add(customer)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ConflictError("Customer email already exists") from exc
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer_id: int) -> None:
    customer = get_customer(db, customer_id)
    db.delete(customer)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ConflictError("Customer has existing orders") from exc
