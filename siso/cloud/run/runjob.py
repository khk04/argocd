#!/usr/bin/env python3

import os
import pbs
import sys
import json

sys.path.append('/shared/opt/python-modules/')
from kafka import KafkaProducer
e = pbs.event()

job_id = e.job.id
job_vnode_chunks = e.job.exec_vnode.chunks
job_out_path = e.job.Output_Path
job_job_name = e.job.Job_Name
producer = KafkaProducer( 
	bootstrap_servers='10.0.0.5:31090',
        value_serializer=lambda m: m.encode('utf-8')
)
job_vnodes = []
for ck in job_vnode_chunks:
    job_vnodes.append(ck.vnode_name)
    
    

jd = {
        "cmd": "set_status",
        "job_id":job_id, 
        "out_path":str(job_out_path),
        "job_name":str(job_job_name),
        "job_state":"job_run",
        }
json_data = json.dumps(jd)
producer.send('hpc_job_log',value=json_data)

producer.close()
