package models

type UserToken struct {
    AccessToken string `json:"access_token" bson:"access_token"`
    ExpiresIn int `json:"expires_in"`
    RefreshToken string `json:"refresh_token" bson:"refresh_token"`
    Scope string `json:"scope"`
    TokenType string `json:"token_type"`

    UserID string `json:"user_id" bson:"user_id"`
}
