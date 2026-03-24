import React from "react"

export function useSkipper() {
    const shouldSkipRef = React.useRef(true)
    const shouldSkip = shouldSkipRef.current

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    React.useEffect(() => {
        shouldSkipRef.current = true
    })

    return [shouldSkip, skip] as const
}



export const formatNumber = (val: number | null) => {
    if (val) {
        const [integer, decimal] = val.toString().split(".")
        const formattedInt = parseInt(integer).toLocaleString()
        return decimal !== undefined ? `${formattedInt}.${decimal}` : formattedInt
    } else return 0
}


export function handleGridNavigation(e: React.KeyboardEvent<HTMLInputElement>) {
    const current = e.currentTarget;

    const row = Number(current.dataset.row);
    const col = Number(current.dataset.col);

    // Find the parent table container
    const tableContainer = current.closest<HTMLDivElement>('[data-table]');

    if (!tableContainer) return; // safety

    const selector = (r: number, c: number) =>
        tableContainer.querySelector<HTMLInputElement>(`input[data-row="${r}"][data-col="${c}"]`);

    // TAB (→)
    if (e.key === "Tab") {
        e.preventDefault();

        if (e.shiftKey) {
            // ← Shift+Tab
            const prev =
                selector(row, col - 1) ||
                selector(row - 1, Number.MAX_SAFE_INTEGER); // fallback only within this table
            prev?.focus();
            prev?.select();
        } else {
            // →
            const next =
                selector(row, col + 1) ||
                selector(row + 1, 0); // only within current table
            next?.focus();
            next?.select();
        }
    }

    // ENTER (↓)
    if (e.key === "Enter") {
        e.preventDefault();
        const next = e.shiftKey
            ? selector(row - 1, col)
            : selector(row + 1, col);
        next?.focus();
        next?.select();
    }

    // ARROWS
    if (e.key === "ArrowRight") {
        e.preventDefault();
        selector(row, col + 1)?.focus();
    }

    if (e.key === "ArrowLeft") {
        e.preventDefault();
        selector(row, col - 1)?.focus();
    }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        selector(row + 1, col)?.focus();
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();
        selector(row - 1, col)?.focus();
    }
}