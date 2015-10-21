var cheerio = require("cheerio");
var request = require("request");
var mongodb = require('mongodb');

for (i = 1 ; i <= 272; i++){
	
	url = "http://yourstory.com/ys-stories/page/" + i + "/"

	request (url,function(error,response,html){

		if(!error && response.statusCode == 200) {

			var $ = cheerio.load(html) ;

			var storyLinks = $('li.grid-full.mb-30').each(function(){

				var link = $(this).find('a.block').attr('href');
				
				crawl(link)
			});
		}
	});

}

function crawl(url){

request(url, function(error,response,html){

	if(!error && response.statusCode == 200) {

		var $ = cheerio.load(html);
		
		var title = $('h3.title-large.color-ys').text().trim();
		
		var date = $('p.postInfo.color-grey.mt-5').first().text().trim();
		
		var articleType = $('div.pill.pill-white.mb-16').first().text().trim();
		
		tags = [];
		
		var tagsList = $('a.pill.pill-large.pill-grey').each(function(){

			var tag = $(this).text().trim();
			tags.push(tag);
		})
		
		var authorName = $('a.aboutAuthor_name.inline-block.mr-5').text().trim();
		
		var aboutAuthor = $('p.aboutAuthor_text.mt-5').text().trim();
		
		text_element_list = []
		
		site_links = []
		
		img_links = []
		
		var textElement = $('div.ys_post_content.text p').each(function(){
		
			var text = $(this).text().trim();
		
			text_element_list.push(text);
		
			var link = $(this).children('a').each(function(){
				
				var links = $(this).attr('href');
				var temp = links.slice(-4);

				if (temp === '.jpg' || temp === '.png' ) {

					img_links.push(links);
				}
				else {

					site_links.push(links);
				}
				

			});	
			
		});
		
		var imgLinks = $('div.ys_post_content.text figure').each(function(){

			var imglink = $(this).children('a').attr('href');
			img_links.push(imglink);
		});

		var main_object = {
			"title" : title,
			"date" : date,
			"Article Type" : articleType,
			"Tags" : tags,
			"Text Element" : text_element_list,
			"Site Links" : site_links,
			"Image Links" : img_links
		};

		var author_object = {
			"Author Name" : authorName,
			"About Author" : aboutAuthor
		};

		console.log(main_object);
		console.log(author_object);
}

});


}