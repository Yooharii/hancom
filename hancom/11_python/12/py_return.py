from termcolor import colored

def highlight(text:str, color:str) ->  str:
    """
    text, color를 입력받아서 text 색상을 변경하는 함수

        text : str
        color : str
    """
    color_text = colored(text, color)
    return color_text
# Python에서 return은 함수의 실행을 즉시 종료하고 
# 결과값을 호출한 곳으로 돌려줄 때 사용합니다
# 결과를 변수에 담아 다른곳에도 쓸 수 있게 해줌
print(highlight("GOOD", "blue"))


