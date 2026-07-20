from ultralytics import YOLO
import cv2

# 1. 모델 로드 (분할 전용)
model = YOLO("yolo11n-seg.pt")

# 2. 모델 추론 (이미지 경로 입력)
model("input_seg1.jpg",save = True)
