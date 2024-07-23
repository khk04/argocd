import requests

# Docker 레지스트리 URL
registry_url = "http://docker-registry-service.docker:5000"

# 인증 정보
username = "juxtagene"
password = "2023May02"

def get_images():
    catalog_endpoint = f"{registry_url}/v2/_catalog"
    auth = (username, password)
    response = requests.get(catalog_endpoint, auth=auth)

    if response.status_code == 200:
        catalog_data = response.json()
        images = catalog_data.get("repositories", [])
    else:
        print(f"에러: {response.status_code} - {response.text}")

    return images


def get_tags(image_name):
    catalog_endpoint = f"{registry_url}/v2/{image_name}/tags/list"
    auth = (username, password)
    response = requests.get(catalog_endpoint, auth=auth)

    if response.status_code == 200:
        tags_data = response.json()
        tags = tags_data.get("tags", [])
    else:
        print(f"에러: {response.status_code} - {response.text}")

    return tags


def get_user_iamges(user_name):
    images = get_images()

    user_images = []
    for image in images:
        if image.find(user_name) != -1:
            tags = get_tags(image)
            if tags is not None:
                for tag in tags:
                    user_images.append({"name" : f"{image}:{tag}" })

    return user_images
