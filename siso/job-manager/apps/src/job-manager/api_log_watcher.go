package main

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"os"
	"time"
	"encoding/json"
	"bufio"
	"strings"
	"io"
	"io/ioutil"
	"regexp"
	"strconv"
)


func start_logwatcher(job_id string, job_name string, userName string) {
	currentTime := time.Now().UTC()
	iso8601Time := currentTime.Format("2006-01-02T15:04:05.999Z")
	filename := "/shared/home/juxtagene/result/"+job_name+".log"
	progressPercent := 0.0

	retryInterval := 10 * time.Millisecond // 0.01초 간격으로 재시도
	maxDuration := 2 * time.Second   // 최대 3초 동안 재시도

	startTime := time.Now()
	var file *os.File
	var err error

	for {
		file, err = os.Open(filename)
		if err == nil {
			// 파일을 성공적으로 오픈함
			fmt.Println("File opened successfully:", file.Name())
			defer file.Close()
			break
		}
		// 파일 오픈 실패
		if time.Since(startTime) > maxDuration {
			// 최대 재시도 시간을 초과함
			fmt.Println("Failed to open file within", maxDuration)
			return
		}
		// 재시도 대기
		time.Sleep(retryInterval)
		//fmt.Println("Retrying...")
	}

	currentHash, err := calculateMD5(filename)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	// 파일의 끝까지 이동
	file.Seek(0, io.SeekEnd)

	for {
		time.Sleep(1 * time.Second)
		newHash, err := calculateMD5(filename)
		if err != nil {
			DEBUG("[logwatcher] DEBUG watcher 종료")
			break;
		}

		if !bytesEqual(currentHash, newHash) {
			// 로그 상의 변경된 부분을 읽어와서 출력
			rawlog, err := io.ReadAll(file)
			if err != nil {
				DEBUG("[printLastLine]파일 처리 에러:", err)
				return
			}

			joblog := string(rawlog)
			var parsedLines []string // 파싱되지 않은 라인들을 저장할 슬라이스

			lines := strings.Split(joblog,"\n")
			for _,line := range lines {
				re := regexp.MustCompile(`PROGRESS[^\d]*(\d+?\.?\d*)[^\d]*(\d+?\.\d*)`)
				matches := re.FindStringSubmatch(line)
				if len(matches) > 0 {
					var err error
					progressPercent,err = strconv.ParseFloat(matches[2], 64)
					if err != nil{
						progressPercent = 0
					}
				} else {
					parsedLines = append(parsedLines, line) // 파싱되지 않은 라인 추가
				}
			}
			joblog = strings.Join(parsedLines, "\n")

			data := map[string]interface{}{
				"@timestamp": []string{iso8601Time},
				"job_name"	:   job_name,
				"userName"	:  	userName,
				"progress"	: 	progressPercent,
				"log"		:   joblog,
			}
			jsonmsg, err := json.Marshal(data)
			if err != nil {
				fmt.Println("Error marshaling JSON:", err)
				return
			}
			sendKafkaMessage("job_tmp_log",string(jsonmsg),job_name)

			currentHash = newHash
		}
	}


}

// 파일의 해시 값을 계산하는 함수
func getFileHash(filePath string) (string, error) {
	// 파일 읽기
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	hash := md5.New()
	if _, err := io.Copy(hash, file); err != nil {
		return "", err
	}

	return hex.EncodeToString(hash.Sum(nil)), nil
}

func produce_endlog(job_id string, job_name string,user string,outPath string){
	filePath := "/shared/home/juxtagene/result/"+job_name+".log"
	fileContent, errfl := ioutil.ReadFile(filePath)
	if errfl != nil {
		DEBUG("파일을 읽는 동안 오류 발생:", errfl)
		return
	}

	// 파일 내용을 endlog 변수에 저장
	endlog := string(fileContent)
	var parsedLines []string // 파싱되지 않은 라인들을 저장할 슬라이스

	lines := strings.Split(endlog,"\n")
	for _,line := range lines {
		re := regexp.MustCompile(`PROGRESS`)
		matches := re.FindStringSubmatch(line)
		if len(matches) <= 0 {
			parsedLines = append(parsedLines, line) // 파싱되지 않은 라인 추가
		}
	}
	endlog = strings.Join(parsedLines, "\n")
	data := map[string]interface{}{
		"job_id" : 		job_id,
		"job_name":   	job_name,
		"user" : 		user,
		"progress" : 	100,
		"endlog":       endlog,
	}
	jsonmsg, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}
	sendKafkaMessage("job_tmp_log",string(jsonmsg),job_name)
}

func printLastLineFromFile(filePath string) (string, error) {
	// 파일이 존재하는지 확인
	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		DEBUG("파일이 존재하지 않습니다.")
		return "", err
	}

	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var lastLine string
	for scanner.Scan() {
		lastLine = scanner.Text()
	}

	if err := scanner.Err(); err != nil {
		return "", err
	}

	return strings.TrimSpace(lastLine), nil
}


func bytesEqual(a, b []byte) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func calculateMD5(filename string) ([]byte, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	hash := md5.New()
	_, err = io.Copy(hash, file)
	if err != nil {
		return nil, err
	}
	return hash.Sum(nil), nil
}