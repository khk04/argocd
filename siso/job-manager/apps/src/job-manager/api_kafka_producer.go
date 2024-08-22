package main

import (
	"encoding/json"
	"github.com/IBM/sarama"
)


// createKafkaProducer 함수는 Kafka Producer를 생성하고 초기화합니다.
func createKafkaProducer(brokerList []string) (sarama.AsyncProducer, error) {
	config := sarama.NewConfig()
	config.Producer.Return.Successes = true

	// AsyncProducer를 생성합니다.
	p, err := sarama.NewAsyncProducer(brokerList, config)
	if err != nil {
		return nil, err
	}

	// Successes 채널에서 성공적인 메시지 전송 결과를 처리합니다.
	go func() {
		for range p.Successes() {
			// 메시지가 성공적으로 전송되면 아무 작업도 수행하지 않습니다.
			//DEBUG("kafka msg produce done")
		}
	}()

	// Errors 채널에서 메시지 전송 에러를 처리합니다.
	go func() {
		for err := range p.Errors() {
			DEBUG("Failed to produce message: ",err)
		}
	}()

	return p, nil
}

// sendKafkaMessage 함수는 Kafka Producer를 이용하여 메시지를 전송합니다.
func sendKafkaMessage(topic string, msg string, key string) {
	message := &sarama.ProducerMessage{
		Topic: topic,
		Value: sarama.StringEncoder(msg),
	}

	if key != "" {
		message.Key = sarama.StringEncoder(key)
	}
	DEBUG("[sendKafkaMessage]msg produce to topic : "+topic+" key : "+key)
	// 메시지를 프로듀서에 보냅니다.
	producer.Input() <- message
}


func sendKafkaProject(topic string, proj *Project, key string) {
	msg, err := json.Marshal(proj)
	if err != nil {
		DEBUG("[sendKafkaProject] Project marshaling error!")
	}
	message := &sarama.ProducerMessage{
		Topic: topic,
		Value: sarama.StringEncoder(msg),
	}

	if key != "" {
		message.Key = sarama.StringEncoder(key)
	}
	DEBUG("[sendKafkaProject]msg produce to topic : "+topic+" key : "+key)
	// 메시지를 프로듀서에 보냅니다.
	producer.Input() <- message
}
