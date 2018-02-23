window.onbeforeunload = function () {
	console.log("Hello Gagan");
	return "Do you really want to close?";
};