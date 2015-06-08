Sender
Sender web is only necessary for a Chromecast compatible APP. It will work as an input and will control the Receiver web.
You have to register an APP on Google Chromecast console, and they will get you an APP\_ID linked to a RECEIVER\_URL and a SENDER\_URL, where you have to upload this SENDER HTML.
This base API resolve the communication with the Chromecast, logs on javascript console all the transactions, and send all the keyboard inputs to the TV, obviously if you need you can send other information while it respect a JSON structure.

Sender Imports
> 

&lt;script type="text/javascript" src="https://www.gstatic.com/cv/js/sender/v1/cast\_sender.js"&gt;



&lt;/script&gt;


> 

&lt;script type="text/javascript" src="../engine/engine-base.js"&gt;



&lt;/script&gt;


> > 

&lt;script type="text/javascript" src="../engine/engine-sender.js"&gt;



&lt;/script&gt;



Sender Initialize
This is the hardest part, you have to call loadEngine(APP\_ID) function when window onload is handle.

Example:
window.onload = function() {
loadEngine("APP\_ID");
}

Sender Body
You can add this HTML tags to the BODY. If you add a Label with the ID “castLabel” it will work as a first initializer alert and If you add an Input with the ID “castButton”, you will have to handle the onclick event with onCastButtonConnectionClick(), it will work as a browser plugin Chromecast button, inside the web, and it will show different states inside it depending of the connection state.



&lt;body&gt;



> <!--CHROMECAST API --->
> 

&lt;label id="castLabel"&gt;

Initializing Chromecast API

&lt;/label&gt;


> 

&lt;input id="castButton" hidden="true" type="button" value="Chromecast" onclick="onCastButtonConnectionClick()" /&gt;




&lt;/body&gt;

