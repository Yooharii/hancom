const title =document.querySelector("#title");
// document(문서).(~의)querySelector(--)--의 Id를 찾겟다
//가져와서 const(상수) title(여기에)
//종합 --> 가지고와서 title에 넣어준다
const btn = document.querySelector("#btn");

btn.addEventListener("click",()=>{
    title.textContent="Hello world!";
    title.style.color="purple";
});
// btn에 이벤트를 추가(addEventListener) 해줄거야 근데 무슨 액션? click했을때 title의 내용을 Hello world!로 바꿔줄거야

// ()=>{} 이건 최신식 표기
// function()이랑 같은거라 보면 댐
