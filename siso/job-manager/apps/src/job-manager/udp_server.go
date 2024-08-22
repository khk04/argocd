package main



import (
	"net"
	"log"
	"strings"
)
var udplistenport = ":35000"





func OpenudpServ(recvdata chan string){
	buffer := make([]byte, 1024)
	s, err := net.ResolveUDPAddr("udp4", udplistenport)
	if err != nil {
		log.Println(err)
		return
	}
	connection, err := net.ListenUDP("udp4", s)
	if err != nil {
		log.Println(err)
		return
	}
	defer connection.Close()

	for {
		n, addr, err := connection.ReadFromUDP(buffer)
		if err != nil {
			log.Println(err)
			return
		}
		DEBUG("[" + addr.String() + "]" + "rxdata : " + string(buffer))
		var rxdata string = string(buffer)


		recvdata <- rxdata

		if strings.TrimSpace(string(buffer[0:n])) == "STOP" {
			log.Println("Exiting UDP server!")
			return
		}

		buffer = make([]byte, 1024)
	}
}

