const chpConnection = require('../database/CHPConnection');

// Controller that interacts with Weapon to retrieve data.
class WeaponController {
    constructor() {
        console.log('Weapon Controller Initialized!');
    }

    // Fetches all Tests
    async weapons(ctx) {
        console.log('Controller HIT: WeaponController::Weapons');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Weapon';

            chpConnection.query(query, (err, res) => {
                if (err) {
                    reject(`Error querying CHP.test: ${err}`);
                }

                ctx.body = res;
                ctx.status = 200;

                resolve();
            });
        })
            .catch(err => {
                ctx.status = 500;
                ctx.body = err;
            });
    }

    // Fetches a single Weapon
    async weapon(ctx) {
        console.log('Controller HIT: WeaponController::Weapon');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Weapon WHERE w_name = ?';
            const s = ctx.params.weapon;

            chpConnection.query({
                sql: query,
                values: [s]
            }, (err, res) => {
                if (err) {
                    reject(err);
                }

                ctx.body = res;
                ctx.status = 200;
                resolve();
            });
        })
            .catch(err => {
                ctx.status = 500;
                ctx.body = err;
            });
    }

    // Add a new test
    async addWeapon(ctx, next) {
        console.log('Controller HIT: WeaponController::addWeapon');
        return new Promise((resolve, reject) => {
            const newW = ctx.request.body;
            chpConnection.query({
                sql: 'INSERT INTO Weapon(w_name, accuracy) VALUES (?, ?);',
                values: [newW.name, newW.accuracy]
            }, (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });

        })
            .then(await next)
            .catch(err => {
                ctx.status = 500;
                ctx.body = {
                    error: `Internal Server Error: ${err}`,
                    status: 500
                };
            });
    }

    // Update a weapon
    async updateWeapon(ctx, next) {
        console.log('Controller HIT: WeaponController::updateWeapon');
        return new Promise((resolve, reject) => {
            const t = ctx.request.body;
            chpConnection.query({
                sql: `
                    UPDATE Weapon 
                    SET 
                        accuracy = ?
                    WHERE w_name = ?
                    `,
                values: [t.accuracy, ctx.params.weapon]
            }, (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        })
            .then(await next)
            .catch(err => {
                ctx.status = 500;
                ctx.body = {
                    error: `Internal Server Error: ${err}`,
                    status: 500
                };
            });
    }

    async deleteWeapon(ctx, next) {
        console.log('Controller HIT: WeaponController::deleteWeapon');
        return new Promise((resolve, reject) => {
            chpConnection.query({
                sql: `DELETE FROM Weapon WHERE w_name = ?;`,
                values: [ctx.params.weapon]
            }, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
            .then(await next)
            .catch(err => {
                ctx.status = 500;
                ctx.body = {
                    error: `Internal Server Error: ${err}`,
                    status: 500
                };
            });
    }
}

module.exports = WeaponController;