package main

import (
	"log"
	"os"
	"os/signal"
	"os/exec"
	"sync"
	"runtime"
	"github.com/IBM/sarama"
	"encoding/json"
	"time"
	"strings"
	"bytes"
	"strconv"

	"fmt"
)

const VERSION = "v0.0.1"
const TimeAutoscaleRefresh = 2 //second
var (
	producer sarama.AsyncProducer
)

/////project struct ////
type Project struct {
	//from kafka//
	name string  
	commit string
	//////////////

	////
	InputFile string	`json:"upload"`
	ResultFile string	`json:"download"`
	Job_name string 	`json:"job_name"`
	User string 		`json:"user_name"`
	Parampath string 	`json:"param_path"`
	QuotaCPU int 		`json:"resource_cpu"`
	QuotaMEM int 		`json:"resource_mem"`
	QuotaNODE int 		`json:"resource_node"`
	Jobcmd []string		`json:"job_cmd"`
	Modulecmd string 
	OutPath string 		`json:"outfile_path"`
	Job_ID string 		`json:"job_id"`
	JobParameter string `json:"job_parameter"`
	JobControl string	`json:"job_control"`
	/////////////////
	//////docker/////
	DockerImage string	`json:"docker_image"`
	/////////////////

	JobmanagerCmd string 	`json:"cmd"`
	////state////
	Flowstate string 		`json:"flow_state"`
	State0 string			`json:"job_summited"`
	State1 string			`json:"ready"`
	State2 string			`json:"job_queued"`
	State3 string			`json:"job_running"`
	State4 string			`json:"job_done"`
	State5 string 			`json:"job_end"`

	/////////////
	Batchpath string 	`json:"batch_path"`
	JobType string		`json:"job_type"`
	isBatchfile bool 	`json:"isBatchfile"`
	isParamfile bool 	`json:"isParamfile"`
}
////////////////////////

var wgc sync.WaitGroup


type pbsJob struct {
    JobName  string `json:"job_name"`
    Nodes    int    `json:"nodes"`
    Ppn      int    `json:"ppn"`
    Mem      string `json:"mem"`
    Outpath  string `json:"outpath"`
	Walltime string `json:walltime`

}

type NodeInfo struct {
	State string `json:"state"`
	Mem   string `json:"mem f/t"`
	Cpus  string `json:"ncpus f/t"`
}

type JobInfo struct {
	JobName string `json:"Job_Name"`
	JobState string `json:"job_state"`
}


type PBSNodes struct {
	Nodes map[string]NodeInfo `json:"nodes"`
}

type PBSJobs struct {
	Jobs map[string]JobInfo `json:"Jobs"`
}


type pbsBatch struct {
    PbsBatch []pbsJob `json:"pbs_batch"`
}


func checkClusterResources(proj *Project) bool {
	nodes, err := getNodeInfo()
	if err != nil {
		DEBUG("[checkClusterResource] can't check cluster resources")
		return false
	}

	for name, info := range nodes {
		DEBUG("Node: ", name)
		DEBUG("  State: ", info.State)
		DEBUG("  Memory: ", info.Mem)
		DEBUG("  CPUs: ", info.Cpus)
		
		availCPUstr := strings.Split(info.Cpus, "/")[0]
		availMEMstr := strings.Split(info.Mem, "/")[0]
		availMEMstr = availMEMstr[:len(availMEMstr)-2]

		//avainMEM : gb
		availCPU, _  := strconv.Atoi(availCPUstr)
		availMEM, _  := strconv.Atoi(availMEMstr)
		availMEM = availMEM * 1000


		DEBUG("availCPU : ",availCPU)
		DEBUG("availMEM : ",availMEM)

		if (info.State != "free") {
			continue
		}
		if (proj.QuotaMEM >= availMEM) {
			DEBUG("[checkClusterResources] there are no memory resources")
			return false
		}
		if (proj.QuotaCPU >= availCPU) {
			DEBUG("[checkClusterResources] there are no cpu core resources")
			return false
		}

	}
	return true
}
func job_autoscaler(){
	// job migration to cloud
	queueStateCounter := make(map[string]int)
	for {
		time.Sleep(TimeAutoscaleRefresh*time.Second)
		jobs, err := getClusterJobs()
		if err != nil {
			DEBUG("[checkClusterResource] can't check cluster Jobs")
		}
		for jobId, info := range jobs {
			if (info.JobState == "Q") {
				DEBUG("[job_autoscaler] queued job : ",info.JobName,"  count :",queueStateCounter[info.JobName])		
				if (queueStateCounter[info.JobName]>=3){
					curProj := new(Project)
					err := getJobinfo(info.JobName,curProj)
					if (err != nil){
						DEBUG("[job_autoscaler] 작업정보 조회 실패")
						continue
					}
					DEBUG("[job_autoscaler] Job Move to CloudCluster : ",info.JobName)
					DEBUG("[job_autoscaler] Delete job from this cluster to migrate : ",info.JobName)
					runqdel(jobId)

					DEBUG("[job_autoscaler] Job scale to cloud")
					sendKafkaProject("hpc_Job_control",curProj,info.JobName)
					delete(queueStateCounter, "info.JobName")
				}
				queueStateCounter[info.JobName] += 1
			}
		}
	}
}

func createBatch(pbsBatchJSON string) error {
    var pbsBatch pbsBatch
    err := json.Unmarshal([]byte(pbsBatchJSON), &pbsBatch)
    if err != nil {
        return fmt.Errorf("failed to unmarshal pbs_batch JSON: %v", err)
    }

    // Create or open batch.sh file
    file, err := os.Create("batch.sh")
    if err != nil {
        return fmt.Errorf("failed to create batch.sh file: %v", err)
    }
    defer file.Close()

    // Write the shebang line
    file.WriteString("#!/bin/bash\n")

    // Create PBS script
    for _, job := range pbsBatch.PbsBatch {
        if job.JobName != "" {
            file.WriteString(fmt.Sprintf("#PBS -N %s\n", job.JobName))
        }
        if job.Nodes > 0 && job.Ppn > 0 {
            file.WriteString(fmt.Sprintf("#PBS -l nodes=%d:ppn=%d\n", job.Nodes, job.Ppn))
        }
        if job.Walltime != "" {
            file.WriteString(fmt.Sprintf("#PBS -l walltime=%s\n", job.Walltime))
        }
        if job.Mem != "" {
            file.WriteString(fmt.Sprintf("#PBS -l mem=%s\n", job.Mem))
        }
        file.WriteString("#PBS -j oe\n")
        if job.Outpath != "" {
            file.WriteString(fmt.Sprintf("#PBS -o %s\n", job.Outpath))
        }
        file.WriteString("\n")

        // Write the rest of the script
        file.WriteString("# Change to the directory from which the job was submitted\n")
        file.WriteString("cd $PBS_O_WORKDIR\n")
        file.WriteString("\n")
        
        // Write module load command if needed
        // Uncomment the line below if specific modules are required
        // file.WriteString("# module load mpi\n")
        
        // Write the command to run
        file.WriteString("sleep 3;\n")
        if job.Nodes > 0 && job.Ppn > 0 {
            file.WriteString(fmt.Sprintf("/opt/mvapich2-2.3.7-1/bin/mpirun -np %d hostname\n", job.Nodes * job.Ppn))
        }
        file.WriteString("\n")
    }

    return nil
}

func submitBatchScript(batchScriptPath string) error {

    // qsub 명령 생성
    cmd := exec.Command("qsub", batchScriptPath)

    // 명령 실행 및 실행 결과 확인
    output, err := cmd.CombinedOutput()
    if err != nil {
        return fmt.Errorf("error executing qsub command: %v, output: %s", err, output)
    }

    // qsub 실행 결과 출력
    fmt.Println("qsub command output:", string(output))

    return nil
}

///////////////// create consume loop functions ////////////////
func consume_submiter(consumer sarama.Consumer, topic string) {
	partitions, err := consumer.Partitions(topic)
	if err != nil {
		log.Fatalln("Failed to get partitions:", err)
	}
	DEBUG("[DEBUG] Initial topic : " + topic)
	for _, partition := range partitions {
		partitionConsumer, err := consumer.ConsumePartition(topic, partition, sarama.OffsetNewest)
		if err != nil {
			log.Fatalln("Failed to start partition consumer:", err)
		}
		DEBUG("[DEBUG] partition init done")
		go func(pc sarama.PartitionConsumer) {
			defer wgc.Done()

			for message := range pc.Messages() {
				// Pretty print the JSON message
				var prettyJSON bytes.Buffer
				err := json.Indent(&prettyJSON, message.Value, "", "  ")
				if err != nil {
					DEBUG("[DEBUG] recv kafka msg : " + string(message.Value))
				} else {
					DEBUG("[DEBUG] recv kafka msg : \n" + prettyJSON.String())
				}
				cmd := Jsoncmdparser(string(message.Value))
				switch cmd {
				///////////////////////////// olaf cmd //////////////////////////////
				case "job_bin":
					DEBUG("CMD job_bin start")
					// project = new(Project)
					// err = json.Unmarshal(message.Value, project)
					// if err != nil {
					// 	log.Printf("JSON unmarshaling error: %v", err)
					// }
					err := createBatch(string(message.Value))
					if err != nil {
						log.Printf("Error creating batch: %v", err)
						return
					}
					fmt.Println("batch.sh 파일이 성공적으로 생성되었습니다.")

					batchScriptPath := "batch.sh"

					// 배치 파일을 qsub으로 제출
					serr := submitBatchScript(batchScriptPath) 
					if serr != nil {
						fmt.Printf("Error submitting batch script: %v\n", serr)
						return
					}
					fmt.Println("Batch script submitted successfully.")

				case "job_run":
					switch run_cluster{
					case "olaf":
						DEBUG("[JobSumitter] Start sqeuence Job Submit")
						proj := new(Project)
						err = json.Unmarshal(message.Value, proj)
						initJob(string(message.Value), proj)
						readyJob(string(message.Value), proj)
						RunJobsumitter(string(message.Value), proj)
					case "genie":
						DEBUG("[JobSumitter] Start sqeuence Cloud Job Submit")
						proj := new(Project)
						err = json.Unmarshal(message.Value, proj)
						initJobCloud(string(message.Value), proj)
						readyJob(string(message.Value), proj)
						RunJobsumitter(string(message.Value), proj)
					}
				case "job_del":
					DEBUG("[JobSumitter] Start job cancellation")
					go CGJob(string(message.Value))
				case "img_pull":
					go Runimagepull(string(message.Value))
				case "status_req":
					curProj := new(Project)
					curJobName := Jsonstrdataparser(string(message.Value), "job_name")
					_ = getJobinfo(curJobName, curProj)
					sendKafkaProject("job_status", curProj, curJobName)
				case "delete_work_dir":
					DEBUG("[deleteWorkDir] Start delete Workspace dir")
					DEBUG("[deleteWorkDir] message : " + string(message.Value))
					curUserName := Jsonstrdataparser(string(message.Value), "user_name")
					curJobName := Jsonstrdataparser(string(message.Value), "job_name")
					DEBUG("[preDeleteWorkDir] " + curJobName + curUserName)
					deleteWorkDir(curJobName, curUserName)
				}
			}
		}(partitionConsumer)
	}
}


func consume_logger(consumer sarama.Consumer,topic string){
	partitions, err := consumer.Partitions(topic)
	if err != nil {
		log.Fatalln("Failed to get partitions:", err)
	}
	for _, partition := range partitions {
		partitionConsumer, err := consumer.ConsumePartition(topic, partition, sarama.OffsetNewest)
		if err != nil {
			log.Fatalln("Failed to start partition consumer:", err)
		}

		go func(pc sarama.PartitionConsumer) {
			defer wgc.Done()

			for message := range pc.Messages() {
				cmd := Jsoncmdparser(string(message.Value))
				job_id := Jsonstrdataparser(string(message.Value),"job_id")
				job_name := Jsonstrdataparser(string(message.Value),"job_name")
				job_state := Jsonstrdataparser(string(message.Value),"job_state")
				curProj := new(Project)
				_ = getJobinfo(job_name,curProj)
				switch cmd {
				case "set_status":
					DEBUG("[Job Logger] Start sequence set job status")
					switch job_state {
					case "job_queued":
						DEBUG("state :"+job_state+"  job_id : "+string(job_id))
						updateJobStatus(curProj,"job_queued")
						sendKafkaProject("job_state",curProj,job_name)
					case "job_run":
						DEBUG("state :"+job_state+"  job_id : "+string(job_id))
						updateJobStatus(curProj,"job_running")
						updateJobID(curProj,job_id)
						sendKafkaProject("job_state",curProj,job_name)
					case "job_begin":
						DEBUG("state :"+job_state+"  job_id : "+string(job_id))
					case "job_launch":
						DEBUG("state :"+job_state+"  job_id : "+string(job_id))
						go start_logwatcher(job_id,job_name,curProj.User)
					case "job_end":
						DEBUG("state :"+job_state+"  job_id : "+string(job_id))
						updateJobStatus(curProj,"job_done")
						sendKafkaProject("job_state",curProj,job_name)
						//downloadOutput(job_name,curProj.User,curProj.ResultFile)
						updateJobStatus(curProj,"job_end")
						sendKafkaProject("job_state",curProj,job_name)
						produce_endlog(job_id, job_name,curProj.User,curProj.OutPath)

					}
				}
			}
		}(partitionConsumer)
	}
}
//////////////////////////////////////////////////////////////////


////////////// job submit functions //////////////////
func initJob(kafkamsg string,proj *Project){ 
	proj.Flowstate	= "job_summited"
	proj.State0		= time.Now().Format("06-01-02-15:04:05")
	proj.Modulecmd  = makeModuleCommand(proj.Job_name,proj.JobParameter,proj.DockerImage,proj.User)
	DEBUG(proj)
	sendKafkaProject("job_state",proj,proj.Job_name)
	makeWorkDir(proj.Job_name,proj.User)
}
func initJobCloud(kafkamsg string,proj *Project){ 
	proj.Flowstate	= "job_summited"
	proj.State0		= time.Now().Format("06-01-02-15:04:05")
	proj.Modulecmd  = makeModuleCommandCloud(proj.Job_name,proj.JobParameter,proj.DockerImage,proj.User)
	DEBUG(proj)
	sendKafkaProject("job_state",proj,proj.Job_name)
}

func makeModuleCommandCloud(jobName string,jobParameter string,dockerImage string,Username string)string{
	// projectDir := "/seegene/home/"+Username+"/projects/"+jobName
	var Command []string
	Command = append(Command, "sudo docker run --tty --rm --net=host")		// docker command
	Command = append(Command, "--name="+jobName)						// container name
	Command = append(Command, dockerImage)

	DEBUG("[Make module command]"+strings.Join(Command," "))
	return strings.Join(Command," ")
}

func makeModuleCommand(jobName string,jobParameter string,dockerImage string,Username string)string{
	projectDir := "/seegene/home/"+Username+"/projects/"+jobName
	var Command []string
	Command = append(Command, "docker run --tty --rm --net=host")		// docker command
	Command = append(Command, "--name="+jobName)						// container name
	Command = append(Command, "-v "+ projectDir +"/result:/app/res")	// container mount path
	Command = append(Command, "-v "+ projectDir +"/tmp:/app/tmp")
	Command = append(Command, "-v "+ projectDir +"/input:/app/input")
	Command = append(Command, "-v "+ projectDir +"/chk:/app/chk")
	Command = append(Command, "-e "+"JOB_PARAMETERS=\""+jobParameter+"\"")						// module parameter
	Command = append(Command, dockerImage)

	DEBUG("[Make module command]"+strings.Join(Command," "))
	return strings.Join(Command," ")
}
func readyJob(kafkamsg string,proj *Project){
	DEBUG("[uploadInput] Start Upload files")
	DEBUG("[uploadInput ] name : "+proj.Job_name+" user : "+proj.User+" upload : "+proj.InputFile)
	// if(proj.InputFile != ""){
	// 	uploadInput(proj.Job_name,proj.User,proj.InputFile)
	// }
	updateJobStatus(proj,"job_ready")
	sendKafkaProject("job_state",proj,proj.Job_name)
	DEBUG("[uploadInput] Done")

}

func RunJobsumitter(kafkamsg string, proj *Project){

	directory := base_dir+proj.Job_name+"/"
	if(run_cluster == "olaf"){
		MakeJobbatch(directory,proj)
	}else if(run_cluster == "genie"){
		MakeJobbatchCloud(directory,proj)
	}
	if(proj.isBatchfile){
		runqsub(proj)
	}else{
		INFO("[Fail] batch file generating fail")
	}
}

func CGJob(kafkamsg string){

	job_name := Jsonstrdataparser(kafkamsg,"job_name")
	job_id := getRedisData(job_name,"job_id")

	if(job_id != ""){
		runqdel(job_id)
	}else{
		INFO("[Fail] Cancelling Job failed")
	}
}


func Runimagepull(kafkamsg string){
	imagename := Jsonstrdataparser(kafkamsg,"image_name")
	imagever  := Jsonstrdataparser(kafkamsg,"image_version")
	imageuri := docker_regi+imagename+":"+imagever
	regid := docker_regi_id
	regpw := docker_regi_pw

	DEBUG("image name : "+imagename)
	DEBUG("image version : "+imagever)
	DEBUG("image uri : "+imageuri)
	
	cmdlg := exec.Command("docker","login","-u",regid,"-p",regpw,docker_regi)
	outlg, errlg := cmdlg.Output()
	if errlg != nil{
		DEBUG("docker login fail check : ",errlg.Error())
	}
	DEBUG("docker login : ",string(outlg))
	cmdpull := exec.Command("docker","pull",imageuri)
	outpull, errpull := cmdpull.Output()
	if errpull != nil{
		DEBUG("docker pull fail check : ",errpull.Error())
	}
	DEBUG("docker pull : ",string(outpull))
	cmdlo := exec.Command("docker","logout",docker_regi)
	outlo, errlo := cmdlo.Output()
	if errlo != nil{
		DEBUG("docker logout fail check : ",errlo.Error())
	}
	DEBUG("docker logout : ",string(outlo))

}



func main() {

	cmdline("app-go-manager")
	log.SetFlags(0)
	runtime.GOMAXPROCS(runtime.NumCPU())
	INFO("#### jobmanager start ####")

	// print software version
	INFO("Software Version: ", VERSION)

	if kafka_broker != "0.0.0.0" {
		brokerList := []string{kafka_broker}
		var err error
		producer, err = createKafkaProducer(brokerList)
		consumer, err := createConsumer(brokerList)
		if err != nil {
			log.Fatalln("Failed to start Kafka consumer:", err)
		}
		defer func() {
			if err := consumer.Close(); err != nil {
				log.Println("Failed to close Kafka consumer cleanly:", err)
			}
		}()
		INFO("[INFO] broker init done")
		// Kafka topic 설정
		topics := []string{"Job_control","job_log","hpc_Job_control","hpc_job_log"}

		wgc.Add(len(topics))
		
		// msg 파싱 통합 함수 
		if (run_cluster == "olaf") {
			go consume_submiter(consumer, topics[0])  //토픽 확장성 고려 가능 
			DEBUG("[DEBUG] submiter consumer init done. Selected topic : " + topics[0])
		} else if (run_cluster == "genie") {
			go consume_submiter(consumer, topics[2])
			DEBUG("[DEBUG] submiter consumer init done. Selected topic : " + topics[2])
		}else {
			DEBUG("[DEBUG] submiter error : topic error")
		}


		if (run_cluster == "olaf") {
			go consume_logger(consumer, topics[1])
			DEBUG("[DEBUG] logger consumer init done. Selected topic : " + topics[1])
		} else if (run_cluster == "genie"){
			go consume_logger(consumer, topics[3])
			DEBUG("[DEBUG] logger consumer init done. Selected topic : " + topics[3])
		}else {
			DEBUG("[DEBUG] logger error : topic error")
		}


		if (run_cluster == "olaf" && autoscale == true){
			go job_autoscaler()
		}


	}
	// 종료 시그널 처리
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	select {
	case <-signals:
		DEBUG("interrupt")
		wgc.Done()
		os.Exit(3)
	}
	wgc.Wait()
}
