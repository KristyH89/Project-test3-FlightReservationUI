import { useEffect } from "react";

// Sets the browser tab title for the page that calls this hook, and
// automatically restores the previous title when that page unmounts
export function usePageTitle(title: string) {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = `${title} — Fly Orange`;

        return () => {
            document.title = previousTitle;
        };
    }, [title]);
}