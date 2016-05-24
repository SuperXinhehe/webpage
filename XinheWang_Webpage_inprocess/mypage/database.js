//database.js file for sending information of blogs
//extract information from the poststb database in mysql

function dbConnect(){
	var mysql = require("mysql");
	var pool  = mysql.createPool({
  	connectionLimit : 10,
  	host            : 'localhost',
  	user            : 'xinhe',
  	password        : 'xwang72',
  	database		    : 'blogdb'
 	});
	return pool;
};

function getConnected(cb,pool,username,password){
  function f(err,db){
    var out = [];
    db.query('call getConnection("'+username+'","'+password+'");',
    function(err,results,fields){
      if(err){
        console.log(err);       
      }
      else if(results.length == 0)
      { 
        out = null;
        cb(null,out);
        db.release();
      }
      else if(results.length != 0)
      {
        for(var i=0; i<Math.min(results.length,10); i++){
          out[i] = results[i];
        }
        cb(null,out);
        db.release();
      }       
    });
  }
 pool.getConnection(f);
};

function dbLoadBlogs(cb,pool,start,length){
 function f(err,db){
  var tab = [];
  db.query('call loadBlogs('+start+','+length+')',
   function(err,results,fields){
    if(err){
     console.log(err);
    }else{
     for(var i=0;i<Math.min(results.length,10); i++){
      tab[i] = results[i];
      if(i == 0){
        for(var k=0; k<tab[i].length;k++){
          tab[i][k].tags = [];
          tab[i][k].images = [];
          if(tab[i][k].picid != null){
            var d = tab[i][k].picid.toString().split(",");
            var e = tab[i][k].picname.toString().split(",");
            var f = tab[i][k].piclink.toString().split(",");
            for(var j=0; j<d.length;j++){
              tab[i][k].images.push({picid:d[j],picname:e[j],piclink:f[j]});
            }
          }
          //console.log(tab[i][k].picid);
          var a = tab[i][k].tagsid.toString().split(",");
          var b = tab[i][k].tagname.toString().split(",");
          var c = tab[i][k].tagspan.toString().split(",");
          for(var j=0; j<a.length;j++){
           tab[i][k].tags.push({tagid:Number(a[j]),tagname:b[j],tagspan:c[j]});
          }
        } 
      }      
     }
     cb(null,tab);
     db.release();
    }	
   });
 }
 pool.getConnection(f);
};

function dbDisplayNotes(cb,pool,start,length,u) {
 function f(err,db) {
  var tab = [];
  db.query('call loadNotes('+start+','+length+',"'+u+'")',
    function(err,results,fields) {
      if(err) {
        console.log(err);
      }else{
        for(var i=0;i<Math.min(results.length,20); i++) {
          tab[i] = results[i];
        }
        //console.log(tab);
        cb(null,tab);
        db.release();
      }
    });
 }
 pool.getConnection(f);
};

function loadData(cb,pool,request) {
  function f(err,db){
    var tab = [];
    db.query('SELECT * FROM '+request,
      function(err,results){
        if(err) {throw err}
        else{
          for(var i=0;i<Math.min(results.length,100); i++) {
           tab[i] = results[i];
          }
          cb(null,tab);
          db.release();
        }
      });
  }
  pool.getConnection(f);
};

function loadTimeline(cb,pool) {
  function f(err,db){
    var tab = [];
    var datetime = "";
    db.query('call loadTimeline()',
      function(err,results){
        if(err) {throw err}
        else{
          for(var i=0;i<Math.min(results.length,20); i++) {
            if(i == 0){
              //console.log(results[0]);
              for (var j=0;j<Math.min(results[i].length);j++) {
                datetime = results[i][j].tweet_date;
                datetime = datetime.toString();
                var year = datetime.split(" ")[3];
                results[i][j].year = year;
                var day = datetime.split(" ")[2];
                results[i][j].day = day;
                var month = datetime.split(" ")[1];
                results[i][j].month = month;
              }
            }
           tab[i] = results[i];
          }
          //console.log(tab);
          cb(null,tab);
          db.release();
        }
      });
  }
  pool.getConnection(f);
};

// adding information about the updates about a note
function uploadFile(cb,pool,file) {
  function f(err,db){
    db.query("INSERT INTO files SET ?",file,
      function(err,results){
        if(err) {throw err;}
        else{
          db.query("UPDATE files SET loadtime = NOW() WHERE filename = ?", [file.filename],
            function(err,result){
            if(err) throw err;
            //console.log(result.affectedRows);
          });
          cb(null,null);
          db.release();
        }
      });
  }
  pool.getConnection(f);
};


// adding information about the updates about a note
function update(cb,pool,newnote) {
  function f(err,db){
    db.query("INSERT INTO noteupdates SET ?",newnote,
      function(err,results){
        if(err) {throw err;}
        else{
          db.query("UPDATE noteupdates SET update_date = NOW() WHERE note_id = ? and content = ?", [newnote.note_id,newnote.content],
            function(err,result){
            if(err) throw err;
            //console.log(result.affectedRows);
          });
          db.query("UPDATE notes SET last_time_updated = NOW() WHERE note_id = ?",newnote.note_id,
            function(err,result){
              if(err) throw err;
              //console.log(result.affectedRows);
          });
          cb(null,[newnote.note_id,newnote.usr_name]);
          db.release();
        }
      });
  }
  pool.getConnection(f);
};

function newUpdate(cb,pool,newupdate) {
  function f(err,db) {
    db.query("UPDATE noteupdates SET content = ? WHERE note_id = ? AND updateid = ?",[newupdate.content,newupdate.note_id,newupdate.updateid],
      function(err,result) {
        if(err) throw err;
        else {
          console.log(result.affectedRows);
          cb(null,null);
          db.release();
        }
    });
  }
  pool.getConnection(f);
};

//function to get the filename based on the originalname
function getFileName(cb,pool,originalname) {
  function f(err,db) {
    db.query("SELECT filename FROM files WHERE originalname = ?",originalname,
      function(err,result) {
        if(err) throw err;
        else {
          cb(null,result);
          db.release();
        }
      });
  }
  pool.getConnection(f);
};

//function to load all the nice notes under certain category
function loadNNotes(cb,pool,category) {
  function f(err,db) {
    var tab = [];
    db.query("SELECT * FROM nicenotes where category = ?",category,
      function(err,results) {
        if(err) throw err;
        else {
          for(var i=0;i<Math.min(results.length,20); i++) {
            tab[i] = results[i];
          }
          cb(null,tab);
          db.release();
        }
      });
  }
  pool.getConnection(f);
}

//function to extract all the notes created by Tina Wang...
function dbDisplayNotesGuests(cb,pool,start,length) {
 function f(err,db) {
  var tab = [];
  db.query('call loadNotesGuests('+start+','+length+')',
    function(err,results,fields) {
      if(err) {
        console.log(err);
      }else{
        for(var i=0;i<Math.min(results.length,20); i++) {
          tab[i] = results[i];
        }
        cb(null,tab);
        db.release();
      }
    });
 }
 pool.getConnection(f);
}

// function to start a new topic note
function addNewNote(cb,pool,newtopic) {
  function f(err,db) {
    var tagid;
    var tags = newtopic.tags.split(",");
    //console.log(tags);
    db.query("INSERT INTO notes(note_id,note_name,usr_name,source,description,content) VALUES(?,?,?,?,?,?)",
      [newtopic.note_id,newtopic.note_name,newtopic.usr_name,newtopic.source,newtopic.description,newtopic.content],
      function(err,result) {
        if(err) {throw err;}
        else{
          db.query("UPDATE notes SET time = NOW() WHERE note_id = ?",[newtopic.note_id],
            function(err,result){
              if(err) {throw err;}
              //console.log(result.affectedRows);
          });
          db.query("UPDATE notes SET last_time_updated = NOW() WHERE note_id = ?",[newtopic.note_id],
            function(err,result){
              if(err) {throw err;}
              //console.log(result.affectedRows);
          });
          for(var i=0;i<tags.length;i++) {
            db.query("SELECT tag_id FROM tags WHERE tag_name = ?",tags[i],
              function(err,result){
                if(err) {throw err;}
                //console.log(result);
                tagid = result[0].tag_id;
                //console.log(tagid);
                db.query("INSERT INTO notetags(note_id,tag_id) VALUES(?,?)",[newtopic.note_id,tagid],
                  function(err,result) {
                    if(err) {throw err;}
                    //console.log(result.affectedRows);
                });
            });
          }
          db.release();
        }
      });
  }
  pool.getConnection(f);
};

function dbLoadNote(cb,pool,u,nid){
 function f(err,db){
  var tab = [];
  db.query('call loadANote("'+u+'","'+nid+'")',
   function(err,results,fields){
    if(err){
     console.log(err);
    }else{
     for(var i=0;i<Math.min(results.length,10); i++){
      tab[i] = results[i];
      if(i == 1){
        tab[i][0].tags = [];
        var a = tab[i][0].tagid.toString().split(",");
        var b = tab[i][0].tagname.toString().split(",");
        var c = tab[i][0].tagspan.toString().split(",");
        for(var j=0; j<a.length;j++){
          tab[i][0].tags.push({tagid:Number(a[j]),tagname:b[j],tagspan:c[j]});
        }
      } 
     }
     cb(null,tab);
     db.release();
    } 
   });
 }
 pool.getConnection(f);
};

function dbLoadUsrBlogs(cb,pool,start,length,u,p){
 function f(err,db){
  var tab = [];
  db.query('call loadUsrBlogs('+start+','+length+',"'+u+'")',
   function(err,results,fields){
    if(err){
     console.log(err);
    }else{
     for(var i=0;i<Math.min(results.length,10); i++){
      tab[i] = results[i];
      if(i == 1){
        for(var k=0; k<tab[i].length;k++){
          tab[i][k].tags = [];
          tab[i][k].images = [];
          if(tab[i][k].picid != null){
            var d = tab[i][k].picid.toString().split(",");
            var e = tab[i][k].picname.toString().split(",");
            var f = tab[i][k].piclink.toString().split(",");
            for(var j=0; j<d.length;j++){
              tab[i][k].images.push({picid:d[j],picname:e[j],piclink:f[j]});
            }
          }
          //console.log(tab[i][k].picid);
          var a = tab[i][k].tagsid.toString().split(",");
          var b = tab[i][k].tagname.toString().split(",");
          var c = tab[i][k].tagspan.toString().split(",");
          for(var j=0; j<a.length;j++){
           tab[i][k].tags.push({tagid:Number(a[j]),tagname:b[j],tagspan:c[j]});
          }
        } 
      }      
     }
     cb(null,tab);
     db.release();
    } 
   });
 }
 pool.getConnection(f);
};

exports.dbConnect = dbConnect;
exports.dbLoadBlogs = dbLoadBlogs;
exports.dbLoadUsrBlogs = dbLoadUsrBlogs;
exports.getConnected = getConnected;

exports.dbDisplayNotes = dbDisplayNotes;
exports.dbDisplayNotesGuests = dbDisplayNotesGuests;
exports.dbLoadNote = dbLoadNote;

exports.update = update;
exports.loadData = loadData;
exports.addNewNote = addNewNote;
exports.newUpdate = newUpdate;
exports.loadTimeline = loadTimeline;
exports.uploadFile = uploadFile;
exports.getFileName = getFileName;
exports.loadNNotes = loadNNotes;