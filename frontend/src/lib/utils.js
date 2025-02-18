export function formatMsgTime(date) {
    return new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
}