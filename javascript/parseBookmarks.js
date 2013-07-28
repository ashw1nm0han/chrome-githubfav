var GITHUB_BOOKMARKS = 'githubbookmarks';
var IS_LOADED = 'isNew_githubbookmarks';
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
	div.empty();
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

function SaveForSync(github_bookmarks){
	try {
		localStorage[GITHUB_BOOKMARKS] = JSON.stringify(github_bookmarks);
		localStorage[IS_LOADED] = JSON.stringify(true);
	}
	catch(err){
		console.log("The storage set for SaveForSync throws an error:" + err.message);
	}
}

function loadMarks(){
	chrome.bookmarks.getTree(function(bookmarks){
	var github_bookmarks = [];
	bookmarks.forEach(function(item){
		processBookmark(item, github_bookmarks);
	});
	addToPage(github_bookmarks);
	SaveForSync(github_bookmarks);
	});

}

chrome.bookmarks.onCreated.addListener(function(id, bookmark){
	try {
		if(!bookmark.children && GITHUB_REGEX.test(bookmark.url)){
			var bk = JSON.parse(localStorage[GITHUB_BOOKMARKS]);
			bk.push({"id": bookmark.id, "title": bookmark.title, "url": bookmark.url});
			addToPage(bk);
			localStorage[GITHUB_BOOKMARKS] = JSON.stringify(bk);
		}
	}
	catch(err){
		console.log("The storage set for chrome.bookmarks.onCreated throws an error:" + err.message);
	}	
});

chrome.bookmarks.onRemoved.addListener(function(){
	loadMarks();
});

chrome.bookmarks.onImportEnded.addListener(function(){
	loadMarks();
});

chrome.bookmarks.onChanged.addListener(function(id, changeinfo){
	try {
		var removeLoc = -1;
		var bk = JSON.parse(localStorage[GITHUB_BOOKMARKS]);
		for(var i = 0; i < bk.length; ++i){
		
			if(bk[i].id == id){
				if(GITHUB_REGEX.test(bookmark.url)){
					bk[i].title = changeinfo.title;
					bk[i].url = changeinfo.url;
				}
				
				else{
					removeLoc = i;
					break;
				}
			}
		}
		if(removeLoc >= 0){
				bk.remove(removeLoc);
		}
		addToPage(bk);	
		localStorage[GITHUB_BOOKMARKS] = JSON.stringify(bk);
	}
	catch(err){
		console.log("The storage set for chrome.bookmarks.onCreated throws an error:" + err.message);
	}			
});

document.addEventListener(DOM_CONTENT_LOADED, function(){
	if(localStorage[IS_LOADED] == undefined){
		loadMarks();
	}
	else {
		addToPage(JSON.parse(localStorage[GITHUB_BOOKMARKS]));
	}
});