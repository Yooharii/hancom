from ultralytics import solutions
import ssl, os
ssl._create_default_https_context = ssl._create_unverified_context
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""

# 1. Streamlit추론 인스턴스 생성
inf = solutions.Inference(
    model = "yolo11n.pt"
)

# 2.웹 UI 시작
inf.inference()