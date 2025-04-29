#!/bin/bash

# Запуск бэкенда
echo "Запуск бэкенда на порту 5003..."
cd "D:\project\Effective-mobile-app"
npm run start &

# Запуск фронтенда
echo "Запуск фронтенда на порту 3000..."
cd "D:\project\Effective-mobile-app\frontend"
npm run dev
