import dotenv from "dotenv"
dotenv.config()


if(!process.env.MONGO_URI){
    console.error("MONGO_URI must be defined")
    process.exit(1)
}
if(!process.env.IMAGEKIT_PUBLIC_KEY){
    console.error("IMAGEKIT_PUBLIC_KEY must be defined")
    process.exit(1)
}
if(!process.env.IMAGEKIT_PRIVATE_KEY){
    console.error("IMAGEKIT_PRIVATE_KEY must be defined")
    process.exit(1)
}
if(!process.env.IMAGEKIT_URL_ENDPOINT){
    console.error("IMAGEKIT_URL_ENDPOINT must be defined")
    process.exit(1)
}
if(!process.env.JWT_SECRET){
    console.error("JWT_SECRET must be defined")
    process.exit(1)
}
const config = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
    JWT_SECRET: process.env.JWT_SECRET,
}

export default config
