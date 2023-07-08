import { date } from 'quasar'

const AUDIO_GOLD_FILE = '/sounds/LootCoinSmall.ogg'

export function formatTimeStampToDate(dateArg: Date | string) {
    return date.formatDate(dateArg, 'DD-MM-YYYY')
}

export function formatTimeStampToDateISO(dateArg: string) {
    const dateParts = dateArg.split('-');
    return new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
}

export function generateEvolutionId() {
    const today = new Date();
    return today.getMonth() + '_' + today.getFullYear();
}

export function dateToLocalString(dateArg: Date | string) {
    const stringDate = new Date(date.formatDate(dateArg, 'DD-MM-YYYY')).toLocaleDateString('fr', {month: 'long', year: 'numeric'})
    return stringDate.charAt(0).toUpperCase() + stringDate.slice(1);
}

export function playGoldSound() {
    const goldSound = new Audio(AUDIO_GOLD_FILE)
    goldSound.volume = 0.2
    goldSound.play()
}
