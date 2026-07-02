export function formatReadableDate(isoString: string): string {
    // 1. Validar que no sea null, undefined o string vacío
    if (!isoString) return '-';

    // 2. Intentar convertir a objeto Date
    const date = new Date(isoString);

    // 3. Validar si la fecha es "Inválida"
    // isNaN(date.getTime()) detecta fechas como "2026-07-01T..." que fallaron al parsearse
    if (isNaN(date.getTime())) {
        return '-'; 
    }

    // 4. Formatear con seguridad
    return new Intl.DateTimeFormat('es-CR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}