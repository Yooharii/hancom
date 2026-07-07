const con = document.querySelector("#con");
const anl = document.querySelector("#anl");
const rel = document.querySelector("#rel");

anl.addEventListener("click",()=>{
    const text = con.value;

    rel.innerHTML=
        `글자 수(length): ${text.length} <br>
        대문자(toUpperCase): ${text.toUpperCase()} <br>
        e->E 바꾸기(replace):${text.replace("e","E")} <br>
        글자 쪼개기 : ${text.split("")}<br>
        글자 다른방식 쪼개기 : ${text.split("").join(".")}`;
});
