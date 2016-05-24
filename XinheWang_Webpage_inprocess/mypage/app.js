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
app.engine('jade', require('jade').__express);

////////////////////////////////////////////////
// routes
///////////////////////////////////////////////
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


app.listen(3000);
