from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.services.exceptions import ConflictError, InsufficientStockError, NotFoundError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(NotFoundError)
    async def not_found_handler(_: Request, exc: NotFoundError):
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(exc)})

    @app.exception_handler(ConflictError)
    async def conflict_handler(_: Request, exc: ConflictError):
        return JSONResponse(status_code=status.HTTP_409_CONFLICT, content={"detail": str(exc)})

    @app.exception_handler(InsufficientStockError)
    async def stock_handler(_: Request, exc: InsufficientStockError):
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"detail": str(exc)})

    @app.exception_handler(RequestValidationError)
    async def validation_handler(_: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": exc.errors()},
        )

    @app.exception_handler(SQLAlchemyError)
    async def database_handler(_: Request, __: SQLAlchemyError):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Database error"},
        )
