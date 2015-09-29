/* See license.txt for terms of usage */

"use strict";

(function({
  content,
  addMessageListener,
  sendAsyncMessage,
  removeMessageListener,
  addEventListener}) {

const Cu = Components.utils;
const Cc = Components.classes;
const Ci = Components.interfaces;

const document = content.document;
const window = content;

/**
 * Register a listener for messages from a panel (Controller, chrome scope).
 * A message from chrome scope comes through a message manager.
 * It's further distributed as DOM event, so it can be handled by
 * views (View, content scope).
 */
addMessageListener("firebug.sdk/message", message => {
  const { type, data } = message.data;
  var contentData = new window.Object();
  contentData.data = window.wrappedJSObject.JSON.parse(JSON.stringify(data));
  const event = new window.MessageEvent(type, contentData);
  window.dispatchEvent(event);
});

/**
 * Send a message to the parent myPanel.js (Controller, chrome scope).
 */
function postChromeMessage(id, args) {
  const event = {
    type: id,
    args: args,
  };

  sendAsyncMessage("firebug.sdk/message", event);
}

/**
 * Register a listener for DOM events from myView.js (View, content scope).
 * It's further distributed as a message through message manager to
 * myPanel.js (Controller, chrome scope).
 */
window.addEventListener("firebug.sdk/event", function (event) {
  const data = event.data;
  postChromeMessage(data.type, data.args);
}, true);

// End of scope
})(this);
