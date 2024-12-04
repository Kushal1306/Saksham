#!/bin/bash
echo "Starting backend application bolte..."
cd /home/ec2-user/saksham-backend
pm2 start npm --name saksham-backend -- run dev