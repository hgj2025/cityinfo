#!/bin/bash

echo "Starting CityInfo Backend Server..."
echo

cd "$(dirname "$0")/server"

echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi

echo
echo "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "Failed to generate Prisma client"
    exit 1
fi

echo
echo "Building TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "Failed to build TypeScript"
    exit 1
fi

echo
echo "Starting server..."
npm start