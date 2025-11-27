import React, { useEffect, useRef } from 'react';
import katex from 'katex';

export default function MathText({ children, inline = true }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && children) {
            try {
                // Render math using KaTeX
                katex.render(children, containerRef.current, {
                    throwOnError: false,
                    displayMode: !inline,
                    strict: false
                });
            } catch (error) {
                // If KaTeX fails, just show the text
                containerRef.current.textContent = children;
            }
        }
    }, [children, inline]);

    return inline ? (
        <span ref={containerRef} className="math-inline" />
    ) : (
        <div ref={containerRef} className="math-display my-2" />
    );
}

// Helper function to detect and render math in text
export function renderTextWithMath(text) {
    if (!text) return text;

    const parts = [];
    let currentIndex = 0;

    // First, find all $$...$$ (display math)
    const displayMatches = [...text.matchAll(/\$\$(.*?)\$\$/g)];

    // Then find all $...$ (inline math) but exclude those inside $$...$$
    const inlineMatches = [...text.matchAll(/\$([^$]+?)\$/g)];

    // Combine and sort all matches by position
    const allMatches = [
        ...displayMatches.map(m => ({
            type: 'display',
            content: m[1],
            start: m.index,
            end: m.index + m[0].length
        })),
        ...inlineMatches.map(m => ({
            type: 'inline',
            content: m[1],
            start: m.index,
            end: m.index + m[0].length
        }))
    ].sort((a, b) => a.start - b.start);

    // Remove overlapping matches (display takes precedence)
    const filteredMatches = [];
    let lastEnd = 0;

    for (const match of allMatches) {
        if (match.start >= lastEnd) {
            filteredMatches.push(match);
            lastEnd = match.end;
        }
    }

    // Build parts array
    for (const match of filteredMatches) {
        // Add text before this match
        if (match.start > currentIndex) {
            parts.push({
                type: 'text',
                content: text.slice(currentIndex, match.start)
            });
        }

        // Add the math
        parts.push({
            type: match.type === 'display' ? 'display-math' : 'inline-math',
            content: match.content
        });

        currentIndex = match.end;
    }

    // Add remaining text
    if (currentIndex < text.length) {
        parts.push({
            type: 'text',
            content: text.slice(currentIndex)
        });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
}

// Component to render text with embedded math
export function TextWithMath({ children }) {
    if (!children) return null;

    const parts = renderTextWithMath(children);

    return (
        <>
            {parts.map((part, index) => {
                if (part.type === 'inline-math') {
                    return <MathText key={index} inline={true}>{part.content}</MathText>;
                } else if (part.type === 'display-math') {
                    return <MathText key={index} inline={false}>{part.content}</MathText>;
                } else {
                    return <span key={index}>{part.content}</span>;
                }
            })}
        </>
    );
}
