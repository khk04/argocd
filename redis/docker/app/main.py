# main.py
from job_kafka import KafkaJobConsumer
from job_redis import RedisPublisher
import datetime
from sg_logger import *



def main():
    debug_log("main called.")
    redis_publisher = RedisPublisher('config/config.ini')
    kafka_consumer = KafkaJobConsumer('config/config.ini',redis_publisher)


    try:
        kafka_consumer.consume_messages()
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()
