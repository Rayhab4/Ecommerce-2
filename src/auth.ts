import { Request, Response, NextFunction } from "express";
const {logger} = require("./loggers")
const isApiKeyValid =require("./Models/apiKey")
async function checkApiKey(req: Request, res: Response, next: NextFunction ) {
const authHeader=req.headers["authorization"]
if (authHeader === undefined){
    return res.status(400).json ({message: 'API is missing'})
}
const apiKey =authHeader.substring(6)
let check
try{
    check=await isApiKeyValid({ apiKey})
}catch (e){
    logger.error(e)
    return res.sendStatus(500)
}
if (check ===undefined) return res.sendStatus(500)
    if (check=== false)return res.sendStatus(401)
        next()
}
module.exports=checkApiKey