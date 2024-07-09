const sequelize = require('../../config/database');
const day = require('../../db/models/day');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Your custom logic here
        const daysCount = (await day.count());
        if(daysCount > 0) {
            console.log('Days already setup');
        } else {
            await day.bulkCreate([
                { dayName: 'Monday' },
                { dayName: 'Tuesday' },
                { dayName: 'Wednesday' },
                { dayName: 'Thursday' },
                { dayName: 'Friday' },
                { dayName: 'Saturday' },
                { dayName: 'Sunday' },
            ]);
            console.log('Days setup');
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
})();