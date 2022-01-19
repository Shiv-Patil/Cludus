package utils

import (
	"bytes"
	"context"
	"mime/multipart"
	"net/http"
)

func RequestWithFormData(
    ctx context.Context,
    method string,
    url string,
    form map[string]string,
) (*http.Request, error) {

    var bytesBuffer bytes.Buffer
    writer := multipart.NewWriter(&bytesBuffer)

    for key, value := range form {
        fieldWriter, err := writer.CreateFormField(key)
        if err != nil {
            return &http.Request{}, err
        }

        _, err = fieldWriter.Write([]byte(value))
        if err != nil {
            return &http.Request{}, err
        }
    }

    writer.Close()
    req, err := http.NewRequestWithContext(ctx, method, url, &bytesBuffer)

    if err != nil {
        return req, err
    }

    req.Header.Add("Content-Type", writer.FormDataContentType())
    return req, nil
}
