import Joi from 'joi'
import CustomErrorHandler from '../../services/CustomErrorHandler';
const registerController= {
     async register(req,res,next){
        //checklist
        //[-] validate the request
        //[-] authorise the request
        //[-] check if the user is in the database already
        //[-] prepare model 
        //[-] store in database
        //[-] generate jwt token
        //[-] send responses

        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });
        console.log(req.body);
        const {error} = registerSchema.validate(req.body);

        if(error){
            return next(error);
        }

        //check if the user is in the database already
        try{
            const exist = await User.exists({ email: req.body.email});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
            }
        }catch(err){

        }
        res.json({ msg: "Hello from express "});
    }
}


export default registerController;