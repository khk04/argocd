FROM python:3.9

WORKDIR /app

RUN apt update
RUN apt install -y libsasl2-dev libldap2-dev libssl-dev kmod wget ceph-common
# RUN apt install -y 

# add mac USER (501)
# RUN useradd -ms /bin/bash mac
# RUN usermod -u 501 mac
# RUN mkdir -p /home/mac


COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

ENV DATABASE_URL postgresql://juxtagene:qwer1234@postgresql.biso:5432/api-db

COPY app /app
COPY configfile/ceph.conf /etc/ceph/ceph.conf
COPY configfile/ceph.client.admin.keyring /etc/ceph/ceph.client.admin.keyring
RUN chmod 600 /etc/ceph/ceph.client.admin.keyring
RUN chown root:root /etc/ceph/ceph.client.admin.keyring


RUN mkdir -p /app/userhome


EXPOSE 8000
CMD [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000" ]
