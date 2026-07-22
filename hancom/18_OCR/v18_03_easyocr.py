import ssl
import certifi
ssl._create_default_https_context = ssl._create_unverified_context
import easyocr

# 1. Reader 생성 (언어 지정: 영어 + 한국어)
reader = easyocr.Reader(['en', 'ko'])

# 2. OCR 수행
results = reader.readtext("image.png")

# 3. 결과 출력
print("==============================================")
for (bbox, text, confidence) in results:
    print(f"{text}")
print("==============================================")
