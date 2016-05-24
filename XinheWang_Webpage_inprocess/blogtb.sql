-- this database for administrator could add tags and post blogs
-- and delete blogs and delete comments
use blogdb;

DROP TABLE IF EXISTS users;
-- table to store the information of users
create table users (
 usr_id VARCHAR(20) NOT NULL,
 usr_name VARCHAR(50) NOT NULL,
 -- could be administrator or normal user
 class VARCHAR(50) NOT NULL,
 first_name VARCHAR(100),
 last_name VARCHAR(100),
 email VARCHAR(255),
 city VARCHAR(25),
 PRIMARY KEY(usr_name),
 UNIQUE(usr_name)
);

DROP TABLE IF EXISTS blogs;
-- blog table to store the information of blogs
create table blogs (
 blog_id VARCHAR(20) NOT NULL,
 blog_h2 VARCHAR(100),
 blog_h3 VARCHAR(100),
 posttime DATETIME,
 usr_name VARCHAR(50),
 PRIMARY KEY(blog_id),
 FOREIGN KEY(usr_name) REFERENCES users(usr_name)
);

DROP TABLE IF EXISTS pictures;
-- table for updating the pictures
create table pictures (
 blog_id VARCHAR(20) NOT NULL,
 pic_id VARCHAR(20) NOT NULL,
 pic_link TEXT,
 pic_name TEXT,
 PRIMARY KEY(pic_id),
 FOREIGN KEY(blog_id) REFERENCES blogs(blog_id)
);

DROP TABLE IF EXISTS tags;
-- table to store the information of tags
create table tags (
 tag_id VARCHAR(20) NOT NULL,
 tag_name VARCHAR(50) NOT NULL,
 tag_span VARCHAR(255),
 UNIQUE(tag_name),
 UNIQUE(tag_id),
 PRIMARY KEY(tag_id)
);

DROP TABLE IF EXISTS blogtags;
-- bridge table to connect blogs and tags
create table blogtags (
 blog_id VARCHAR(20) NOT NULL,
 tag_id VARCHAR(20) NOT NULL,
 FOREIGN KEY (blog_id) REFERENCES blogs(blog_id) on delete cascade,
 FOREIGN KEY (tag_id) REFERENCES tags(tag_id) on delete cascade
);

DROP TABLE IF EXISTS attachment;
-- table to store the information of attachments
create table attachment (
 attachment_id VARCHAR(20) NOT NULL,
 blog_id VARCHAR(20) NOT NULL,
 attachment_type VARCHAR(50),
 attachment_name VARCHAR(255),
 link TEXT,
 width FLOAT,
 height FLOAT,
 PRIMARY KEY(attachment_id),
 UNIQUE(attachment_id),
 FOREIGN KEY (blog_id) REFERENCES blogs(blog_id) on delete cascade
); 


DROP TABLE IF EXISTS comments;
-- table to store all the comments
create table comments (
 comment_id VARCHAR(10) NOT NULL,
 comment_body TEXT,
 -- poster either be visitor or usrname (stored in our database)
 usr_name VARCHAR(25),
 time DATETIME,
 blog_id VARCHAR(20),
 sentiment_score int,
 PRIMARY KEY (comment_id),
 FOREIGN KEY (blog_id) REFERENCES blogs(blog_id) on delete cascade
 );


DROP TABLE IF EXISTS likes;
-- table for updating the number of likes for each blog posts
create table likes (
 blog_id VARCHAR(20) NOT NULL,
 numberlikes int,
 FOREIGN KEY (blog_id) REFERENCES blogs(blog_id) on delete cascade
);


DROP TABLE IF EXISTS notes;
-- table for store the notes
create table notes (
 note_id VARCHAR(25) NOT NULL,
 note_name VARCHAR(255) NOT NULL,
 usr_name VARCHAR(50),
 -- SOURCE WHERE ARE THE QUESTIONS FROM
 source VARCHAR(255), 
 description TEXT,
 content TEXT,
 last_time_updated datetime,
 PRIMARY KEY(note_id),
 UNIQUE(note_name),
 UNIQUE(note_id),
 FOREIGN KEY(usr_name) REFERENCES users(usr_name) on delete cascade
);

-- TAGS share the same table from tags (for notes and blogs)
DROP TABLE IF EXISTS notetags;
-- table for storing the tags of notes
create table notetags (
 note_id VARCHAR(25) NOT NULL,
 tag_id VARCHAR(20) NOT NULL,
 FOREIGN KEY(note_id) REFERENCES notes(note_id),
 FOREIGN KEY(tag_id) REFERENCES tags(tag_id)
);

DROP TABLE IF EXISTS noteupdates;
-- bridge table for storing the updates by time for each note_name
create table noteupdates (
 note_id VARCHAR(25) NOT NULL,
 -- time for the update
 update_date datetime,
 -- person who updated the note
 usr_name VARCHAR(50),
 content TEXT,
 FOREIGN KEY(note_id) REFERENCES notes(note_id)
);

DROP TABLE IF EXISTS noteattachs;
-- table for storing the attachments for notes
create table noteattachs (
 note_id VARCHAR(25) NOT NULL,
 attachment_id VARCHAR(25) NOT NULL,
 file_name VARCHAR(255),
 FOREIGN KEY(note_id) REFERENCES notes(note_id),
 PRIMARY KEY(attachment_id),
 UNIQUE(attachment_id)
);


