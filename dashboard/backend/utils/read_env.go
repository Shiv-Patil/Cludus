package utils

import (
	"os"
    "fmt"
	"log"
)

type Config struct {
    ClientID string
    ClientSecret string
    RedirectURL string
    LoginURL string
}

func ReadEnvVar(variable string) string {
    value, found := os.LookupEnv(variable)
    if !found {
        log.Fatalf("Please specify a `%v` in an env variable!\n", variable)
    }
    return value
}

func ReadConfig() *Config {
    var config *Config = &Config{}

    config.ClientID = ReadEnvVar("CLIENT_ID")
    config.ClientSecret = ReadEnvVar("CLIENT_SECRET")
    config.RedirectURL = ReadEnvVar("REDIRECT_URL")
    config.LoginURL = "https://discord.com/api/oauth2/authorize?" +
		fmt.Sprintf("client_id=%v", config.ClientID) +
		fmt.Sprintf("&redirect_uri=%v", config.RedirectURL) +
		"&response_type=code&scope=identify%20email%20guilds"

    return config
}
