#!/bin/bash
if [ ! -f '.select-src-target' ]; then
	echo -e "다음 중 원하는 타겟 설정 스크립트를 실행하세요"
	echo -e ""
	ls init-*
	echo -e ""
	exit 1
fi


target=$(cat .select-src-target)
target_nover=$(echo "$target" | sed 's/-v[0-9]\+\(\.[0-9]\+\)*$//')
echo -e "\033[31mneuro $target install \033[0m"

rm ../apps/bin/$target_nover

echo "CGO_ENABLED=1 GOOS=linux go install -a ldflags '-extldflags \"-static\"' ./..."
docker-compose run --name neuro-$target-go-ds-install \
	--rm \
	-u $(id -u ${USER}):$(id -g ${USER}) \
	--workdir /work/src/$target/ \
	neuro-go-ds \
	bash -c "CGO_ENABLED=1 GOOS=linux go install -a -ldflags '-extldflags \"-static\" -extldflags ' ./..."
	
#bash -c "CGO_ENABLED=1 GOOS=linux go install -a -ldflags '-extldflags \"-static\" -extldflags \"-lusb-1.0\"' ./..."



file ../apps/bin/$target_nover


scp ../apps/bin/$target_nover juxtagene@20.41.78.225:~
#scp -i ~/.ssh/cyclecloud-vm_key.pem ../apps/bin/$target_nover cc-admin@20.196.103.227:~

#echo "./job-manager -D -d batch -r docker.juxtagene.com -id juxtagene -pw "qwer1234" -br 222.98.244.15:31090 -re 222.98.244.15:32001 -C "olaf""
