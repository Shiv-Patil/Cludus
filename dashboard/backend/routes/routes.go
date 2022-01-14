package routes

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/go-chi/chi/v5"
)

func AddRoutes(router *chi.Mux) {
    router.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello, World!"))
    })
    
    cdir, _ := os.Getwd()
    FileServer(router, "/", http.Dir(filepath.Join(cdir, "frontend", "build")))
}
