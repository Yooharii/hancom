import matplotlib
matplotlib.use('Agg')
from ultralytics import solutions
import ssl, os
ssl._create_default_https_context = ssl._create_unverified_context
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["REQUESTS_CA_BUNDLE"] = ""

# 1. 검색 앱 생성 - CPU에서 동작
app = solutions.SearchApp(
    data = "images.zip",
    device= "cpu"
)

# 2. 웹서버 실행
app.run(debug=True, use_reloader=False)