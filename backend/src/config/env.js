
const environment = (process.env.ENVIRONMENT || 'development').toLowerCase();

export const env = {
    DB_PORT: process.env.MYSQL_ADDON_PORT,
    DB_URI: (environment === "development") ? process.env.LOCAL_ADDON_URI : process.env.MYSQL_ADDON_URI,
    API_PORT: process.env.API_PORT || 3000,
    ENVIRONMENT: environment,
    FIREBASE_SERVICE_ACCOUNT : process.env.FIREBASE_SERVICE_ACCOUNT
};

const requiredVars = ['DB_URI', 'API_PORT', 'ENVIRONMENT', 'FIREBASE_SERVICE_ACCOUNT'];

requiredVars.forEach((varName) => {
    if (!env[varName]) {
        throw new Error(`❌ Error de configuración: La variable de entorno "${varName}" no está definida.`);
    }
});