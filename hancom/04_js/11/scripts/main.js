const n = document.querySelector("#n");
const out = document.querySelector("#out");
const roop = document.querySelector("#roop");
const down = document.querySelector("#down");

roop.addEventListener("click",()=>{
    out.innerHTML="";
    const count = Number(n.value);

    for(let i=1;i<=count;i++){
        const li = document.createElement("li");
        li.textContent=`${i}번째 🍎`;
        out.appendChild(li);
    }
});

down.addEventListener("click",()=>{
    out.innerHTML="";
    let i = Number(n.value);

    while(i>0){
        const li =document.createElement("li");
        li.textContent=i;
        out.appendChild(li);
        i--;
    }
});