from ultralytics import FastSAM
import cv2
import ssl, os
ssl._create_default_https_context = ssl._create_unverified_context
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""

# 1. 이미지 경로
source = "advanced\input_fast_sam.png"

# 2. FastSAM모델 로드
model = FastSAM("FastSAM-s.pt")

# 3. 텍스트 프롬포트
results = model(source, texts="tiger")

# 4. 결과 이미지
output_path = "output_fast_sam_result.png"
output_image = results[0].plot()

# 5. 결과 이미지 저장
cv2.imwrite(output_path, output_image)

# 6. 코드 완료 출력
print(f"결과 이미지가 저장 됐습니다. {output_path}")