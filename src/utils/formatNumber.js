// Da muss auch nichts installiert werden, funktioniert direkt!
export default function formatNumber (num) {
    if (num === "") return "";
    return new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};