import gradio as gr

# 1. 간단한 함수 정의
def say_hello(name):
    return "Hello, " + name

# 2. Gradio 인터페이스 생성
gr_web = gr.Interface(
    fn=say_hello,
    inputs="text",
    outputs="text",
)

# 3. 웹앱 실행 (share = True => 공개 URL)
gr_web.launch(share=True)