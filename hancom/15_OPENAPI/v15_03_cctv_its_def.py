import urllib   # URL 요청
import json     # JSON 데이터 처리용
import pandas as pd   #데이터 프레임 생성 및 데이터 처리용
import urllib.request  # URL 요청2

# 1. 인증 키 설정
key = "db5c00dc1fce45c49049bff225a0fea6"

# 2. 도로 유형 지정
Type = "its"
# its : 일반 도로
# ex : 고속도로

# 3. 관심 영역 설정
minX = float(120.95)  #최소 경도
maxX = float(127.02)  #최대 경도
minY = float(30.55)  #최소 위도
maxY = float(37.69)  #최대 위도

# 4. 응답 데이터 형식 설정
getType = "json"

# 5. API 요청 URL 생성
url_cctv = (
    f"https://openapi.its.go.kr:9443/cctvInfo"
    f"?apiKey={key}&type={Type}&cctvType=1"
    f"&minX={minX}&maxX={maxX}"
    f"&minY={minY}&maxY={maxY}"
    f"&getType={getType}"
)

# 6. API 요청 및 응답 받기
response = urllib.request.urlopen(url_cctv)
# print(response)
# <http.client.HTTPResponse object at 0x000001F643ABEBE0>

# 7. 응답 데이터 디코딩 => bytes => str(읽을 수 있는 문자로)
json_str = response.read().decode('utf-8')
#print(json_str)

# 8.. JSON 문자열 => 파이썬 딕셔너리
json_object = json.loads(json_str)
# print(json_object)  #'{...}' =>{...}

# 9. 데이터 프레임 변환
cctv_play = pd.json_normalize(json_object["response"]["data"])
# CCTV 목록이 맨 위에 안 놓여있고, response => data 안에 숨어 잇어서 거기까지 손 뻗지 못함
# print(cctv_play)

# 10. 특정 cctv 선택
test_url = cctv_play["cctvurl"][17]
print(f"선택된 CCTV URL => {test_url}")

# 함수화
    # 함수명 : its_cctv
    # 파라미터 : 1개 => cctv_index
    # return : test_url

def its_cctv(cctv_index = 77):
    key = "db5c00dc1fce45c49049bff225a0fea6" #인증키

    Type = "its" # 도로 유형

    minX = float(120.95)
    maxX = float(127.02)
    minY = float(30.55)
    maxY = float(37.69) #경도, 위도

    getType = "json" #응답 데이터 형식

    url_cctv = (
    f"https://openapi.its.go.kr:9443/cctvInfo"
    f"?apiKey={key}&type={Type}&cctvType=1"
    f"&minX={minX}&maxX={maxX}"
    f"&minY={minY}&maxY={maxY}"
    f"&getType={getType}"
    )    #api

    response = urllib.request.urlopen(url_cctv) # 서버응답

    json_str = response.read().decode('utf-8') #디코딩

    json_object = json.loads(json_str) # 파이썬 딕셔너리

    cctv_play = pd.json_normalize(json_object["response"]["data"]) #프레임 변환

    test_url = cctv_play["cctvurl"][17] #cctv 선택
    print(f"선택된 CCTV URL => {test_url}")

    return test_url