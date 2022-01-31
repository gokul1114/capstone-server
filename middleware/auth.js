import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    try {
        //console.log(request.header)
        const key = process.env.SECRET_KEY||"token"
        const token = request.header("x-auth-token");
        const isCustomAuth = token.length < 500;
        let decodedData;
        if (token && isCustomAuth) {      
          decodedData = jwt.verify(token,  process.env.SECRET_KEY);
          req.userId = decodedData?.id;
        } else {
          decodedData = jwt.decode(token);
          req.userId = decodedData?.sub;
        }    
        next();
      } catch (error) {
        res.status(401).send(err)
      }
    };
    
    export default auth;
