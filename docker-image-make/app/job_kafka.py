# job_kafka.py
from confluent_kafka import Consumer
from configparser import ConfigParser
from job_redis import *
from sg_logger import *

class KafkaJobConsumer:
    def __init__(self, config_file, redis_publisher):
        config = ConfigParser()
        config.read(config_file)
        
        kafka_config = config['kafka']
        bootstrap_servers = kafka_config['bootstrap_servers']

        self.consumer = Consumer({
            'bootstrap.servers': bootstrap_servers,
            'group.id': 'redis-publish',
            'auto.offset.reset': 'earliest'
        })
        self.topic = kafka_config['topic']
        self.running = True
        self.redis_publisher = redis_publisher

    def _on_message(self, message):
        if message is None:
            return
        if message.error():
            debug_log(f"Error: {message.error()}")
        else:
            key = message.key().decode('utf-8')
            value = message.value().decode('utf-8')
            debug_log(f"Received message: {key}: {value}")
            self.redis_publisher.publish_message(key, value)
            self.redis_publisher.get_value(key)
            # Add your logic to handle the message here

    def consume_messages(self):
        try:
            self.consumer.subscribe([self.topic])
            while self.running:
                msg = self.consumer.poll(timeout=0.001)
                self._on_message(msg)
        except KeyboardInterrupt:
            pass
        finally:
            self.consumer.close()
