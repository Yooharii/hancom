const arr=["사과","바나나"];
// 배열 생성
const fruit =document.querySelector("#fruit");
const ad = document.querySelector("#ad");
const con = document.querySelector("#con");
const info =document.querySelector("#info");
// op함수 설계
const op =()=>{
    con.textContent=arr.join(", ");
    info.textContent=`개수(length):${arr.length}`;
};
op();
// 클릭
ad.addEventListener("click",()=>{
    if(!fruit.value){return;}
    arr.push(fruit.value);
    fruit.value=""
    op();
});