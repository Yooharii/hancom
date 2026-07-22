from transformers import pipeline

# 1. 요약 파이프라인 생성
summarizer = pipeline(
    "summarization", 
    model = "t5-small"
    )

# 2. 요약할 원문
text = """
The study of literature has repeatedly failed to recognize the
influence of modern musical lyricists and their contributions
to the evolution of language. Unlike Shakespeare, who has
been studied and celebrated for his development of the English
language, particularly in vocabulary and grammatical structure,
modern songwriters have experienced restraints on the
acknowledgement of their contributions and largely been
ignored. Over the past century, we have witnessed an explosion
of incredible literary works by these artists, who, through their
music, have used linguistic manipulation and storytelling to
enrich our language and literature. Producing lyrics of distinct
and complex imagery, songwriters have had an incredible
literary impact on our language. Their remarkable works,
including influences on modern language development, must
be recognized in the field of modern literature.
"""
# 3. 요약 실행
summary = summarizer(
    text,
    min_length = 20 ,   # 최소토큰수 => 너무 짧은 요약 방지
    max_length = 60,    # 최대토큰 수 => 길이 폭주 방지
    do_sample=False     # 매번 동일한 결과
)
# 4. 결과 확인
sum_text = summary[0]['summary_text']
print(f"요약된 문장 : {sum_text}")