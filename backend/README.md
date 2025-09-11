# backend
Para recepción de mensajes CAN y comprobar su estado:

1. Crear interfaz virtual CAN:
```
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```
Y Comprobar que está levantada:
```
ip link show vcan0
```

2. Instalar can-utils si no lo tenemos

3. Levantar docker redis:
```
sudo docker run -p 6379:6379 -it redis:latest
```

4. Desplegar uvicorn:
```
uvicorn main:app --reload
```


Ya podemos probar a enviar mensajes CAN usando:
```
cansend <iface> <can_id>#<data_bytes>
```

Ejemplo:
```
cansend vcan0 014#0960505050505050
```

Al buscar ese componente en el API:

http://localhost:8000/status/20

Devolverá:

{"VBattery":"24585","VCell0":"80","VCell1":"80","VCell2":"80","VCell3":"80","VCell4":"80","VCell5":"80"}

//Fin del documento 