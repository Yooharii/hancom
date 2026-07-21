colors = ["red", "green", "blue"]
#순서 있음, 수정가능, 중복 허용

# print(colors[0])
# print(colors[-1])
# print(colors[0:2])

# colors[-1] = "black"         # 값 변경
# print(colors[-1])            # black
# colors.append("pink")        # 끝에 추가
# colors.insert(0, "white")   # 특정 위치에 삽입
# print(colors)  
# colors.remove("white")       # 값으로 제거

numbers = [8, 5, 3, 2, 7]
# numbers.sort()              # 오름차순 정렬 2 3 5 7 8 
# numbers.sort(reverse=True)   # 내림차순 정렬 8 7 5 3 2
# numbers.reverse()            # 순서 뒤집기 7 2 3 5 8
print(2 in numbers)          # True (포함 여부)
