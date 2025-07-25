// src/hooks/useDragToScroll.js
import { useRef, useEffect } from 'react';

export const useDragToScroll = () => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        const onMouseDown = (e) => {
            isDown = true;
            el.style.cursor = 'grabbing'; // Change cursor on the element itself
            document.body.style.cursor = 'grabbing'; // And on the body to be safe
            document.body.style.userSelect = 'none'; // *** FIX: Disable text selection globally ***

            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        };

        const onMouseUp = () => {
            isDown = false;
            el.style.cursor = 'grab';
            document.body.style.cursor = 'auto';
            document.body.style.userSelect = 'auto'; // *** FIX: Re-enable text selection ***
        };

        const onMouseLeave = () => {
            isDown = false;
            el.style.cursor = 'grab';
            document.body.style.cursor = 'auto';
            document.body.style.userSelect = 'auto'; // *** FIX: Also re-enable on leave ***
        };

        const onMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault(); // This is still important
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 1.5; // *** FIX: Removed laggy multiplier, using a smoother one ***
            el.scrollLeft = scrollLeft - walk;
        };

        // Add event listeners
        el.addEventListener('mousedown', onMouseDown);
        el.addEventListener('mouseup', onMouseUp);
        el.addEventListener('mouseleave', onMouseLeave);
        el.addEventListener('mousemove', onMouseMove);

        // Cleanup function to remove listeners
        return () => {
            el.removeEventListener('mousedown', onMouseDown);
            el.removeEventListener('mouseup', onMouseUp);
            el.removeEventListener('mouseleave', onMouseLeave);
            el.removeEventListener('mousemove', onMouseMove);
        };
    }, []); // The empty dependency array ensures this effect runs only once

    return ref; // Return the ref to be attached
};