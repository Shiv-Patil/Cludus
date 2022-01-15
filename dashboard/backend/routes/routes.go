/*
package routes

Implements handlers for different routes

A handler is function that takes in a pointer to a DBConnector, and returns a http.HandlerFunc
*/
package routes

import (
	"os"
	"net/http"
	"path/filepath"

    "cludus/db"

	"github.com/go-chi/chi/v5"
)

type Handler func(*db.DBConnector) http.HandlerFunc

func AddRoutes(router *chi.Mux, dbconnector *db.DBConnector) {
    cdir, _ := os.Getwd()
    FileServer(router, "/", http.Dir(filepath.Join(cdir, "frontend", "build")))
}
