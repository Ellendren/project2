const chpConnection = require('../database/CHPConnection');

// Controller that interacts with attribute to retrieve data.
class AttributeController {
    constructor() {
        console.log('Attribute Controller Initialized!');
    }

    // Fetches all attributes
    async attributes(ctx) {
        console.log('Controller HIT: AttributeController::attributes');
        return new Promise((resolve, reject) => {
            const query = 'SELECT (SELECT charName FROM `character` WHERE id = `char`) AS charName, name, rating, `limit`, mainLimitStat FROM attribute';//with id disguised as name

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

    // Fetches a single attribute for a character
    async attribute(ctx) {
        console.log('Controller HIT: AttributeController::attribute');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM attribute WHERE (SELECT id FROM `character` WHERE charName = ?) = `char` && name = ?;';

            chpConnection.query({
                sql: query,
                values: [ctx.params.name, ctx.params.attribute]
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

    // Add a new attribute
    async addAttribute(ctx, next) {
        console.log('Controller HIT: AttributeController::addAttribute');
        return new Promise((resolve, reject) => {
            const news = ctx.request.body;
            chpConnection.query({
                sql: 'INSERT INTO attribute VALUES (?, ?, ?, ?, ?);',
                values: [news.char, news.attribute, news.rating, news.limit, news.mainLimitStat]
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

    // Update an attribute
    async updateAttribute(ctx, next) {
        console.log('Controller HIT: AttributeController::updateAttribute');
        return new Promise((resolve, reject) => {
            const t = ctx.request.body;
            chpConnection.query({
                sql: `
                    UPDATE attribute 
                    SET 
                        rating = ?
                    WHERE (SELECT id FROM \`character\` WHERE charName = ?) = \`char\` && name = ?;
                    `,
                values: [t.rating, ctx.params.name, ctx.params.attribute]
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

    //deletes an attribute
    async deleteAttribute(ctx, next) {
        console.log('Controller HIT: AttributeController::deleteAttribute');
        return new Promise((resolve, reject) => {
            chpConnection.query({
                sql: `DELETE FROM attribute WHERE (SELECT id FROM \`character\` WHERE charName = ?) = \`char\` && name = ?;`,
                values: [ctx.params.name, ctx.params.attribute]
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

module.exports = AttributeController;