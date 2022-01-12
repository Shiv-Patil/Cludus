package main

import (
    "os"
    "net/http"

    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
)

func main() {
    r := chi.NewRouter()
    r.Use(middleware.Logger)
    
    r.Get("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello World!"))
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }
    
    http.ListenAndServe(":" + port, r)
}
