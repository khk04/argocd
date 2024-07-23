FROM python:3.9

WORKDIR /app

RUN apt update
# RUN apt install -y 

# add mac USER (501)
# RUN useradd -ms /bin/bash mac
# RUN usermod -u 501 mac
# RUN mkdir -p /home/mac/

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app /app

# RUN chmod 0400 /app/azure-ssh-key/id_rsa

EXPOSE 8000
CMD [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000" ]
