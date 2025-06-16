const lang = document.documentElement.lang || 'de';
const i18n_de = {
    de: 'Deutsch',
    en: 'Englisch',
    language: 'Kommunikationssprache',
    datetime: 'Datum und Zeit',
    location: 'Ort',
    storyteller: 'Storyteller',
    information: 'Weitere Informationen',
    registration: 'Zur Anmeldung',
    page: 'Seite',
    of: 'von',
    nyd: 'Noch nicht bestimmt',
}
const i18n_nds = {
    de: 'Hööchdüütsch',
    en: 'Engelsch',
    language: 'Snackwark',
    datetime: 'Datum un Tied',
    location: 'Steed',
    storyteller: 'Storyteller',
    information: 'Määd Informations',
    registration: 'För de Anmeldung',
    page: 'Siet',
    of: 'ut',
    nyd: 'Noch nich festlegt',
}
const i18n_en = {
    de: 'German',
    en: 'English',
    language: 'Communication language',
    datetime: 'Date and time',
    location: 'Location',
    storyteller: 'Storyteller',
    information: 'More information',
    registration: 'To the registration',
    page: 'Page',
    of: 'of',
    nyd: 'Not yet determined',
}
const i18n = {
    de: i18n_de, en: {...i18n_de, ...i18n_en}, nds: {...i18n_de, ...i18n_nds},
}

function findStartsWith(array, value) {
    return array.findIndex(elem => elem.startsWith(value));
}

function setLanguage(language, event = null) {
    if (event) event.preventDefault();
    localStorage.setItem('language', language);
    if (language !== lang) {
        if (language === 'de') {
            window.location.href = '/' + window.location.hash;
        } else {
            window.location.href = '/' + language + '/' + window.location.hash;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let language = localStorage.getItem('language');
    if (!language) {
        if (lang !== 'de') {
            language = lang;
        } else {
            // if 'en' and ('en' before 'de' or no 'de' at all) -> en
            // -> defaults to 'de' if no 'en' (international guests without knowledge of 'en')
            if (findStartsWith(navigator.languages, 'en') > -1 && (findStartsWith(navigator.languages, 'en') < findStartsWith(navigator.languages, 'de') || findStartsWith(navigator.languages, 'de') < 0)) {
                language = 'en';
            } else {
                language = 'de'
            }
        }
    }
    setLanguage(language);
});
