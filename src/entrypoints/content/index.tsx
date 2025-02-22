import "@/assets/style.css"
import ReactDOM from "react-dom/client"
import App from "./App"

export default defineContentScript({
    matches: ['<all_urls>'],
    cssInjectionMode: "ui",

  
  async main(ctx) {
      console.log("Content script starting...")
      
      const ui = await createShadowRootUi(ctx, {
          name: "mur-mur",
          position: "overlay",
          anchor: "body",
          append: "first",
          onMount: (container) => {
              console.log("UI mounting...")
              const wrapper = document.createElement("div")
              wrapper.style.position = "fixed"
              wrapper.style.bottom = "20px"
              wrapper.style.right = "20px"
              wrapper.style.zIndex = "999999"
              container.appendChild(wrapper)
              const root = ReactDOM.createRoot(wrapper)
              root.render(<App />)
              return {root, wrapper}
          },
          onRemove: (elements) => {
              if (elements) {
                  elements.root.unmount()
                  elements.wrapper.remove()
              }
          }
      })

      console.log("Mounting UI...")
      ui.mount()
      console.log("UI mounted!")
  },
});
