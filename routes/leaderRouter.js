const express = require('express');
const bodyParser = require('body-parser');
const Leaderships = require('../models/leaders');
var authenticate = require('../authenticate');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

    .get((req, res, next) => {
        res.end('Will send all the leaders to you!')
        Leaderships.find({})
            .then((leaders) => {
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            },(err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        Leaderships.create(req.body)
        .then((leader) => {
            console.log('leader Created ', leader);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Leaderships.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

leaderRouter.route('/:leaderId')

    .get((req, res, next) => {
        Leaderships.findById(req.params.leaderId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /leaders/' + req.params.leaderId);
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        Leaderships.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, {new: true})
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Leaderships.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = leaderRouter;