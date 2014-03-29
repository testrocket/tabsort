chrome.tabs.onUpdated.addListener(function(id, changeInfo, tab) {
	console.log(changeInfo);
	if (changeInfo.status === "complete") 
	{
		moveTabs()
	}
});

function moveTabs() {
	chrome.tabs.query({}, function(tabs) {
		var urls = [];
		for (var i = 0; i < tabs.length; i++) {
			urls.push(tabs[i].url);	
		}
		
		urls.sort(function(url1, url2) {
			return parse(url1).localeCompare(parse(url2));
		});
		
		console.log(urls);
		
		var tabData = [];
		for (var i = 0; i < urls.length; i++) {
			for (var j = 0; j < tabs.length; j++) {
				if (tabs[j].url === urls[i]) {
					tabData.push({id: tabs[j].id, index: i });
				}	
			}
		}
		
		for (var i = 0; i < tabData.length; i++) {
			chrome.tabs.move(tabData[i].id, { index: tabData[i].index }, function(tabs) {
				console.log('done moving');
			});
		}
	});
}

function parse(url) {
	var fixed = url.substring(url.indexOf('://') + 3);
	var index = fixed.indexOf('/');
	
	index = index === -1 ? fixed.length : index;
	
	fixed = fixed.substring(0, index);
	
	index = fixed.lastIndexOf('.');
	if (index === -1) {
		return fixed;
	}
	
	index = fixed.lastIndexOf('.', index - 1);
	if (index === -1) {
		return fixed;
	}
	
	fixed = fixed.substring(index + 1);
	return fixed;
}