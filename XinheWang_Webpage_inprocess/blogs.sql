-- updates samples
INSERT INTO users
(usr_id,usr_name,class,first_name,last_name,email,city)
VALUES
(
 "1",
 "Tina Wang",
 "Administrator",
 "Xinhe",
 "Wang",
 "xinhehe8612@gmail.com",
 "Seattle"
);

INSERT INTO users
(usr_id,usr_name,class,first_name,last_name,email,city)
VALUES
(
 "2",
 "Mark Bai",
 "Administrator",
 "Mark",
 "Bai",
 "xinhehe8612@gmail.com",
 "Seattle"
);

-- first blog 
INSERT INTO blogs 
(blog_id,blog_h2,blog_h3,posttime,usr_name)
VALUES
(
 "1",
 "The PageRank Citation Ranking:",
 "Bring the order to web",
 "2015-06-06 18:00:00",
 "Tina Wang"
);

INSERT INTO blogs
(blog_id,blog_h2,blog_h3,posttime,usr_name)
VALUES
(
 "3",
 "Being a Support Teacher at Ru Jiazhuang Primary School:",
 "this is one of my best volunteering memories,grown with these kids",
 "2015-07-07 12:15:00",
 "Tina Wang"
);

INSERT INTO blogs
(blog_id,blog_h2,blog_h3,posttime,usr_name)
VALUES
(
 "2",
 "parallel_community_detection_for_large_graph",
 NULL,
 "2015-06-08 18:45:00",
 "Tina Wang"
);


-- attachment pdf paper
INSERT INTO attachment
(attachment_id,blog_id,attachment_type,attachment_name,link,width,height)
VALUES
(
 "1001",
 "1",
 "paper",
 "PageRank",
 "papers/pagerank.pdf",
 NULL,
 NULL
);

INSERT INTO attachment
(attachment_id,blog_id,attachment_type,attachment_name,link,width,height)
VALUES
(
 "2001",
 "2",
 "paper",
 "parallel_community_detection_for_large_graph",
 "papers/parallel_community_detection_for_large_graph.pdf",
 NULL,
 NULL
);

-- comments on the first post
INSERT INTO comments
(comment_id,comment_body,usr_name,time,blog_id,sentiment_score)
VALUES
(
 "1001",
 "Thanks for sharing!",
 "visitor",
 "2015-06-06 20:15:00",
 "1",
 NULL
);

-- number of likes 
INSERT INTO likes
(blog_id,numberlikes)
VALUES
(
 "1",
 1
);

INSERT INTO likes
(blog_id,numberlikes)
VALUES
(
 "2",
 3
);

INSERT INTO tags
(tag_id,tag_name,tag_span)
VALUES
(
 "1",
 "algorithm",
 "lable label-success"
);

INSERT INTO tags
(tag_id,tag_name,tag_span)
VALUES
(
 "2",
 "data science",
 "label label-info"
);



INSERT INTO tags
(tag_id,tag_name,tag_span)
VALUES
(
 "3",
 "graph",
 "label label-success"
);

INSERT INTO tags
(tag_id,tag_name,tag_span)
VALUES
(
 "4",
 "volunteering",
 "label label-warning"
);

INSERT INTO blogtags
(blog_id,tag_id)
VALUES
(
 "1",
 "2"
);

INSERT INTO blogtags
(blog_id,tag_id)
VALUES
(
 "3",
 "4"
);

INSERT INTO blogtags
(blog_id,tag_id)
VALUES
(
 "1",
 "1"
);

INSERT INTO blogtags
(blog_id,tag_id)
VALUES
(
 "2",
 "1"
);

INSERT INTO blogtags
(blog_id,tag_id)
VALUES
(
 "2",
 "3"
);

INSERT INTO pictures
(blog_id,pic_id,pic_link,pic_name)
VALUES
(
 "3",
 "image3001",
 "images/mudac.jpg",
 "mudac.jpg"
 );

INSERT INTO pictures
(blog_id,pic_id,pic_link,pic_name)
VALUES
(
 "3",
 "image3002",
 "images/winonaroom.jpg",
 "winonaroom.jpg"
 );

INSERT INTO pictures
(blog_id,pic_id,pic_link,pic_name)
VALUES
(
 "3",
 "image3003",
 "images/mudaclogo.jpg",
 "mudaclogo.jpg"
);

INSERT INTO notes
(note_id,note_name,usr_name,source,description,content,last_time_updated)
VALUES
(
 "DP001",
 "Dynamic Programming",
 "Tina Wang",
 "Online Notes",
 "dp self-learning notes",
 null,
 null
);

INSERT INTO notetags
(note_id,tag_id)
VALUES
(
 "DP001",
 "1"
);

INSERT INTO notetags
(note_id,tag_id)
VALUES
(
 "DP001",
 "5"
);
-- ..
INSERT INTO noteupdates
(note_id,update_date,usr_name,content)
VALUES
(
 "DP001",
 null,

)


INSERT INTO tags
(tag_id,tag_name,tag_span)
VALUES
(
 "5",
 "dynamic programming",
 "label label-info"
);

