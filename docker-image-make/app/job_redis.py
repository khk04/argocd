# job_redis.py
import redis
from configparser import ConfigParser
from sg_logger import *

class RedisPublisher:
    def __init__(self, config_file):
        config = ConfigParser()
        config.read(config_file)
        
        redis_config = config['redis']
        host = redis_config['host']
        port = int(redis_config['port'])

        self.redis_client = redis.StrictRedis(host=host, port=port, decode_responses=True)

    def publish_message(self, key, value):
        self.redis_client.set(key, value)
        
    def get_value(self, key):
        value = self.redis_client.get(key)
        debug_log(f"redis get value. key : {key} val: {value}")
        return value
