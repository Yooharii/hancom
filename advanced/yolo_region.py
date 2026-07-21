from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정
cap = cv2.VideoCapture("http://210.99.70.120:1935/live/cctv023.stream/playlist.m3u8")

# 2. 구역 좌표 설정
region_points = {
    "region-01": [(266, 70), (311, 196), (427, 105), (407, 66)],
    "region-02": [(166, 346), (441, 321), (486, 366), (636, 345),(299,111)]
}

# 3. 모델 로드 및 구역 객체 생성
yolo_region = solutions.RegionCounter(
    model="yolo11n.pt",
    show = False,
    region = region_points,
    conf = 0.4  # 임계값(신뢰도) =cctv 저화질 대응
)

# 4.프레임처리  
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    # 4-1. 프레임 크기 조정
    re_frame = cv2.resize(frame, (640,480))

    # 4-2. 구역 내 객체 수 계산
    results = yolo_region(re_frame)

    # 4-3. 프레임 표시(시각화)
    cv2.imshow("Region", results.plot_im)

    # 4-4. q키 눌러 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("q 키 눌러 종료")
        break

# 5.자원해제
cap.release()
cv2.destroyAllWindows()