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
            el.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        };

        const onMouseUpOrLeave = () => {
            isDown = false;
            el.style.cursor = 'grab';
            document.body.style.userSelect = 'auto';
        };

        const onMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 2; // Speed multiplier
            el.scrollLeft = scrollLeft - walk;
        };

        el.addEventListener('mousedown', onMouseDown);
        el.addEventListener('mouseup', onMouseUpOrLeave);
        el.addEventListener('mouseleave', onMouseUpOrLeave);
        el.addEventListener('mousemove', onMouseMove);

        return () => {
            el.removeEventListener('mousedown', onMouseDown);
            el.removeEventListener('mouseup', onMouseUpOrLeave);
            el.removeEventListener('mouseleave', onMouseUpOrLeave);
            el.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return ref;
};