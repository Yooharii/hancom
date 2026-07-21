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
    distance(frame)
# 4. 자원 해제
cap.release()
cv2.destroyAllWindows()