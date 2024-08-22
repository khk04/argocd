package main

import (
	"github.com/IBM/sarama"

	// "os"
)


func createConsumer(brokerList []string) (sarama.Consumer, error) {
	// Kafka consumer 구성 설정
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true

	// Kafka consumer 생성
	consumer, err := sarama.NewConsumer(brokerList, config)
	if err != nil {
		return nil, err
	}

	return consumer, nil
}




