import TTSReader from "@/components/tts-reader";
import "@/globals.css"
import ReactDOM from "react-dom/client"
import React from "react";

export const PortalContext = React.createContext<HTMLElement | null>(null);

const ContentRoot = () => {
  // Radix UI Portal
  // Some components will not render in the shadow root, so you need to create a portal
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  return (
    <React.StrictMode>
      <PortalContext.Provider value={portalContainer}>
        <div ref={setPortalContainer} id="mur-mur-container">
          <TTSReader />
        </div>
      </PortalContext.Provider>
    </React.StrictMode>
  );
};
export default defineContentScript({
    matches: ['<all_urls>'],
    cssInjectionMode: "ui",

  
  async main(ctx) {
      console.log("Content script starting...")
      
      const ui = await createShadowRootUi(ctx, {
          name: "mur-mur",
          position: "inline",
          anchor: "body",
          onMount: (container) => {
            console.log("UI mounting...")
              const app = document.createElement('div');
              container.appendChild(app);
                // Create a root on the UI container and render a component
                const root = ReactDOM.createRoot(app);
                root.render(<ContentRoot />);
                return root;
          },
          onRemove: (root) => {
              if (root) {
                root.unmount()
              }
          }
      })

      console.log("Mounting UI...")
      ui.mount()
      console.log("UI mounted!")
  },
});


