default:
		@echo "Choose one task"
		@echo "make run-app: Run API"
		@exit 1

run-app:
		@echo "Starting the application"
		@docker-compose up --build
