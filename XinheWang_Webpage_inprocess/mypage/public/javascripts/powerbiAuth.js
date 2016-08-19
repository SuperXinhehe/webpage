// funciton to get the authorization information 
// contains workspacename, workspaceid, reportid and accesskey
function postActionReport(token) {
	var accessToken = token;
	if ("" == accessToken) return;
	var m = {action: "loadReport",accessToken:accessToken};
	var message = JSON.stringify(m);
	iframe = document.getElementById("myReport");
	iframe.contentWindow.postMessage(message,"*");
}