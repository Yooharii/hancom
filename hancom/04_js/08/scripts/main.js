let n =0;
// n의 초깃값 설정

const btn = document.querySelector("#btn");
const count = document.querySelector("#count");

btn.addEventListener("click", ()=>{
    n++;
    count.textContent = `${n}번 눌렀어요`;

});