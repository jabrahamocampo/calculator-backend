# Wait until PostgreSQL is up and ready
set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" -U "postgres"; do
  echo "Esperando a PostgreSQL..."
  sleep 2
done

exec $cmd
