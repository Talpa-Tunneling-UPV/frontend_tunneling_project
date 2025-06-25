import can
import cantools
import threading
import redis_client
import json

class CANInterface:
    def __init__(self):
        self.database = cantools.database.load_file('battery_temp.dbc')
        self.bus = can.interface.Bus(channel="vcan0", bustype="socketcan")
        self.listeners = []
        self.running = False

    def send_message(self, arbitration_id: int, data):

        msg = self.database.encode_message(arbitration_id, data=data)
        self.bus.send(msg)

    def read_loop(self):
        self.running = True
        while self.running:
            msg = self.bus.recv()
            if msg:
                for callback in self.listeners: #when received a message it will run all methods in listeners (like handle_can_message)
                    callback(msg)

    def add_listener(self, callback):
        self.listeners.append(callback)

    def start(self):
        threading.Thread(target=self.read_loop, daemon=True).start()

    # decodes the message, saves it in the database and publishes it
    def handle_can_message(self, msg):
        decoded_message = self.database.decode_message(msg.arbitration_id, msg.data)
        json_decoded_message = json.dumps(decoded_message)
        redis_client.save_status(msg.arbitration_id, decoded_message)
        print(f'Decoded message: {decoded_message} \n\n type{type(decoded_message)} \n\n arb_id {msg.arbitration_id}')
        redis_client.publish_status({"component": msg.arbitration_id, "data":decoded_message})
