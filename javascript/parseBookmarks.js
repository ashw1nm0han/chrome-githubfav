var DOM_CONTENT_LOADED = 'DOMContentLoaded';
var ID_NO_BOOKMARKS = '#no_bookmarks';
var MSG_NO_BOOKMARKS =  '<p><strong>No Github Bookmarks Found</strong></p>';
var GITHUB_REGEX = /github.com/i;

function createExtensionItem(bookmark){
	var li = $('<li>');
	var span = $('<span>');
	var a = $('<a>');
	a.attr("href", bookmark.url);
	a.attr("title", bookmark.url);
	a.text(bookmark.title);
	span.append(a);
	li.append(span);
	return li;
}

function addToPage(github_bookmarks){
	var div = $(ID_NO_BOOKMARKS);
	if(github_bookmarks.length > 0)
	{
		var list = $('<ul>');
		github_bookmarks.forEach(function(bookmark){
			list.append(createExtensionItem(bookmark));
		});
		div.append(list);
	}
	else{
		div.append(MSG_NO_BOOKMARKS);
	}
}

function processBookmark(bookmark, github_bookmarks){
	if(bookmark.children){
		bookmark.children.forEach(function(child){
			processBookmark(child, github_bookmarks);
		});
	}
	else {
		if(GITHUB_REGEX.test(bookmark.url)){
			github_bookmarks.push({"id": bookmark.id, "title": bookmark.title, "url": bookmark.url});
		}
	}
}

function loadMarks(){
	chrome.bookmarks.getTree(function(bookmarks){
	var github_bookmarks = [];
	bookmarks.forEach(function(item){
		processBookmark(item, github_bookmarks);
	});
	addToPage(github_bookmarks);
	});

}

document.addEventListener(DOM_CONTENT_LOADED, function(){
	loadMarks();
});

$(document).on( "click", "a", function() {
	chrome.tabs.create({"url":this.href}, function(){});
	return false;
});
