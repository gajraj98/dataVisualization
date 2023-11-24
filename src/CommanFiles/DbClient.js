export default class DbClient{

   static session;
    static async injectDb(conn){
        if(DbClient.session){
           return;
        }
        try{
         DbClient.session = await conn.db('mailBox');
        }
        catch(e){
           console.log("error in indexDao " + e.message);
        }
   }
}