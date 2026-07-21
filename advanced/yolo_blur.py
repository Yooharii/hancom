from ultralytics import solutions
import cv2

# 1. 비디오 경로 설정
cap = cv2.VideoCapture(0)

#2. 모델 로드 및 블러 객체 생성
blurrer = solutions.ObjectBlurrer(
 model = "yolo11n.pt",
 show = False,
 blur_ratio=0.3
)
#3. 비디오 프레임 철
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("프레임 읽기 실패")
        break

    # 3-1. 탐지 => 박스 영역 자동 블러
    results = blurrer(frame)

    # 3-2. 처리된 프레임 표시 (show =>False = > 우리가 창을 직접 띄움) 
    cv2.imshow("BLUR", results.plot_im)

    #3-3. q눌러 종료
    if cv2.waitKey(1) & 0xFF==ord('q'):
        print("q키를 눌러서 종료")
        break

#자원해제
cap.release()
cv2.destroyAllWindows()