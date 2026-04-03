const https = require(“https”);

exports.handler = function(event, context, callback) {
if (event.httpMethod !== “POST”) {
return callback(null, { statusCode: 405, body: “Method Not Allowed” });
}

var body = event.body;
var key = process.env.ANTHROPIC_API_KEY;

var options = {
hostname: “api.anthropic.com”,
path: “/v1/messages”,
method: “POST”,
headers: {
“Content-Type”: “application/json”,
“x-api-key”: key,
“anthropic-version”: “2023-06-01”,
“Content-Length”: Buffer.byteLength(body)
}
};

var req = https.request(options, function(res) {
var data = “”;
res.on(“data”, function(chunk) { data += chunk; });
res.on(“end”, function() {
callback(null, {
statusCode: res.statusCode,
headers: {
“Content-Type”: “application/json”,
“Access-Control-Allow-Origin”: “*”
},
body: data
});
});
});

req.on(“error”, function(err) {
callback(null, {
statusCode: 500,
body: JSON.stringify({ error: err.message })
});
});

req.write(body);
req.end();
};
