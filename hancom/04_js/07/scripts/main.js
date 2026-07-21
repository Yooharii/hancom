const multifly =(num1, num2,num3) =>num1 * num2 * num3 ; 

const a=document.querySelector("#a");
const b=document.querySelector("#b");
const c=document.querySelector("#c");
const cal=document.querySelector("#cal");
const rel=document.querySelector("#rel");

cal.addEventListener("click",()=>{
    rel.textContent = `${a.value} x ${b.value} x ${c.value} = ${multifly(Number(a.value),Number(b.value),Number(c.value))}`;
});
