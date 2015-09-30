/* See license.txt for terms of usage */

"use strict";

(function() {

/**
 * Switch theme within this window.
 */
function switchTheme(newTheme, oldTheme) {
  var body = document.body;

  if (newTheme === oldTheme) {
    return;
  }

  var oldThemeDef = Theme.getDefinition(oldTheme);

  // Unload all theme stylesheets related to the old theme.
  if (oldThemeDef) {
    for (var url of oldThemeDef.stylesheets) {
      removeSheet(url);
    }
  }

  // Load all stylesheets associated with the new theme.
  var newThemeDef = Theme.getDefinition(newTheme);

  // The theme might not be available anymore (e.g. uninstalled)
  // Use the default one.
  if (!newThemeDef) {
    newThemeDef = Theme.getDefinition("light");
  }

  for (var url of newThemeDef.stylesheets) {
    loadSheet(url);
  }

  if (oldThemeDef) {
    for (var name of oldThemeDef.classList) {
      body.classList.remove(name);
    }

    if (oldThemeDef.onUnapply) {
      oldThemeDef.onUnapply(window, newTheme);
    }
  }

  for (var name of newThemeDef.classList) {
    body.classList.add(name);
  }

  if (newThemeDef.onApply) {
    newThemeDef.onApply(window, oldTheme);
  }

  // Final notification for further theme-switching related logic?
  //emit("theme-switched", window, newTheme, oldTheme);
}

/**
 * Handle theme-changed event
 */
function handleThemeChange(event) {
  var data = event.data;
  switchTheme(data.newTheme, data.oldTheme);
}

/**
 * Handle 'initialize' event and register 'theme-changed' listener.
 */
addEventListener("initialize", event => {
  var body = document.body;

  if (body.hasAttribute("force-theme")) {
    switchTheme(body.getAttribute("force-theme"));
  } else {
    switchTheme(Theme.getCurrentTheme());
    window.addEventListener("theme-changed", handleThemeChange);
  }
})

// Helpers

function loadSheet(url) {
  var style = document.createElement("link");
  style.setAttribute("rel", "stylesheet");
  style.setAttribute("href", url);
  style.setAttribute("id", url);

  var head = document.getElementsByTagName("head")[0];
  head.appendChild(style);
}

function removeSheet(url) {
  var style = document.getElementById(url);
  if (style) {
    style.remove();
  }
}

// End of theme-switching.js
})();
