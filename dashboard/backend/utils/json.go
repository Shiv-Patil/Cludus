package utils

import "encoding/json"

func EncodeJson(data interface{}) ([]byte, error) {
    return json.Marshal(data)
}

func DecodeJson(data []byte, target interface{}) error {
    return json.Unmarshal(data, target)
}
