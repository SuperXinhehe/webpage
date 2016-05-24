DELIMITER //  
DROP PROCEDURE IF EXISTS loadBlogs//  
CREATE PROCEDURE `loadBlogs` (IN start INT,length INT)  
LANGUAGE SQL  
NOT DETERMINISTIC  
SQL SECURITY DEFINER  
COMMENT 'A procedure to extract the blog information'  
BEGIN
 DROP TABLE IF EXISTS R1;
 CREATE TEMPORARY TABLE R1 as
 (
 SELECT r.blog_id,blog_h2,blog_h3,blog_body,posttime,tagsid,tagname,tagspan,attachment_id,attachment_name,attachment_type,link,usr_name,website,numberlikes
 FROM (
 SELECT b.blog_id,blog_h2,blog_h3,blog_body,posttime,tagsid,tagname,tagspan,attachment_id,attachment_type,attachment_name,link,b.usr_name,website
 FROM (
  SELECT a.blog_id as blog_id,blog_h2,blog_h3,blog_body,posttime,tagsid,tagname,tagspan,attachment_id,attachment_type,attachment_name,link,usr_name
  FROM (
   SELECT blogs.blog_id as blog_id,blog_h2,blog_h3,blog_body,usr_name,posttime,GROUP_CONCAT(tags.tag_id) as tagsid,GROUP_CONCAT(tag_name) as tagname, GROUP_CONCAT(tag_span) as tagspan
   FROM blogs, blogtags,tags
   WHERE blogs.blog_id = blogtags.blog_id AND tags.tag_id = blogtags.tag_id
   GROUP BY blogs.blog_id
  ) as a LEFT OUTER JOIN attachment
  ON attachment.blog_id = a.blog_id 
 ) as b LEFT OUTER JOIN users
 ON b.usr_name = users.usr_name
 ) as r LEFT OUTER JOIN likes
 ON r.blog_id = likes.blog_id
 );

 SELECT R1.blog_id,blog_h2,blog_h3,blog_body, posttime, tagsid,tagname,tagspan,attachment_id,attachment_type,attachment_name,link,usr_name ,website,numberlikes,GROUP_CONCAT(pic_id) as picid,GROUP_CONCAT(pic_name) as picname,GROUP_CONCAT(pic_link) as piclink 
 FROM R1 LEFT OUTER JOIN pictures
 ON R1.blog_id = pictures.blog_id
 GROUP BY R1.blog_id
 ORDER BY posttime DESC
 LIMIT length OFFSET start;
END// 

-- notes from first length to 20th for first page
DELIMITER //  
DROP PROCEDURE IF EXISTS loadNotes//  
CREATE PROCEDURE `loadNotes` (IN start INT,length INT,u VARCHAR(50))  
LANGUAGE SQL  
NOT DETERMINISTIC  
SQL SECURITY DEFINER  
COMMENT 'A procedure to display all notes'  
BEGIN
  SELECT * FROM users 
  WHERE users.usr_name = u;
  SELECT * FROM notes
  WHERE notes.usr_name = u
  ORDER BY last_time_updated DESC
  LIMIT length OFFSET start; 
END//  

-- load timeline contents
DELIMITER //  
DROP PROCEDURE IF EXISTS loadTimeline//  
CREATE PROCEDURE `loadTimeline` ()  
LANGUAGE SQL  
NOT DETERMINISTIC  
SQL SECURITY DEFINER  
COMMENT 'A procedure to display all contents in timeline'  
BEGIN
 select * from tweeties, categories 
 where tweeties.category = categories.category
 order by tweet_date DESC;
END//  

-- load the notes browse page for guests
DELIMITER //  
DROP PROCEDURE IF EXISTS loadNotesGuests//  
CREATE PROCEDURE `loadNotesGuests` (IN start INT,length INT)  
LANGUAGE SQL  
NOT DETERMINISTIC  
SQL SECURITY DEFINER  
COMMENT 'A procedure to display all notes for guests'  
BEGIN
 select * from tags;
 select * from notes 
 where usr_name = 'Tina Wang'
 order by last_time_updated DESC;
END//  

-- load a note
DELIMITER //  
DROP PROCEDURE IF EXISTS loadANote//  
CREATE PROCEDURE `loadANote` (IN u VARCHAR(50),nid VARCHAR(25))  
LANGUAGE SQL  
NOT DETERMINISTIC  
SQL SECURITY DEFINER  
COMMENT 'A procedure to display a detailed note'  
BEGIN
  SELECT * FROM users 
  WHERE users.usr_name = u;
  DROP TABLE IF EXISTS t1;
  CREATE TEMPORARY TABLE t1 as
  (
   SELECT * FROM notetags WHERE notetags.note_id = nid
  );
  DROP TABLE IF EXISTS t2;
  CREATE TEMPORARY TABLE t2 as
  (
   SELECT t1.tag_id,tag_span,tag_name,note_id from t1,tags 
   WHERE t1.tag_id = tags.tag_id
  );
  DROP TABLE IF EXISTS t3;
  CREATE TEMPORARY TABLE t3 as
  (SELECT GROUP_CONCAT(tag_id) as tagid,GROUP_CONCAT(tag_span) as tagspan,GROUP_CONCAT(tag_name) as tagname,note_id as noteid from t2 group by note_id);
  SELECT * FROM t3, notes WHERE t3.noteid = notes.note_id;
  SELECT * FROM noteupdates WHERE noteupdates.note_id = nid;
END// 


DELIMITER //  
DROP PROCEDURE IF EXISTS getConnection//  
CREATE PROCEDURE `getConnection` (IN uname varchar(50),pw TEXT)  
LANGUAGE SQL  
NOT DETERMINISTIC  
SQL SECURITY DEFINER  
COMMENT 'A procedure to check if username and pw are correct'  
BEGIN
  SELECT * FROM users
  WHERE usr_name = uname OR email = uname AND password = pw;
END//  


DELIMITER //  
DROP PROCEDURE IF EXISTS loadUsrBlogs//  
CREATE PROCEDURE `loadUsrBlogs` (IN start INT,length INT,u VARCHAR(50))  
LANGUAGE SQL  
NOT DETERMINISTIC  
SQL SECURITY DEFINER  
COMMENT 'A procedure to extract the blog information for certain user'  
BEGIN
 DROP TABLE IF EXISTS R2;
 CREATE TEMPORARY TABLE R2 as
 (SELECT * FROM users WHERE usr_name = u);
 
 DROP TABLE IF EXISTS R1;
 CREATE TEMPORARY TABLE R1 as
 (
 SELECT r.blog_id,blog_h2,blog_h3,blog_body,posttime,tagsid,tagname,tagspan,attachment_id,attachment_name,attachment_type,link,usr_name,website,numberlikes,profile_pic,banner_pic,pf_intro,back_pic
 FROM (
 SELECT b.blog_id,blog_h2,blog_h3,blog_body,posttime,tagsid,tagname,tagspan,attachment_id,attachment_type,attachment_name,link,b.usr_name,R2.profile_pic,R2.website,R2.banner_pic,R2.pf_intro,R2.back_pic
 FROM (
  SELECT a.blog_id as blog_id,blog_h2,blog_h3,blog_body,posttime,tagsid,tagname,tagspan,attachment_id,attachment_type,attachment_name,link,usr_name
  FROM (
   SELECT blogs.blog_id as blog_id,blog_h2,blog_h3,blog_body,usr_name,posttime,GROUP_CONCAT(tags.tag_id) as tagsid,GROUP_CONCAT(tag_name) as tagname, GROUP_CONCAT(tag_span) as tagspan
   FROM blogs, blogtags,tags
   WHERE blogs.blog_id = blogtags.blog_id AND tags.tag_id = blogtags.tag_id
   GROUP BY blogs.blog_id
  ) as a LEFT OUTER JOIN attachment
  ON attachment.blog_id = a.blog_id 
 ) as b NATURAL JOIN R2
 WHERE b.usr_name = R2.usr_name
 ) as r LEFT OUTER JOIN likes
 ON r.blog_id = likes.blog_id
 );

 SELECT R1.blog_id,blog_h2,blog_h3,blog_body, posttime, tagsid,tagname,tagspan,attachment_id,attachment_type,attachment_name,link,usr_name ,website,numberlikes,profile_pic,banner_pic,pf_intro,back_pic,GROUP_CONCAT(pic_id) as picid,GROUP_CONCAT(pic_name) as picname,GROUP_CONCAT(pic_link) as piclink 
 FROM R1 LEFT OUTER JOIN pictures
 ON R1.blog_id = pictures.blog_id
 GROUP BY R1.blog_id
 ORDER BY posttime DESC
 LIMIT length OFFSET start;
END// 


DELIMITER //  
DROP PROCEDURE IF EXISTS loadUsrBlogs//  
CREATE PROCEDURE `loadUsrBlogs` (IN start INT,length INT)  
LANGUAGE SQL  
NOT DETERMINISTIC  
SQL SECURITY DEFINER  
COMMENT 'A procedure to extract the blog information'  
BEGIN
 DROP TABLE IF EXISTS R1;
 CREATE TEMPORARY TABLE R1 as
 (
 SELECT r.blog_id,blog_h2,blog_h3,blog_body,posttime,tagsid,tagname,tagspan,attachment_id,attachment_name,attachment_type,link,usr_name,website,numberlikes
 FROM (
 SELECT b.blog_id,blog_h2,blog_h3,blog_body,posttime,tagsid,tagname,tagspan,attachment_id,attachment_type,attachment_name,link,b.usr_name,website
 FROM (
  SELECT a.blog_id as blog_id,blog_h2,blog_h3,blog_body,posttime,tagsid,tagname,tagspan,attachment_id,attachment_type,attachment_name,link,usr_name
  FROM (
   SELECT blogs.blog_id as blog_id,blog_h2,blog_h3,blog_body,usr_name,posttime,GROUP_CONCAT(tags.tag_id) as tagsid,GROUP_CONCAT(tag_name) as tagname, GROUP_CONCAT(tag_span) as tagspan
   FROM blogs, blogtags,tags
   WHERE blogs.blog_id = blogtags.blog_id AND tags.tag_id = blogtags.tag_id
   GROUP BY blogs.blog_id
  ) as a LEFT OUTER JOIN attachment
  ON attachment.blog_id = a.blog_id 
 ) as b LEFT OUTER JOIN users
 ON b.usr_name = users.usr_name
 ) as r LEFT OUTER JOIN likes
 ON r.blog_id = likes.blog_id
 );
 
 SELECT * FROM users WHERE usr_name = u;

 SELECT R1.blog_id,blog_h2,blog_h3,blog_body, posttime, tagsid,tagname,tagspan,attachment_id,attachment_type,attachment_name,link,usr_name ,website,numberlikes,GROUP_CONCAT(pic_id) as picid,GROUP_CONCAT(pic_name) as picname,GROUP_CONCAT(pic_link) as piclink 
 FROM R1 LEFT OUTER JOIN pictures
 ON R1.blog_id = pictures.blog_id
 GROUP BY R1.blog_id
 ORDER BY posttime DESC
 LIMIT length OFFSET start;
END// 

