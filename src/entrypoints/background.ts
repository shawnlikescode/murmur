import "webext-dynamic-content-scripts"
import addPermissionToggle from "webext-permission-toggle"

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  addPermissionToggle()


  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.text) {
      console.log(message.text);
      const utterance = new SpeechSynthesisUtterance(message.text);
      speechSynthesis.speak(utterance);
    }
  });

  browser.contextMenus.create({
      id: "read-selection",
      title: "Read Selection",
      contexts: ["selection"]
    });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "read-selection" && info.selectionText) {
      
    }
  });


});
