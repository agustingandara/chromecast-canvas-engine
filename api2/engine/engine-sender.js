/*	ENGINE 2D CHROMECAST/PC/MOBILE *
 *	NUMEN - AGUSTIN NAHUEL GANDARA */

//Variables	
var isConnected = false;
var appID = "";

//Keyboard Listeners
addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
}, false);


function loop() {
	
	if (isConnected) {
		var objectToSend = new Object();
		objectToSend.KeysDown = keysDown;
		castSendMessage(objectToSend);
	}
}

setInterval(loop, 1000 / 20); //datos por segundo

//api funcitons initializers

function loadEngine(_appID) {
	appID = _appID;
	if (!chrome.cast || !chrome.cast.isAvailable) {
		console.log('sender available');
		setTimeout(initializeCastApi, 1000);
	}
}

function initializeCastApi() {
	console.log('initializing');
	console.log(appID);
	var sessionRequest = new chrome.cast.SessionRequest(appID); //this is the APPLICATION ID
	var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
	chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

function receiverListener(e) {
	if (e === 'available') {
		console.log('receiver available');
		document.getElementById('castButton').hidden = false;
		document.getElementById('castLabel').hidden = true;
		castSetIsConnected(false);
	} else {
		document.getElementById('castLabel').innerHTML = "Chromecast API Error";
	}
}

function sessionListener(e) {
	session = e;
	if (session.media.length != 0) {
		onMediaDiscovered('onRequestSessionSuccess', session.media[0]);
	}
}

//functions

function castSendMessage(msg) {
	console.log('cast buttonsend click');
	session.sendMessage('urn:x-cast:com.numen.castmessage', msg, onSendMessageSuccess, onSendMessageError);
}

function castSetIsConnected(isconnected) {
	isConnected = isconnected;
	if (isConnected)
		document.getElementById('castButton').value = "Disconnect";
	else
		document.getElementById('castButton').value = "Connect";
}

function onCastButtonConnectionClick() {
	if (!isConnected) {
		console.log('cast connecting');
		chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
	} else {
		console.log('cast disconnecting');
		session.stop(onDisconnectSuccess, onDisconnectError);
	}
}

//events handlers

function onRequestSessionSuccess(session_instance) {
	console.log('session connected');
	castSetIsConnected(true);
	session = session_instance;
}

function onInitSuccess() {
	console.log('init success');
}

function onDisconnectSuccess() {
	console.log('disconnect success');
	document.getElementById('castButton').value = "Connect";
	castSetIsConnected(false);
}

function onError() {
	console.log('initialize error');
}

function onLaunchError() {
	console.log("launch error");
}

function onDisconnectError() {
	console.log('disconnect error');
}

function onSendMessageError() {
	console.log('send message error');
}

function onSendMessageSuccess() {
	console.log('send message success');
}

