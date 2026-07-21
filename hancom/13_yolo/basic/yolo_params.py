from ultralytics import YOLO
import cv2

# 1. 모델 로드
model = YOLO("yolo11n.pt")

print(model.names)


#2. 모델 파라미터
model(
    "input_params.jpg", # 추론할 이미지 경로
    classes= [60, 75],
    save = True

#     classes = class_ids, # dining table, vase 만 탐지
#     # conf=0.5,  # 신뢰도
#     # max_det = 3, # 탐지할 최대 개수
#     # save_crop=True # 탐지 영역 이미지 저장
#     # save_txt=True # 좌표 텍스트 저장
#     # save_conf =True # 신뢰도 저장
)

