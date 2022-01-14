package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"cludus/routes"

	"github.com/urfave/cli/v2"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
)

func main() {
    app := &cli.App{
        Commands: []*cli.Command{
            {
                Name: "runserver",
                Aliases: []string{"rs"},
                Usage: "Start the API",
                Action: func(c *cli.Context) error {
                    router := chi.NewRouter()

                    router.Use(middleware.Heartbeat("/ping"))
                    router.Use(middleware.Logger)
                    router.Use(middleware.CleanPath)
                    router.Use(middleware.Recoverer)
                    router.Use(httprate.LimitByIP(1000, 1 * time.Minute))

                    routes.AddRoutes(router)
                    
                    port, found := os.LookupEnv("PORT")
                    if !found {
                        port = "3000"
                    }

                    log.Printf("Running API on :%v", port)

                    return http.ListenAndServe(":" + port, router)
                },
            },
        },
    }

    err := app.Run(os.Args)
    if err != nil {
        log.Fatal(err)
    }
}
