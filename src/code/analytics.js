import { GameAnalytics } from 'gameanalytics'
import gakeys from './gakeys'

export function initAnalytics() {
    if (gakeys.enable) {
        GameAnalytics.setEnabledInfoLog(true);
        GameAnalytics.initialize(gakeys.game, gakeys.secret);
    }
}
export function sendDesignEvent(event, value) {
    if (gakeys.enable) {
        GameAnalytics.addDesignEvent(event, value);
    }
}