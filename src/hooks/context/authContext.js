require('dotenv').config()

export default function isAuthorized(req) {  
  return req?.headers?.authorization == process.env.API_TOKEN;
}