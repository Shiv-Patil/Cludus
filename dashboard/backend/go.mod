module main

go 1.17

replace cludus/routes => ./routes

require (
	cludus/routes v0.0.0-00010101000000-000000000000
	github.com/go-chi/chi/v5 v5.0.7
	github.com/go-chi/httprate v0.5.2
	github.com/urfave/cli/v2 v2.3.0
)

require (
	github.com/cespare/xxhash/v2 v2.1.2 // indirect
	github.com/cpuguy83/go-md2man/v2 v2.0.0-20190314233015-f79a8a8ca69d // indirect
	github.com/russross/blackfriday/v2 v2.0.1 // indirect
	github.com/shurcooL/sanitized_anchor_name v1.0.0 // indirect
)

replace dashboard/middleware => ./middleware

replace dashboard/utils => ./utils

replace dashboard/db => ./db
