import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://coupon-app-b49b8.firebaseio.com/carts/',
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin' : '*',
    //     // 'Access-Control-Allow-Credentials': 'false',
    //     'Accept': 'application/json',
        // 'Content-Type': 'application/json',
    }
});

// instance.defaults.withCredentials = false;
// instance.defaults.headers = {
//     'Access-Control-Allow-Origin': '*'
// }

export default instance;
