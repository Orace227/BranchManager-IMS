import axios from 'axios';

function deepEqual(a, b) {
  //   console.log({ a, b });
  if (b == []) return false;
  if (a == b) return true;

  if (typeof a != 'object' || typeof b != 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return true;
}

export const syncCartWithDatabase = async (cart) => {
  try {
    const GetCartId = await axios.get('/GetCartId');
    console.log(GetCartId.data.cartId);
    const cartId = GetCartId.data.cartId;
    const getOrders = await axios.get(`/GetCarts?cartId=${cartId}`);
    console.log(getOrders.data);
    if (getOrders.data.existedOrder.length > 0) {
      const existedOrder = getOrders.data.existedOrder[0].Products;

      console.log(!deepEqual(existedOrder, cart));
      if (!deepEqual(existedOrder, cart)) {
        console.log('Cart has changed. Making a request to CreateOrders.');

        // Create and send the request
        let cartData = { cartId: cartId };
        cartData.Products = cart;
        const createOrder = await axios.post('/CreateCart', cartData);
        if (createOrder) {
          console.log(createOrder);
        }
      } else {
        console.log('Cart has not changed. Making a request to CreateOrders.');
      }
    } else {
      let cartData = { cartId: cartId };
      cartData.Products = cart;
      const createOrder = await axios.post('/CreateCart', cartData);
      if (createOrder) {
        console.log(createOrder);
      } else {
        console.log('Cart has not changed. Making a request to CreateOrders.');
      }
    }
  } catch (err) {
    console.log(err);
  }
};
