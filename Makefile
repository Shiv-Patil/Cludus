docker_run_dashboard:
	cd dashboard && docker build . -t cludus_dashboard
	docker run -p 3000:3000 cludus_dashboard

run_dashboard:
	cd dashboard/frontend && npm run build
	cd dashboard/backend && go build .
	cd dashboard && backend/main
