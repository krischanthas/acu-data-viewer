#!/bin/bash
# Ensure script exits on error
set -e

# Log for visibility
echo "Starting sync-stock job..."

# Install dependencies
npm install

# Run your Node.js entry script
node syncStock.js

echo "Finished sync-stock job."
