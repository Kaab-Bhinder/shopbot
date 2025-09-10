// helpers/shopBotApi.ts

export async function shopBotApi(
    message: string,
    addToCart: (productId: string, quantity: number, size: string, color: string) => Promise<boolean>
  ) {
    const lower = message.toLowerCase()
  
    // Example: user asks for dresses
    if (lower.includes("dress")) {
      const res = await fetch("/api/products?category=dress")
      const products = await res.json()
  
      if (!products.length) {
        return { text: "Sorry, I couldn’t find dresses right now 😔" }
      }
  
      return {
        text: `Here are some dresses I found:\n${products
          .slice(0, 3)
          .map((p: any) => `- ${p.name} ($${p.price})`)
          .join("\n")}`,
        action: { type: "SHOW_PRODUCTS", payload: products.slice(0, 3) },
      }
    }
  
    // Example: add to cart
    if (lower.includes("add") && lower.includes("cart")) {
      const res = await fetch("/api/products")
      const products = await res.json()
      const product = products.find((p: any) =>
        lower.includes(p.name.toLowerCase())
      )
  
      if (product) {
        // Now we can call addToCart safely
        await addToCart(product._id, 1, "M", "default") // 👈 size/color hardcoded for now
        return {
          text: `${product.name} has been added to your cart 🛒`,
          action: { type: "ADD_TO_CART", payload: product },
        }
      }
    }
  
    // Default fallback
    return {
      text: "I can help you browse products, add to cart, or view your cart. Try asking for 'Show me dresses' or 'Add red shirt to cart'."
    }
  }
  