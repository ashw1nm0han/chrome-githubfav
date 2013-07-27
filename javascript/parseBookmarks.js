function addToPage(github_bookmarks){
	var div = $('#no_bookmarks');
	if(github_bookmarks.length > 0)
	{
		var list = $('<ul>');
		for(var i = 0; i< github_bookmarks.length;++i){
			list.append(createExtensionItem(github_bookmarks[i]));
		}

		div.append(list);
	}
	else{
		div.append('<p><strong>No Github Bookmarks Found</strong></p>');
	}
}

function processBookmark(bookmark, github_bookmarks){
	if(bookmark.children){
		bookmark.children.forEach(function(child){
		processBookmark(child, github_bookmarks);
		});
	}
	else {
	    var re = /github.com/i;
		if(re.test(bookmark.url)){
			github_bookmarks.push(bookmark);
		}
	}
}

function loadMarks(){
	var nodes = chrome.bookmarks.getTree(function(bookmarks){
				var github_bookmarks = []; // all the bookmarks on the github website.
				bookmarks.forEach(function(item){
					processBookmark(item, github_bookmarks);
				});
				addToPage(github_bookmarks);
	});

}

function createExtensionItem(bookmark){
	var li = $('<li>');
	var div = $('<div>');
	div.append('<p>'+ bookmark.title + '</p>'+ '<p>'+ bookmark.url + '</p>' );
	li.append(div);
	return li;
}

document.addEventListener('DOMContentLoaded', function(){
	loadMarks();
});