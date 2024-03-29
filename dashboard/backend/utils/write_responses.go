package utils

import (
	"fmt"
	"log"
	"net/http"
	"time"
)


func WriteInternalServerError(w http.ResponseWriter, err error) {
    log.Println(err)
    w.WriteHeader(http.StatusInternalServerError)
    fmt.Fprintf(
        w,
        "%v: Internal Server Error\nPlease report the problem, if the error persists",
        time.Now().Format("Mon Jan 2 15:04:05 MST 2006"),
    )
}
