import json
import httpx 
import redis


def get_job_list(data):
    external_url = "https://opensearch-cluster-master.elk:9200/pbs-job-state*/_search"
    request_data ={
        "size": 1000, 
        "_source": "job_name", 
        "sort": [
            { "@timestamp": { "order": "desc" } }
        ],
        "query": {
            "bool": {
            "must": [
                {
                "term": { "user_name": data.get("data") }
                },
                {
                "range": {
                    "@timestamp": {
                    "gte": "now-1M/M",
                    "lte": "now/M"
                    }
                }
                },
                {
                "bool": {
                    "should": [
                    { "term": { "flow_state": "job_end" } }
                    ],
                    "minimum_should_match": 1
                }
                }
            ]
            }
        }
    }
    client = httpx.Client(verify=False, auth=('admin', 'Juxtagene1!'))

    response = client.post(external_url, json=request_data)

    return_data = []
    response_json = response.json()
    #response_json = job_list_data

    search_results = response_json["hits"]["hits"]
    for result in search_results:
        try:
            job_name = result['_source']['job_name']
        except:
            continue
        return_data.append({"name": job_name})

    return return_data

def get_job_info(data):
    redis_client = redis.StrictRedis(host='job-redis-headless.redis', port=6379, db=0)
    # 데이터를 담을 딕셔너리 초기화
    jobname = data.get('data')
    try:
        value_str = redis_client.get(jobname).decode('utf-8')
    except:
        value_str = "E1"

# # 문자열로 만들어 출력 또는 다른 용도로 사용
    jsondata = json.loads(value_str)

    return jsondata




