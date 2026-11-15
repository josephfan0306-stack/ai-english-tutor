import type { ConceptKey } from "@/lib/concepts";

/**
 * 翰林版國中英語單元表（依各校公開的翰林版課程計畫整理，課文標題以課本為準）
 * 第 1、2 冊＝國一，第 3、4 冊＝國二，第 5、6 冊＝國三
 */
export type Unit = {
  id: string; // 例如 "b3-u2"
  book: number;
  unit: number;
  title: string;
  theme: string;
  grammar: string[]; // 給學生看的文法句型重點
  concepts: ConceptKey[]; // 對應的觀念代碼，用來查錯誤紀錄
};

export type Grade = {
  grade: 7 | 8 | 9;
  label: string;
  books: { book: number; label: string; units: Unit[] }[];
};

function u(
  book: number,
  unit: number,
  title: string,
  theme: string,
  grammar: string[],
  concepts: ConceptKey[]
): Unit {
  return { id: `b${book}-u${unit}`, book, unit, title, theme, grammar, concepts };
}

export const CURRICULUM: Grade[] = [
  {
    grade: 7,
    label: "國一",
    books: [
      {
        book: 1,
        label: "第一冊（七上）",
        units: [
          u(1, 1, "Who's That Handsome Boy?", "自我介紹、家人", ["be 動詞 am / is / are", "Who 問句", "人稱代名詞與所有格"], ["grammar.be-verb", "grammar.wh-question", "grammar.pronoun-case"]),
          u(1, 2, "What Are Those?", "物品", ["this / that / these / those", "名詞單複數", "What 問句"], ["grammar.demonstrative", "grammar.plural-noun", "grammar.wh-question"]),
          u(1, 3, "Open the Magic Door", "請求與建議", ["祈使句", "Let's + 原形動詞", "受格代名詞"], ["grammar.imperative", "grammar.pronoun-case"]),
          u(1, 4, "What Time Is the Concert?", "時間、活動", ["What time 問句", "現在進行式", "時間的說法"], ["grammar.present-progressive", "grammar.wh-question", "vocabulary.date-time"]),
          u(1, 5, "What's the Date?", "日期、月份、節慶", ["日期與序數", "What day / What's the date", "in / on / at 時間介系詞"], ["vocabulary.date-time", "vocabulary.preposition", "grammar.wh-question"]),
          u(1, 6, "There Are Some Elephants over There", "動物園、位置", ["There is / There are", "some / any", "地方介系詞"], ["grammar.there-be", "grammar.plural-noun", "vocabulary.preposition"]),
        ],
      },
      {
        book: 2,
        label: "第二冊（七下）",
        units: [
          u(2, 1, "Do You Like Sports?", "運動、喜好", ["現在簡單式", "第三人稱單數動詞加 s", "Do / Does 問句"], ["grammar.simple-present", "grammar.third-person-s"]),
          u(2, 2, "How Often Do You Go to the Library?", "生活習慣", ["頻率副詞", "How often 問句"], ["grammar.frequency-adverb", "grammar.simple-present"]),
          u(2, 3, "Which Painting Do You Like?", "藝術、選擇", ["Which 問句", "所有格代名詞", "one / ones"], ["grammar.wh-question", "grammar.possessive-pronoun"]),
          u(2, 4, "How Much Flour Do You Need?", "食物、烹飪", ["可數與不可數名詞", "How many / How much", "a lot of / a few / a little"], ["grammar.countable-uncountable", "grammar.plural-noun"]),
          u(2, 5, "There Was a Lot of Trash in the Sea", "環保", ["be 動詞過去式 was / were", "There was / There were"], ["grammar.simple-past-be", "grammar.there-be"]),
          u(2, 6, "We Rode a Bike to the Temple", "旅遊", ["一般動詞過去式", "because / so"], ["grammar.simple-past", "grammar.because-so"]),
        ],
      },
    ],
  },
  {
    grade: 8,
    label: "國二",
    books: [
      {
        book: 3,
        label: "第三冊（八上）",
        units: [
          u(3, 1, "How Was the Weather in Australia?", "季節、天氣", ["過去式問句與回答", "天氣的說法", "過去簡單式"], ["grammar.simple-past-be", "grammar.simple-past"]),
          u(3, 2, "You Can Learn About Game Design After You Join the Club", "社團活動", ["when / before / after 時間子句"], ["grammar.time-clause"]),
          u(3, 3, "Mom Was Doing the Dishes at Half past Twelve", "家事、失眠", ["過去進行式", "when / while 搭配過去進行式"], ["grammar.past-progressive", "grammar.time-clause"]),
          u(3, 4, "What Do You Want to Be in the Future?", "職業、夢想", ["不定詞 to + V", "動名詞 V-ing 當主詞／受詞"], ["grammar.infinitive", "grammar.gerund"]),
          u(3, 5, "How Do We Go to the Hotel?", "問路、交通", ["問路與指路", "疑問詞 + 不定詞（how to…）", "花費 take / spend / cost"], ["grammar.infinitive", "grammar.wh-question", "vocabulary.preposition"]),
          u(3, 6, "She'll Wear a Sweater to the Party", "計畫、派對", ["未來式 will / be going to"], ["grammar.future-tense"]),
        ],
      },
      {
        book: 4,
        label: "第四冊（八下）",
        units: [
          u(4, 1, "The Steak Looks Yummy", "飲食文化", ["連綴動詞 + 形容詞（look / smell / taste…）", "比較級"], ["grammar.linking-verb", "grammar.comparative"]),
          u(4, 2, "Red Fire Ants Are the Most Dangerous Ants", "戶外安全", ["形容詞最高級"], ["grammar.superlative"]),
          u(4, 3, "The Animals Work Hard", "勞工權益", ["副詞的用法與位置", "副詞比較級"], ["grammar.adverb", "grammar.comparative"]),
          u(4, 4, "I Can Hear the Wind Blow", "自然、災害", ["感官動詞 + 原形動詞／V-ing", "反身代名詞", "should / must"], ["grammar.perception-verb", "grammar.reflexive-pronoun", "grammar.modal-verb"]),
          u(4, 5, "All of the Food Stands Look Great", "夜市、美食", ["all / both / most / none of the…", "although / though"], ["grammar.indefinite-pronoun", "grammar.although-though"]),
          u(4, 6, "You Can Throw a Ball, Can't You?", "性別平等", ["附加問句"], ["grammar.tag-question"]),
        ],
      },
    ],
  },
  {
    grade: 9,
    label: "國三",
    books: [
      {
        book: 5,
        label: "第五冊（九上）",
        units: [
          u(5, 1, "Have You Had Breakfast Yet?", "生活經驗", ["現在完成式", "already / yet / ever / never / for / since"], ["grammar.present-perfect"]),
          u(5, 2, "The Movie Looks Exciting", "電影、心情", ["分詞形容詞 -ing / -ed", "too…to / enough to / so…that"], ["grammar.participle-adjective", "grammar.too-enough-so-that"]),
          u(5, 3, "The Soldier Was Saved by a Dog", "動物與人", ["被動語態", "助動詞 + be + p.p."], ["grammar.passive-voice", "grammar.modal-verb"]),
          u(5, 4, "Do You Know Where the File Is?", "求助、詢問", ["間接問句", "whether / if"], ["grammar.indirect-question"]),
          u(5, 5, "The Man Who Shook Hands with Me Is My Favorite Star", "偶像、人物", ["關係代名詞 who / that"], ["grammar.relative-clause"]),
          u(5, 6, "The Sign Which You Used Is Not OK", "文化差異", ["關係代名詞 which / that", "受格關係代名詞省略"], ["grammar.relative-clause"]),
        ],
      },
      {
        book: 6,
        label: "第六冊（九下）",
        units: [
          u(6, 1, "I Feel So Lost, and So Do My Friends", "成長、壓力", ["附和句 so / too / either / neither"], ["grammar.so-neither-agreement"]),
          u(6, 2, "I Can Focus Neither in the Morning Nor at Night", "專注、時間管理", ["neither…nor / either…or / both…and / not only…but also"], ["grammar.correlative-conjunction"]),
          u(6, 3, "Is AI Good for Learning?", "科技、議論", ["though / although / but", "when / while 與過去進行式"], ["grammar.although-though", "grammar.time-clause", "grammar.past-progressive"]),
          u(6, 4, "Let's Vote", "公民、投票", ["關係副詞 where / when", "名詞子句"], ["grammar.relative-adverb"]),
        ],
      },
    ],
  },
];

export function getGrade(grade: number | string): Grade | undefined {
  return CURRICULUM.find((g) => g.grade === Number(grade));
}

export function getUnit(unitId: string): Unit | undefined {
  for (const g of CURRICULUM) for (const b of g.books) for (const unit of b.units) if (unit.id === unitId) return unit;
  return undefined;
}

export function unitLabel(unit: Unit): string {
  return `B${unit.book} U${unit.unit} ${unit.title}`;
}

/** 給 prompt 用的單元描述 */
export function unitForPrompt(unit: Unit): string {
  return `第${unit.book}冊 Unit ${unit.unit}「${unit.title}」｜主題：${unit.theme}｜文法句型：${unit.grammar.join("、")}`;
}
