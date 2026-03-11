'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function generateVisitorId(): string {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem('sponge_visitor_id');
    if (!id) {
        id = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('sponge_visitor_id', id);
    }
    return id;
}

export default function PageTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Skip tracking for admin pages
        if (pathname.startsWith('/admin')) return;

        const visitorId = generateVisitorId();
        if (!visitorId) return;

        // Fire and forget — non-blocking
        fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                visitorId,
                pagePath: pathname,
                referrer: document.referrer || null,
            }),
        }).catch(() => {
            // Silently ignore tracking failures
        });
    }, [pathname]);

    return null;
}
