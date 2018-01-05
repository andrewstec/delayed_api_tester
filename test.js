var redis = require("redis");
var rp = require('request-promise-native');

var push = require('./push_d0.json');
var commit_comment = require('./commit_comment_d0.json');

// var push = require('./push_d12.json');
// var commit_comment = require('./commit_comment_d12.json');

// console.log(push);
// console.log(commit_comment);

const SUBMIT_API_ENDPOINT = 'https://localhost:1210/submit';
const REDIS_ADDRESS = 'redis://localhost:7210';

    let client = redis.createClient(REDIS_ADDRESS);
    const PUSH = 'push';
    const COMMIT_COMMENT = 'commit_comment';
    const BOTH = 'both';

    let argument = process.argv[2]
    console.log('ARGUMENT: ', argument);

    if (argument === PUSH) {
        pushReq();
    } else if (argument === COMMIT_COMMENT) {
        commitCommentReq();
    } else if (argument === BOTH) {
        bothReq();
    }

    // Next API hit occurs every 800ms
    let index = 0;
    let timeIndex = 0;

    function pushReq() {
        let bodyPayload = push;
        let xGithubEvent = 'push';

        let options = {
            method: 'POST', 
            uri: SUBMIT_API_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                'X-GitHub-Event': xGithubEvent
            },
            body: JSON.stringify(bodyPayload)
        }

        rp(options).then(function(response) {
            // response from API
            console.log('response', response);
        });
    }

    function commitCommentReq() {
        let bodyPayload = commit_comment;
        let xGithubEvent = 'commit_comment';

        let options = {
            method: 'POST', 
            uri: SUBMIT_API_ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                'X-GitHub-Event': xGithubEvent
            },
            body: JSON.stringify(bodyPayload)
        }

        rp(options).then(function(response) {
            // response from API
            console.log('response', response);
        });
    }

    function bothReq() {
        let timeIndex = 0;

        for (let i = 0; i < 2; i++) {
                            timeIndex+= 3000;

            setTimeout(function() {

                let bodyPayload = push;
                let xGithubEvent = 'push';

                if (index > 0) {
                    bodyPayload = commit_comment;
                    xGithubEvent = 'commit_comment';
                    console.log('commit_comment firing');
                } else {
                    console.log('push firing');
                }

                let options = {
                    method: 'POST', 
                    uri: SUBMIT_API_ENDPOINT,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-GitHub-Event': xGithubEvent
                    },
                    body: JSON.stringify(bodyPayload)
                }

                rp(options).then(function(response) {
                    // response from API
                    console.log('response', response);
                });

                index++;

            }, timeIndex);
        }
    }






