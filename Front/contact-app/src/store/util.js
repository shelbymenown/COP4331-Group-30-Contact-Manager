import * as userTypes from './userTypes';
export const updateObject = (oldObject, newObject) => {
    return {
        ...oldObject,
        ...newObject
    }
}

export const getUserType = userType => {
    if (!userType)
        return userTypes.CUSTOMER;

    const t = userType.trim().toUpperCase();
    switch (t) {
        case userTypes.ADMIN: return userTypes.ADMIN;
        case userTypes.COMPANY: return userTypes.COMPANY;
        default: return userTypes.CUSTOMER;
    }
};

export const createCouponCatagoryObject = catagoryArray => {
    if (!catagoryArray || !Array.isArray(catagoryArray) || catagoryArray.length < 1)
        return null;
    const catagories = {};
    catagoryArray.forEach(cat => {
        catagories[cat] = false;
    });
    // console.log(catagories);
    return catagories;
};

export const getCatagaroyTypeSearchParams = catagoriesObject => {
    let type = [];

    for (let key in catagoriesObject)
        if (catagoriesObject[key])
            type.push(key);

    if (!type)
        return null;

    return type.join(',');
};

export const getFilterParam = filterObject => {
    for (let key in filterObject)
        if (filterObject[key])
            return key;

    return null;
}

export const stringToColor = str => {
    let hash = 0;
    let color = '#';

    if (str)
        for (let i = 0; i < str.length; i++)
            hash = str.charCodeAt(i) + ((hash << 5) - hash);


    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
}

export const getCartFromJson = cartData => {
    const cart = {};
    if (cartData)
        Object.keys(cartData).forEach(key => {
            if (key.startsWith('c_') && key.length > 2) {
                const newKey = key.substring(2);
                if (parseInt(newKey, 10) > 0 && !cart[key])
                    cart[newKey] = null;
            }
        });
    return cart;
}

export const getUpdatedCart = (cart, initialItemState) => {
    const updatedCart = { cart: {}, items: 0 };
    for (let key in cart) {
        updatedCart.cart[key] = initialItemState ? { ...initialItemState } : { ...cart[key] };
        updatedCart.items++;
    }
    return updatedCart;
}


export const uuid = () => {
    return '4xxx-yxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16)
    });
    // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    //     let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    //     return v.toString(16)
    // });
    // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //     var r = (d + Math.random() * 16) % 16 | 0;
    //     d = Math.floor(d / 16);
    //     return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    // });
}