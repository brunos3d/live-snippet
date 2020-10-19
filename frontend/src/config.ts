import dotenv from "dotenv";

function config() {
    const NODE_ENV = process.env["NODE_ENV"];
    console.log(`====== NODE_ENV: ${NODE_ENV} ======`);
    dotenv.config({ path: `./config/.env.${NODE_ENV}.local` });
}

export default config();
