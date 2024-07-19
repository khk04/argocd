import logging
import paramiko
import jsons

logging.basicConfig(level=logging.WARNING, format='%(asctime)s [%(levelname)s] %(message)s')

def get_maas_info():

    host_ip = "10.10.101.71"
    username = "olaflogin00"
    password = "qwer1234"
    ssh_command = "echo qwer1234 | sudo -S maas insilico machines read"
    # ssh_command = "echo qwer1234 | sudo -S ls -al"

    data_string = ""
    json_object = {}
    return_data = []

    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(host_ip, username=username, password=password)
        
        logging.debug("ssh " + username + "@" + host_ip + " connected.")

        stdin, stdout, stderr = ssh.exec_command(ssh_command)
        lines = stdout.readlines()
        for i in lines:
            re = str(i).replace("\n", "")
            # logging.debug(re)
            data_string = data_string + re

        json_object = jsons.loads(data_string)
        # logging.debug(json_object)

        for node in json_object:
            data = {
              "hostname": node.get("hostname"),
              "cpu_count": node.get("cpu_count"),
              "storage": node.get("storage"),
              "hardware_info": node.get("hardware_info"),
              "memory": node.get("memory"),
              "ip_addresses": node.get("ip_addresses"),
            }
            return_data.append(data)

        ssh.close()

    except Exception as err:
        logging.warning(err)

    return return_data
