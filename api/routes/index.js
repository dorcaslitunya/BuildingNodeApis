const express=require('express');
//const speakerRoute=require('./speaker.js')
const router = express.Router();

module.exports = () => {
router.get('/',(request,response)=>{
    response.send('Hello Children');
});
//router.use('/speakers',speakerRoute())

return router;
}
