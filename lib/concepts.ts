/**
 * 觀念代碼表：糾錯統計靠 conceptKey 跨題目累計，所以 AI 只能從這份清單挑，
 * 避免同一個觀念被取成不同名字。
 */
export const CONCEPTS = {
  // ── 文法：be 動詞與代名詞
  "grammar.be-verb": "be 動詞（am / is / are）",
  "grammar.pronoun-case": "代名詞主格／受格／所有格",
  "grammar.possessive-pronoun": "所有格代名詞（mine / yours…）",
  "grammar.reflexive-pronoun": "反身代名詞（myself…）",
  "grammar.demonstrative": "指示代名詞（this / that / these / those）",
  "grammar.indefinite-pronoun": "不定代名詞（all / both / most / none of…）",
  // ── 名詞與冠詞
  "grammar.plural-noun": "名詞單複數",
  "grammar.countable-uncountable": "可數／不可數名詞（how many / how much）",
  "grammar.article": "冠詞（a / an / the）",
  // ── 句型
  "grammar.imperative": "祈使句",
  "grammar.there-be": "There is / There are",
  "grammar.wh-question": "疑問詞問句（who / what / where / when / which / how）",
  "grammar.tag-question": "附加問句",
  "grammar.indirect-question": "間接問句",
  "grammar.so-neither-agreement": "附和句（so / too / either / neither）",
  "grammar.correlative-conjunction": "對等連接詞（both…and / either…or / neither…nor / not only…but also）",
  "grammar.too-enough-so-that": "too…to / enough to / so…that",
  // ── 時態
  "grammar.simple-present": "現在簡單式",
  "grammar.third-person-s": "第三人稱單數動詞加 s",
  "grammar.present-progressive": "現在進行式",
  "grammar.simple-past-be": "be 動詞過去式（was / were）",
  "grammar.simple-past": "一般動詞過去式",
  "grammar.past-progressive": "過去進行式",
  "grammar.future-tense": "未來式（will / be going to）",
  "grammar.present-perfect": "現在完成式",
  "grammar.tense-consistency": "時態一致",
  // ── 動詞
  "grammar.subject-verb-agreement": "主詞與動詞一致",
  "grammar.modal-verb": "助動詞（can / should / must / have to）",
  "grammar.infinitive": "不定詞（to + V）",
  "grammar.gerund": "動名詞（V-ing）",
  "grammar.linking-verb": "連綴動詞＋形容詞（look / feel / sound…）",
  "grammar.perception-verb": "感官動詞（see / hear / watch + V / V-ing）",
  "grammar.passive-voice": "被動語態",
  "grammar.participle-adjective": "分詞形容詞（-ing / -ed）",
  // ── 形容詞與副詞
  "grammar.adjective-order": "形容詞位置與用法",
  "grammar.adverb": "副詞用法",
  "grammar.frequency-adverb": "頻率副詞（always / usually / often…）",
  "grammar.comparative": "比較級",
  "grammar.superlative": "最高級",
  // ── 連接詞與子句
  "grammar.time-clause": "時間副詞子句（when / before / after / while）",
  "grammar.because-so": "because / so 連接詞",
  "grammar.although-though": "although / though",
  "grammar.relative-clause": "關係子句（who / which / that）",
  "grammar.relative-adverb": "關係副詞與名詞子句（where / when / what）",
  // ── 非文法類
  "vocabulary.word-choice": "用字選擇",
  "vocabulary.collocation": "搭配詞",
  "vocabulary.preposition": "介系詞",
  "vocabulary.date-time": "日期與時間的說法",
  "mechanics.spelling": "拼字",
  "mechanics.capitalization": "大小寫",
  "mechanics.punctuation": "標點符號",
  "structure.word-order": "語序",
  "structure.missing-word": "漏字／多字",
  "meaning.mistranslation": "語意誤譯／漏譯",
  "style.naturalness": "語氣與自然度",
} as const;

export type ConceptKey = keyof typeof CONCEPTS;

export const CONCEPT_KEYS = Object.keys(CONCEPTS) as [ConceptKey, ...ConceptKey[]];

export function conceptLabel(key: string): string {
  return (CONCEPTS as Record<string, string>)[key] ?? key;
}

/** 給 prompt 用的觀念清單文字 */
export function conceptListForPrompt(): string {
  return CONCEPT_KEYS.map((k) => `- ${k}：${CONCEPTS[k]}`).join("\n");
}
