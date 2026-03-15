FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput 2>/dev/null || true

EXPOSE 8001

CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8001", "--workers", "4", "--timeout", "120"]
