#!/bin/sh

echo "Pushing Prisma schema to database..."
npx prisma db push

echo "Starting Node.js app..."
npm start