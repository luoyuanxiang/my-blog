#!/bin/bash

echo "Starting My Blog Server..."
echo

echo "Checking Java version..."
java -version
echo

echo "Building project..."
mvn clean compile
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo
echo "Starting application..."
mvn spring-boot:run
