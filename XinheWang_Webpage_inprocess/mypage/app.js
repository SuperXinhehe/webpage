var express = require("express")
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var phantom = require("phantom");
var fs = require("fs");
var db = require("./database.js");
var pool = db.dbConnect();
var params = require("express-params");
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
params.extend(app);
/////////////////////////////////////////
// configure
/////////////////////////////////////////
app.set("views",__dirname + "/views");
app.set("view engine","jade");
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + "/public"));

var jade = require("jade");
var RSS = require("rss");
var Feed = require('feed');
//var static = require('node-static');  
//var file = new static.Server('./public');
// power bi
var powerbi = require("powerbi-api");
function renderPowerBI(info) {
	var workspaceid = info.workspaceid;
	var workspacename = info.workspacename;
	var reportid = info.reportid;
	var token = powerbi.PowerBIToken.createReportEmbedToken(workspacename,workspaceid,reportid);
	var accesskey = info.accesskey;
	var jwt = token.generate(accesskey);
	return jwt;		
};

app.engine('jade', require('jade').__express);

////////////////////////////////////////////////
// routes
///////////////////////////////////////////////
app.get("/powerbi",function(req,res) {
  var workspacename = 'powerbifrauddb';
  var workspaceid = '481c30ce-23bd-4291-a4ef-e1c243855512';
  var reportid = '491c8f0d-2e82-4ac0-98ba-c94376fcd9fb';
  var accesskey = 'z5cMS9fycpx9OOqe3IUG3b8jCX848QlerSD5SVPZ9MZ/flHX7EWXRcshS2QW9qbOrkJFYKZZPTt3ApW3SlgmPA==';
  info = {};
  info.workspaceid = workspaceid;
  info.workspacename = workspacename;
  info.reportid = reportid;
  info.accesskey = accesskey;
  var token = renderPowerBI(info);
 res.render("powerbi.jade",{token:token,reportid:reportid});
});

app.get("/theheapspace",function(req,res){
 res.render("homepage.jade");
});
var storage = multer.diskStorage({
	destination: function(req,file,cb) {
		cb(null,'./public/files/')
	},
	filename: function(req,file,cb) {
		//var extension = "";
		//if(file.mimetype='application/pdf') {
		//	extension = ".pdf";
		//}
		//console.log(file);
		crypto.pseudoRandomBytes(16,function(err,raw) {
			cb(null,raw.toString("hex") + Date.now() + "." + mime.extension(file.mimetype));
		});
	},
});
var uploading = multer({storage:storage});

// store the uploaded file to mypage/uploads/ directory
app.post('/',uploading.single('singleInputFileName'),function(req,res,next) {
	console.log("added a file into uploads folder");
	//console.log(req.file);
	var filename = req.file.filename;
	var originalname = req.file.originalname;
	var file = {}
	file.originalname = originalname;
	file.filename = filename;
	file.path = req.file.path;
	file.size = req.file.size;
	file.destination = req.file.destination;
	console.log(file.filename);
	db.uploadFile(function(error,doc) {
		console.log("file info added");
		res.redirect("back");
	},pool,file);
});

app.get("/theheapspace/signup",function(req,res){
 res.render("signup.jade");
});
//load the nice notes (quick notes)
app.get("/theheapspace/nicenotes",function(req,res) {
	res.render("nicenotes.jade");
});

app.post("/theheapspace/nicenotes/cate=?:category",function(req,res){
	var category = req.body.category;
	db.loadNNotes(function(error,doc){
		var results = doc[0];
		console.log(results);
		res.end(doc[0].nnote_content);
		//console.log(output);
	},pool,category);
});

app.get("/files/name=?:originalname",function(req,res) {
	var originalname = req.params.originalname;
	db.getFileName(function(error,doc) {
		var filename = doc[0].filename;
		console.log(filename);
		res.redirect("/theheapspace/files/filename="+filename);
	},pool,originalname);
});

app.get("/theheapspace/aboutme",function(req,res){
 res.render("aboutme.jade");
});

app.get("/theheapspace/myblog",function(req,res){
 res.render("myblog.jade");
});

app.get("/theheapspace/login",function(req,res){
 res.render("login.jade");
});

// blog page for administrator
app.get("/theheapspace/login=ad/1:username/mi:pw/blog/page=?:np",function(req,res){
 var np = req.params.np;
 var from = (np-1)*6;
 var to = np*6;
 var username = req.params.username;
 var pw = req.params.pw;
 var u = new Buffer(username,"base64").toString("ascii");
 var p = new Buffer(pw,"base64").toString("ascii");
 db.dbLoadUsrBlogs(function(error,doc){
  res.render("ad_blog.jade",
   {blogs:doc[1],usr:doc[0][0]});
 },pool,from,to,u);
});

app.get("/theheapspace/login=ad/as=:username/notes/page=?:np",function(req,res){
 var np = req.params.np;
 var username = req.params.username;
 var u = new Buffer(username).toString("base64");
 res.redirect("/theheapspace/login=ad/1"+u+"/notes/page=1");
});

app.get("/theheapspace/login=ad/as=:username/notes/newnote", function(req,res){
 var username = req.params.username;
 var u = new Buffer(username).toString("base64");
 res.redirect("/theheapspace/login=ad/1"+u+"/notes/newnote");
});

app.get("/theheapspace/login=ad/1:username/notes/newnote", function(req,res){
 var username = req.params.username;
 var u = new Buffer(username,"base64").toString("ascii");
 res.render("editnew.jade",{usr:u});
});


app.get("/theheapspace/login=ad/as=:username/notes/note=:noteid",function(req,res){
 var nid = req.params.noteid;
 var username = req.params.username;
 var u = new Buffer(username).toString("base64");
 res.redirect("/theheapspace/login=ad/1"+u+"/notes/note="+nid+"");
});

app.get("/theheapspace/login=ad/1:username/notes/note=:nid",function(req,res){
 var nid = req.params.nid;
 var username = req.params.username;
 var u = new Buffer(username,"base64").toString("ascii");
 db.dbLoadNote(function(error,doc){
  res.render("note_overview.jade",
   {usr:doc[0][0],note:doc[1][0],updates:doc[2]});
   //console.log(doc[2]);
 },pool,u,nid);
});

app.post("/notes/update",function(req,res) {
 db.update(function(err,doc){
 	console.log("added a new update");
 	res.end('{"success":"Updated Successfully","status":200}');
 	},pool,req.body);
});

app.post("/notes/newupdate",function(req,res) {
	db.newUpdate(function(err,doc) {
		console.log("updated");
		console.log(req.body);
	},pool,req.body);
	//console.log(req.body);
});

app.get("/asserts/:r",function(req,res) {
 db.loadData(function(error,doc){
 	res.send(doc);
 },pool,req.params.r);
});

app.get("/theheapspace/login=ad/1:username/notes/page=?:np",function(req,res){
 var np = req.params.np;
 var from = (np-1)*20;
 var to = np*20;
 var username = req.params.username;
 var u = new Buffer(username,"base64").toString("ascii");
 db.dbDisplayNotes(function(error,doc){
  res.render("notes.jade",
   {usr:doc[0][0],notes:doc[1]});
 },pool,from,to,u);
});

app.get("/theheapspace/timeline",function(req,res) {
	db.loadTimeline(function(error,doc) {
		res.render("timeline.jade",
			{contents:doc[0]});
	},pool);
});

// get the data post about a new note 
app.post("/theheapspace/notes/addingnew",function(req,res){
	//console.log(req.body);
	var username = req.body.usr_name;
	//var u = new Buffer(username,"base64").toString("ascii");
	//console.log(username);
	db.addNewNote(res.redirect("/theheapspace/login=ad/as="+username+"/notes/page=1")
		,pool,req.body);
});

app.get("/theheapspace/login=u/blog/page=?:np",function(req,res){
 var np = req.params.np;
 var from = (np-1)*6;
 var to = np*6;
 db.dbLoadBlogs(function(error,doc){
  res.render("u_blog.jade",
   {blogs:doc[0]});
 },pool,from,to);
});

// check if the user exists in our database
app.post("/theheapspace/login/check",function(req,res){
 //console.log(req.body.user.username);
 //console.log(req.body.user.password);
 var check;
 db.getConnected(function(error,doc){
  check = doc[0];
  if(check.length == 0)
  {
   res.render("login.jade",{error:"the username and password combination is incorrect"});
  }
  else if(check[0]["class"]=="Administrator")
  {
   var usrname = new Buffer(req.body.user.username).toString("base64");
   var pw = new Buffer(req.body.user.password).toString("base64");
   res.redirect("/theheapspace/login=ad/1"+usrname+"/mi"+pw+"/blog/page=1");
  }
  else
  {
 	res.redirect("/theheapspace/login=u/blog/page=1");
  }
 },pool,req.body.user.username,req.body.user.password);
});

// the format of page range is 
// ex: 1.10 first 10 rows of data
//app.param("range",/^(\w+)\.(\w+)?$/);

// blog page for normal visitors
app.get("/theheapspace/blog/page=?:np",function(req,res){
	var np = req.params.np;
	var from = (np-1)*6;
	var to = np*6;
	console.log("from "+from+" to "+to)
	db.dbLoadBlogs(function(error,doc){
		res.render("blog.jade",
		{blogs:doc[0]});
	},pool,from,to);
});

app.get("/theheapspace/files/filename=:name",function(req,res,next){

	var options = {
		root: __dirname + "/public/files/",
		dotfiles: "deny",
		headers: {
			"x-timestamp" : Date.now(),
			"x-sent" : true
		}
	};

	var file = req.params.name;
	res.sendFile(file, options, function(error){
		if(error){
			console.log(error);
			res.status(error.status).end();
		}
		else{
			console.log("Sent:",file);
		}
	});
});

//notes browse pages for guests
// calling function displaynotesGuests
app.get("/theheapspace/notes/page=?:np",function(req,res){
 var np = req.params.np;
 var from = (np-1)*20;
 var to = np*20;
 db.dbDisplayNotesGuests(function(error,doc){
  console.log(doc[0]);
  res.render("notes_guests.jade",
   {tags:doc[0],notes:doc[1]});
 },pool,from,to);
});

/*
 notes personal page google calender 
*/
var readline = require("readline")
var google = require("googleapis")
var googleAuth = require("google-auth-library")



app.get("/theheapspace/app=calender",function(req,res) {
	// pass teh certificate 
	var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
	var TOKEN_PATH = "calendar-nodejs-quickstart.json";
	var TOKEN_DIR = "/credentials/";
	/**
	 * Create an OAuth2 client with the given credentials, and then execute the
	 * given callback function.
	 *
	 * @param {Object} credentials The authorization client credentials.
	 * @param {function} callback The callback to call with the authorized client.
	 */
	function authorize(credentials,callback) {
	  var clientSecret = credentials.web.client_secret;
	  var clientId = credentials.web.client_id;
	  var redirectUrl = credentials.web.redirect_uris[0];
	  var auth = new googleAuth();
	  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

	  // Check if we have previously stored a token.
	  fs.readFile(TOKEN_PATH, function(err, token) {
	    if (err) {
	      return getNewToken(oauth2Client, callback);
	    } else {
	      oauth2Client.credentials = JSON.parse(token);
	      return callback(oauth2Client);
	    }
	  });
	}
		/**
	 * Get and store new token after prompting for user authorization, and then
	 * execute the given callback with the authorized OAuth2 client.
	 *
	 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
	 * @param {getEventsCallback} callback The callback to call with the authorized
	 *     client.
	 */
	function getNewToken(oauth2Client, callback) {
	  var authUrl = oauth2Client.generateAuthUrl({
	    access_type: 'offline',
	    scope: SCOPES
	  });
	  console.log('Authorize this app by visiting this url: ', authUrl);
	  var rl = readline.createInterface({
	    input: process.stdin,
	    output: process.stdout
	  });
	  rl.question('Enter the code from that page here: ', function(code) {
	    rl.close();
	    oauth2Client.getToken(code, function(err, token) {
	      if (err) {
	        console.log('Error while trying to retrieve access token', err);
	        return;
	      }
	      oauth2Client.credentials = token;
	      storeToken(token);
	      callback(oauth2Client);
	    });
	  });
	}

	/**
	 * Store token to disk be used in later program executions.
	 *
	 * @param {Object} token The token to store to disk.
	 */
	function storeToken(token) {
	  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
	  console.log('Token stored to ' + TOKEN_PATH);
	}

	/**
	 * Lists the next 10 events on the user's primary calendar.
	 *
	 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
	 */
	function listEvents(auth,cb) {
	  var calendar = google.calendar('v3');
	  calendar.events.list({
	    auth: auth,
	    calendarId: 'primary',
	    timeMin: (new Date()).toISOString(),
	    maxResults: 20,
	    singleEvents: true,
	    orderBy: 'startTime'
	  }, function(err, response) {
	    if (err) {
	      console.log('The API returned an error: ' + err);
	      return;
	    }
	    var events = response.items;
	    if (events.length == 0) {
	      console.log('No upcoming events found.');
	    } else {
	      var outs = [];
	      for (var i = 0; i < events.length; i++) {
	      	var out = {};
	        var event = events[i];
	        var start = event.start.dateTime || event.start.date;
	        out.date = start;
	        out.e = event.summary;
	        outs[i] = out;
	      }
	      // console.log(outs);
	      cb(null,outs);
	    }
	  });
	}
		// Load client secrets from a local file.
	fs.readFile('client_secret.json', function processClientSecrets(err, content) {
	  if (err) {
	    console.log('Error loading client secret file: ' + err);
	    return;
	  }

	  // Authorize a client with the loaded credentials, then call the
	  // Google Calendar API.
	  authorize(JSON.parse(content),function(req,err) {
	  	listEvents(req,function(err, doc) {
	  	res.render("ad_calender.jade",{
	  		events: doc
	  	});
	  })});	
	  });  	
});


app.listen(3000);


