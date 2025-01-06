export function getCartItems() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

export function addToCart(product, quantity) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let alreadyPresent = false;

  let cart2 = [];

  for (const c of cartItems) {
    if (c.product._id === product._id) {
      if (c.quantity < product.inStock) c.quantity += quantity;
      if (c.quantity > product.inStock) c.quantity = product.inStock;

      if (product.error) c.product.error = product.error;

      c.product.inStock = product.inStock;

      cart2.push(c);
      alreadyPresent = true;
    } else cart2.push(c);
  }

  cartItems = cart2;

  //   if (cartItems) {
  //     cartItems.filter((c) =>
  //       c.product._id === product._id
  //         ? (alreadyPresent = c)
  //         : (alreadyPresent = null)
  //     );

  //     if (alreadyPresent) {
  //       const index = cartItems.indexOf(alreadyPresent);
  //       cartItems[index].quantity += quantity;
  //     }
  //   }

  if (!alreadyPresent) {
    const obj = { product: product, quantity };
    cartItems.push(obj);
  }

  // let { cartopen } = this.state;
  // cartopen = !cartopen;

  // this.setState({ cartItems, cartopen });
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  return cartItems;
}

export function deleteFromCart(cartItem) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  //   const index = cartItems.indexOf(cartItem);
  //   cartItems.splice(index, 1);
  cartItems = cartItems.filter((c) => c.product._id !== cartItem.product._id);

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  return cartItems;
}

export function updateCart(button, item) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  //   const index = cartItems.indexOf(item);

  let cart2 = [];

  for (const c of cartItems) {
    if (c.product._id === item.product._id) {
      c.quantity = button === 'inc' ? c.quantity + 1 : c.quantity - 1;

      if (button !== 'inc' && c.quantity <= c.product.inStock) {
        delete c.product.error;
      }

      cart2.push(c);
    } else cart2.push(c);
  }

  cartItems = cart2;

  //   cartItems[index].quantity =
  //     button === 'inc'
  //       ? cartItems[index].quantity + 1
  //       : cartItems[index].quantity - 1;

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  return cartItems;
}

export function emptyCart() {
  localStorage.removeItem('cartItems');
}
