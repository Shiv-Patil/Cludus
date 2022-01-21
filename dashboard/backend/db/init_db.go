package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InitDB(dbc *DBConnector) {
    database := dbc.Client.Database(dbc.Database)

    schema := bson.M{
        "bsonType": "object",
        "required": []string{"access_token", "refresh_token", "userid", "email"},
        "properties": bson.M{
            "access_token": bson.M{
                "bsonType": "string",
                "description": "Access token of the user",
            },
            "refresh_token": bson.M{
                "bsonType": "string",
                "description": "Refresh token of the user",
            },
            "userid": bson.M{
                "bsonType": "string",
                "description": "Discord user id",
            },
            "email": bson.M{
                "bsonType": "string",
                "description": "Discord user email",
            },
        },
    }

    validator := bson.M{
        "$jsonSchema": schema,
    }

    opts := options.CreateCollection().SetValidator(validator)
    err := database.CreateCollection(context.Background(), "users", opts)
    if err != nil {
        log.Fatal(err)
    }
}
