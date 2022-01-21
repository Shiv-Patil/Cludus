package routes

import (
	"context"
	"io/ioutil"
	"net/http"

	"cludus/db"
	"cludus/models"
	"cludus/utils"

	"go.mongodb.org/mongo-driver/bson"
)

var config *utils.Config
var discord_api_url string = "https://discord.com/api"

func InitConfig() {
    config = utils.ReadConfig()
}

func LoginHandler(_ *db.DBConnector) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, config.LoginURL, http.StatusTemporaryRedirect)
    }
}

func CallbackHandler(dbc *db.DBConnector) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        r.ParseForm()

        req, err := utils.RequestWithFormData(
            r.Context(),
            "POST",
            discord_api_url + "/oauth2/token",
            map[string]string{
                "client_id": config.ClientID,
                "client_secret": config.ClientSecret,
                "grant_type": "authorization_code",
                "code": r.FormValue("code"),
                "redirect_uri": config.RedirectURL,
            },
        )

        if err != nil {
            utils.WriteInternalServerError(w, err)
            return
        }

        resp, err := (&http.Client{}).Do(req)
        if err != nil {
            utils.WriteInternalServerError(w, err)
            return
        }

        defer resp.Body.Close()
        content, err := ioutil.ReadAll(resp.Body)
        if err != nil {
            utils.WriteInternalServerError(w, err)
            return
        }

        var token *models.UserToken
        err = utils.DecodeJson(content, token)
        if err != nil {
            utils.WriteInternalServerError(w, err)
            return
        }

//        userCollection := dbc.Client.Database(dbc.Database).Collection("users")
//        _, err = userCollection.InsertOne(context.Background(), *token)
    }
}
