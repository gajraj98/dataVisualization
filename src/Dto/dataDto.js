import dao from '../Dao/dataDao.js'
export default class DataDto {
     static async insertData(req,res,next){
        try{
            for(var i = 0;i<req.body.length;i++){
                var json = req.body[i];
            const details = {
                end_year : json.end_year,
                intensity : json.intensity,
                sector : json.sector,
                topic : json.topic,
                insight : json.insight,
                url : json.url,
                region : json.region,
                start_year : json.start_year,
                impact : json.impact,
                added : json.added,
                published : json.published,
                country	 : json.country,
                relevance : json.relevance,
                pestle : json.pestle,
                source : json.source,
                title : json.title,
                likelihood : json.likelihood
            }
            // console.log(req.body);
           await dao.insertData(details);
            }
           res.status(200).send('data inserted successfully');
        }
        catch(error){
            res.status(500).send(error.message);
        }
     }
     static async getCountryList(req,res,next){
        try{
            
             const list = await dao.getCountryList();
            //  console.log(list);
             res.status(200).send(list);
        }
        catch(error){
            console.log(error.message);
            res.status(500).send('Error in server while fetching countryList '+ error.message);
        }
     }
     static async getEconomicGrowthList(req,res,next){
        try{
            const list = await dao.getEconomicGrowthList();
            res.status(200).send(list);
        }
        catch(error){
            console.log(error.message);
            res.status(500).send('Error in server while fetching countryList '+ error.message);
        }
     }
     static async getRegionalImpactOnOilAndGasPrices(req,res,next){
        try{
            const list = await dao.getRegionalImpactOnOilAndGasPrices();
            res.status(200).send(list);
        }
        catch(error){
            console.log(error.message);
            res.status(500).send('Error in server while fetching countryList '+ error.message);
        }
     }
     static async getTopicList(req,res,next){
        try{
            
             const list = await dao.getTopicList();
            //  console.log(list);
             res.status(200).send(list);
        }
        catch(error){
            console.log(error.message);
            res.status(500).send('Error in server while fetching countryList '+ error.message);
        }
     }
     static async getTimeSeriesofOilProduction(req,res,next){
        try{
            const list = await dao.getTimeSeriesofOilProduction();
            res.status(200).send(list);
        }
        catch(error){
            console.log(error.message);
            res.status(500).send('Error in server while fetching countryList '+ error.message);
        }
     }
}