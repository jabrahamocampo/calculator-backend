set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" -U "postgres"; do
  echo "Waiting to PostgreSQL..."
  sleep 2
done

exec $cmd
