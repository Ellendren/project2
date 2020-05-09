const chpConnection = require('../database/CHPConnection');

// Controller that interacts with skills to retrieve data.
class SkillController {
    constructor() {
        console.log('Skill Controller Initialized!');
    }

    // Fetches all skills
    async skills(ctx) {
        console.log('Controller HIT: skillController::skills');
        return new Promise((resolve, reject) => {
            const query = 'SELECT (SELECT charName FROM `character` WHERE id = `char`) AS charName, name, rating FROM skill';//with id disguised as name

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

    // Fetches a single skill for a character
    async skill(ctx) {
        console.log('Controller HIT: skillController::skill');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM skill WHERE (SELECT id FROM `character` WHERE charName = ?) = `char` && name = ?;';

            chpConnection.query({
                sql: query,
                values: [ctx.params.name, ctx.params.skill]
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

    // Add a new skill
    async addSkill(ctx, next) {
        console.log('Controller HIT: SkillController::addSkill');
        return new Promise((resolve, reject) => {
            const news = ctx.request.body;
            chpConnection.query({
                sql: 'INSERT INTO skill VALUES (?, ?, ?);',
                values: [news.char, news.skill, news.rating]
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

    // Update a skill
    async updateSkill(ctx, next) {
        console.log('Controller HIT: SkillController::updateSkill');
        return new Promise((resolve, reject) => {
            const t = ctx.request.body;
            chpConnection.query({
                sql: `
                    UPDATE skill 
                    SET 
                        rating = ?
                    WHERE (SELECT id FROM \`character\` WHERE charName = ?) = \`char\` && name = ?;
                    `,
                values: [t.rating, ctx.params.name, ctx.params.skill]
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

    async deleteSkill(ctx, next) {
        console.log('Controller HIT: SkillController::deleteSkill');
        return new Promise((resolve, reject) => {
            chpConnection.query({
                sql: `DELETE FROM skill WHERE (SELECT id FROM \`character\` WHERE charName = ?) = \`char\` && name = ?;`,
                values: [ctx.params.name, ctx.params.skill]
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

module.exports = SkillController;