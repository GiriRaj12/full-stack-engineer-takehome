FROM   bitnami/postgresql:latest
EXPOSE 5432
ENV    POSTGRESQL_PASSWORD=password123 \
       POSTGRESQL_DATABASE=editor \
       POSTGRES_USER=postgres_user \
       DB_URL=postgres://postgres_user:password123@localhost:5432/editor?sslmode=disable
COPY   . ./docker-entrypoint-initdb.d