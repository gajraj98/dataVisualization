import dao from '../Dao/userDao.js'
import twilio from 'twilio';
const accountSid = "ACc502c1007c37406ca6783b1477c0740c";
const token = "a751ceae8215dbbd51649dd5301763cb";
const client = twilio(accountSid, token);

export default class UserDto {
    static async addUserDetails(req, res, next) {
        try {

            const user = {
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
            console.log(req.body.email);
            const response = dao.addUserDetails(user);
            if (response === "user already exist!!") {
                return res.status(409).json({ error: "User already exists." });
            }

            return res.status(200).json({ message: "User added successfully" });
        }
        catch (e) {
            console.log(e);
        }
    }

    static async login(req,res,next){
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await dao.checkUser(email);
            if ( req.body.email === user.email && password === user.password) {
                req.session.user = user.email;
                const name = user.firstName + " " + user.lastName;
                res.render('index',{name});
            } else {
                res.send('Invalid User');
            }
        } catch (e) {
            res.send(e.message);
        }
    }
    static async getUser(email){
        try{ 
              const user = await dao.getUser(email);
              return user;  
        }
        catch(e){
           return "No user found";
        }
    }
    static async verifyPhoneNumber(req,res,next){
        try{
            const phoneNumber = req.body.number;
            const user = await dao.verifyPhoneNumber(req.body.email,req.body.number);
                if(user.phoneNumber === phoneNumber){
                    await UserDto.generateOtp(req.body.email,phoneNumber);
                    res.status(200).send('enter otp');
                }
                else{
                    console.log("number are not matches");
                }
        }
        catch(e){
            res.status(400).send(e.message);
        }
    }
    static async generateOtp(email,phoneNumber) {
        try {
            const min = 1000;
            const max = 9999;
            const otp = Math.floor(Math.random() * (max - min + 1)) + min;

            client.messages.create({
                body: `Alert!! Blackcoffer password change. your otp is ${otp}`,
                to: '+' + '91' + phoneNumber,
                from: '+12565677671'
            })
                .then(message => console.log(message.sid))
                .catch(error => console.error(error.message));
            const response = await dao.saveOtp(email,phoneNumber, otp);

        }
        catch (e) {
            console.log(e.message)
        }
    }
    static async otpVerifection(req,res,next){
        try{
            const phoneNumber = req.query.phoneNumber;
            const email = req.query.email;
            const otp =  await dao.otpVerifection(email,phoneNumber);
            console.log(otp);
            res.status(200).send(otp.toString());
           
        }
        catch(e){
            res.status(400).send(e.message);
        }
    }
    static async updatePassword(req,res,next){
        try{
             const phoneNumber = req.body.phoneNumber;
             const email = req.body.email;
             const password = parseInt(req.body.password);
             dao.updatePassword(email,phoneNumber,password);
             res.status(200).send("Password updated Successfully");
        }
        catch(e){
              console.log(e.message);
              res.status(400).send(e.message);
        }
  }
  static async logout(req,res,next){
    req.session.destroy(function(error){
        if(error){
            console.log(error);
            res.send(error);
        }
        else{
            res.render('login');
        }
    })
}
}