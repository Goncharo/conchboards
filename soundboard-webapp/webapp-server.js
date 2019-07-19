require('zone.js/dist/zone-node');
const ps = require('@angular/platform-server');
const express = require('express');
const fs = require('fs');
const angular = require('@angular/core/');

const {AppServerModuleNgFactory} = require('./dist-server/main');

angular.enableProdMode();

const app = express();

const indexHtml = fs.readFileSync(__dirname + '/dist/index.html', 'utf-8').toString();


app.get('*.*', express.static(__dirname + '/dist', {
    maxAge: '5y'
}));

app.route('*').get((req, res) => {

    ps.renderModuleFactory(AppServerModuleNgFactory, {
        document: indexHtml,
        url: req.url
    })
        .then(html => {
            res.status(200).send(html);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });

});


app.listen(process.env.WEBAPP_PORT, process.env.IP, () => {
    console.log(`Conchboards Angular Universal server listening on ${process.env.IP}:${process.env.WEBAPP_PORT}`);
});