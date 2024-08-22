#!/usr/bin/env bash

# 현재 디렉토리를 기준으로 상위 디렉토리 경로를 찾음
current_dir=$(pwd)
apps_dir=""

while [[ "$current_dir" != "/" ]]; do
    if [[ -d "$current_dir/apps" ]]; then
        apps_dir="$current_dir/apps"
        break
    fi
    current_dir=$(dirname "$current_dir")
done

if [[ -z "$apps_dir" ]]; then
    echo "상위 'apps' 디렉토리를 찾을 수 없습니다."
    exit 1
fi

echo "상위 'apps' 디렉토리 경로: $apps_dir"

selected_directory=${apps_dir}


sed -i '' "s/selected_directory=.*/selected_directory=/" .env
sed -i '' "s/selected_directory=/selected_directory=${selected_directory//\//\\/}/g" .env

echo "선택된 디렉토리: $selected_directory"

docker-compose up --build miso-services-frontend-api-server-init