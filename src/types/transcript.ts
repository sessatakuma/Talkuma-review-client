export type MistakeType = 'vocab' | 'grammar' | 'voice' | 'advance';

export interface Mistake {
    mistake_id: number;
    start_time: number;
    end_time: number;
    type: MistakeType;
    origin_text: string;
    fixed_text: string;
    comment: string;
}

export interface Subword {
    surface: string;
    accent: Array<{
        furigana: string;
        accent_marking_type: number;
    }>;
    mistake_ids: number[];
}

export interface TextSegment {
    text: string;
    highlight: boolean;
    mistakes: Mistake[];
    subword: Subword;
}

export interface TranscriptItem {
    id: number;
    time: number;
    speaker_id: string;
    text: string;
    textSegments: TextSegment[];
}

export interface TranscriptData {
    date: string | null;
    practice_type?: string | null;
    transcripts: TranscriptItem[];
    notes: string[];
}
