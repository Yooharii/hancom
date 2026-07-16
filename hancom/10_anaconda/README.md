# Anaconda 학습 허브

## 01. Anaconda란?

> "집 안에는 여러 방이 있음 — 주방, 화장실, 거실, 안방. 방마다 목적이 다르고, 도구도 따로 갖춤"

Anaconda는 프로젝트별로 **독립된 가상환경**을 생성하는 Python 데이터 과학 패키지 관리자입니다.  
프로젝트 간 라이브러리 버전 충돌을 방지할 수 있습니다.

---

## 02. 설치하기 (Windows)

1. `Anaconda3-…-Windows-x86_64.exe` 다운로드
2. 설치 파일 실행 후 **"Just Me"** 선택
3. 기본 경로 유지
4. **"Add Anaconda3 to my PATH"** 체크

### 설치 확인

```bash
conda --version
conda info
python --version
```

---

## 03. 가상환경 관리

| 작업 | 명령어 |
|------|--------|
| 생성 | `conda create -n 환경이름 python=3.10` |
| 활성화 | `conda activate 환경이름` |
| 비활성화 | `conda deactivate` |
| 목록 조회 | `conda env list` |
| 삭제 | `conda env remove -n 환경이름` |

---

## 04. 패키지 관리 (pip)

```bash
# 기본 설치
pip install package-name

# 다중 설치
pip install package1 package2 package3

# 특정 버전 설치
pip install package==1.2.3

# 업그레이드
pip install --upgrade package

# 설치된 패키지 목록
pip list
```

---

## 05. 환경 공유

```bash
# 환경 내보내기
conda env export > environment.yml

# 환경 복원
conda env create -f environment.yml

# 의존성 파일 생성
pip freeze > requirements.txt
pipreqs --force --savepath=requirements.txt .
```

---

참고: https://hancom-nine.vercel.app/anaconda.html
