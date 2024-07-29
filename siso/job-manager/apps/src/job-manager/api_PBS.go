package main



import (
    // "os"
	"os/exec"
	"io/ioutil"
	// "fmt"
	"bytes"
	"log"
	"encoding/json"
)



func runqsub(proj *Project){

	if(!isExistFile(proj.Batchpath)){
		DEBUG("[ERROR] Batchfile missing in git repository")
		DEBUG("[ERROR] Check "+ proj.Batchpath)
		return
	}

	INFO("Running qsub")
	
	INFO("qsub "+proj.Batchpath)

	//////batch and param print///
	INFO("=============batch file=============")
	b1, err := ioutil.ReadFile(proj.Batchpath)
	if err != nil{
		DEBUG("Qsub fail check [read batch] : ",err.Error())
	}

	INFO(string(b1))
	qsubPath := pbs_home+"/bin/qsub"
	if (run_cluster == "olaf"){
		cmd := exec.Command("sudo", "su", "-", proj.User, "-c", qsubPath+" "+proj.Batchpath)
		var outBuf, errBuf bytes.Buffer
		cmd.Stdout = &outBuf
		cmd.Stderr = &errBuf
	
		err := cmd.Run()
    	if err != nil {
			// 에러 발생 시 로그에 기록
			log.Printf("Command execution failed: %v", err)
			log.Printf("Stderr: %s", errBuf.String())
		}
		DEBUG("[runqsub] JOB summited")
	}else if (run_cluster == "genie"){
		cmd := exec.Command(qsubPath,proj.Batchpath)
		var outBuf, errBuf bytes.Buffer
		cmd.Stdout = &outBuf
		cmd.Stderr = &errBuf

		err := cmd.Run()
    	if err != nil {
			// 에러 발생 시 로그에 기록
			log.Printf("Command execution failed: %v", err)
			log.Printf("Stderr: %s", errBuf.String())
		}
		DEBUG("[runqsub] JOB summited")
	}
}

func runqdel(job_id string){
	INFO("Running qdel")
	INFO("qdel"+ job_id)

	//////batch and param print///

	cmd := exec.Command("/opt/openpbs/bin/qdel",job_id)
	out, errcmd := cmd.Output()

	if errcmd != nil{
		DEBUG("Qsub fail check : ",errcmd.Error())
	}

	DEBUG("JOB canceled : ",string(out))
}

func getNodeInfo() (map[string]NodeInfo, error) {
	// Execute the pbsnodes -F json command
	cmd := exec.Command("/opt/openpbs/bin/pbsnodes","-aSj" ,"-F", "json")
	out, errcmd := cmd.Output()

	if errcmd != nil {
		DEBUG("error cmd : ",errcmd.Error())
		return nil , errcmd
	}
	// Parse the JSON output
	var nodes PBSNodes
	errcmd = json.Unmarshal(out, &nodes)
	if errcmd != nil {
		DEBUG("error parsing json : ",errcmd.Error())
		return nil, errcmd

	}

	return nodes.Nodes, nil
}

func getClusterJobs()(map[string]JobInfo, error) {
	cmd := exec.Command("/opt/openpbs/bin/qstat","-f" ,"-F", "json")
	out, errcmd := cmd.Output()

	if errcmd != nil {
		DEBUG("error cmd : ",errcmd.Error())
		return nil , errcmd
	}
	// Parse the JSON output
	var jobs PBSJobs
	errcmd = json.Unmarshal(out, &jobs)
	if errcmd != nil {
		DEBUG("error parsing json : ",errcmd.Error())
		return nil, errcmd

	}

	return jobs.Jobs, nil
}