#!/usr/bin/env bash

set -e

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


# if MacOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/selected_directory=.*/selected_directory=/" .env
    sed -i '' "s/selected_directory=/selected_directory=${selected_directory//\//\\/}/g" .env
    #else
else 
    sed -i "s/selected_directory=.*/selected_directory=/" .env
    sed -i "s/selected_directory=/selected_directory=${selected_directory//\//\\/}/g" .env
fi

echo "선택된 디렉토리: $selected_directory"

USER_ID=$(id -u) GROUP_ID=$(id -g) docker-compose up --build seegene-services-frontend-olaf-monitor-init