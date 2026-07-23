import streamlit as st
from ultralytics import YOLO
import cv2
import pandas as pd
import plotly.express as px #그래프 그리는 도구
import time

# 1. 화면 구성 - 화면을 좌 우 2칸으로 분할
col1, col2 = st.columns(2) # 같은 너비 두 칸 만들기

with col1:
    # YOLO 프레임 표시용 빈 영역
    frame_placeholder = st.empty()

with col2:
    # 객체 수 그래프 표시용 빈 영역
    chart_placeholder = st.empty()

# 2. 비디오 경로 설정
stream_url = "http://210.99.70.120:1935/live/cctv010.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

# 3. 모델로드
@st.cache_resource # 모델이나 DB같은 무거운 자원 캐싱
def load_model():
    return YOLO("yolo11n.pt")

model = load_model()

# 4. 비디오 프레임 처리
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    # 4-1. 모델 객체 탐지 수행
    results = model(frame)

     # 4-2. 탐지 결과를 이미지에 시각화
    annotated_frame = results[0].plot()
    
    # 4-3. 탐지 객체 클래스 이름 추출 -"사람", "차", 이름 모으기
    labels = [model.names[int(c)] for c in results[0].boxes.cls]

    # 4-4. 탐지 객체 수 시각화 -종류별 개수 막대 그래프 만들기
    if labels:  #객체탐지되면
        #labels 리스트를 DataFrame으로 변환 후 객체별 개수 집계
        df_count = pd.DataFrame({"Object": labels})

        #종류별 개수 세기
        df_count = df_count.value_counts().reset_index(name="Count")

        #Plotly를 이용해 막대 그래프 생성
        fig = px.bar(
            df_count,
            x="Object",             #틀래스 이름
            y="Count",              # 개수
            title="탐지 객체 수",     
            color="Object",         # 클래스마다 색 다르게
            text="Count"            # 막대 위에 숫자 표시
        )
    else:
        df_count = pd.DataFrame({"Object" : [], "Count" : []})
        #빈 표만 표시
        fig = px.bar(
            df_count,
            x = "Object",
            y = "Count",
            title = "탐지 객체 수"
        )
    # 4-5. Stremalit에 결과 표시 - 왼쪽 영상 + 오른쪽 그래프 동시 갱신
    frame_placeholder.image(annotated_frame, channels="BRG")
    chart_placeholder.plotly_chart(fig, use_container_width=True, key=f"chart_{time.time()}")
    # key=f"chart_{time.time()} : 매번 다른 이름 줘서 위젯 충돌 막기

# 5. 자원해제
cap.release()
cv2.destroyAllWindows()

        

