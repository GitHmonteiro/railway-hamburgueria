// facebook-pixel.service.ts
declare global {
    interface Window {
      fbq: FacebookPixel;
    }
  }
  
  interface FacebookPixel {
    (
      cmd: 'init',
      pixelId: string,
      options?: { autoConfig?: boolean; debug?: boolean }
    ): void;
    (cmd: 'track', event: string, parameters?: Record<string, unknown>): void;
    (cmd: 'trackSingle', pixelId: string, event: string, parameters?: Record<string, unknown>): void;
    callMethod?: (...args: any[]) => void;
    queue: any[];
    push: (...args: any[]) => void;
    loaded: boolean;
    version: string;
  }
  
  type FacebookPixelEvent = 
    | 'PageView' 
    | 'Purchase' 
    | 'InitiateCheckout'
    | 'ViewContent'
    | 'AddToCart'
    | 'CompleteRegistration';
  
  interface FacebookPixelParams {
    [key: string]: any;
  }
  
  export class FacebookPixelService {
    private static initialized = false;
    private static pixelId = '663421426299567'; // Seu Pixel ID
  
    public static initialize(): void {
      if (this.initialized || typeof window === 'undefined') return;
  
      // Inicializa o pixel
      this.injectPixelScript();
      window.fbq('init', this.pixelId);
      this.track('PageView'); // Track automatic page view
      this.initialized = true;
    }
  
    public static track(event: FacebookPixelEvent, params?: FacebookPixelParams): void {
      if (typeof window === 'undefined' || !window.fbq) return;
  
      if (params) {
        window.fbq('track', event, params);
      } else {
        window.fbq('track', event);
      }
    }
  
    private static injectPixelScript(): void {
      if (typeof window === 'undefined') return;
  
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
  
      // Inicializa a fila do FBQ se não existir
      if (!window.fbq) {
        const fbq = function() {
          // @ts-ignore - O Facebook Pixel injeta essas propriedades depois
          if (fbq.callMethod) {
            // @ts-ignore
            fbq.callMethod.apply(fbq, arguments);
          } else {
            // @ts-ignore
            fbq.queue.push(arguments);
          }
        } as unknown as FacebookPixel;
  
        fbq.push = fbq;
        fbq.loaded = true;
        fbq.version = '2.0';
        fbq.queue = [];
  
        window.fbq = fbq;
      }
    }
  }