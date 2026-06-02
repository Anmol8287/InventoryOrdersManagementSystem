from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.order import OrderCreate, OrderRead
from app.services import order_service


router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    return order_service.create_order(db, payload)


@router.get("", response_model=list[OrderRead])
def list_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return order_service.list_orders(db, skip=skip, limit=limit)


@router.get("/{order_id}", response_model=OrderRead)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return order_service.get_order(db, order_id)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order_service.delete_order(db, order_id)
