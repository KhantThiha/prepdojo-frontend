import { Question, Section, SectionType, SECTION_CONFIG, QuestionCountMode } from '@/app/types/exam';

// Vocabulary Questions
const vocabularyQuestions: Question[] = [
  {
    id: 'vocab-1',
    section: 'vocabulary',
    text: '次の漢字の読み方を選びなさい。「新しい」',
    options: ['あたらしい', 'あたらし', 'あだらしい', 'あだらし'],
    correctIndex: 0,
    explanation: '「新しい」は「あたらしい」と読みます。「あだらしい」は間違いです。正確に読みましょう。',
  },
  {
    id: 'vocab-2',
    section: 'vocabulary',
    text: '次の言葉の意味として正しいものを選びなさい。「時間をさいごに」',
    options: ['時間を守る', '時間を大切にする', '時間を過ごす', '時間を無駄にする'],
    correctIndex: 0,
    explanation: '「さいごに」は漢字で「最後に」と書きます。ここでは「時間をさいごに（守る）」という文脈で、「最後に」は「守る」意味で使われています。',
  },
  {
    id: 'vocab-3',
    section: 'vocabulary',
    text: '（　　）に入る最も適当な言葉を選びなさい。「この問題は（　　）難しいので、小学生には無理だ。」',
    options: ['非常に', 'わりあい', 'すこしも', 'たぶん'],
    correctIndex: 0,
    explanation: '「非常に」は程度が高いことを表す副詞です。「非常に難しい」で「とても難しい」という意味になります。',
  },
];

// Grammar Questions
const grammarQuestions: Question[] = [
  {
    id: 'grammar-1',
    section: 'grammar',
    text: '（　　）に入る最も適当なものを選びなさい。「彼は毎日勉強している（　　）、成績が上がらない。」',
    options: ['のに', 'ので', 'から', 'ため'],
    correctIndex: 0,
    explanation: '「のに」は逆接を表し、「勉強しているのに成績が上がらない」という文脈に合います。「〜しているのに、〜ない」という逆接の関係を示します。',
  },
  {
    id: 'grammar-2',
    section: 'grammar',
    text: '（　　）に入る最も適当なものを選びなさい。「雨が降っていますから、傘を持って（　　）ください。」',
    options: ['いって', 'きて', 'いって', 'おいて'],
    correctIndex: 1,
    explanation: '「傘を持ってきてください」は「傘を持って来てください」という意味で、相手に傘を持って来るように頼む表現です。',
  },
  {
    id: 'grammar-3',
    section: 'grammar',
    text: '次の文の意味として最も近いものを選びなさい。「この映画は子供でも見られる。」',
    options: [
      'この映画は子供には難しい',
      'この映画は子供も理解できる',
      'この映画は子供しか見られない',
      'この映画は子供が作った',
    ],
    correctIndex: 1,
    explanation: '「子供でも見られる」は「子供揚でも理解できる・楽しむことができる」という意味です。可能形を使って可能性を表しています。',
  },
];

// Reading Questions
const readingQuestions: Question[] = [
  {
    id: 'reading-1',
    section: 'reading',
    text: '次の文章を読んで、問いに答えなさい。',
    passageTitle: 'School Life in Japan',
    passage: `　日本の学校では、毎日昼休みがあります。昼休みは通常12時から1時間程度です。多くの生徒は学校で昼食をとります。最近では、学校給食を食べる生徒もいれば、お弁当を持ってくる生徒もいます。　給食は栄養バランスが考えられており、メニューは月曜日から金曜日まで毎日違います。学校給食は、生徒が健康的な食事を摂ることを目的としています。また、給食の時間は、生徒同士がコミュニケーションをとる良い機会にもなっています。`,
    options: [
      'すべての生徒がお弁当を持ってきている',
      '給食のメニューは毎週同じである',
      '昼休みは通常1時間程度である',
      '給食の時間に生徒は教室を出る',
    ],
    correctIndex: 2,
    explanation: '文章に「昼休みは通常12時から1時間程度です」と明確に書かれています。これは正解の選択肢と一致します。',
  },
  {
    id: 'reading-2',
    section: 'reading',
    text: '給食の時間について、文章の内容と合っているものはどれか。',
    passageTitle: 'School Life in Japan',
    passage: `　日本の学校では、毎日昼休みがあります。昼休みは通常12時から1時間程度です。多くの生徒は学校で昼食をとります。最近では、学校給食を食べる生徒もいれば、お弁当を持ってくる生徒もいます。　給食は栄養バランスが考えられており、メニューは月曜日から金曜日まで毎日違います。学校給食は、生徒が健康的な食事を摂ることを目的としています。また、給食の時間は、生徒同士がコミュニケーションをとる良い機会にもなっています。`,
    options: [
      '生徒が一人で静かに食べる時間である',
      '月曜日から金曜日まで同じメニューである',
      '不健康な食事を摂ることが目的である',
      '生徒同士が交流する機会になっている',
    ],
    correctIndex: 3,
    explanation: '文章の最後に「給食の時間は、生徒同士がコミュニケーションをとる良い機会にもなっています」と述べられています。',
  },
  {
    id: 'reading-3',
    section: 'reading',
    text: '次の文章を読んで、筆者が最も言いたいことを選びなさい。',
    passage: `　環境問題は私たち一人ひとりの行動に関わっています。ゴミを減らすこと、節電すること、水を大切に使うこと、これらは小さなことかもしれませんが、多くの人が行動すれば大きな変化となります。　今すぐできることから始めましょう。`,
    options: [
      '環境問題は政府だけの責任である',
      '個人の小さな行動も環境問題に貢献できる',
      '節電は環境問題に関係がない',
      '大きな変化は個人の努力では生まれない',
    ],
    correctIndex: 1,
    explanation: '筆者は「多くの人が行動すれば大きな変化となります」と述べており、個人の小さな行動の重要性を強調しています。',
  },
];

// Listening Questions
const listeningQuestions: Question[] = [
  {
    id: 'listening-1',
    section: 'listening',
    text: '録音を聞いて、質問に答えなさい。男の人は何時に会社に着きますか。',
    audioUrl: '/audio/test-listening.mp3',
    options: ['8時半', '9時', '9時半', '10時'],
    correctIndex: 2,
    explanation: '会話の中で「9時半に着きます」という内容が含まれています。正確に時間を聞き取ることが重要です。',
  },
  {
    id: 'listening-2',
    section: 'listening',
    text: '録音を聞いて、質問に答えなさい。女性が誕生日に欲しいプレゼントは何ですか。',
    audioUrl: '/audio/sample-2.mp3',
    options: ['本', '花', '時計', 'ハンカチ'],
    correctIndex: 0,
    explanation: '女性は「本が読みたい」と言っており、誕生日プレゼントとして本を希望していることが分かります。',
  },
  {
    id: 'listening-3',
    section: 'listening',
    text: '録音を聞いて、質問に答えなさい。この人は明日何をしますか。',
    audioUrl: '/audio/sample-3.mp3',
    options: ['映画を見る', '買い物に行く', '家で休む', '友達に会う'],
    correctIndex: 2,
    explanation: '話者は「明日は家でゆっくり休みたい」と言っており、家で休むことを計画していることが分かります。',
  },
];

// Export all questions as a flat array
export const allQuestions: Question[] = [
  ...vocabularyQuestions,
  ...grammarQuestions,
  ...readingQuestions,
  ...listeningQuestions,
];

// Get all questions as a flat array (keeping for backward compatibility or renaming if needed)
export const getAllQuestionsFlat = (): Question[] => {
  return allQuestions;
};

// Get sections configuration
export const getSections = (): Section[] => {
  const sections: SectionType[] = ['vocabulary', 'grammar', 'reading', 'listening'];

  return sections.map(type => {
    const sectionQuestions = allQuestions.filter(q => q.section === type);
    const config = SECTION_CONFIG[type];

    return {
      type,
      title: config.title,
      description: config.description,
      timeLimit: config.timeLimit,
      questions: sectionQuestions,
    };
  });
};

// Get questions by level and sections with a specific count mode
export const getFilteredQuestions = (
  level: string,
  selectedSections: SectionType[],
  countMode: QuestionCountMode,
  levelConfig: any // LevelConfig from jlpt-levels.ts
): Question[] => {
  let filtered: Question[] = [];

  // Sort selected sections to maintain consistent order: vocab, grammar, reading, listening
  const order: SectionType[] = ['vocabulary', 'grammar', 'reading', 'listening'];
  const sortedSections = [...selectedSections].sort((a, b) => order.indexOf(a) - order.indexOf(b));

  sortedSections.forEach(sectionType => {
    // Filter questions by section
    const sectionQuestions = allQuestions.filter(q => q.section === sectionType);

    // Determine how many questions to take
    let limit = 0;
    if (countMode === 'quick') limit = 5;
    else if (countMode === 'balanced') limit = 10;
    else if (countMode === 'custom') limit = 15;
    else {
      // Standard - use metadata from jlpt-levels.ts
      limit = levelConfig.sections[sectionType]?.questionCount || 20;
    }

    // Slice (for now just slice the first few)
    filtered = [...filtered, ...sectionQuestions.slice(0, limit)];
  });

  return filtered;
};

// Get questions by level (for backward compatibility)
export const getQuestionsByLevel = (level: string): Question[] => {
  return allQuestions;
};