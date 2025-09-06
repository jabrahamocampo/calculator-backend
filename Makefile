.PHONY: up down build logs

# Put down all containers
down:
	docker-compose down -v

# Build the images
build:
	docker-compose build --no-cache

# Delete the specific container: docker compose rm -sf (container name)
remove:
	docker-compose rm -sf

# Up all containers
up:
	docker-compose up -d --build

# Logs
logs:
	docker-compose logs -f

# List all active containers
ps:
	docker compose ps

