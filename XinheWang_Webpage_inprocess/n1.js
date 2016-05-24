<img src="images/zhijiao3.jpg" class='img-responsive' />

<div class='panel panel-danger'>
   <div class='panel-heading'>
      <h3 class='panel-title'>Panel title</h3>
   </div>
   <div class='panel-body'>
      <img src="+$img+" height=300px />
   </div>
</div>


 $(".image").click(function(){
  $img = $(this).attr('src');
  $(this).parent('#display-image').html("<p>this</p>");
 });



 <div class="modal" id="myModal">
  <div class="modal-header">
    <button class="close" data-dismiss="modal">×</button>
    <h3>Modal header</h3>
  </div>
  <div class="modal-body">
    <p>One fine body…</p>
  </div>

  <div class="modal" id="myModal">
  <div class="modal-header">
    <button class="close" data-dismiss="modal">×</button>
    <h3>Modal header</h3>
  </div>
  <div class="modal-body">
    <p>One fine body…</p>
  </div>
function checkaccount() 
{
 var usrname = document.getElementbyId("inputUsernameEmail").value
 var pw = document.getElementbyId("inputPassword").value
 
}

  div(id="display-image#{blog.blog_id}",class="display-image model")








       for(var i=0;i<Math.min(results.length,10); i++){
      console.log(results);
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


[ { usr_id: '1',
    usr_name: 'Tina Wang',
    class: 'Administrator',
    first_name: 'Xinhe',
    last_name: 'Wang',
    email: 'xinhehe8612@gmail.com',
    city: 'Seattle',
    website: '/theheapspace/aboutme',
    profile_pic: 'profilepic.jpg',
    state: 'WA',
    last_time_login: Tue Jul 21 2015 11:27:52 GMT-0400 (EDT),
    password: 'lianshang9le',
    banner_pic: 'banner2.jpg',
    back_pic: null,
    pf_intro: 'The ideals which have lighted my way , and time after time have given me new courage to face life cheerfully have been kindness , beauty and truth',
    currenttime: null } ]
{ usr_id: '1',
  usr_name: 'Tina Wang',
  class: 'Administrator',
  first_name: 'Xinhe',
  last_name: 'Wang',
  email: 'xinhehe8612@gmail.com',
  city: 'Seattle',
  website: '/theheapspace/aboutme',
  profile_pic: 'profilepic.jpg',
  state: 'WA',
  last_time_login: Tue Jul 21 2015 11:27:52 GMT-0400 (EDT),
  password: 'lianshang9le',
  banner_pic: 'banner2.jpg',
  back_pic: null,
  pf_intro: 'The ideals which have lighted my way , and time after time have given me new courage to face life cheerfully have been kindness , beauty and truth',
  currenttime: null }
[ { blog_id: '3',
    blog_h2: 'Being a Support Teacher at Ru Jiazhuang Primary School:',
    blog_h3: null,
    blog_body: 'This is one of my best volunteering memories, grown with these kids.',
    posttime: Tue Jul 07 2015 12:15:00 GMT-0400 (EDT),
    tagsid: '4',
    tagname: 'volunteering',
    tagspan: 'label label-warning',
    attachment_id: null,
    attachment_type: null,
    attachment_name: null,
    link: null,
    usr_name: 'Tina Wang',
    website: '/theheapspace/aboutme',
    numberlikes: 0,
    picid: 'image3001,image3002,image3003,image3004,image3005',
    picname: 'zhijiao1.jpg,zhijiao2.jpg,zhijiao3.jpg,zhijiao4.jpg,zhijiao5.jpg',
    piclink: 'images/zhijiao1.jpg,images/zhijiao2.jpg,images/zhijiao3.jpg,images/zhijiao4.jpg,images/zhijiao5.jpg' },
  { blog_id: '2',
    blog_h2: 'Parallel Community Detection for Large Graph',
    blog_h3: null,
    blog_body: 'Community detection has arisen as one of the most relevant topics in the field of graph mining, principally for its applica- tions in domains such as social or biological networks anal- ysis. Different community detection algorithms have been proposed during the last decade, approaching the problem from different perspectives. However, existing algorithms are, in general, based on complex and expensive computa- tions, making them unsuitable for large graphs with millions of vertices and edges such as those usually found in the real world.',
    posttime: Mon Jun 08 2015 18:45:00 GMT-0400 (EDT),
    tagsid: '1,3',
    tagname: 'algorithm,graph',
    tagspan: 'label label-success,label label-success',
    attachment_id: '2001',
    attachment_type: 'paper',
    attachment_name: 'parallel_community_detection_for_large_graph',
    link: 'href = \'/papers/parallel_community_detection_for_large_graph.pdf\'',
    usr_name: 'Tina Wang',
    website: '/theheapspace/aboutme',
    numberlikes: 3,
    picid: null,
    picname: null,
    piclink: null },
  { blog_id: '1',
    blog_h2: 'The PageRank Citation Ranking:',
    blog_h3: 'Bring the order to web',
    blog_body: 'Mathematical PageRanks for a simple network, expressed as percentages. (Google uses a logarithmic scale.) Page C has a higher PageRank than Page E, even though there are fewer links to C; the one link to C comes from an important page and hence is of high value. If web surfers who start on a random page have an 85% likelihood of choosing a random link from the page they are currently visiting, and a 15% likelihood of jumping to a page chosen at random from the entire web, they will reach Page E 8.1% of the time. (The 15% likelihood of jumping to an arbitrary page corresponds to a damping factor of 85%.) Without damping, all web surfers would eventually end up on Pages A, B, or C, and all other pages would have PageRank zero. In the presence of damping, Page A effectively links to all pages in the web, even though it has no outgoing links of its own.(from wiki)',
    posttime: Sat Jun 06 2015 18:00:00 GMT-0400 (EDT),
    tagsid: '1,2',
    tagname: 'algorithm,data science',
    tagspan: 'label label-success,label label-info',
    attachment_id: '1001',
    attachment_type: 'paper',
    attachment_name: 'PageRank',
    link: 'href = \'/papers/pagerank.pdf\'',
    usr_name: 'Tina Wang',
    website: '/theheapspace/aboutme',
    numberlikes: 1,
    picid: 'image1001',
    picname: 'rankpage.png',
    piclink: 'images/rankpage.png' } ]
undefined

