export function formatReadableDate(isoString: string): string {
    if (!isoString) return '';

    const date = new Date(isoString);

    // Configuramos el formato a tu gusto
    return new Intl.DateTimeFormat('es-CR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // true para AM/PM, false para formato 24h
    }).format(date);
}