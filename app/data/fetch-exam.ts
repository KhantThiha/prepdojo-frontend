import { JLPTLevel, SectionType, Question } from '@/app/types/exam';
import { JLPT_LEVEL_CONFIGS } from '@/app/data/jlpt-levels';
import { ExamConfig } from '@/app/types/exam';

/**
 * Fetches random questions from the API and filters them based on the provided configuration.
 */
export async function fetchAndFilterExamQuestions(
    level: JLPTLevel,
    config: ExamConfig
): Promise<Question[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${apiUrl}/api/v1/exam/random`, {
        headers: {
            'X-Custom-Header': process.env.NEXT_PUBLIC_X_CUSTOM_HEADER || '',
        },
    });
    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    const apiQuestions: Question[] = data.questions || [];

    const levelConfig = JLPT_LEVEL_CONFIGS[level];
    let questions: Question[] = [];

    // Sort selected sections to maintain consistent order: vocab, grammar, reading, listening
    const order: SectionType[] = ['vocabulary', 'grammar', 'reading', 'listening'];
    const sortedSections = [...config.selectedSections].sort((a, b) => order.indexOf(a) - order.indexOf(b));

    sortedSections.forEach(sectionType => {
        const sectionQuestions = apiQuestions.filter((q: any) => q.section === sectionType);

        let limit = 0;
        if (config.questionCountMode === 'quick') limit = 5;
        else if (config.questionCountMode === 'balanced') limit = 10;
        else if (config.questionCountMode === 'custom') limit = 15;
        else {
            limit = levelConfig.sections[sectionType]?.questionCount || 20;
        }

        questions = [...questions, ...sectionQuestions.slice(0, limit)];
    });

    return questions;
}
