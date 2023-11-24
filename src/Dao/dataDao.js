import DbClient from "../CommanFiles/DbClient.js";

export default class DataDao extends DbClient{
    static async insertData(details){
        try{
            const session  = DbClient.session.collection('data');
            session.insertOne(details);
        }
        catch(error){
            console.log(error.message);
            return error;
        }
    }
    static async getCountryList(){
        try{
            const session  = DbClient.session.collection('data');
           var  list =  await session.distinct("country",{});
            // console.log(list);
            return list;
        }
        catch(error){
            return error;
        }
    }
    static async getEconomicGrowthList(){
        try{
                 const session = DbClient.session.collection('data');
                 var  list  = await session.find().project({
                    likelihood: 1,
                    relevance: 1,
                    title: 1,
                    country: 1,
                    _id: 0
                 }).toArray();
            //   console.log('getEconomicGrowth');
            //   console.log(list);
                 return list;
        }
        catch(error){
            return error;
        }
    }
    static async getRegionalImpactOnOilAndGasPrices(){
        try{
           
            const session = DbClient.session.collection('data');
            const list = await session.find({ region: { $ne: '' } }).project({
                likelihood: 1,
                intensity: 1,
                topic: 1,
                region: 1,
                _id: 0
            }).toArray();
            
        //   console.log('getEconomicGrowth');
        //   console.log(list);
             return list;
        }
        catch(error){
            return error;
        }
    }
    static async getTopicList(){
        try{
            const session  = DbClient.session.collection('data');
           var  list =  await session.distinct("topic",{});
            // console.log(list);
            return list;
        }
        catch(error){
            return error;
        }
    }
    static async getTimeSeriesofOilProduction(){
        try{
           
            const session = DbClient.session.collection('data');
            const list = await session.find({ topic: 'oil',start_year:{ $ne:''},end_year:{$ne:''},country:{$ne:''} }).project({
                start_year: 1,
                intensity: 1,
                end_year: 1,
                country: 1,
                _id: 0
            }).toArray();
            
        //   console.log('getEconomicGrowth');
        //   console.log(list);
             return list;
        }
        catch(error){
            return error;
        }
    }
}