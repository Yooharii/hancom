const num1 = document.querySelector("#num1")
const op = document.querySelector("#op")
const num2 = document.querySelector("#num2")
const cal = document.querySelector("#cal")
const rel = document.querySelector("#rel")

cal.addEventListener("click", ()=>{
    const x = Number(num1.value);
    const y = Number(num2.value);

    let result;

    if(op.value=="+"){
        result = x + y;
    }else if(op.value=="-"){
        result = x-y;
    }else if(op.value=="*"){
        result = x*y;
    }else{
        result = x/y;
    }

    rel.textContent = `${x} ${op.value} ${y} = ${result}`;
})