import express from 'express';
import user from '../Dto/userDto.js'
import data from '../Dto/dataDto.js'
const routes = express.Router();

routes.get('/', (req, res) => {
    res.render('login');
});
routes.get('/sign', (req, res) => {
    res.render('signUp');
});
routes.get('/enterPhoneNumber', (req, res) => {
    res.render('enterPhoneNumber');
});

routes.post('/verifyPhoneNumber', user.verifyPhoneNumber);

routes.get('/enter-otp', (req, res) => {
    const phoneNumber = req.query.phoneNumber;
    const email = req.query.email;
    res.render('otpVerifection', { phoneNumber, email });
});
routes.get('/otp-verifection', user.otpVerifection);
routes.get('/password-change', (req, res) => {
    const phoneNumber = req.query.phoneNumber;
    const email = req.query.email;
    res.render('updatePassword', { phoneNumber, email });
});
routes.get('/profile', async (req, res)=>{
    console.log(req.session);
    if (req.session.cookie._expires !== null) {
        
        const user1= await user.getUser(req.session.user);
        const phoneNumber = user1.phoneNumber;
        const name = user1.firstName + " " + user1.lastName;
        const email = user1.email;
        res.render('user_profile', { name,email,phoneNumber });
    }
    else {
        res.status(404).send('No User Found');
    }
})
routes.get('/logout', user.logout);
routes.post('/password-update', user.updatePassword);
routes.post('/sign',user.addUserDetails);
routes.post('/login',user.login);
routes.post('/index',data.insertData);
routes.get('/getCountryList',data.getCountryList);
routes.get('/ecnomicGrowth',data.getEconomicGrowthList);
routes.get('/regionalImpactOnOilAndGasPrices',data.getRegionalImpactOnOilAndGasPrices);
routes.get('/topic',data.getTopicList);
routes.get('/timeSeriesofOilProduction',data.getTimeSeriesofOilProduction);
export default routes