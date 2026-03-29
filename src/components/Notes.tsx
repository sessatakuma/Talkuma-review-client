import React, { useEffect, useRef } from 'react';

import { X } from 'lucide-react';

import type { Mistake, MistakeType, TranscriptItem } from 'src/types/transcript';

import 'components/Notes.css';

interface NotesProps {
    note: string;
    onNoteChange: (note: string) => void;
    mistake: Mistake | null;
    setMistake: React.Dispatch<React.SetStateAction<Mistake | null>>;
    selectedCaptionIndex: number;
    selectedCaption: TranscriptItem | null;
}

export default function Notes({
    note,
    onNoteChange,
    mistake,
    setMistake,
    selectedCaptionIndex,
    selectedCaption,
}: NotesProps) {
    const typeMap: Record<MistakeType, string> = {
        vocab: '単語',
        grammar: '文法',
        voice: '発音',
        advance: '上級',
    };
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (selectedCaptionIndex !== -1 && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [selectedCaptionIndex]);

    return (
        <section className='notes'>
            {selectedCaptionIndex === -1 ? (
                <div className='placeholder'>
                    <p>サブタイトルをクリックすると、対応するメモが開きます。</p>
                </div>
            ) : (
                <div className='notes-content'>
                    {selectedCaption && (
                        <div className='selected-caption'>
                            <p className='text'>
                                {selectedCaption.textSegments.map((textSegment, j) => {
                                    const hasMistake =
                                        textSegment.highlight && textSegment.mistakes?.length > 0;
                                    const targetMistake = hasMistake
                                        ? textSegment.mistakes[0]
                                        : null;

                                    return (
                                        <span
                                            key={j}
                                            className={
                                                hasMistake ? 'highlight ' + targetMistake!.type : ''
                                            }
                                            onClick={(e) => {
                                                if (!hasMistake) return;
                                                e.stopPropagation();
                                                setMistake(targetMistake);
                                            }}
                                        >
                                            {textSegment.text}
                                        </span>
                                    );
                                })}
                            </p>
                        </div>
                    )}

                    {mistake && (
                        <div className={'feedback ' + mistake.type}>
                            <div className='feedback-header'>
                                <h4>{typeMap[mistake.type] + 'の問題'}</h4>
                                <button className='close-feedback' onClick={() => setMistake(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <p className='comment'>{mistake.comment}</p>
                        </div>
                    )}
                    <textarea
                        ref={textareaRef}
                        className='notes-textarea'
                        value={note}
                        onChange={(e) => onNoteChange(e.target.value)}
                        placeholder='メモを取りましょう'
                    />
                </div>
            )}
        </section>
    );
}
