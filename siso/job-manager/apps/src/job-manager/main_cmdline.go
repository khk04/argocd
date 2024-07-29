package main

import (
	"flag"
	"fmt"
	"os"
)


var (
	priv_key	= ""
	git_url		= ""
	base_dir	= ""
	execName   = ""
	docker_regi = ""
	docker_regi_id = ""
	docker_regi_pw = ""
	kafka_broker = ""
	redis_endpoint = ""
	udp_port = ""
	run_cluster = ""
	pbs_home	= ""
	autoscale	= false

)

func Usage() {
	fmt.Printf("Usage: %s [OPTIONS]\n", execName)


	//flag.PrintDefaults()
}



func cmdline(executeName string) {

	execName = executeName
	// 명령행 정의 및 처리
	//flag.Usage = Usage

	_infoMode := flag.Bool("I", false, "Info log print")
	_traceMode := flag.Bool("T", false, "Trace log print")
	_debugMode := flag.Bool("D", false, "Debug log print")
	_help := flag.Bool("h", false, "help print")
	_priv_key := flag.String("k","/home/falinux/.ssh/id_ed25519","ssh Private key file path")
	_git_url  := flag.String("g","ssh://git@git.falinux.com:10022/","gitlab url (default : falinux git)")
	_base_dir := flag.String("d","/tmp/","data base dir (default : /tmp/)")
	_docker_regi := flag.String("r","dev-docker.seegene.com","docker registry to pull images (default : docker.nemopai.com)")
	_docker_regi_id := flag.String("id","insilico","docker registry id (default insilico)")
	_docker_regi_pw := flag.String("pw","\"qwer1234\"","docker registry pw")
	_kafka_broker := flag.String("br","\"0.0.0.0\"","kafka broker uri")
	_redis_endpoint := flag.String("re","\"10.10.120.3:32001\"","redis endpoint")
	_udp_port := flag.String("p","35000","udp port for hpc (default 35000)")
	_run_cluster := flag.String("C","olaf","running cluster (olaf/genie)")
	_pbs_home := flag.String("pbs","/opt/openpbs/","pbs home path (olaf/genie)")
	_autoscale := flag.Bool("as",false,"on / off auto scale to cloud")

	flag.Parse()

	infoMode = *_infoMode
	traceMode = *_traceMode
	debugMode = *_debugMode
	priv_key = *_priv_key
	git_url	= *_git_url
	base_dir = *_base_dir
	docker_regi = *_docker_regi
	docker_regi_id = *_docker_regi_id
	docker_regi_pw = *_docker_regi_pw
	kafka_broker = *_kafka_broker
	redis_endpoint = *_redis_endpoint
	udp_port = *_udp_port
	run_cluster = *_run_cluster
	pbs_home = *_pbs_home
	autoscale = *_autoscale

	flag.Parse()

	if (flag.NFlag() == 0) || (*_help == true) {
		Usage()
		flag.Usage()
		os.Exit(0)
	}
	setDebugMode()

}
