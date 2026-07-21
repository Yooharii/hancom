const item = document.querySelector("#item");
const btn = document.querySelector("#btn");
const rel = document.querySelector("#rel");

btn.addEventListener("click",()=>{
    if(item.value==="chocolate"){
        rel.textContent="와! 초코아이스크림 좋아!🍫";
    }else if(item.value==="vanilla"){
        rel.textContent="바닐라도 깔끔하니 좋지!🍦";
    }else{
        rel.textContent="음... 그래도 초코가 최고인데...";
    }
});
