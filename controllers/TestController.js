const chpConnection = require('../database/CHPConnection');

// Controller that interacts with Test to retrieve data.
class TestController {
    constructor() {
        console.log('Test Controller Initialized!');
    }

    // Fetches all Tests
    async tests(ctx) {
        console.log('Controller HIT: TestController::Tests');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM test';

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

    // Fetches a single test
    async test(ctx) {
        console.log('Controller HIT: testController::test');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM test WHERE t_name = ?';
            const s = ctx.params.test;

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
    async addTest(ctx, next) {
        console.log('Controller HIT: TestController::addTest');
        return new Promise((resolve, reject) => {
            const newT = ctx.request.body;
            chpConnection.query({
                sql: 'INSERT INTO test(t_name, attribute, skill_or_other, `limit`) VALUES (?, ?, ?, ?);',
                values: [newT.name, newT.attribute, newT.skill, newT.limit]
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

    // Update a Test
    async updateTest(ctx, next) {
        console.log('Controller HIT: TestController::updateTest');
        return new Promise((resolve, reject) => {
            const t = ctx.request.body;
            chpConnection.query({
                sql: `
                    UPDATE test 
                    SET 
                        attribute = ?,
                        skill_or_other = ?,
                        \`limit\` = ?
                    WHERE t_name = ?
                    `,
                values: [t.attribute, t.skill, t.limit, ctx.params.test]
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

    async deleteTest(ctx, next) {
        console.log('Controller HIT: TestController::deleteTest');
        return new Promise((resolve, reject) => {
            chpConnection.query({
                sql: `DELETE FROM test WHERE t_name = ?;`,
                values: [ctx.params.test]
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

module.exports = TestController;