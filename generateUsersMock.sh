#!/bin/bash

KC_URL="http://localhost:8080"
KC_REALM="bt-cm"
KC_CLIENT_ID="bt-mc-client-backend"
KC_CLIENT_KEY="BACK3ND-S3CR3T-K3Y"
USERS_FILE_PATH="./src/pages/monitoring/api"
USERS_FILE_FILENAME="usersMock.json"

server_esponse(){
	echo "Error $1:"
	if echo "$2" | jq . >/dev/null 2>&1; then
        echo "$2" | jq .
    else
        echo "$2"
    fi
}

if ! command -v jq &> /dev/null; then
	echo "Instala 'jq' antes de ejecutar el script"
	exit 1
fi

mkdir -p "$USERS_FILE_PATH"

echo "Obteniendo token..."

res_raw=$(curl -sSX 'POST' \
"$KC_URL/realms/$KC_REALM/protocol/openid-connect/token" \
-H "Content-Type=application/x-www-form-urlencoded" \
-d "grant_type=client_credentials" \
-d "client_id=$KC_CLIENT_ID" \
-d "client_secret=$KC_CLIENT_KEY" \
-w "%{http_code}" )

status_code="${res_raw:${#res_raw}-3}"
res="${res_raw:0:${#res_raw}-3}"

if [[ "$status_code" -gt 299 ]]; then 
	echo "No se puede obtener el token..."
	server_esponse "$status_code" "$res"
	exit 1
fi

token=$(echo "$res" | jq -r '.access_token')

if [[ "$token" == "null" ]] || [[ -z "$token" ]]; then 
	echo "No fue posible extraer el 'access_token' de la respuesta"
	server_esponse "$status_code" "$res"
	exit 1
fi

echo "Obteniendo usuarios..."

res_raw=$(curl -sSX 'GET' \
"$KC_URL/admin/realms/$KC_REALM/users" \
-H "Authorization: Bearer $token" \
-H "Accept: application/json" \
-w "%{http_code}")

status_code="${res_raw:${#res_raw}-3}"
cm_users="${res_raw:0:${#res_raw}-3}"

if [[ "$status_code" -gt 299 ]]; then 
	echo "No se pudo obtener la lista de usuarios:"
	server_esponse "$status_code" "$cm_users"
	exit 1
fi

echo "$cm_users" | jq '.' > "$USERS_FILE_PATH/$USERS_FILE_FILENAME"
echo "Usuarios guardados en \"$USERS_FILE_PATH/$USERS_FILE_FILENAME\""
