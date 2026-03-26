#!/bin/sh

# Generate configuration file from the current environment variables
echo "window._env_ = {" > /app/dist/env-config.js
env | grep "^VITE_" | while read -r line; do
    key=$(echo "$line" | cut -d '=' -f 1)
    # Remove quotes with sed
    value=$(echo "$line" | cut -d '=' -f 2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
    echo "  \"$key\": \"$value\"," >> /app/dist/env-config.js
done
echo "};" >> /app/dist/env-config.js

# Execute original process (serve)
exec "$@"
