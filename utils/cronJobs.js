const cron = require('node-cron');
const { checkAndDeleteEmptyCardiovascular, checkAndDeleteEmptyEtsDisease, checkAndDeleteEmptyPathologicalHistory, checkAndDeleteEmptyOralCavity } = require('../scripts');

// Programar la tarea para que se ejecute todos los días a medianoche
// Para Cardiovascular
cron.schedule('0 0 * * *', () => {
    console.log('Running check and delete for empty records...');
    checkAndDeleteEmptyCardiovascular();
});

// Para EtsDisease se ejecuta 1 minuto despues de la medianoche
cron.schedule('0 1 * * *', () => {
    console.log('Running check and delete for empty records...');
    checkAndDeleteEmptyEtsDisease();
});

// Para PathologicalHistory
cron.schedule('0 2 * * *', () => {
    console.log('Running check and delete for empty records...');
    checkAndDeleteEmptyPathologicalHistory();
})

// Para OralCavity
cron.schedule('0 3 * * *', () => {
    console.log('Running check and delete for empty records...');
    checkAndDeleteEmptyOralCavity();
})

/* console.log('Running manual check and delete for empty records...');
checkAndDeleteEmptyCardiovascular(); */