package models

import (
	"bytes"
	"context"
	"net/http"
	"io/ioutil"

    "cludus/utils"
)

type User struct {
    Id string `json:"id"`
    Username string `json:"username"`
    Discriminator string `json:"discriminator"`
    Bot bool `json:"bot"`
    System bool `json:"system"`
    Verified bool `json:"verified"`
    Email string `json:"email"`
}

func GetUser(ctx context.Context, userid string, discord_api_url string) (*User, error) {
    user := &User{}

    req, err := http.NewRequestWithContext(
        ctx,
        "GET",
        discord_api_url + "/users/" + userid,
        bytes.NewBuffer([]byte{}),
    )
    if err != nil {
        return user, err
    }

    response, err := (&http.Client{}).Do(req)
    if err != nil {
        return user, nil
    }

    defer response.Body.Close()
    content, err := ioutil.ReadAll(response.Body)
    if err != nil {
        return user, nil
    }

    err = utils.DecodeJson(content, user)
    return user, err
}
