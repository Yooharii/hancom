from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정
stream_url = "http://210.99.70.120:1935/live/cctv010.stream/playlist.m3u8"
cap = cv2.VideoCapture(stream_url)

# 2. 모델 로드 및 거리 계산 객체생성
distance = solutions.DistanceCalculation(
    model="yolo11n.pt",
    show=True
)
# 3.프레임 처리 루프
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    # 3-1. 거리 계산 수행
    results = distance.process(frame)

    # 3-2. pixels_distances 추출
    pixels_distance = results.pixels_distance

    # 3-3. 거리 계산 측정 안됐을때
    if pixels_distance is None or pixels_distance ==0:
        print("[거리] ----px [상태] 입력안됨")
        continue

    # 3-4. 거리 조건에 따른 정의
    if pixels_distance >= 150:
        states = "SAFE"
    elif pixels_distance >= 100:
        states = "Warning"
    else:
        states = "DANGER"
    
    # 3-5. 상태 출력  frame,
    print(f"[거리]  {pixels_distance}px  [상태] {states}")


# 4. 자원 해제
cap.release()
cv2.destroyAllWindows()

#실습 : 거리에 따른 상태 조건을 출력해주세요.