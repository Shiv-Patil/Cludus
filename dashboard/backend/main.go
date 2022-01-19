package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"cludus/db"
	"cludus/routes"
	"cludus/utils"

	_ "github.com/joho/godotenv/autoload"
	"github.com/urfave/cli/v2"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
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

                    router.Use(chiMiddleware.Heartbeat("/ping"))
                    router.Use(chiMiddleware.Logger)
                    router.Use(chiMiddleware.CleanPath)
                    router.Use(chiMiddleware.Recoverer)
                    router.Use(httprate.LimitByIP(1000, 1 * time.Minute))


                    dbConnector := db.NewDBConnector(utils.ReadEnvVar("MONGO_URL"))
                    log.Println("Successfully connected to, and pinged DB")

                    routes.AddRoutes(router, dbConnector)
                    
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
