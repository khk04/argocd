from typing import Union

from fastapi import FastAPI, Depends, HTTPException, File, Response, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import httpx 
from kafka import KafkaProducer
from pydantic import BaseModel
import json
import redis
import random
from datetime import datetime

from LIB_user import *
from LIB_jobs import *
from LIB_registry import *
from LIB_database import *

app = FastAPI()

origins = [
    "http://localhost:8080",
    "https://localhost:8080",
    "https://az.miso.juxtagene.com",
    "http://az.miso.juxtagene.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    username: str
    password: str

class CreateUserData(BaseModel):
    name: str
    admin: bool = False
    cpu: int
    node: int
    memory: int

class UpdateUserData(BaseModel):
    id: int
    name: str
    nickname: str
    admin: bool = False
    cpu: int
    node: int
    memory: int

class DeleteUserData(BaseModel):
    id: int
    name: str
    nickname: str
    admin: bool = False
    cpu: int
    node: int
    memory: int

class CreateJobData(BaseModel):
    job_name: str
    user_name: str
    cpu: int
    node: int
    memory: int
    image: str
    job_state: str
    file_count: int
    file_name1: str
    file_name2: str
    file_name3: str
    job_control: str

class UpdateJobData(BaseModel):
    id: int
    job_name: str
    user_name: str
    cpu: int
    node: int
    memory: int
    image: str
    job_state: str
    file_name1: str
    file_name2: str
    file_name3: str
    job_control: str

class DeleteJobData(BaseModel):
    id: int

class FileListData(BaseModel):
    directorypath: str

class DownloadFiletData(BaseModel):
    filePath: str
    fileName: str
    fileType: str

@app.get("/")
def read_root():
    return {"juxtagene": "backend api server"}

@app.post("/login")
async def create_item(user: User, db=Depends(get_db)):
    result = login(user, db)
    return result

@app.get("/user-images")
async def get_images(username: Union[str, None] = None):
    result = get_user_iamges(username)
    return result

@app.post("/process")
async def process_json(data: dict):
    # 수신한 JSON 데이터 처리 로직
    result = {
        "message": "JSON received successfully",
        "data": data
    }
    return result


@app.post("/kafka")
async def send_to_kafka_topic(data: dict):
    bootstrap_servers = 'kafka.kafka:9092'


    data = data.get("data")

    print(json.dumps(data, indent=4, ensure_ascii=False))

    # JSON 결과에서 topic_name 필드 파싱
    topic_name = data.get("job_control")
    if topic_name is None:
        topic_name = "default"

    # KafkaProducer 인스턴스 생성
    producer = KafkaProducer(bootstrap_servers=bootstrap_servers)

    message = json.dumps(data).encode('utf-8')

    # 메시지 전송
    producer.send(topic_name, value=message)

    # KafkaProducer 인스턴스 종료
    producer.close()
    
    result = {
        "message": "JSON received successfully",
        "data": message
    }

    return result


# @app.post("/kafka")
# async def send_to_kafka_topic(data: dict):
#     bootstrap_servers = 'kafka.kafka:9092'

#     # JSON 결과에서 topic_name 필드 파싱
#     topic_name = data.get("topic_name")

#     # if topic_name is null 
#     if topic_name is None:
#         topic_name = "default"

#     # KafkaProducer 인스턴스 생성
#     producer = KafkaProducer(bootstrap_servers=bootstrap_servers)

#     message = json.dumps(data).encode('utf-8')

#     # 메시지 전송
#     producer.send(topic_name, value=message)

#     # KafkaProducer 인스턴스 종료
#     producer.close()
    
#     result = {
#         "message": "JSON received successfully",
#         "data": message
#     }

#     return result


@app.post("/execlog")
async def send_to_elasticsearch(data: dict):
    # 외부 URL

    log_data=''
    search_results=''
    external_url = "https://opensearch-cluster-master.elk:9200/pbs-job-exec*/_search"
    jobname= data.get('data')
    # print(data)
    request_data ={
        "sort": [ 
        { "@timestamp": { "order": "asc" } }
        ],
        "_source": ["log", "endlog","progress"],
        "size": 10000,
        "query": {
            "bool": {
            "must": {
                "match_phrase": {
                "job_name": jobname
                }
            },
            "filter": {
                "range": {
                "@timestamp": {
                    "gte": "2000-01-01T00:00:00"
                }
                }
            },
            "should": [
                {
                    "exists": {
                        "field": "log"
                    }
                },
                {
                    "exists": {
                        "field": "endlog"
                    }
                }
            ]
            }
        }
    } 
    # HTTP POST 요청을 보내고 응답을 받습니다.
    async with httpx.AsyncClient(verify=False, auth=('admin', 'Juxtagene1!')) as client:
        response = await client.post(external_url, json=request_data)


    response_json = response.json()
    # 응답 JSON 데이터에서 검색 결과를 가져오기
    search_results = response_json['hits']['hits']


    # 각 검색 결과에 접근하며 'log' 키의 값을 출력
    for result in search_results:
        if 'log' not in result['_source']:
            try:
                log_data = log_data + result['_source']['endlog']
            except KeyError:
                log_data = "there are no log data" + "\n"
        else:
            log_data = log_data + result['_source']['log']
        if 'endlog' in result['_source']:
            log_data = result['_source']['endlog']
        progress = result['_source'].get('progress', None)
    log_data = log_data.replace("\n", "\n\r")
    # 응답을 반환합니다.
    return {"status_code": response.status_code, "content": log_data, "progress": progress}


@app.post("/jobstate")
async def get_redis_jobstate(data: dict):
    redis_client = redis.StrictRedis(host='redis-headless.redis', port=6379, db=0)
    current_time = datetime.now()
    formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S")
    state_list = ["job_summited","ready","job_queued","job_running","job_done","job_end"]
    # 데이터를 담을 딕셔너리 초기화

    jobname = data.get('data')
    try:
        value_str = redis_client.get(jobname).decode('utf-8')
    except:
        value_str = "E1"

# # 문자열로 만들어 출력 또는 다른 용도로 사용
    jsondata = json.loads(value_str)
    job_state = jsondata.get("flow_state")
    # job_state2 = {
    #     state_list[0]: jsondata.get("job_summited"),
    #     state_list[1]: jsondata.get("job_ready"),
    #     state_list[2]: jsondata.get("job_queued"),
    #     state_list[3]: jsondata.get("job_running"),
    #     state_list[4]: jsondata.get("job_done"),
    #     state_list[5]: jsondata.get("job_end")
    # }
    return {"timestamp":formatted_time,"content": job_state}


@app.post("/joblist")
async def job_list(data: dict):
    job_list = get_job_list(data)
    return job_list

@app.post("/jobinfo")
async def job_info(data: dict):
    job_info = get_job_info(data)
    return job_info

@app.post("/users")
async def create_dev_user(user: CreateUserData, db=Depends(get_db)):
    new_dev_user = DevUser(name=user.name, nickname=user.name, admin=user.admin, cpu=user.cpu, node=user.node, memory=user.memory)
    db.add(new_dev_user)
    db.commit()
    db.refresh(new_dev_user)
    return new_dev_user

@app.get("/users/all")
async def read_dev_user(db=Depends(get_db)):
    dev_users = db.query(DevUser).all()   
    if dev_users is None:
        raise HTTPException(status_code=404, detail="DevUser not found")
    return dev_users

@app.get("/users/{dev_user_name}")
async def read_dev_user(dev_user_name: str, db=Depends(get_db)):
    dev_user = db.query(DevUser).filter(DevUser.name == dev_user_name).first()
    if dev_user is None:
        raise HTTPException(status_code=404, detail="DevUser not found")
    return dev_user

@app.post("/users/update")
async def update_dev_user(user: UpdateUserData, db=Depends(get_db)):
    dev_user = db.query(DevUser).filter(DevUser.id == user.id).first()
    if dev_user is None:
        raise HTTPException(status_code=404, detail="DevUser not found")
    if user.name is not None:
        dev_user.name = user.name
    if user.admin is not None:
        dev_user.admin = user.admin
    if user.nickname is not None:
        dev_user.nickname = user.nickname
    if user.cpu is not None:
        dev_user.cpu = user.cpu
    if user.node is not None:
        dev_user.node = user.node
    if user.memory is not None:
        dev_user.memory = user.memory
    db.commit()
    db.refresh(dev_user)
    return dev_user

@app.post("/users/delete")
async def delete_dev_user(user: DeleteUserData,  db=Depends(get_db)):
    dev_user = db.query(DevUser).filter(DevUser.id == user.id).first()
    if dev_user is None:
        raise HTTPException(status_code=404, detail="DevUser not found")

    db.delete(dev_user)
    db.commit()

@app.post("/ready-jobs")
async def create_ready_job(job: CreateJobData, db=Depends(get_db)):
    directory_path_in = Path(f"/app/userhome/tmp/{job.job_name}/in")
    if not directory_path_in.exists():
        directory_path_in.mkdir(parents=True, exist_ok=True, mode=0o777)
        print(f"디렉터리가 생성되었습니다: {directory_path_in}")
    else:
        print(f"디렉터리가 이미 존재합니다: {directory_path_in}")

    directory_path_out = Path(f"/app/userhome/tmp/{job.job_name}/out")
    if not directory_path_out.exists():
        directory_path_out.mkdir(parents=True, exist_ok=True, mode=0o777)
        print(f"디렉터리가 생성되었습니다: {directory_path_out}")
    else:
        print(f"디렉터리가 이미 존재합니다: {directory_path_out}")

    new_ready_job = ReadyJob(job_name=job.job_name, user_name=job.user_name, cpu=job.cpu, memory=job.memory, image=job.image, job_state=job.job_state, file_count=job.file_count, file_name1=job.file_name1, file_name2=job.file_name2, file_name3=job.file_name3, job_control=job.job_control)
    db.add(new_ready_job)
    db.commit()
    db.refresh(new_ready_job)
    return new_ready_job

@app.get("/ready-jobs/name/{dev_user}")
async def read_dev_user(dev_user: str, db=Depends(get_db)):
    ready_jobs = db.query(ReadyJob).filter(ReadyJob.user_name == dev_user).filter(ReadyJob.job_state == "ready").all()
    if ready_jobs is None:
        raise HTTPException(status_code=404, detail="ReadyJob not found")
    return ready_jobs

@app.get("/ready-jobs/{ready_job_name}")
async def read_ready_job(ready_job_name: str, db=Depends(get_db)):
    ready_job = db.query(ReadyJob).filter(ReadyJob.job_name == ready_job_name).first()
    if ready_job is None:
        raise HTTPException(status_code=404, detail="ReadyJob not found")
    return ready_job

@app.post("/ready-jobs/update")
async def update_ready_job(job: UpdateJobData, db=Depends(get_db)):
    ready_job = db.query(ReadyJob).filter(ReadyJob.id == job.id).first()
    if ready_job is None:
        raise HTTPException(status_code=404, detail="ReadyJob not found")
    if ready_job.job_name is not None:
        ready_job.job_name = job.job_name
    if ready_job.user_name is not None:
        ready_job.user_name = job.user_name
    if ready_job.cpu is not None:
        ready_job.cpu = job.cpu
    if ready_job.memory is not None:
        ready_job.memory = job.memory
    if ready_job.image is not None:
        ready_job.image = job.image
    if ready_job.job_state is not None:
        ready_job.job_state = job.job_state
    if ready_job.file_name1 is not None:
        ready_job.file_name1 = job.file_name1
    if ready_job.file_name2 is not None:
        ready_job.file_name2 = job.file_name2
    if ready_job.file_name3 is not None:
        ready_job.file_name3 = job.file_name3
    if ready_job.job_control is not None:
        ready_job.job_control = job.job_control
        
    db.commit()
    db.refresh(ready_job)
    return ready_job

@app.post("/ready-jobs/delete")
async def delete_ready_job(job: DeleteJobData,  db=Depends(get_db)):
    ready_job = db.query(ReadyJob).filter(ReadyJob.id == job.id).first()
    if ready_job is None:
        raise HTTPException(status_code=404, detail="ReadyJob not found")

    db.delete(ready_job)
    db.commit()

@app.get("/run-jobs/name/{dev_user}")
async def read_dev_user(dev_user: str, db=Depends(get_db)):
    run_jobs = db.query(ReadyJob).filter(ReadyJob.user_name == dev_user).filter(ReadyJob.job_state == "run").all()
    if run_jobs is None:
        raise HTTPException(status_code=404, detail="ReadyJob not found")
    return run_jobs

@app.get("/run-jobs/{run_job_name}")
async def read_run_job(run_job_name: str, db=Depends(get_db)):
    run_job = db.query(ReadyJob).filter(ReadyJob.job_name == run_job_name).first()
    if run_job is None:
        raise HTTPException(status_code=404, detail="ReadyJob not found")
    return run_job

@app.post("/run-jobs/delete")
async def delete_run_job(job: DeleteJobData,  db=Depends(get_db)):
    run_job = db.query(ReadyJob).filter(ReadyJob.id == job.id).first()
    if run_job is None:
        raise HTTPException(status_code=404, detail="ReadyJob not found")

    db.delete(run_job)
    db.commit()

@app.post("/filelist")
async def download_file_list(path: FileListData, response: Response):
    
    folder = Path(f"{path.directorypath}")
    if not folder.is_dir():
        return JSONResponse(content={"error": "폴더가 존재하지 않습니다."}, status_code=404)

    file_list = []

    files = os.listdir(folder)
    for file_name in files:
        file_path = os.path.join(folder, file_name)
        if os.path.isfile(file_path):
            file_list.append({'name': file_name, 'type': 'file'})
        if os.path.isdir(file_path):
            file_list.append({'name': file_name, 'type': 'dir'})

    return {"folder": str(folder), "files": file_list}


@app.post("/filecount")
async def upload_file_count(path: FileListData, response: Response):
    
    folder = Path(f"{path.directorypath}")
    if not folder.is_dir():
        return JSONResponse(content={"error": "폴더가 존재하지 않습니다."}, status_code=404)

    file_count = 0

    files = os.listdir(folder)
    for file_name in files:
        file_path = os.path.join(folder, file_name)
        if os.path.isfile(file_path):
            file_count += 1


    return {"folder": str(folder), "file_count": file_count}

# @app.post("/filelist/")
# async def download_file_list(path: FileListData, response: Response):
#     return {"folder": "", "files": []}

@app.post("/upload")
async def file_uploadfile(file: UploadFile = File(...), job_name: str = File(...)):
    directory_path_in = Path(f"/app/userhome/tmp/{job_name}/in")
    if not directory_path_in.exists():
        directory_path_in.mkdir(parents=True, exist_ok=True, mode=0o777)
        print(f"디렉터리가 생성되었습니다: {directory_path_in}")
    else:
        print(f"디렉터리가 이미 존재합니다: {directory_path_in}")

    directory_path_out = Path(f"/app/userhome/tmp/{job_name}/out")
    if not directory_path_out.exists():
        directory_path_out.mkdir(parents=True, exist_ok=True, mode=0o777)
        print(f"디렉터리가 생성되었습니다: {directory_path_out}")
    else:
        print(f"디렉터리가 이미 존재합니다: {directory_path_out}")

    with open(f"{directory_path_in}/{file.filename}", "wb") as f:
        f.write(file.file.read())
    return {"filename": file.filename}

@app.post("/downloadfile")
async def download_file(fileInfo: DownloadFiletData, response: Response):
    print("download_file")
    print(fileInfo)
    file_path = Path(f"{fileInfo.filePath}/{fileInfo.fileName}")  # Change this path based on your file storage location
    print(file_path)
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path, filename=fileInfo.fileName)
