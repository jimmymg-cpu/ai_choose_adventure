"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

interface ReaderProps {
    content: string;
    paragraphsPerPage?: number;
    fontSize?: number;
    onPageChange?: (current: number, total: number) => void;
    onLastPage?: (isLast: boolean) => void;
}

export default function Reader({ content, paragraphsPerPage = 5, fontSize = 18, onPageChange, onLastPage }: ReaderProps) {
    const [currentPage, setCurrentPage] = useState(0);

    const allParagraphs = content.split('\n\n').filter(p => p.trim() !== '');

    // Chunk paragraphs into pages
    const pages: string[][] = [];
    for (let i = 0; i < allParagraphs.length; i += paragraphsPerPage) {
        pages.push(allParagraphs.slice(i, i + paragraphsPerPage));
    }

    const totalPages = pages.length;

    useEffect(() => {
        setCurrentPage(0);
    }, [content]);

    useEffect(() => {
        if (totalPages > 0) {
            onPageChange?.(currentPage + 1, totalPages);
            onLastPage?.(currentPage === totalPages - 1);
        } else {
            onPageChange?.(1, 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, totalPages]);


    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Keyboard support for desktop
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextPage();
            else if (e.key === 'ArrowLeft') prevPage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, totalPages]);

    const handlers = useSwipeable({
        onSwipedLeft: () => nextPage(),
        onSwipedRight: () => prevPage(),
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    if (totalPages === 0) return null;

    return (
        <div {...handlers} className="relative w-full max-w-2xl mx-auto touch-pan-y min-h-[50vh]">
            <AnimatePresence mode="wait">
                <motion.article
                    key={currentPage}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="prose prose-invert lg:prose-lg font-serif leading-loose transition-all duration-300 w-full mx-auto"
                    style={{ fontSize: `${fontSize}px` }}
                >
                    {pages[currentPage].map((p, idx) => (
                        <p key={idx} className="mb-6 indent-8 text-[var(--color-text-primary)]">
                            {p}
                        </p>
                    ))}
                </motion.article>
            </AnimatePresence>

            {/* Tap areas for desktop / thumb tap turning - significantly widened for desktop UX */}
            <div
                className="absolute inset-y-0 left-0 w-1/5 md:w-32 cursor-pointer z-10 flex items-center justify-start opacity-0 hover:opacity-10 transition-opacity"
                onClick={prevPage}
                title="Previous Page"
            >
                <div className="h-full w-full bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
            </div>
            <div
                className="absolute inset-y-0 right-0 w-1/5 md:w-32 cursor-pointer z-10 flex items-center justify-end opacity-0 hover:opacity-10 transition-opacity"
                onClick={nextPage}
                title="Next Page"
            >
                <div className="h-full w-full bg-gradient-to-l from-[var(--color-primary)] to-transparent" />
            </div>
        </div>
    );
}
