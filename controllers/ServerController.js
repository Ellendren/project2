const chpConnection = require('../database/CHPConnection');

// Controller that interacts with database to retrieve data.
class ServerController {
    constructor() {
        console.log('Server Controller Initialized!');
    }

    // Fetches all servers
    async servers(ctx) {
        console.log('Controller HIT: ServerController::Severs');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM L6_Server';

            chpConnection.query(query, (err, res) => {
                if (err) {
                    reject(`Error querying CHP.L6_Server: ${err}`);
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

    // Fetches a single server
    async server(ctx) {
        console.log('Controller HIT: ServerController::Sever');
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM L6_Server WHERE id = ?';
            const s = ctx.params.server;

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

    // Add a new Server
    async addServer(ctx, next) {
        console.log('Controller HIT:ServerController::addServer');
        return new Promise((resolve, reject) => {
            const newS = ctx.request.body;
            chpConnection.query({
                sql: 'INSERT INTO L6_Server(id, hostName, L6_DataCenter, installedOn, powerOnAt) VALUES (?, ?, ?, ?, ?);',
                values: [newS.id, newS.hostName, newS.L6_DataCenter, newS.installedOn, newS.powerOnAt]
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

    // Update a Server
    async updateServer(ctx, next) {
        console.log('Controller HIT: ServerController::updateServer');
        return new Promise((resolve, reject) => {
            const s = ctx.request.body;
            chpConnection.query({
                sql: `
                    UPDATE L6_Server 
                    SET 
                        hostName = ?,
                        L6_DataCenter = ?,
                        installedOn = ?,
                        powerOnAt = ?
                    WHERE id = ?
                    `,
                values: [s.hostName, s.L6_DataCenter, s.installedOn, s.powerOnAt, ctx.params.server]
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

    async deleteServer(ctx, next) {
        console.log('Controller HIT: serverController::deleteServer');
        return new Promise((resolve, reject) => {
            chpConnection.query({
                sql: `DELETE FROM L6_Server WHERE id = ?;`,
                values: [ctx.params.server]
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

module.exports = ServerController;