/* See license.txt for terms of usage */

"use strict";

module.metadata = {
  "stability": "experimental"
};

const { Trace, TraceError } = require("./core/trace.js").get(module.id);
const { EventTarget } = require("sdk/event/target");
const { Class } = require("sdk/core/heritage");
const { Menu } = require("./menu.js");
const { Locale } = require("./core/locale.js");

const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

/**
 * xxxHonza: should be probably in an extra module
 */
const ToolbarButton = Class(
/** @lends ToolbarButton */
{
  extends: EventTarget,
  initialize: function(options) {
    EventTarget.prototype.initialize.call(this);

    this.button = createToolbarButton(options.toolbar, options,
      options.referenceElement, options.document);

    return this.button;
  },

  remove: function() {
    if (this.button) {
      this.button.remove();
    }
  }
});

function createToolbarButton(toolbar, button, before, doc)
{
  if (typeof(button) == "string" && button.charAt(0) == "-") {
    return createToolbarSeparator(toolbar, before, doc);
  }

  let ownerDoc = doc || toolbar.ownerDocument;
  let toolbarButton = ownerDoc.createElementNS(XUL_NS, "toolbarbutton");

  setItemIntoElement(toolbarButton, button);

  if (!toolbar) {
    return toolbarButton;
  }

  if (before) {
    toolbar.insertBefore(toolbarButton, before);
  } else {
    toolbar.appendChild(toolbarButton);
  }

  return toolbarButton;
};

// Like Menu.setItemIntoElement, but for toolbar buttons.
function setItemIntoElement(element, item)
{
  if (item.label) {
    let label = item.nol10n ? item.label : Locale.$STR(item.label);
    element.setAttribute("label", label);
  }

  if (item.id) {
    element.setAttribute("id", item.id);
  }

  if (item.type) {
    element.setAttribute("type", item.type);
  }

  if (item.checked) {
    element.setAttribute("checked", "true");
  }

  if (item.disabled) {
    element.setAttribute("disabled", "true");
  }

  if (item.image) {
    element.setAttribute("image", item.image);
  }

  if (item.command) {
    element.addEventListener("command", item.command, false);
  }

  if (item.commandID) {
    element.setAttribute("command", item.commandID);
  }

  if (item.option) {
    element.setAttribute("option", item.option);
  }

  if (item.tooltiptext) {
    let tooltiptext = item.nol10n ? item.tooltiptext :
      Locale.$STR(item.tooltiptext);
    element.setAttribute("tooltiptext", tooltiptext);
  }

  if (item.className) {
    element.classList.add(item.className);
  }

  if (item["class"]) {
    element.className = item["class"];
  }

  if (item.key) {
    element.setAttribute("accesskey", item.key);
  }

  if (item.name) {
    element.setAttribute("name", item.name);
  }

  if (item.items) {
    Menu.createMenuPopup(element, item);
  }

  // Finally, set all custom attributes (starting with '_').
  let props = Object.getOwnPropertyNames(item);
  for (let prop of props) {
    if (prop.startsWith("_")) {
      element.setAttribute(prop.slice(1), item[prop]);
    }
  }

  return element;
}

function createToolbarSeparator(toolbar, before, doc)
{
  if (!toolbar.firstChild) {
    return;
  }

  let ownerDoc = doc || toolbar.ownerDocument;
  let separator = ownerDoc.createElement("toolbarseparator");

  if (!toolbar) {
    return separator;
  }

  if (before) {
    toolbar.insertBefore(separator, before);
  } else {
    toolbar.appendChild(separator);
  }

  return separator;
};

exports.ToolbarButton = ToolbarButton;
