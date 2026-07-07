const IMG_A = "https://picsum.photos/96?random=1";
const IMG_B = "https://picsum.photos/96?random=2";
const IMG_C ="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA3MTRfMjMy%2FMDAxNzUyNDgwMjM1NjEx.4UF6UsB4eZtIUbIsX_IYnYoGrb4zuUhOPP_zwMbpU0og.I7RjTy0H2GlpQJbpF02MLqKQR68ureavhaT8Xf2gX9gg.JPEG%2F%25B8%25C5%25C7%25E2_AI%25C0%25CC%25B9%25CC%25C1%25F6_%252812%2529.jpg&type=a340"
const IMG_D ="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxNjExMDNfMjIg%2FMDAxNDc4MTM2ODEwODE3.Pis31uMJPKPkZsZJ4wSbXKe4SouUj6USuwjReIHn2Xog.wKcOoXbO73-COt2ry4iX27tQZp4R6SgqNdHYeUM6ej0g.JPEG.oneroomqueen1%2F%25B0%25DC%25BF%25EF%25C7%25B3%25B0%25E6_%25B9%25E8%25B0%25E6%25C8%25AD%25B8%25E9_%25B9%25D9%25C5%25C1%25C8%25AD%25B8%25E9_%25C0%25CC%25B9%25CC%25C1%25F6_%252811%2529.jpg&type=a340";

const myImage = document.querySelector("#pic");

myImage.setAttribute("src",IMG_A);

myImage.onclick=()=>{
    const mySrc = myImage.getAttribute("src");
    // 지금 걸려있는 그림 주소 읽어오기

    if(mySrc === IMG_A){
        myImage.setAttribute("src",IMG_B);
    }else if(mySrc === IMG_B){
        myImage.setAttribute("src",IMG_C);
    }else if(mySrc === IMG_C){
        myImage.setAttribute("src",IMG_D);
    }else{
        myImage.setAttribute("src",IMG_A);
    }
};