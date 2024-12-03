const serverUrls = [
    process.env.SERVER1_URL,
    process.env.SERVER2_URL,
    process.env.SERVER3_URL,
    process.env.SERVER4_URL,
    process.env.SERVER5_URL,
];

export const HEALTH_CHECK_PATH = 'health';
export const HEALTH_CHECK_INTERVAL = 10;

export const servers = {
    backends: serverUrls.filter(s => {
        if (s) return s
    })
}