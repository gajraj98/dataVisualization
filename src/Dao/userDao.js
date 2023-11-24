import DbClient from "../CommanFiles/DbClient.js"

export default class UserDao extends DbClient {
      
    static async  addUserDetails(user) {
         console.log(user);
         const session = await DbClient.session.collection('newUser');
         const userAlreadyExist = await session.findOne({email:user.email});
         if(userAlreadyExist){
               throw new Error('user alredy exist');
         }
         await session.insertOne(user);
         return 'user successfully added';
 
    }
    static async getUser(email){
        try{
             const session = DbClient.session.collection('newUser');
             const user = session.findOne({email:email});
             return user;
        }
        catch(e){
            return e.message;
        }
    }

    static async checkUser(email){
        try{
            const session = DbClient.session.collection('newUser');
             // console.log(email);
             const details = {
                 email:email
             }
             // await session.insertOne(details);
             const user = await session.findOne({email:email.toString()});
             return user;
         }
         catch(e){
             return e.message;
         }
    }
    static async verifyPhoneNumber(email,phoneNumber){
        try{
            console.log('stage11');
            const session = DbClient.session.collection('user');
            console.log(phoneNumber);
            const user = await session.findOne({ email: email });
            console.log('stage12');
            // console.log(user);
            return user;
        }
        catch(e){
            console.log(e.message);
            return e.message;
        }
    }
    static async saveOtp(email,phoneNumber,otp){
        try{

            const list = {
                email:email,
                phoneNumber:phoneNumber,
                otp:otp
            };
           
            const session = DbClient.session.collection('otp');
            await session.insertOne(list);
       }
       catch(e){
           console.log(e.message);
           return {Error:e.message};
       }
    }
    static async otpVerifection(email,phoneNumber){   
        try{
             const session = DbClient.session.collection('otp');
             const otp = await session
             .find({ email: email })
             .sort({ timestamp: -1 })
             .limit(1)
             .toArray();
            //  console.log(otp[0].otp);
             return otp[0].otp;
        }
        catch(e){
            return e.message;
        }
    }
    static async updatePassword(email,phoneNumber,password){
        try{
            console.log(email);
            console.log(password);
              const session = DbClient.session.collection('user');
              session.updateOne({email:email},
                 {
                    $set:{
                        password:password
                    }
                 }
                )
        }
        catch(e){
         return e;
        }
    }
}