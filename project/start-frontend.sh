#!/bin/bash

echo "Starting CityInfo Frontend Development Server..."
echo

cd "$(dirname "$0")"

echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi

echo
echo "Starting development server..."
npm run dev