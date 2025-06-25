#!/bin/bash

# Setup vcan0 if it doesn't exist
echo "Executing entrypoint.sh"
if ! ip link show vcan0 &>/dev/null; then
  echo "Setting up vcan0..."
  modprobe vcan
  ip link add dev vcan0 type vcan
  ip link set up vcan0
else
  echo "vcan0 already exists"
fi

exec "$@"
