CREATE TABLE categories(
  category VARCHAR(255) NOT NULL,
  badge VARCHAR(255),
  UNIQUE (category),
  PRIMARY KEY(category)
);

CREATE TABLE tweeties(
  tweet_id VARCHAR(255) NOT NULL,
  tweet_title VARCHAR(30),
  usr_name VARCHAR(20),
  tweet_date DATETIME,
  tweet_content TEXT,
  link TEXT,
  category VARCHAR(255),
  UNIQUE (tweet_id),
  PRIMARY KEY (tweet_id),
  FOREIGN KEY (category) REFERENCES categories(category)
);


CREATE TABLE tweettags(
  tweet_id VARCHAR(255) NOT NULL,
  tag_id VARCHAR(20) NOT NULL,
  FOREIGN KEY(tweet_id) REFERENCES tweeties(tweet_id),
  FOREIGN KEY(tag_id) REFERENCES tags(tag_id)
);

CREATE TABLE files(
  file_id int NOT NULL AUTO_INCREMENT,
  originalname VARCHAR(255) NOT NULL,
  destination VARCHAR(255),
  filename TEXT,
  path TEXT,
  size int,
  PRIMARY KEY(file_id)
);

CREATE TABLE nicenotes(
  nnote_id int NOT NULL AUTO_INCREMENT,
  title VARCHAR(255),
  nnote_content TEXT,
  last_time_updated datetime,
  category VARCHAR(255),
  PRIMARY KEY(nnote_id)
);

INSERT INTO nicenotes(title,nnote_content,last_time_updated,category)
VALUES("Hash Table","Hash table is a data structure that used to implement an associative array, a structure that can map keys to values.",NOW(),"data structure");

INSERT INTO categories VALUES("Tweeties","glyphicon glyphicon-comment");
INSERT INTO categories VALUES("Location","glyphicon glyphicon-map-maker");
INSERT INTO categories VALUES("QandA","glyphicon glyphicon-check");
INSERT INTO categories VALUES("Link","glyphicon glyphicon-link");
INSERT INTO tweeties(tweet_id,tweet_title,tweet_date,tweet_content,link,category,usr_name) 
VALUES("T00001",NULL,NOW(),"人生也是如此，我们用三分之一的时间行动，却用三分之二的时间后悔不仅扭转不了已成定局的事实，也会错过当下，更仓促了即将到来的明天。人生若调成纠结模式，就会不由自主地进入一种死循环里，无声无息中消耗掉了你所拥有的眼前。",NULL,"Tweeties","Tina Wang");
INSERT INTO tweeties(tweet_id,tweet_title,tweet_date,tweet_content,link,category,usr_name) 
VALUES("QA00001","How to initialize <pre><code class='language-html'>List<String></code></pre> object in java?",NOW(),"All known imiplementing classes:<br><pre class='lang-java prettyprint prettyprinted'><code>List<String> l1 = new ArrayList<String>();</code><code>List<String> l2 = new LinkedList<String>();</code><br><code>List<String> supplierNames3 = new Vector<String>();</code></pre>",NULL,"QandA","Tina Wang");)
INSERT INTO tweeties(tweet_id,tweet_title,tweet_date,tweet_content,link,category,usr_name)
VALUES("T00001",NULL,NOW(),"",NULL,"Tweeties","Tina Wang")

