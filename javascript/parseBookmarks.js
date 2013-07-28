var DOM_CONTENT_LOADED = 'DOMContentLoaded';
var ID_NO_BOOKMARKS = '#no_bookmarks';
var MSG_NO_BOOKMARKS =  '<p><strong>No Github Bookmarks Found</strong></p>';
var GITHUB_REGEX = /github.com/i;

function createExtensionItem(bookmark){
	var row = $('<tr>');
	
	var colleft = $('<td>');
	colleft.attr("class", "link_main");
	var a = $('<a>');
	a.attr({"href": bookmark.url, "title": bookmark.url});
	a.text(bookmark.title);
	colleft.append(a);
	
	var colright = $('<td>');
	colright.attr("class", "link_remove");
	var a_remove = $('<a>');
	a_remove.attr({"title": "remove", "href": "remove", "id": bookmark.id});
	a_remove.text("remove");
	colright.append(a_remove);
	
	row.append(colleft);
	row.append(colright);
	return row;
}

function addToPage(github_bookmarks){
	var div = $(ID_NO_BOOKMARKS);
	div.empty();
	if(github_bookmarks.length > 0)
	{
		var list = $('<table>');
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
	if($(this).parent().attr("class") == "link_main"){
		chrome.tabs.create({"url":this.href}, function(){});
		return false;
	}
	
	if($(this).parent().attr("class") == "link_remove"){
		chrome.bookmarks.remove(this.id);
		loadMarks();
		return false;
	}	
});