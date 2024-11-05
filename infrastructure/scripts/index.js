const checkAndDeleteEmptyCardiovascular = require('./cardiovascularValidation');
const checkAndDeleteEmptyEtsDisease = require('./etsDiseaseValidation');
const checkAndDeleteEmptyPathologicalHistory = require('./pathologicalValidation');
const checkAndDeleteEmptyOralCavity = require('./oralCavityValidation');


module.exports = {
    checkAndDeleteEmptyCardiovascular,
    checkAndDeleteEmptyEtsDisease,
    checkAndDeleteEmptyPathologicalHistory,
    checkAndDeleteEmptyOralCavity,
};