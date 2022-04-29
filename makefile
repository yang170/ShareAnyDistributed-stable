cas-local:
	docker-compose -f configs/docker-compose-local.yml up -d cas1 cas2 cas3

cas1:
	docker-compose -f configs/docker-compose-cas1.yml up -d

cas1-down:
	docker-compose -f configs/docker-compose-cas1.yml down

cas2:
	docker-compose -f configs/docker-compose-cas2.yml up -d

cas2-down:
	docker-compose -f configs/docker-compose-cas2.yml down

cas3:
	docker-compose -f configs/docker-compose-cas3.yml up -d

cas3-down:
	docker-compose -f configs/docker-compose-cas3.yml down

server-local:
	docker-compose -f configs/docker-compose-local.yml up -d django

server:
	docker-compose -f configs/docker-compose-server.yml up -d

server-down:
	docker-compose -f configs/docker-compose-server.yml down

status:
	docker exec -ti $$(docker ps --format {{.Names}}) nodetool status
