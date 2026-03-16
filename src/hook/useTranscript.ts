import { useState, useEffect, useMemo } from 'react';

import data from 'data/transcript.json';

import type { TranscriptData, TranscriptItem, TextSegment } from 'src/types/transcript';

interface RawTranscript {
    transcript: string;
    start_time: number;
    end_time: number;
    subwords: Subword[];
    note: string;
}

interface RawTranscriptData {
    transcripts: RawTranscript[];
    mistakes: Mistake[];
}

interface Subword {
    surface: string;
    accent: Array<{ furigana: string; accent_marking_type: number }>;
    mistake_ids: number[];
}

interface Mistake {
    mistake_id: number;
    type: string;
    origin_text: string;
    fixed_text: string;
    comment: string;
}

function processTranscriptData(rawData: RawTranscriptData): TranscriptData {
    // 1. 補齊空資料時的回傳結構，避免 TS 報錯
    if (!rawData) {
        return {
            date: null,
            practice_type: null,
            transcripts: [],
            notes: [],
        };
    }

    const mistakesMap = new Map(rawData.mistakes.map((m) => [m.mistake_id, m]));
    const notes = rawData.transcripts.map((t) => t.note || '');

    const transcripts: TranscriptItem[] = rawData.transcripts.map((t, index) => {
        const textSegments = t.subwords.map((sw) => {
            const mistakes = sw.mistake_ids
                .map((id) => mistakesMap.get(id))
                .filter((m): m is Mistake => m !== undefined);

            return {
                text: sw.surface,
                highlight: mistakes.length > 0,
                mistakes: mistakes,
                subword: sw,
            } as unknown as TextSegment;
        });

        return {
            id: index,
            time: t.start_time,
            text: t.transcript,
            textSegments,
            speaker_id: 'unknown',
        };
    });

    return {
        date: null,
        practice_type: null,
        transcripts,
        notes,
    };
}

export default function useTranscript(currentTime: number) {
    const initialData = useMemo(() => processTranscriptData(data as any), []);

    const [transcriptData, setTranscriptData] = useState(initialData);
    const [selectedCaptionIndex, setSelectedCaptionIndex] = useState(-1);
    const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);

    useEffect(() => {
        let index = -1;
        const list = transcriptData.transcripts;

        for (let i = 0; i < list.length; i++) {
            if (currentTime >= list[i].time) {
                index = i;
            } else {
                break;
            }
        }

        if (index !== -1 && index !== currentCaptionIndex) {
            setCurrentCaptionIndex(index);
        }
    }, [currentTime, transcriptData.transcripts, currentCaptionIndex]);

    const updateNote = (index: number, newText: string) => {
        setTranscriptData((prevData) => {
            const newNotes = [...prevData.notes];
            newNotes[index] = newText;
            return {
                ...prevData,
                notes: newNotes,
            };
        });
    };

    return {
        ...transcriptData,
        currentCaptionIndex,
        selectedCaptionIndex,
        setSelectedCaptionIndex,
        updateNote,
    };
}
