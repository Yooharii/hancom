class dog{
    constructor(name){
        this.name=name;
    }

    bark(){
        return `${this.name} : 멍멍!`;
    }
}

const name = document.querySelector("#name");
const out = document.querySelector("#out");

const poppy = new dog("뽀삐");
const hari = new dog("하리");

name.addEventListener("click",()=>{
    out.textContent=`${poppy.bark()} ${hari.bark()}`;
});
