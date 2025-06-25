import asyncio
from fastapi import FastAPI, WebSocket, HTTPException
from models import CommandRequest, StatusResponse
from redis_client import get_status
from pubsub_listener import listen_to_redis
from websocket import ws_manager
from can_interface import CANInterface
from contextlib import asynccontextmanager


can_if = None  # variable global para la interfaz CAN

@asynccontextmanager
async def lifespan(app: FastAPI):
    global can_if
    # Inicialización al arrancar la app
    can_if = CANInterface()
    can_if.add_listener(can_if.handle_can_message)
    can_if.start()

    # Lanzar la tarea de escucha a Redis
    task = asyncio.create_task(listen_to_redis())

    yield  # Aquí la app está corriendo

    # Código para limpieza al apagar la app
    task.cancel()
    #can_if.shutdown()  # TO DO -> Apagar lo que haga falta


app = FastAPI(lifespan=lifespan)


@app.post("/command")
def send_command(cmd: CommandRequest): # Modificar
    if cmd.action == "start":
        can_if.send_message(0x101, [0x01])
    elif cmd.action == "stop":
        can_if.send_message(0x101, [0x00])
    else:
        raise HTTPException(400, "Comando no válido")
    return {"message": f"'{cmd.action}' enviado a {cmd.target}"}

@app.get("/status/{component_id}")
def get_component_status(component_id: str):
    data = get_status(component_id)
    if not data:
        raise HTTPException(404, "Component not found")
    return data

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        ws_manager.disconnect(websocket)

