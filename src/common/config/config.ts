export const config = () => ({
    databaseUri: process.env.MONGODB_URI || "mongodb://localhost:27017/url-shortener"
});