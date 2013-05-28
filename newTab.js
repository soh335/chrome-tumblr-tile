$(function() {
    tumblrTile.draw();
	a=document.getElementById("commonlink");
a.addEventListener("click",function(){
	console.log("aaa");
	chrome.tabs.update( {url:"chrome-internal://newtab/"} );
},true);
});
