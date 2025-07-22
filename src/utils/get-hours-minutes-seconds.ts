export function getHoursMinutesSeconds(remainSeconds: number) {
    const hours = Math.floor(remainSeconds / 3600);
    const minutes = Math.floor((remainSeconds - hours * 60) / 60);
    const seconds = Math.floor(remainSeconds - hours * 3600 - minutes * 60);
    return [hours, minutes, seconds];
}
