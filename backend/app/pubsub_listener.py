import asyncio
import json
import redis
from websocket import ws_manager
import os

r = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=int(os.getenv("REDIS_PORT", "6379")), db=0, decode_responses=True)
pubsub = r.pubsub()
pubsub.subscribe("estado_maquina")

# when it receives a message sends it to everyone (the frontend in our case)
async def listen_to_redis():
    while True:
        message = pubsub.get_message()
        if message and message['type'] == 'message':
            data = json.loads(message['data'])
            await ws_manager.broadcast(data) 
        await asyncio.sleep(0.01)
