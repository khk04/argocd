import jwt
from datetime import datetime, timedelta
import secrets
import string
import ldap
import argparse

from LIB_database import *

def login_ldap(user):
    username = user.username
    password = user.password
    ldap_server = "ldap://ldap-server.ldap:389"
    #ldap_bind_dn = f"cn={username},cn=falinux,ou=coworkers,dc=dev-ldap,dc=seegene,dc=com"
    ldap_base_dn = ["cn=falinux,ou=coworkers,dc=dev-ldap,dc=seegene,dc=com","cn=insilico,ou=seegene,dc=dev-ldap,dc=seegene,dc=com"]
    ldap_bind_password = password

    conn = ldap.initialize(ldap_server)
    allow_login = False
    for base in ldap_base_dn:
        ldap_bind_dn = "cn="+username+","+base
        try:
            print ("current_ldap_base : "+base)
            conn.simple_bind_s(ldap_bind_dn, ldap_bind_password)
        except ldap.INVALID_CREDENTIALS:
            print ("Your username or password is incorrect.")
            #conn.unbind()
            allow_login = False
            continue
        except Exception as e:
            print ("Your username or password is incorrect.")
            print(e)
            allow_login = False
            continue
        print("User name and password is correct")
        allow_login = True
        break

    conn.unbind()
   
    return allow_login


# 사용자 정보를 받아 로그인 처리하는 함수
def login(user, db):
    # 정해진 유저네임과 패스워드 리스트를 정의합니다.

    # allowed_flag = login_ldap(user) # khk comment
    # print ("user.username", user.username)
    # print ("user.password", user.password)
    # 입력된 유저네임과 패스워드를 확인하여 인증을 처리합니다.

    # khk 
    allowed_flag = True

    if allowed_flag:

        admin_data = False
        cpu_data = 1
        node_data = 1
        memory_data = 100000

        # 유저정보가 전혀 없으면 유저 정보를 만들 때 관리자로 생성합니다.
        dev_users = db.query(DevUser).all()
        if len(dev_users) == 0:
            admin_data = True

        # 접속한 유저정보가 없으면 기본값으로 유정정보를 생성합니다.
        dev_user = db.query(DevUser).filter(DevUser.name == user.username).first()
        if dev_user is None:
            print("User Info None")

            new_dev_user = DevUser(name=user.username, admin=admin_data, nickname=user.username, cpu=cpu_data, node=node_data, memory=memory_data)
            db.add(new_dev_user)
            db.commit()
            db.refresh(new_dev_user)

        # 로그인 성공 시, 토큰을 생성하여 리턴합니다.
        token = generate_token(user.username)
        return {"auth": True, "token": token}

    # 로그인 실패 시, 인증 실패 메시지를 리턴합니다.
    return {"auth": False, "message": "Authentication failed"}



    # # 입력된 유저네임과 패스워드를 확인하여 인증을 처리합니다.
    # for allowed_user in allowed_users:
    #     if user.username == allowed_user["username"] and user.password == allowed_user["password"]:
    #         # 로그인 성공 시, 토큰을 생성하여 리턴합니다.
    #         token = generate_token(user.username)
    #         return {"auth": True, "token": token}

    # # 로그인 실패 시, 인증 실패 메시지를 리턴합니다.
    # return {"auth": False, "message": "Authentication failed"}

def generate_random_key(length):
    characters = string.ascii_letters + string.digits + string.punctuation
    random_key = ''.join(secrets.choice(characters) for _ in range(length))
    return random_key

# 토큰 생성 함수
def generate_token(username: str):
    # 토큰의 만료 시간을 정의합니다. 여기서는 1시간으로 설정하겠습니다.
    expires = datetime.utcnow() + timedelta(hours=1)
    
    # 토큰 페이로드를 정의합니다.
    payload = {
        'username': username,
        'exp': expires
    }
    
    # 토큰을 생성하여 리턴합니다.
    # 32자리의 무작위 비밀 키 생성
    secret_key = generate_random_key(32)
    print(secret_key)

    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token

