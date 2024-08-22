#!/usr/bin/env python3

import os
import pbs
import sys
import json

sys.path.append('/shared/opt/python-modules')
from kafka import KafkaProducer
#
e = pbs.event()

job_id = e.job.id
job_out_path = e.job.Output_Path
job_job_name = e.job.Job_Name

permissions = 0o655
log_file_path = "/var/spool/pbs/spool/"+job_id+".OU"
os.chmod(log_file_path, permissions)


jd = {
        "cmd":"set_status",
        "job_id":job_id, 
        "out_path":str(job_out_path),
        "job_name":str(job_job_name),
        "job_state":"job_launch"
        }

json_data = json.dumps(jd)
try:
    producerolaf = KafkaProducer(
        bootstrap_servers='10.0.0.5:31090',
                value_serializer=lambda m: m.encode('utf-8')
    )
    producerolaf.send('hpc_job_log',value=json_data)
    producerolaf.close()
except:
    print(" producer init fail olaf kafka broker")
