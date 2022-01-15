package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type DBConnector struct {
    client *mongo.Client
}

func NewDBConnector(uri string) DBConnector {
    client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))

    if err != nil {
        log.Fatalf("Error while connecting to DB - %v\n", err.Error())
    }

    err = client.Ping(context.TODO(), readpref.Primary())
    if err != nil {
        log.Fatalf("Error while pinging DB - %v\n", err.Error())
    }

    return DBConnector{client}
}

func (d *DBConnector) Close() {
    d.client.Disconnect(context.Background())
}
