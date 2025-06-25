# slim -> minimalist and without aditioanl tools. To change if needed
FROM python:3.10-slim
RUN apt-get update && apt-get install kmod -y && apt-get install iproute2 -y

WORKDIR /app

# Copy the requirements file first to leverage Docker caching.
# pip install will only re-run if this file changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app/ /app


#Create vcan0 interface for testing
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Command to run the Uvicorn server when the container starts.
# It listens on all network interfaces (0.0.0.0) on port 8000.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
