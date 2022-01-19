/*
package routes

Implements handlers for different routes

A handler is function that takes in a pointer to a DBConnector, and returns a http.HandlerFunc
*/
package routes

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"cludus/db"

	"github.com/go-chi/chi/v5"
)

type Handler func(*db.DBConnector) http.HandlerFunc

var client *http.Client = http.DefaultClient

func AddRoutes(router *chi.Mux, dbconnector *db.DBConnector) {

    InitConfig()

    cdir, _ := os.Getwd()
    log.Println(cdir)
    FileServer(router, "/", http.Dir(filepath.Join(cdir, "frontend", "build")))

    apiRouter := chi.NewRouter()

    authRouter := chi.NewRouter()
    authRouter.Get("/login", LoginHandler(dbconnector))
    authRouter.Get("/callback", CallbackHandler(dbconnector))

    apiRouter.Mount("/auth", authRouter)
    router.Mount("/api", apiRouter)
}
