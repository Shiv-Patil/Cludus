# syntax=docker/dockerfile:1

# Build API
FROM golang:1.17-alpine AS backend

WORKDIR /app

RUN mkdir backend
COPY backend/go.mod backend/
COPY backend/go.sum backend/

RUN cd backend && go mod download -x

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

CMD ["/app/backend/main"]
