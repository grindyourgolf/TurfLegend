var https = require("https");
exports.handler = function(event, context, callback) {
  var body = event.body;
  var opts = {
    hostname: "api.anthropic.com",
    path: "/v1/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Length": Buffer.byteLength(body)
    }
  };
  var req = https.request(opts, function(res) {
    var d = "";
    res.on("data", function(c) { d += c; });
    res.on("end", function() {
      callback(null, { statusCode: res.statusCode, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: d });
    });
  });
  req.on("error", function(e) { callback(null, { statusCode: 500, body: e.message }); });
  req.write(body);
  req.end();
};
