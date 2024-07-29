package main

import (
	"github.com/go-redis/redis/v8"
	"context"
	"encoding/json"
	"time"
	"bytes"
)



func creatRedisClient()*redis.Client{
	// Redis 클라이언트 생성
	client := redis.NewClient(&redis.Options{
		Addr:     redis_endpoint, // Redis 서버 주소
		Password: "",               // Redis 접속 비밀번호 (없을 경우 빈 문자열)
		DB:       0,                // 사용할 Redis 데이터베이스 번호
	})
	return client
}

func updateJobID(proj *Project, job_id string){
	proj.Job_ID = job_id
	newValue, err2 := json.Marshal(proj)
	if err2 != nil {
		DEBUG(err2)
	}

	rediscli := creatRedisClient() 
	DEBUG("[rediscli] newValue : "+string(newValue))
	rediscli.Close()
}


func updateJobStatus(proj *Project, state string){
	proj.Flowstate = state

	switch state{	
		case "job_ready" :
			proj.State1 = time.Now().Format("06-01-02-15:04:05")
		case "job_queued":
			proj.State2 = time.Now().Format("06-01-02-15:04:05")
		case "job_running":
			proj.State3 = time.Now().Format("06-01-02-15:04:05")
		case "job_done":
			proj.State4 = time.Now().Format("06-01-02-15:04:05")
		case "job_end":
			proj.State5 = time.Now().Format("06-01-02-15:04:05")
	}
	_, err2 := json.Marshal(proj)
	if err2 != nil {
		DEBUG(err2)
	}
}

func getJobinfo(Job_name string,proj *Project) error {
	rediscli := creatRedisClient()
	val, err := rediscli.Get(context.Background(), Job_name).Result()
	if err != nil {
		DEBUG("데이터 조회 실패:", err)
		return err
	}
	err = json.Unmarshal([]byte(val), &proj)
	if err != nil {
		DEBUG(err)
	}
	var prettyJSON bytes.Buffer
	_ = json.Indent(&prettyJSON, []byte(val), "", "  ")
	DEBUG("조회된 데이터:", prettyJSON.String())
	return nil
}

func getusername(kafkamsg string,jobname string)string{
	rediscli := creatRedisClient()
	val, err := rediscli.Get(context.Background(), jobname).Result()
	if err != nil {
		DEBUG("데이터 조회 실패:", err)
	}

	username := Jsonstrdataparser(val,"user")
	return username

}

func getRedisData(jobname string,key string)string{
	rediscli := creatRedisClient()
	val, err := rediscli.Get(context.Background(), jobname).Result()
	if err != nil {
		DEBUG("데이터 조회 실패:", err)
	}

	data := Jsonstrdataparser(val,key)
	return data

}