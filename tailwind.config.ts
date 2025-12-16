import type {Config} from "tailwindcss";
const config: Config = {
    darkMode: "class",
    content:[
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme:{
        extend:{}
    },
    plugins: [
    ],
};
export default config;
