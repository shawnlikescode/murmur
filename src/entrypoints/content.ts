export default defineContentScript({
  matches: ['https://www.google.com/'],
  cssInjectionMode: "ui",
  async main(ctx) {
    console.log("Hello from content script!");
  },
});