#!/bin/bash
echo "Stopping current backend application..."
pm2 stop saksham-backend || true
echo "Cleaning up old files..."
rm -rf /home/ec2-user/saksham-backend
