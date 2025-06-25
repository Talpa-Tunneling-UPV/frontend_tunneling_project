import redis
import os
#Lanzar redis docker con: docker run -p 6379:6379 -it redis:latest

r = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=int(os.getenv("REDIS_PORT", "6379")), db=0, decode_responses=True)

def save_status(component: str, data):
    r.hset(f"status:{component}", mapping=data) #hashes the component and stores the data (packet bytes)

def get_status(component: str):
    return r.hgetall(f"status:{component}")

def publish_status(data: dict):
    import json
    r.publish("estado_maquina", json.dumps(data))
