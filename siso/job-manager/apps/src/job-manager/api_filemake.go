package main


import (
	"os"
    "strconv"
)




func MakeJobbatch(projdir string,proj *Project) error {
    DEBUG("[MakeJobbatch] Make batch sequence")
	proj.Batchpath = projdir+"batch.sh"
    DEBUG("[MakeJobbatch] batch dir : "+proj.Batchpath)
    if _, err := os.Stat(projdir); os.IsNotExist(err) {
        if err = os.MkdirAll(projdir, 0755); err != nil {
            return err
        }
    }

    // Create a file in the path of the proj.batchpath variable
    f, err := os.Create(proj.Batchpath)
    if err != nil {
        return err
    }
    defer f.Close()

    // Write the contents of the created file
    // FIXME
    contents := "#!/bin/bash\n"
    contents += "#PBS -N " + proj.Job_name + "\n"
    contents += "#PBS -l nodes="+strconv.Itoa(proj.QuotaNODE)+":ppn=" + strconv.Itoa(proj.QuotaCPU) + "\n"
    contents += "#PBS -l mem=" + strconv.Itoa(proj.QuotaMEM) +"mb"+ "\n"
    // contents += "#PBS -j oe\n"
    // contents += "#PBS -o "+proj.OutPath+"\n"
    contents += "exec &>/shared/result/"+proj.Job_name+".log \n\n"
    if proj.DockerImage != "" {
        contents += "docker login -u juxtagene -p 2023May02 docker.juxtagene.com > /dev/null \n"
        contents += "docker pull -q "+proj.DockerImage+ "\n"
    }
    contents += proj.Modulecmd + "\n"
    if _, err := f.WriteString(contents); err != nil {
        return err
    }

	proj.isBatchfile = true	
    DEBUG(contents)
    return err
}


func MakeJobbatchCloud(projdir string,proj *Project) error {
    DEBUG("[MakeJobbatch] Make batch sequence")
	proj.Batchpath = projdir+"batch.sh"
    DEBUG("[MakeJobbatch] batch dir : "+proj.Batchpath)
    if _, err := os.Stat(projdir); os.IsNotExist(err) {
        if err = os.MkdirAll(projdir, 0755); err != nil {
            return err
        }
    }

    // Create a file in the path of the proj.batchpath variable
    f, err := os.Create(proj.Batchpath)
    if err != nil {
        return err
    }
    defer f.Close()

    // Write the contents of the created file
    // FIXME
    contents := "#!/bin/bash\n"
    contents += "#PBS -N " + proj.Job_name + "\n"
    contents += "#PBS -l nodes="+strconv.Itoa(proj.QuotaNODE)+":ppn=" + strconv.Itoa(proj.QuotaCPU) + "\n"
    contents += "#PBS -l mem=" + strconv.Itoa(proj.QuotaMEM) +"mb"+ "\n"
    contents += "#PBS -j oe\n"
    contents += "#PBS -o shared/home/juxtagene/batch/" + proj.Job_name+"\n"
    contents += "exec &>/shared/home/juxtagene/result/" + proj.Job_name+".log \n\n"
    if proj.DockerImage != "" {
        contents += "sudo docker login -u juxtagene -p 2023May02 az.docker.juxtagene.com > /dev/null \n"
        contents += "sudo docker pull "+proj.DockerImage+ "\n"
    }
    contents += proj.Modulecmd + "\n"
    if _, err := f.WriteString(contents); err != nil {
        return err
    }

	proj.isBatchfile = true	
    DEBUG(contents)
    return err
}


func CheckParameter(projdir string,confpath string,proj *Project){

	proj.Parampath = projdir + "param.dat"

	if(!isExistFile(proj.Parampath)){
		DEBUG("[ERROR] Parameter file missing in git repository")
		DEBUG("[ERROR] Check "+ proj.Parampath)
		return
	}

	proj.isParamfile = true
}
