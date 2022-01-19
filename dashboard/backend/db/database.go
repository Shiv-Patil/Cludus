package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type DBConnector struct {
    client *mongo.Client
}

func NewDBConnector(uri string) DBConnector {
    ctx, cancel := context.WithTimeout(context.Background(), 30 * time.Second)
    defer cancel()
    client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))

    if err != nil {
        log.Fatalf("Error while connecting to DB - %v\n", err.Error())
    }

    ctx, cancel = context.WithTimeout(context.Background(), 30 * time.Second)
    defer cancel()
    err = client.Ping(ctx, readpref.Primary())
    if err != nil {
        log.Fatalf("Error while pinging DB - %v\n", err.Error())
    }

    return DBConnector{client}
}

func (d *DBConnector) Close() {
    d.client.Disconnect(context.Background())
}
