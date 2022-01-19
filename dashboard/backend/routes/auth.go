package routes

import (
	"cludus/db"
	"cludus/utils"
	"io/ioutil"
	"net/http"
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

        form := map[string]string{
            "client_id": config.ClientID,
            "client_secret": config.ClientSecret,
            "grant_type": "authorization_code",
            "code": r.FormValue("code"),
            "redirect_uri": config.RedirectURL,
        }

        req, err := utils.RequestWithFormData(
            r.Context(),
            "POST",
            discord_api_url + "/oauth2/token",
            form,
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
        content, _ := ioutil.ReadAll(resp.Body)
        w.Write(content)
    }
}
