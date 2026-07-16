#1. pyfiglet ,termcolor 불러오기
#2. pyfiglet 적용
#3. termcolor 적용
#4. pyfiglet + termcolor 적용된 텍스트 

import pyfiglet
from termcolor import colored

sentence = pyfiglet.figlet_format("COMEON")

result = colored(
    sentence,
    "blue",
   
    )

print(result)

