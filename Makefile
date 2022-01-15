docker_run_dashboard:
	cd dashboard && docker build . -t cludus_dashboard
	docker run -d -p 3000:3000 cludus_dashboard

docker_run_bot:
	cd cludus && docker build . -t cludus_bot && cd ..
	docker run cludus_bot

run_dashboard:
	cd dashboard/frontend && npm run build
	cd dashboard/backend && go build .
	cd dashboard && backend/main runserver

run_bot:
	cd cludus && npm run dev
