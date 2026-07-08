// 버튼으로 좋아요 부분 구성
// 저장된 값을 불러옴 (저장된 게 없으면 null → 0)
let n = Number(localStorage.getItem("likeCount")) || 0;

const like = document.querySelector("#like");
const count = document.querySelector("#count");

// 새로고침 직후에도 저장돼 있던 갯수를 바로 화면에 표시
if (n > 0) {
  count.textContent = `♥️ + ${n}`;
}

like.addEventListener("click", () => {
  n++;
  localStorage.setItem("likeCount", n); // 클릭할 때마다 저장
  count.textContent = `♥️ + ${n}`;
});



// 사진 추가하기 구성
const addBtn = document.querySelector(".bottom .add-icon");
const photoInput = document.querySelector("#photoInput");
const preview = document.querySelector("#preview");
const bottomSub = document.querySelector(".bottom-sub");

// 버튼을 누르면 숨겨둔 파일 선택창을 대신 열어줌
addBtn.addEventListener("click", () => {
  photoInput.click();
});

let selectedFile = null; // 지금 미리보기 중인 파일 (추가할 때 이름을 기억해두려고 보관)

// 파일을 축소한 데이터 주소(dataURL)로 바꿔서 onDone에 넘겨줌
// blob URL은 새로고침하면 죽지만 dataURL은 글자라서 localStorage에 저장할 수 있음
// 단, 원본 그대로면 localStorage 용량(약 5MB)을 금방 넘겨서 긴 쪽을 440px로 축소함
function shrinkToDataURL(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 440 / Math.max(img.width, img.height)); // 작은 사진은 그대로(1배)
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      onDone(canvas.toDataURL("image/jpeg", 0.8)); // 80% 품질 jpg 데이터 주소로 변환
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file); // 파일을 dataURL 글자로 읽음 (다 읽으면 위 onload 실행)
}

// 파일을 고르면 실행됨
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return; // 선택창에서 취소를 누른 경우

  // 이미 캐러셀에 들어있는 사진이면 추가하지 못하게 막음
  if (carousel.has(file)) {
    preview.hidden = true;
    bottomSub.textContent = "다른 사진을 선택하세요";
    bottomTitle.disabled = true; // 버튼이 안 눌리게 잠금
    photoInput.value = "";
    return;
  }

  selectedFile = file;
  // 변환이 끝나면 미리보기 표시 (파일 읽기는 시간이 걸려서 콜백 안에서 처리)
  shrinkToDataURL(file, (dataURL) => {
    preview.src = dataURL;
    preview.hidden = false; // 미리보기 표시
    bottomSub.textContent = "이 사진을 넣으시겠습니까?"; // 문구는 남기고 내용만 변경
    bottomTitle.disabled = false; // 새 사진이니 버튼 잠금 해제
  });
});



// 레코드 캐러셀 구성
// 사진 1장 = 객체 하나. 예) { src: "./assets/1.jpg", alt: "하리 성장 사진 1", name: "1.jpg" }

class Carousel {
  constructor() {
    // 캐러셀이 다룰 화면 요소들
    this.ring = document.querySelector(".record-carousel-ring");
    this.prevBtn = document.querySelector(".carousel-arrow.prev");
    this.nextBtn = document.querySelector(".carousel-arrow.next");
    this.deleteBtn = document.querySelector(".carousel-delete");

    // 사진 목록 : 객체를 담는 배열 (name은 중복 검사에 쓰는 파일 이름)
    this.photos = [
      { src: "./assets/1.jpg", alt: "하리 성장 사진 1", name: "1.jpg" },
      { src: "./assets/2.jpg", alt: "하리 성장 사진 2", name: "2.jpg" },
      { src: "./assets/3.jpg", alt: "하리 성장 사진 3", name: "3.jpg" },
      { src: "./assets/4.jpg", alt: "하리 성장 사진 4", name: "4.jpg" },
      { src: "./assets/5.jpg", alt: "하리 성장 사진 5", name: "5.jpg" },
      { src: "./assets/6.jpg", alt: "하리 성장 사진 6", name: "6.jpg" },
      { src: "./assets/7.jpg", alt: "하리 성장 사진 7", name: "7.jpg" },
      { src: "./assets/8.jpg", alt: "하리 성장 사진 8", name: "8.jpg" },
      { src: "./assets/9.jpg", alt: "하리 성장 사진 9", name: "9.jpg" },
      { src: "./assets/10.jpg", alt: "하리 성장 사진 10", name: "10.jpg" },
      { src: "./assets/11.jpg", alt: "하리 성장 사진 11", name: "11.jpg" },
    ];

    // 저장돼 있던 '올린 사진'들을 불러와 기본 사진 뒤에 이어붙임 (없으면 null → 빈 배열)
    const saved = JSON.parse(localStorage.getItem("carouselPhotos")) || [];
    this.photos.push(...saved);

    localStorage.removeItem("carouselAngle"); // 예전 버전이 저장하던 각도 키 청소 (지금은 순번만 저장)

    // 지금 정면에 보이는 사진의 순번 (넘긴 횟수만큼 계속 커지거나 작아짐)
    // 각도를 직접 저장하면 사진 개수가 바뀔 때 한 칸의 각도도 바뀌어 어긋나므로,
    // 순번만 기억하고 각도는 매번 현재 개수 기준으로 계산함
    // 좋아요처럼 저장된 값을 불러옴 (저장된 게 없으면 null → 0)
    this.index = Number(localStorage.getItem("carouselIndex")) || 0;

    // 화살표 클릭 시 prev / next 실행
    // () => 로 감싸야 this가 이 캐러셀을 가리킨 채로 실행됨
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());
    this.deleteBtn.addEventListener("click", () => this.removeCurrent());

    this.buildRing(); // photos 배열대로 사진들을 원형으로 배치
    this.rotate(); // 새로고침 직후에도 저장돼 있던 각도로 바로 회전
  }

  // photos 배열로 img들을 만들어 링 안에 원형으로 세움
  buildRing() {
    const step = 360 / this.photos.length; // 사진 1장이 차지하는 각도 (5장이면 72도)

    // 사진이 많아져도 옆 사진끼리 겹치지 않게 반지름을 개수에 맞춰 계산
    // (사진 절반 폭 110px ÷ tan(π/개수) = 겹치지 않는 최소 반지름, 최소값은 기존 220px 유지)
    // rotate()에서도 써야 하니 this에 보관
    this.radius = Math.max(
      220,
      Math.round(110 / Math.tan(Math.PI / this.photos.length)) + 30
    );

    this.ring.innerHTML = ""; // 기존 사진을 비우고 처음부터 다시 배치
    this.photos.forEach((photo, i) => {
      const img = document.createElement("img");
      img.className = "record-carousel-item";
      img.src = photo.src;
      img.alt = photo.alt;
      // i번째 사진을 i*step도 방향으로 돌린 뒤, 반지름만큼 바깥으로 밀어서 원형으로 세움
      img.style.transform = `rotateY(${i * step}deg) translateZ(${this.radius}px)`;
      this.ring.appendChild(img);
    });
  }

  // 지금 정면에 보이는 사진이 photos 배열에서 몇 번째인지
  // (index는 계속 커지거나 음수도 되므로 0 ~ 길이-1 범위로 맞춤)
  currentIndex() {
    const len = this.photos.length;
    return ((this.index % len) + len) % len;
  }

  // 링 전체를 현재 순번의 사진이 정면에 오는 각도로 회전
  rotate() {
    const step = 360 / this.photos.length; // 각도는 항상 현재 사진 개수 기준으로 계산
    // 사진들이 반지름만큼 앞으로 나와 있으니 링을 그만큼 뒤로 밀어서,
    // 사진이 몇 장이 되든 정면 사진은 항상 같은 깊이(원래 크기)에 오게 함
    this.ring.style.transform = `translateZ(${-this.radius}px) rotateY(${-this.index * step}deg)`;
    localStorage.setItem("carouselIndex", this.index); // 회전할 때마다 저장

    // 정면 사진이 파일로 올린 사진일 때만 휴지통 버튼 활성화 (기본 사진 5장은 보호)
    this.deleteBtn.disabled = !this.photos[this.currentIndex()].added;
  }

  // ‹ 이전 사진 : 링을 시계 방향으로 한 칸 회전
  prev() {
    this.index--;
    this.rotate();
  }

  // › 다음 사진 : 링을 반시계 방향으로 한 칸 회전
  next() {
    this.index++;
    this.rotate();
  }

  // 새 사진 객체를 photos 끝에 추가하고 링을 다시 배치
  add(photo) {
    this.photos.push(photo);
    this.savePhotos(); // 새로고침해도 남아있게 저장
    this.buildRing();
    this.index = this.photos.length - 1; // 방금 추가한 사진(배열 마지막)이 정면에 오게
    this.rotate();
  }

  // 🗑 정면에 보이는 사진을 캐러셀에서 삭제 (파일로 올린 사진만 가능)
  removeCurrent() {
    const i = this.currentIndex();
    if (!this.photos[i].added) return; // 기본 사진이면 아무것도 안 함 (버튼도 잠겨 있음)

    this.photos.splice(i, 1); // i번째 사진 1개를 배열에서 제거
    this.savePhotos(); // 지운 것도 저장에 반영 (새로고침하면 되살아나지 않게)
    this.index = i % this.photos.length; // 지워진 자리의 다음 사진이 정면에 오게
    this.buildRing();
    this.rotate();
  }

  // '올린 사진'들만 골라 localStorage에 저장 (기본 사진 5장은 파일로 있으니 저장 안 함)
  savePhotos() {
    const added = this.photos.filter((photo) => photo.added);
    try {
      localStorage.setItem("carouselPhotos", JSON.stringify(added));
    } catch {
      // localStorage가 가득 차면 setItem이 오류를 던짐 → 화면엔 있지만 저장은 못 한 상태
      alert("저장 공간이 가득 차서 이 사진은 새로고침하면 사라져요");
    }
  }

  // 같은 이름의 사진 객체가 이미 photos에 들어있는지 확인
  // some : 배열에서 조건을 만족하는 게 하나라도 있으면 true
  has(file) {
    return this.photos.some((photo) => photo.name === file.name);
  }
}

const carousel = new Carousel();



// "사진 추가하기" 버튼 : 미리보기 중인 사진을 캐러셀에 추가
const bottomTitle = document.querySelector(".bottom-title");

bottomTitle.addEventListener("click", () => {
  if (preview.hidden) return; // 아직 고른 사진이 없으면 아무것도 안 함

  carousel.add({
    src: preview.src,
    alt: "새로 추가한 하리 사진",
    name: selectedFile.name, // 다음 중복 검사에 쓸 파일 이름
    added: true, // 파일로 올린 사진 표시 → 휴지통 버튼으로 지울 수 있음
  });
  selectedFile = null;

  // 하단 카드는 원래 상태로 되돌림
  preview.hidden = true;
  bottomSub.textContent = "새로운 추억이 생겼나요?";
  photoInput.value = ""; // 같은 파일을 다시 골라도 change 이벤트가 뜨게 초기화
});

