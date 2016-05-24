      results.forEach(function(result) {
      	result.tags = result.tagsid.toString().split(",").map(function(value){
          return {tagid: Number(value)};
        });
        delete result.tagsid;
      });

     results.forEach(function(result) {
      result.tags = result.tagname.toString().split(",").map(function(value){
       return {tagname:value};
      });
     })

            result = results[i];
      tab[i].blog_h2 = result.blog_h2;
      tab[i].blog_h3 = result.blog_h3;
      tab[i].posttime = result.posttime;
      a = result.tagsid.toString.split(",");
      b = result.tagname.toString.split(",");
      c = result.tagspan.toString.split(",");
      tab[i].tags = {};
      for(var j=0; j<a.length;j++){
        tab[i].tags.push({tagid:Number(a[j]),tagname:b[j],tagspan:c[j]});
      }
      tab[i].usr_name = result.usr_name;
      tab[i].blog_id = result.blog_id;
      tab[i].attachment_name = result.attachment_name;
      tab[i].attachment_type = result.attachment_type;
      tab[i].link = result.link;

for(var i=0;i<Math.min(results.length,10); i++){
  tab[i] = results[i]
  tab[i][tags] = []
  a = result.tagsid.toString.split(",");
  b = result.tagname.toString.split(",");
  c = result.tagspan.toString.split(",");
  for(var j=0; j<a.length;j++){
    tab[i][tags].push({tagid:Number(a[j]),tagname:b[j],tagspan:c[j]});
  }
}



from 0 to 3
[ { blog_id: '2',
    blog_h2: 'Parallel Community Detection for Large Graph',
    blog_h3: null,
    blog_body: 'Community detection has arisen as one of the most relevant topics in the field of graph mining, principally for its applica- tions in domains such as social or biological networks anal- ysis. Different community detection algorithms have been proposed during the last decade, approaching the problem from different perspectives. However, existing algorithms are, in general, based on complex and expensive computa- tions, making them unsuitable for large graphs with millions of vertices and edges such as those usually found in the real world.',
    posttime: Mon Jun 08 2015 18:45:00 GMT-0400 (EDT),
    tagsid: '1,3',
    tagname: 'algorithm,graph',
    tagspan: 'lable label-success,label label-success',
    attachment_id: '2001',
    attachment_type: 'paper',
    attachment_name: 'parallel_community_detection_for_large_graph',
    link: 'href=\'images/parallel_community_detection_for_large_graph.pdf\'',
    width: null,
    height: null },
  { blog_id: '1',
    blog_h2: 'The PageRank Citation Ranking:',
    blog_h3: 'Bring the order to web',
    blog_body: 'Mathematical PageRanks for a simple network, expressed as percentages. (Google uses a logarithmic scale.) Page C has a higher PageRank than Page E, even though there are fewer links to C; the one link to C comes from an important page and hence is of high value. If web surfers who start on a random page have an 85% likelihood of choosing a random link from the page they are currently visiting, and a 15% likelihood of jumping to a page chosen at random from the entire web, they will reach Page E 8.1% of the time. (The 15% likelihood of jumping to an arbitrary page corresponds to a damping factor of 85%.) Without damping, all web surfers would eventually end up on Pages A, B, or C, and all other pages would have PageRank zero. In the presence of damping, Page A effectively links to all pages in the web, even though it has no outgoing links of its own.',
    posttime: Sat Jun 06 2015 18:00:00 GMT-0400 (EDT),
    tagsid: '1,2',
    tagname: 'algorithm,data science',
    tagspan: 'lable label-success,label label-info',
    attachment_id: '1001',
    attachment_type: 'paper',
    attachment_name: 'PageRank',
    link: 'href=\'images/pagerank.pdf\'',
    width: null,
    height: null },
  tags: [] ]
{ fieldCount: 0,
  affectedRows: 0,
  insertId: 0,
  serverStatus: 34,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0,
  tags: [] }


function liked()
{
 var val = $(this).find("#numbers").value;
 $(this).find("#numbers").html(function(i,val) {return val*1+1}); 
}
 $("#likes").click(function() {
  $(this).find("#numbers").html(function(i,val) {return val*1+1}); 
 });

          div(class="outer-grid")
          - each image, i in blog.images
           div(class="image-grid")
            img(src='/images/#{image.picname}',height='100%',width='100%')
