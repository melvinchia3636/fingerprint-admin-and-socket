# socket.py
from typing import List
import socketio
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from fastapi.applications import ASGIApp
from loguru import logger

def handle_connect(sid, environ):
    logger.info(f"Socket connected with sid {sid}")

class SocketManager:
    def __init__(self, origins: List[str]):
        self.server = socketio.AsyncServer(
            cors_allowed_origins=origins,
            async_mode="asgi",
            logger=True,
            engineio_logger=True,
        )
        self.app = socketio.ASGIApp(self.server)

    @property
    def on(self):
        return self.server.on

    @property
    def send(self):
        return self.server.send

    def mount_to(self, path: str, app: ASGIApp):
        app.mount(path, self.app)


socket_manager = SocketManager(origins=[])
socket_manager.on("connect", handler=handle_connect)