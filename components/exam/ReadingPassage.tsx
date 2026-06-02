'use client';

import { useState, useRef, useMemo } from 'react';
import { Highlighter as HighlighterIcon, Eraser, Underline } from 'lucide-react';
import { Highlighter } from '@/components/ui/highlighter';
import { cn } from '@/lib/utils';

interface ReadingPassageProps {
    title: string;
    content: string;
}

interface Highlight {
    id: string; // Added ID for React keys stability
    start: number;
    end: number;
    color: string;
    action: 'highlight' | 'underline';
}

export function ReadingPassage({ title, content }: ReadingPassageProps) {
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [activeAction, setActiveAction] = useState<'highlight' | 'underline' | null>(null);
    const [activeColor, setActiveColor] = useState<string>('#fde047');
    const contentRef = useRef<HTMLDivElement>(null);

    // Memoize lines to prevent recalculation on every render
    const lines = useMemo(() => content.split('\n'), [content]);

    // Helper: Calculate absolute character offset from a DOM node
    const getAbsoluteOffset = (root: Node, node: Node, offset: number): number => {
        const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        let totalOffset = 0;
        
        while (treeWalker.nextNode()) {
            const current = treeWalker.currentNode;
            if (current === node) {
                return totalOffset + offset;
            }
            // Use length of text content. Ensure we handle nulls safely.
            totalOffset += current.textContent?.length || 0;
        }
        return totalOffset;
    };

    const handleMouseUp = () => {
        if (!activeAction) return;

        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !contentRef.current) return;

        const range = selection.getRangeAt(0);
        
        // Ensure selection is within our content div
        if (!contentRef.current.contains(range.commonAncestorContainer)) return;

        // Calculate exact start and end offsets using DOM traversal
        // This fixes the "indexOf" issue with duplicate text
        const start = getAbsoluteOffset(contentRef.current, range.startContainer, range.startOffset);
        const end = getAbsoluteOffset(contentRef.current, range.endContainer, range.endOffset);

        if (start === end) return;

        // Create new highlight
        const newHighlight: Highlight = {
            id: Math.random().toString(36).substr(2, 9),
            start,
            end,
            color: activeColor,
            action: activeAction
        };

        // Filter out any highlights that overlap with the new one
        // Logic: Remove old if (OldStart < NewEnd AND OldEnd > NewStart)
        const filteredHighlights = highlights.filter(h => !(h.start < end && h.end > start));

        setHighlights([...filteredHighlights, newHighlight]);
        
        // Optional: Keep selection active or remove it. 
        // Removing it prevents visual glitch where browser selection overlaps React highlight
        selection.removeAllRanges(); 
    };

    const clearHighlights = () => setHighlights([]);

    const renderHighlightedText = (text: string, lineIndex: number) => {
        // Calculate the starting index of this line in the full content string
        let lineStartOffset = 0;
        for (let i = 0; i < lineIndex; i++) {
            lineStartOffset += lines[i].length + 1; // +1 for newline character
        }
        const lineEndOffset = lineStartOffset + text.length;

        // Find highlights relevant to this specific line
        const lineHighlights = highlights
            .filter(h => h.start < lineEndOffset && h.end > lineStartOffset)
            .sort((a, b) => a.start - b.start);

        // If no highlights for this line, return plain text
        if (lineHighlights.length === 0) return text;

        const nodes: React.ReactNode[] = [];
        let lastIndex = 0; // Tracks cursor within the current line text

        lineHighlights.forEach((h) => {
            // Convert global offsets to local line offsets
            const startInLine = Math.max(0, h.start - lineStartOffset);
            const endInLine = Math.min(text.length, h.end - lineStartOffset);

            // Push text before the highlight
            if (startInLine > lastIndex) {
                nodes.push(
                    <span key={`text-${h.id}-${lastIndex}`}>
                        {text.slice(lastIndex, startInLine)}
                    </span>
                );
            }

            // Push the highlighted component
            nodes.push(
                <Highlighter
                    key={h.id}
                    action={h.action}
                    color={h.color}
                    isView={true}
                    animationDuration={300}
                    multiline={true}
                >
                    {text.slice(startInLine, endInLine)}
                </Highlighter>
            );

            lastIndex = endInLine;
        });

        // Push remaining text after the last highlight
        if (lastIndex < text.length) {
            nodes.push(
                <span key={`text-end-${lineIndex}`}>
                    {text.slice(lastIndex)}
                </span>
            );
        }

        return nodes;
    };

    return (
        <section className="flex flex-1 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
             {/* ... Header / Controls code remains the same ... */}
             <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#3182ed] uppercase tracking-widest">Section 3: Reading</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setActiveAction(activeAction === 'highlight' ? null : 'highlight')}
                                className={cn(
                                    "px-2 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                                    activeAction === 'highlight' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                <HighlighterIcon size={14} /> Highlight
                            </button>
                            <button
                                onClick={() => setActiveAction(activeAction === 'underline' ? null : 'underline')}
                                className={cn(
                                    "px-2 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                                    activeAction === 'underline' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                <Underline size={14} /> Underline
                            </button>

                            <div className="w-px h-4 self-center bg-slate-300 dark:bg-slate-700 mx-1" />
                            <button
                                onClick={() => setActiveColor('#fde047')}
                                className={cn(
                                    "size-5 rounded-full bg-yellow-200 border border-yellow-400 transition-all",
                                    activeColor === '#fde047' ? "bg-[#fde047] border-yellow-500 scale-110 shadow-sm" : "bg-[#fef08a] border-yellow-200 opacity-60 hover:opacity-100"
                                )}
                                title="Yellow"
                            />
                            <button
                                onClick={() => setActiveColor('#93c5fd')}
                                className={cn(
                                    "size-5 rounded-full bg-blue-200 border border-blue-400 transition-all",
                                    activeColor === '#93c5fd' ? "bg-[#93c5fd] border-blue-500 scale-110 shadow-sm" : "bg-[#bfdbfe] border-blue-200 opacity-60 hover:opacity-100"
                                )}
                                title="Blue"
                            />
                            <div className="w-px h-4 self-center bg-slate-300 dark:bg-slate-700 mx-1" />
                            <button
                                onClick={clearHighlights}
                                className="size-6 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                title="Clear All Tool Actions"
                            >
                                <Eraser size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar transition-all bg-white dark:bg-slate-900">
                <div className="max-w-3xl mx-auto selection:bg-[#3182ed]/20">
                    <h4 className="text-slate-900 dark:text-white text-xl font-black mb-8 border-b-2 pb-3 border-[#3182ed]/10">
                        問題: 次の文章を読んで、後の問いに対する答えを一つ選びなさい。
                    </h4>

                    <div
                        ref={contentRef}
                        onMouseUp={handleMouseUp}
                        className="flex flex-col gap-0 select-text" // Ensure select-text is enabled
                    >
                        {lines.map((line, idx) => (
                            <div
                                key={idx}
                                className="japanese-text text-[1.125rem] leading-[2.6] font-medium transition-all duration-300 px-4 -mx-4 rounded-lg"
                                style={{ letterSpacing: '0.04em' }}
                            >
                                {line.trim() === '' ? '\u00A0' : renderHighlightedText(line, idx)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-8 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <HighlighterIcon size={10} className="text-[#3182ed]" />
                <span>Tip: Select a tool (Highlight or Underline) and text to annotate.</span>
            </div>
        </section>
    );
}