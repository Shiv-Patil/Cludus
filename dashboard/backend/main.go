package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"cludus/routes"
    "cludus/db"

	"github.com/urfave/cli/v2"
    _ "github.com/joho/godotenv/autoload"

    "github.com/go-chi/chi/v5"
	"github.com/go-chi/httprate"
    chiMiddleware "github.com/go-chi/chi/v5/middleware"
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

                    router.Use(chiMiddleware.Heartbeat("/ping"))
                    router.Use(chiMiddleware.Logger)
                    router.Use(chiMiddleware.CleanPath)
                    router.Use(chiMiddleware.Recoverer)
                    router.Use(httprate.LimitByIP(1000, 1 * time.Minute))

                    dbUri, found := os.LookupEnv("MONGO_URL")

                    if !found {
                        log.Fatal("Please specify and the Mongo DB url in an environment variable!")
                    }

                    dbConnector := db.NewDBConnector(dbUri)
                    log.Println("Successfully connected to, and pinged DB")

                    routes.AddRoutes(router, &dbConnector)
                    
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
