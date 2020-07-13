default:
    @echo "Choose one task"
    @echo "make run-app: Run API"
    @echo "make up-db: Run just db"
    @echo "make rtest: Run tests"
    @exit 1

run-app:
    @echo "Starting the application..."
    @docker-compose up --build

up-db:
    @echo "Setting up database..."
    @docker-compose up -d db

tests:
    @echo "Preparing to run the tests..."
    @make up-db && yarn test
