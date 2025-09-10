
export interface ChatMessage {
    id: string
    sender: "user" | "bot"
    text: string
    timestamp: number
    action?: {
        type: "ADD_TO_CART" | "SHOW_PRODUCTS" | "VIEW_CART"
        payload?: any
      }
  }
  