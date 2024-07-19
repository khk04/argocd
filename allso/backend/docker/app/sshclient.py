import logging
import paramiko
import time

logging.basicConfig(level=logging.WARNING, format='%(asctime)s [%(levelname)s] %(message)s')
logging.debug('This is a debug message')

class SshClient:

    def __init__(self, host_ip, username, password):
        self.host_ip = host_ip
        self.username =  username
        self.password =  password

    def open(self):
        self.sshclient = paramiko.SSHClient()
        self.sshclient.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        if self.password == "":
            key = paramiko.RSAKey.from_private_key_file('/app/ssh-key/id_rsa')
            self.sshclient.connect(self.host_ip, username=self.username, pkey=key)
        else:
            self.sshclient.load_system_host_keys()
            self.sshclient.connect(self.host_ip, username=self.username, password=self.password)
        self.shell = self.sshclient.invoke_shell(term='xterm')
        self.shell.settimeout(9999)

        logging.debug("ssh " + self.username + "@" + self.host_ip + " connected.")
        logging.debug("self.sshclent id = ", id(self))
        time.sleep(0.5)

        return self

    def on_message(self, command):
        logging.debug("CALL on_message() command = " , command)

        self.shell.send(command + "\n")
        time.sleep(0.4)
        output = self.shell.recv(65535).decode("utf-8")
        return output

    def get_message(self):
        output = self.shell.recv(65535).decode("utf-8")
        return output

    def on_close(self):
        logging.debug("ssh connection closed.")
        logging.debug("self.sshclent id = ", id(self))
        self.sshclient.close()

    def check_origin(self, origin):
        return True

def sshShellOpen1():
    logging.debug("ssh shell open")

    host_ip = "10.10.120.3"
    username = "insilico"
    password = "qwer1234"

    ssh_client = SshClient(host_ip, username, password)
    data = ssh_client.open()
    return data

def sshShell1(sshshell, command):
    logging.debug("ssh shell command = ", command)
    data_string = sshshell.on_message(command)
    logging.debug("data_string = ", data_string)
    return data_string

def sshShellRecv1(sshshell):
    logging.debug("CALL sshShellRecv() !!!")
    data_string = sshshell.get_message()
    return data_string

def sshShellOpen2():
    logging.debug("ssh shell open")
    host_ip = "10.10.120.2"
    # username = "cloud-user"
    username = "insilico"
    password = "qwer1234"

    ssh_client = SshClient(host_ip, username, password)
    data = ssh_client.open()
    return data

def sshShell2(sshshell, command):
    logging.debug("ssh shell command = ", command)
    data_string = sshshell.on_message(command)
    logging.debug("data_string = ", data_string)
    return data_string

def sshShellOpen3():
    logging.debug("ssh shell open")

    host_ip = "10.48.120.1"
    username = "root"
    password = "cmdefault"

    ssh_client = SshClient(host_ip, username, password)
    data = ssh_client.open()
    return data

def sshShell3(sshshell, command):
    logging.debug("ssh shell command = ", command)
    data_string = sshshell.on_message(command)
    logging.debug("data_string = ", data_string)
    return data_string

def sshShellOpen4():
    logging.debug("ssh shell open")

    host_ip = "10.48.120.2"
    username = "root"
    password = "cmdefault"

    ssh_client = SshClient(host_ip, username, password)
    data = ssh_client.open()
    return data

def sshShell4(sshshell, command):
    logging.debug("ssh shell command = ", command)
    data_string = sshshell.on_message(command)
    logging.debug("data_string = ", data_string)
    return data_string
