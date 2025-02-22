import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  manifest: {
    permissions: ['storage', 'activeTab', "scripting", "contextMenus"],
    optional_host_permissions: ["*://*/*"],
    action: {}
  },

  hooks: {
    "build:manifestGenerated": (wxt, manifest) => {
      if (wxt.config.command === "serve") {
        // During development, content script is not listed in manifest, causing
        // "webext-dynamic-content-scripts" to throw an error. So we need to
        // add it manually.
        manifest.content_scripts ??= [];
        manifest.content_scripts.push({
          matches: ["*://*.wxt.dev/*"],
          js: ["content-scripts/content.js"],
        });
      }
    },
  },

  runner: {
    startUrls: ["https://tkdodo.eu/blog/dont-over-use-state"]
  }
});
