default:
	@echo "Choose one task"
	@echo "make run-app: Run the application"
	@echo "make up-db: Setup database"
	@echo "make tests: Run tests"
	@exit 1

run-app:
	@echo "Starting the application..."
	@docker-compose up

up-db:
	@echo "Setting up database..."
	@docker-compose up -d db

tests:
	@echo "Preparing to run the tests..."
	@make up-db && yarn test
