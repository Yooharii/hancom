const nameInput = document.querySelector("#name");
const btn = document.querySelector("#btn");
const out = document.querySelector("#out");

btn.addEventListener("click", ()=>{
    let myName = nameInput.value;
    out.textContent=`안녕, ${myName}!`;
    
});
