import logging
import paramiko
import math
import json
import inspect


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)

# qstat -ax
# 수행 작업 시간(누적), 수행 작업 수(누적)
# 현재 작업수 (수행중, 대기)


def get_pbs_qstat_demo():
    logging.debug("CALL get_pbs_qstat_demo() ")

    demo_data = [
        "Job ID          Username Queue    Jobname    SessID NDS TSK Memory Time  S Time"
        "--------------- -------- -------- ---------- ------ --- --- ------ ----- - -----"
        "20.geniemgmt00  root     workq    STDIN      162435   1   1    --    --  F 00:00"
        "21.geniemgmt00  hpe      workq    STDIN      162463   1   1    --    --  F 00:00"
        "22.geniemgmt00  hpe      workq    STDIN      163351   1   1    --    --  F 00:00"
        "24.geniemgmt00  hpe      workq    STDIN      163550   1   1    --    --  F 00:01"
        "25.geniemgmt00  hpe      workq    test       163849   1   1    --    --  F 00:00"
        "26.geniemgmt00  hpe      workq    DHKIM4     163942   3   3    --    --  F 00:00"
    ]

    return_data = []

    try:
        lines = demo_data
        for i in lines:
            line = str(i).replace("\n", "")
            index = line.find(".pbs")

            if index != -1:
                return_data.append(line.split())

    except Exception as err:
        logging.warning(err)

    return return_data


def get_pbs_qstat(cluster):
    logging.debug("CALL get_pbs_qstat(cluster) - ", cluster)

    if cluster == "cluster1":
        host_ip = "10.10.100.33"
        username = "juxtagene"
        ssh_command = "/opt/openpbs/bin/qstat -ax"

    if cluster == "cluster2":
        host_ip = "4.230.4.37"
        username = "cc-admin"
        ssh_command = "/opt/pbs/bin/qstat -ax"

    return_data = []

    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        if cluster == "cluster1":
            key = paramiko.RSAKey.from_private_key_file("/app/ssh-key/id_rsa")
            ssh.connect(host_ip, username=username, pkey=key)
            # ssh.connect(host_ip, username=username, pkey=key)

        if cluster == "cluster2":
            key = paramiko.RSAKey.from_private_key_file("/app/azure-ssh-key/id_rsa")
            # ssh.connect(host_ip, username=username, password=password)
            ssh.connect(host_ip, username=username, pkey=key)

        logging.debug("ssh" + username + "@" + host_ip + "connected.")

        stdin, stdout, stderr = ssh.exec_command(ssh_command)
        lines = stdout.readlines()
        add_flag = False
        for i in lines:
            line = str(i).replace("\n", "")
            if add_flag:
                return_data.append(line.split())

            index = line.find("---")
            if index != -1:
                add_flag = True

        ssh.close()

    except Exception as err:
        logging.warning(err)

    return return_data


# convert hours:minutes to seconds
def convert_time_to_seconds(time_string):
    hours, minutes = map(int, time_string.split(":"))
    return int(hours * 3600 + minutes * 60)

# convert secend to hours
def convert_seconds_to_hours(seconds):
    return seconds // 3600


def process_pbs_job_data(pbs_data):
    return_data = []

    # exmaple string  52.ip-0A00010A  cc-admin workq    240620_499   5886   1  30   10gb   --  R 00:01
    # ttime, tjobs, rjobs, ijobs, user_use, current_jobs = 0, 0, 0, 0, {}, []
    ttime = 0
    tjobs = 0
    rjobs = 0
    ijobs = 0
    user_use = {}
    current_jobs = []

    for job in pbs_data:
        # ttime
        if job[10] != "--":
            ttime += convert_time_to_seconds(job[10])

        # tjobs
        tjobs += 1

        # rjobs
        if job[9] == "R":
            rjobs += 1
            current_jobs.append(
                {"name": job[3], "user": job[1], "time": job[10], "state": "수행"}
            )

        # ijobs
        if job[9] == "Q":
            ijobs += 1
            current_jobs.append(
                {"name": job[3], "user": job[1], "time": job[10], "state": "대기"}
            )

        # user_use
        user = job[1]
        try:
            user_use[user] += 1
        except KeyError:
            user_use[user] = 1
        
    # ttime to hours
    ttime = convert_seconds_to_hours(ttime)


    return_data = {
        "ttime": ttime,
        "tjobs": tjobs,
        "rjobs": rjobs,
        "ijobs": ijobs,
        "user_use": user_use,
        "current_jobs": current_jobs,
    }

    logging.info("############### return_data ###############")
    logging.info(return_data)

    # print("ttime=", ttime)

    return return_data


def create_pbs_jobs_data(item, cluster):
    logging.debug("CALL create_pbs_jobs_data(item, cluster) - ", item, cluster)

    pbs_data = None
    return_data = []

    if item == "server":
        pbs_data = get_pbs_qstat(cluster)
    if item == "demo":
        pbs_data = get_pbs_qstat_demo()

    logging.info("############### pbs_data ###############")
    # logging.info(json.dumps(pbs_data, indent=4))

    return_data = process_pbs_job_data(pbs_data)
    if return_data is None:
        return_data = []

    return return_data


# pbsnodes -a
# 노드 활용 현황 (총 노드, 사용중인 노드, 대기 노드, 노드 사용률)
# 현재 CPU 사용, 현재 메모리 사용


def get_pbs_pbsnodes_demo():
    logging.debug("CALL get_pbs_pbsnodes_demo()")

    demo_data = [
        "node1\n",
        "Mom = node1\n",
        "ntype = cluster\n",
        "state = free\n",
        "np = 1\n",
        "properties = \n",
        "ntype = cluster\n",
        "status = opsys=linux,uname=Linux node1 3.10.0-1127.19.1.el7.x86_64 #1 SMP Tue Mar 31 23:16:55 UTC 2020 x86_64,arch=x86_64,host=node1,mem=16384000kb,ncpus=1,opsys=linux,physmem=16384000kb,vmem=16384000kb\n",
        "pcpus = 4\n",
        "jobs = 0/1\n",
        "resources_available.arch = linux\n",
        "resources_available.host = node1\n",
        "resources_available.mem = 16384000kb\n",
        "resources_available.ncpus = 4\n",
        "resources_available.opsys = linux\n",
        "resources_available.physmem = 16384000kb\n",
        "resources_available.vmem = 16384000kb\n",
        "resources_assigned.accelerator_memory = 0kb\n",
        "resources_assigned.hbmem = 0kb\n",
        "resources_assigned.mem = 0kb\n",
        "resources_assigned.naccelerators = 0\n",
        "resources_assigned.ncpus = 0\n",
        "resources_assigned.vmem = 0kb\n",
        "resv_enable = True\n",
        "sharing = default_shared\n",
        "last_state_change_time = Thu Apr  1 09:00:00 2021\n",
        "last_used_time = Thu Apr  1 09:00:00 2021\n",
        "node2\n",
        "Mom = node2\n",
        "ntype = cluster\n",
        "state = free\n",
        "np = 1\n",
        "properties = \n",
        "ntype = cluster\n",
        "status = opsys=linux,uname=Linux node1 3.10.0-1127.19.1.el7.x86_64 #1 SMP Tue Mar 31 23:16:55 UTC 2020 x86_64,arch=x86_64,host=node1,mem=16384000kb,ncpus=1,opsys=linux,physmem=16384000kb,vmem=16384000kb\n",
        "pcpus = 4\n",
        "jobs = 0/1\n",
        "resources_available.arch = linux\n",
        "resources_available.host = node1\n",
        "resources_available.mem = 16384000kb\n",
        "resources_available.ncpus = 4\n",
        "resources_available.opsys = linux\n",
        "resources_available.physmem = 16384000kb\n",
        "resources_available.vmem = 16384000kb\n",
        "resources_assigned.accelerator_memory = 0kb\n",
        "resources_assigned.hbmem = 0kb\n",
        "resources_assigned.mem = 0kb\n",
        "resources_assigned.naccelerators = 0\n",
        "resources_assigned.ncpus = 0\n",
        "resources_assigned.vmem = 0kb\n",
        "resv_enable = True\n",
        "sharing = default_shared\n",
        "last_state_change_time = Thu Apr  1 09:00:00 2021\n",
        "last_used_time = Thu Apr  1 09:00:00 2021\n",
    ]

    node_data = {}
    return_data = []
    try:
        lines = demo_data
        for i in lines:
            line = str(i).replace("\n", "")
            index = line.find(" = ")

            if index == -1:
                if node_data != {}:
                    return_data.append(node_data)
                    node_data = {}
            else:
                key = line[0:index].strip()
                value = line[index + 2 : len(line)].strip()
                node_data[key] = value.replace("kb", "")
        return_data.append(node_data)

    except Exception as err:
        logging.warning(err)

    return return_data


def get_pbs_pbsnodes(cluster):
    logging.debug("get_pbs_pbsnodes - cluster : " + cluster)

    if cluster == "cluster1":
        host_ip = "10.10.100.33"
        username = "juxtagene"
        ssh_command = "/opt/openpbs/bin/pbsnodes -a"

    if cluster == "cluster2":
        host_ip = "4.230.4.37"
        username = "cc-admin"
        ssh_command = "/opt/pbs/bin/pbsnodes -a"

    node_data = {}
    return_data = []

    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        if cluster == "cluster1":
            key = paramiko.RSAKey.from_private_key_file("/app/ssh-key/id_rsa")
            ssh.connect(host_ip, username=username, pkey=key)
            # ssh.connect(host_ip, username=username, password=password)

        if cluster == "cluster2":
            key = paramiko.RSAKey.from_private_key_file("/app/azure-ssh-key/id_rsa")
            # ssh.connect(host_ip, username=username, password=password)
            ssh.connect(host_ip, username=username, pkey=key)

        logging.debug("ssh" + username + "@" + host_ip + "connected.")

        stdin, stdout, stderr = ssh.exec_command(ssh_command)
        lines = stdout.readlines()
        for i in lines:
            line = str(i).replace("\n", "")
            index = line.find(" = ")

            if index == -1:
                if node_data != {}:
                    return_data.append(node_data)
                    node_data = {}
            else:
                key = line[0:index].strip()
                node_data[key] = line[index + 2 : len(line)].strip()
                # print(line)
        ssh.close()

    except Exception as err:
        logging.warning(err)

    return return_data


def process_pbs_data(pbs_data):
    return_data = []

    for node in pbs_data:
        # 할당된 메모리를 메가바이트 단위로 변환
        rmem = node.get("resources_assigned.mem", "0")
        rmem = convert_memory_to_mb(rmem)

        # 사용 가능한 메모리를 메가바이트 단위로 변환
        imem = node.get("resources_available.mem", "0")
        imem = convert_memory_to_mb(imem)

        # 노드 정보 구성
        node_object = {
            "name": node["Mom"][:15],
            "state": node["state"],
            "rmem": rmem,
            "imem": imem - rmem,
            "tcpus": int(node.get("pcpus", 0)),
            "rcpus": int(node.get("resources_assigned.ncpus", 0)),
            "icpus": int(node.get("resources_available.ncpus", 0))
            - int(node.get("resources_assigned.ncpus", 0)),
        }
        return_data.append(node_object)

    return return_data


def convert_memory_to_mb(memory_str):
    if memory_str == "0":
        return 0
    else:
        memory_value = int(memory_str.replace("kb", "").replace("mb", ""))
        if "kb" in memory_str:
            return math.floor(memory_value / 1024)
        else:
            return memory_value


def convert_memory_to_mb(memory_str):
    if memory_str == "0":
        return 0
    else:
        memory_value = int(
            memory_str[:-2]
        )  # 마지막 2글자("kb", "mb", "gb") 제외한 부분을 정수로 변환
        if memory_str.endswith("kb"):
            return math.floor(memory_value / 1024)
        elif memory_str.endswith("mb"):
            return memory_value
        elif memory_str.endswith("gb") or memory_str.endswith(
            "ga"
        ):  # "gb" 또는 "ga"로 끝나는 경우
            return memory_value * 1024  # GB를 메가바이트로 변환하여 반환
        else:
            return 0  # "kb", "mb", "gb", "ga"로 끝나지 않는 경우에는 0을 반환하거나 다른 처리를 수행할 수 있습니다.


def create_pbs_nodes_data(item, cluster):
    logging.debug("create_pbs_nodes_data - cluster : " + cluster)

    pbs_data = None
    return_data = []

    if item == "server":
        pbs_data = get_pbs_pbsnodes(cluster)
    if item == "demo":
        pbs_data = get_pbs_pbsnodes_demo()

    caller_func_name = inspect.stack()[1].function
    log_msg = f"{caller_func_name} - {json.dumps(pbs_data, indent=4)}"
    # logging.info(log_msg)

    return_data = process_pbs_data(pbs_data)

    logging.info("############### return_data ###############")
    logging.info(return_data)

    return return_data
