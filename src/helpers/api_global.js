import axios from "axios";

export async function cekIsMerchant(token) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/is_merchant`,
      {
        token: token,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cekWhiteListUsername(token, product) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/is_whitelist`,
      {
        produk: product,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
