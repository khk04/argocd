package main
import (
	"os/exec"
	"log"
	"bytes"
)


func makeUserDir(userName string){
	suCommand := "/usr/bin/su"
	dummyCommand := "whoami"

	cmd := exec.Command("sudo",suCommand,userName,"-c",dummyCommand)
	_, errcmd := cmd.Output()
	if errcmd != nil{
		DEBUG("User Make fail check [cmd] : ",errcmd.Error())
	}
	DEBUG("[userdir make] : "+suCommand+" "+userName+" "+dummyCommand)
}

func makeWorkDir(jobName string, username string) {
	DEBUG("makeWorkDir jobName : " + jobName)
	dirs := map[string]string{
		"/seegene/home/" + username + "/projects/" + jobName + "/chk":    "755",
		"/seegene/home/" + username + "/projects/" + jobName + "/result": "755", 
		// "/seegene/home/" + username + "/projects/" + jobName + "/input":  "755",
		"/seegene/home/" + username + "/projects/" + jobName + "/tmp":    "755",
	}

	for dir, mode := range dirs {
		cmd := exec.Command("sudo", "mkdir", "-p", "-m", mode, dir)
		_, errcmd := cmd.CombinedOutput()
		if errcmd != nil {
			DEBUG("Directory Make fail check [cmd] : ", errcmd.Error())
		} else {
			DEBUG("[workdir make] : mkdir -m " + mode + " " + dir)
		}
	}
}

func deleteWorkDir(jobName string, username string){
	DEBUG("deleteWorkDir jobName : "+ jobName)
	dir := "/home/"+username+"/projects/"+jobName
	delCommand := "rm"

	cmd := exec.Command("sudo",delCommand,"-rf",dir)
	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	err := cmd.Run()
	if err != nil {
		// 에러 발생 시 로그에 기록
		log.Printf("Command execution failed: %v", err)
		log.Printf("Stderr: %s", errBuf.String())
	}

	DEBUG("[workdir delete] : "+delCommand+" "+dir)

}

func uploadInput(JobName string,UserName string,InputFile string){
	DEBUG("[upload Input file] start ")
	mvCommand := ""
	inputDir := ""
	mvOption := ""
	if run_cluster == "olaf" {
		inputDir = "/home/" + InputFile
		mvCommand = "mv"
		mvOption = "-f"
	} else if run_cluster == "genie" {
		inputDir = "insilico@10.10.120.2:/home/" + InputFile
		mvCommand = "scp"
		mvOption = "-r"
	}
	destDir := "/seegene/home/" + UserName + "/projects/" + JobName + "/input"
	cmd := exec.Command("sudo", mvCommand, mvOption, inputDir, destDir)
	if err := cmd.Start(); err != nil {
		log.Fatalf("Error starting command: %v", err)
	}

	if err := cmd.Wait(); err != nil {
		log.Fatalf("Error waiting for command to finish: %v", err)
	}

	log.Println("[upload Input file] done : " + "sudo " + mvCommand + " " + mvOption + " " + inputDir + " " + destDir)
}

func downloadOutput(JobName string,UserName string,OutputFile string){
	DEBUG("[download Output file] start ")
	OutputDir := ""
	mvCommand := ""
	mvOption := ""
	if(run_cluster == "olaf"){
		OutputDir = "/seegene/home/tmp/"+JobName+"/out/"
		mvCommand = "cp"
		mvOption = "-a"
	}else if(run_cluster == "genie"){
		OutputDir = "insilico@10.10.120.2:/seegene/home/tmp/"+JobName+"/out/"
		mvCommand = "scp"
		mvOption = "-r"
	}
	resDir := "/seegene/home/"+UserName+"/projects/"+JobName+"/result/"
	cmd := exec.Command("sudo",mvCommand,mvOption,resDir,OutputDir)
	_, errcmd := cmd.CombinedOutput()
	if errcmd != nil{
		DEBUG("InputFile move fail check [cmd] : ",errcmd.Error())
		DEBUG(errcmd)
	}
	DEBUG("[download Output file] done : "+"sudo "+mvCommand+" "+mvOption+" "+resDir+" "+OutputDir)
}
