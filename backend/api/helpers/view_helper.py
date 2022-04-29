from .const import SESSION_ID_LENGTH
import random


def random_session_num(length=SESSION_ID_LENGTH):
    keyspace = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    session_key = ''

    for _ in range(length):
        rand_char = keyspace[random.randint(0, len(keyspace)-1)]
        session_key += rand_char

    return session_key
