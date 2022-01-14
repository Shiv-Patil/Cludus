# syntax=docker/dockerfile:1

# Build API
FROM golang:1.17-alpine AS backend

WORKDIR /app

# Install dependencies
COPY backend/go.* backend/
COPY backend/routes/go.* backend/routes/
COPY backend/middleware/go.* backend/middleware/
COPY backend/utils/go.* backend/utils/
COPY backend/db/go.* backend/db/
RUN cd backend && go mod download

COPY backend/ backend/

RUN cd backend && go build

# Build frontend
FROM node:17-alpine as frontend

WORKDIR /app

RUN mkdir frontend
COPY frontend/package.json frontend/
COPY frontend/package-lock.json frontend/

RUN cd frontend && npm ci

COPY frontend/ frontend/

RUN cd frontend && npm run build

# Move build outputs to a new image
FROM alpine:latest

WORKDIR /app

COPY --from=backend /app/backend/main ./backend/
COPY --from=frontend /app/frontend/build ./frontend/build

CMD ["/app/backend/main", "runserver"]
