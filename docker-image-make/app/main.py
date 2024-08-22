# main.py
#from job_kafka import KafkaJobConsumer
#from job_redis import RedisPublisher
import time
from datetime import datetime
from sg_logger import *
import sys

def info_log(logstr):
    logger = get_logger(__file__)
    logger.info(logstr)
def progress_log(logstr):
    logger = get_progress_logger(__file__)
    logger.log(15,logstr)
    sys.stdout.flush()



def print_time_for_ten_seconds():
    num = 180
    for i in range(num):
        now = datetime.now()
        info_log(now.strftime("%Y-%m-%d %H:%M:%S"))
        progress_log(str(i/num*100))
        time.sleep(1)



def main():
    #debug_log("main called.")
    print("okay")
    #redis_publisher = RedisPublisher('config/config.ini')
    #kafka_consumer = KafkaJobConsumer('config/config.ini',redis_publisher)
    print_time_for_ten_seconds()

    progress_log(str(100.00))

    #try:
    #    kafka_consumer.consume_messages()
    #except KeyboardInterrupt:
    #    pass

if __name__ == "__main__":
    main()
