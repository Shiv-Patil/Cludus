package routes

import (
	"cludus/db"
	"cludus/utils"
	"log"
	"net/http"
    "github.com/imroc/req"
)

var config *utils.Config

func InitConfig() {
    config = utils.ReadConfig()
}

var discord_api_url string = "https://discord.com/api"

func LoginHandler(_ *db.DBConnector) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, config.LoginURL, http.StatusTemporaryRedirect)
    }
}

func CallbackHandler(dbc *db.DBConnector) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        r.ParseForm()

        data := req.Param{
                "client_id": config.ClientID,
                "client_secret": config.ClientSecret,
                "grant_type": "authorization_code",
                "code": r.FormValue("code"),
                "redirect_uri": config.RedirectURL,
        }

        response, err := req.Post(discord_api_url + "/oauth2/token", data, r.Context())

        if err != nil {
            utils.WriteInternalServerError(w)
            log.Println("Error while making request! - ", err)
        }

        w.Write(response.Bytes())
    }
}
