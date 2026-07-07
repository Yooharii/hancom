const object={
    name : "두부",
    age:13
};

const out = document.querySelector("#out");
const up = document.querySelector("#up");
const rename = document.querySelector("#rename");

const render = ()=>{
    out.textContent = `${object.name} (${object.age}살)`;
}
render();

up.addEventListener("click", ()=>{
    object.age++;
    render();
});

rename.addEventListener("click", ()=>{
    object.name = "하리";
    render();
})