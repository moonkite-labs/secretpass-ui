
const BASE_URL = "http://155.4.109.218";
const WEB_PORT = 3000;
const API_PORT = 7777;
export const WEB_URL = `${BASE_URL}:${WEB_PORT}`;
export const WEB_TEXT_DECRYPTION_URL = `${BASE_URL}:${WEB_PORT}/t/d/`;
export const WEB_FILE_DECRYPTION_URL = `${BASE_URL}:${WEB_PORT}/t/d/`;
export const WEB_TEXT_DECRYPTION_URL_WITH_PIN = `${BASE_URL}:${WEB_PORT}/t/d/p/`;
export const TEXT_API_URL = `${BASE_URL}:${API_PORT}/secret`;
export const FILE_API_URL = `${BASE_URL}:${API_PORT}/file`;
export const EMAIL_API_URL = `${BASE_URL}:${API_PORT}/email`;
