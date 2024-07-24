from functools import wraps
import logging
from inspect import getframeinfo, stack
from enum import Enum



class color(Enum):
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    OKYELLOW = '\033[33m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def debug_log(logstr):
    logger = get_logger(__file__)
    logger.debug(logstr)

def get_logger(file_name):
    logger = logging.Logger(file_name)
    logger.setLevel(logging.DEBUG)
    file_handler = logging.FileHandler(f"{file_name.split('.')[0]}.log")
    stream_handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s]  %(levelname)s  %(message)s")
    color_formatter = logging.Formatter(f"{color.OKGREEN.value}[%(asctime)s]{color.ENDC.value}  {color.OKCYAN.value}%(levelname)s{color.ENDC.value}  %(message)s")
    file_handler.setFormatter(formatter)
    stream_handler.setFormatter(color_formatter)
    logger.addHandler(file_handler)
    logger.addHandler(stream_handler)
    return logger

def get_progress_logger(file_name):
    PROGRESS = 15
    logging.addLevelName(PROGRESS, "PROGRESS")
    logger = logging.Logger(file_name)
    logger.setLevel(PROGRESS)    
    file_handler = logging.FileHandler(f"{file_name.split('.')[0]}.log")
    stream_handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s]  %(levelname)s  %(message)s")
    color_formatter = logging.Formatter(f"{color.OKGREEN.value}[%(asctime)s]{color.BOLD.value}  {color.OKYELLOW.value}%(levelname)s{color.ENDC.value}  %(message)s")
    file_handler.setFormatter(formatter)
    stream_handler.setFormatter(color_formatter)
    logger.addHandler(file_handler)
    logger.addHandler(stream_handler)
    return logger

def my_logger(original_function):
    @wraps(original_function)
    def wrapper(*args, **kwargs):
        py_file_caller = getframeinfo(stack()[1][0])
        file_name = py_file_caller.filename.split("/")[-1].split(".")[0]
        code_context = py_file_caller.code_context[0].split("=")[-1].split("(")[0].strip()
        logger = get_logger(file_name)
        logger.debug(f'Start "<{code_context}>" Arguments: {args}, kwargs - {kwargs}')
        try:
            res = original_function(*args, **kwargs)
            logger.debug(f'End   "<{code_context}>" Returns: {res}')
            return res
        except Exception as e:
            logger.error(f'{e}\n\tfilename: {py_file_caller.filename}\n\tlinenum: {py_file_caller.lineno}\n\tcontext: {py_file_caller.code_context}')
            raise
    return wrapper

def sg_progress_logger(original_function):
    @wraps(original_function)
    def wrapper(*args, **kwargs):
        py_file_caller = getframeinfo(stack()[1][0])
        file_name = py_file_caller.filename.split("/")[-1].split(".")[0]
        code_context = py_file_caller.code_context[0].split("=")[-1].split("(")[0].strip()
        logger = get_progress_logger(file_name)
        PROGRESS=15
        logger.log(PROGRESS,f'[progress] Start "<{code_context}>"')
        try:
            res = original_function(*args, **kwargs)
            logger.log(PROGRESS,f'[progress] End   "<{code_context}>"')
            return res
        except Exception as e:
            logger.error(f'{e}\n\tfilename: {py_file_caller.filename}\n\tlinenum: {py_file_caller.lineno}\n\tcontext: {py_file_caller.code_context}')
            raise
    return wrapper
