#!/usr/bin/env python3

import os
import pbs
import sys
import json

sys.path.append('/shared/opt/python-modules/')
from kafka import KafkaProducer
#
e = pbs.event()
job_id = e.job.id
job_cpu = e.job.resources_used.cpupercent
job_mem = e.job.resources_used.mem
job_vmem = e.job.resources_used.vmem
job_cput = e.job.resources_used.cput
job_ncpus = e.job.resources_used.ncpus
job_out_path = e.job.Output_Path
job_job_name = e.job.Job_Name
job_owner_name = e.job.Job_Owner


###
outfile = "/var/spool/pbs/spool/"+ str(job_id) + ".OU"
#try:
producer = KafkaProducer( 
 	bootstrap_servers='10.0.0.5:31090',
            value_serializer=lambda m: m.encode('utf-8')
)
try:
    f = open(outfile,'r')
    log = f.readlines()
except:
    log = ""
    #jd = {"id":job_id, "out_path":str(job_out_path),"job_name":str(job_job_name),"owner_name":str(job_owner_name),"logs":log}
jd = {
        "cmd":"set_status",
        "job_id":job_id, 
        "out_path":str(job_out_path),
        "job_name":str(job_job_name),
        "owner_name":str(job_owner_name),
        "job_state":"job_end"
        }
    
json_data = json.dumps(jd)
   
producer.send('hpc_job_log',value=json_data)


producer.close()

