import threading, time
from typing import Union, List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from pbs import *
from maas import *
from sshclient import *

app = FastAPI()

# CORS 설정
origins = [
    "https://allso.juxtagene.com",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"seegene": "backend api server"}


@app.get("/api/maas")
def run_maas_info():
    result = get_maas_info()
    return result

@app.get("/demo/pbs/{item_id}")
def run_pbs_demo(item_id: str):
    result = []
    if item_id == "nodes":
        result = create_pbs_nodes_data('demo', 'cluster0')
        return result
    if item_id == "jobs":
        result = create_pbs_jobs_data('demo', 'cluster0')
        return result

    return result


@app.get("/api/pbs/{item_id}/{cluster_id}")
def run_pbs_data(item_id: str, cluster_id: str):
    result = []
    if item_id == "nodes":
        result = create_pbs_nodes_data('server', cluster_id)
        return result
    if item_id == "jobs":
        result = create_pbs_jobs_data('server', cluster_id)
        return result

    return result


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)

    try:
        if client_id == 1:
            sshshell = sshShellOpen1()
            return_data = sshshell.get_message()
            await manager.send_message(f"{return_data}", websocket)
            while True:
                data = await websocket.receive_text()
                return_data = sshShell1(sshshell, data)
                await manager.send_message(f"{return_data}", websocket)
    except WebSocketDisconnect:
        sshshell.on_close()
        manager.disconnect(websocket)

    try:
        if client_id == 2:
            sshshell = sshShellOpen2()
            return_data = sshshell.get_message()
            await manager.send_message(f"{return_data}", websocket)
            while True:
                data = await websocket.receive_text()
                return_data = sshShell2(sshshell, data)
                await manager.send_message(f"{return_data}", websocket)
    except WebSocketDisconnect:
        sshshell.on_close()
        manager.disconnect(websocket)

    try:
        if client_id == 3:
            sshshell = sshShellOpen3()
            return_data = sshshell.get_message()
            await manager.send_message(f"{return_data}", websocket)
            while True:
                data = await websocket.receive_text()
                return_data = sshShell3(sshshell, data)
                await manager.send_message(f"{return_data}", websocket)
    except WebSocketDisconnect:
        sshshell.on_close()
        manager.disconnect(websocket)

    try:
        if client_id == 4:
            sshshell = sshShellOpen4()
            return_data = sshshell.get_message()
            await manager.send_message(f"{return_data}", websocket)
            while True:
                data = await websocket.receive_text()
                return_data = sshShell4(sshshell, data)
                await manager.send_message(f"{return_data}", websocket)
    except WebSocketDisconnect:
        sshshell.on_close()
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
