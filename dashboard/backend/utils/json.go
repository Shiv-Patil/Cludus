package utils

import "encoding/json"

func ToJson(data interface{}) ([]byte, error) {
    return json.Marshal(data)
}
