from pydantic import BaseModel

class CommandRequest(BaseModel):
    action: str
    target: str

class StatusResponse(BaseModel):
    status: str
    value: float