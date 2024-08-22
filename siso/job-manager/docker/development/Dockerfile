FROM golang:1.20.0

RUN apt-get update && apt-get install -y curl wget sudo

# Set Go environment variables
ENV PATH="/usr/local/go/bin:${PATH}"

RUN apt-get update

# set locale ko_KR
RUN apt-get update && apt-get install -y locales
RUN dpkg-reconfigure locales
RUN locale-gen C.UTF-8
RUN /usr/sbin/update-locale LANG=C.UTF-8

# Install needed default locale for Makefly
RUN echo 'ko_KR.UTF-8 UTF-8' | tee --append /etc/locale.gen
RUN locale-gen

# Set default locale for the environment
ENV LC_ALL C.UTF-8
ENV LANG ko_KR.UTF-8
ENV LANGUAGE ko_KR.UTF-8

# create golang user , UID/GID 1000
RUN adduser --shell /bin/bash --disabled-password --gecos '' golang
RUN adduser golang sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
RUN chown -R golang $(go env GOROOT)/pkg

USER golang

WORKDIR /work

ENV GOPATH /work
ENV GOBIN $GOPATH/bin
ENV PATH $PATH:$GOBIN
ENV GO111MODULE 'on'
ENV GOCACHE /work/.cache/

CMD	bash
