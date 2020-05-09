const chpConnection = require('../database/CHPConnection');

// Controller that interacts with character to retrieve data.
class CharacterController {
    constructor() {
        console.log('Character Controller Initialized!');
    }

    // Fetches all Characters
    async characters(ctx) {
        console.log('Controller HIT: CharacterController::characters');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM `character`';

            chpConnection.query(query, (err, res) => {
                if (err) {
                    reject(`Error querying CHP.character: ${err}`);
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

    // Fetches a single character
    async character(ctx) {
        console.log('Controller HIT: CharacterController::character');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM `character` WHERE charName = ?';
            const s = ctx.params.character;

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

    // Add a new Character
    async addCharacter(ctx, next) {
        console.log('Controller HIT: CharacterController::addCharacter');
        return new Promise((resolve, reject) => {
            const newC = ctx.request.body;
            chpConnection.query({
                sql: 'INSERT INTO `character`(charName) VALUES (?);',
                values: [newC.charName]
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

    // Update a Character
    async updateCharacter(ctx, next) {
        console.log('Controller HIT: CharacterController::updateCharacter');
        return new Promise((resolve, reject) => {
            const c = ctx.request.body;
            chpConnection.query({
                sql: ` UPDATE \`character\` SET charName = ? WHERE charName = ?;`,
                values: [c.charName, ctx.params.character]
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

    async deleteCharacter(ctx, next) {
        console.log('Controller HIT: CharacterController::deleteCharacter');
        return new Promise((resolve, reject) => {
            chpConnection.query({
                sql: 'DELETE FROM `character` WHERE charName = ?;',
                values: [ctx.params.character]
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

    // Fetches a single dicepool and limit for a character
    async characterTest(ctx) {
        console.log('Controller HIT: CharactertController::CharacterTest');
        return new Promise((resolve, reject) => {
            chpConnection.query({
                sql: 'call proc_dicePoolWithLimit( ?, ?);',
                values: [ctx.params.character, ctx.params.test]
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

    // Fetches a limit for a character
    async characterLimit(ctx) {
        console.log('Controller HIT: CharactertController::characterLimit');
        return new Promise((resolve, reject) => {
            chpConnection.query({
                sql: 'SELECT fn_limit(c.ID, ?) as `limit` FROM `character` c WHERE c.charName = ?;',
                values: [ctx.params.limit, ctx.params.character]
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
}

module.exports = CharacterController;