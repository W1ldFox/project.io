

// const quantityInput = document.querySelector('[data-quantity]');

// quantityInput.addEventListener('input', function() {
 
//   quantityInput.value = quantityInput.value.replace(/[^\d]/g, ''); 

 
//   const value = parseInt(quantityInput.value);
//   if (isNaN(value) || value < 1) {
//     quantityInput.value = 1;
//   }
//   coast.innerText = parseFloat(price.innerText) * parseInt(quantity.value);
// });



// window.addEventListener('input', function{
//     console.log('INPUTING')

// })

// window.addEventListener('click', function(event) {
//     let busketListItem;
//     let quantity;
//     let coast;
//     let price;
//
//     if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
//         busketListItem = event.target.closest('.busket-list__item');
//
//         if (busketListItem) {
//             quantity = busketListItem.querySelector('[data-quantity]');
//             coast = busketListItem.querySelector('[data-coast]');
//             price = busketListItem.querySelector('[data-price]');
//         }
//     }
//
//     if (event.target.dataset.action === 'plus') {
//         if (quantity) {
//             quantity.value = parseInt(quantity.value) + 1;
//             coast.innerText = parseFloat(price.innerText) * parseInt(quantity.value);
//         }
//     }
//
//     if (event.target.dataset.action === 'minus') {
//         if (quantity && parseInt(quantity.value) > 1) {
//             quantity.value = parseInt(quantity.value) - 1;
//             coast.innerText = parseFloat(price.innerText) * parseInt(quantity.value);
//         }
//     }
// });


function getCatalog() {
    fetch('/data/catalog.json')
        .then((response) => response.json())
        .then((data) => {
            printCatalog(data);
        })
}

getCatalog();

function printCatalog(items) {
    const catalogWrap = document.querySelector('[data-catalog-list]');

    if(!catalogWrap) {
        return;
    }

    if (!items) {
        return
    }

    for(const itemId in items) {
        const newItem = document.createElement('article');
        newItem.classList.add('catalog__card');

        const itemData = items[itemId];
        newItem.innerHTML = `<a class="catalog__card-img-link" href="${itemData.url}">
                            <picture>
                                <source srcset="${itemData.img}" media="min-width: 1024px">
                                <img src="${itemData.img}" alt="">
                            </picture>
                        </a>
                        <h3 class="catalog__card-title">
                            <a href="">${itemData.name}</a>
                        </h3>
                        <div class="catalog__card-price">${new Intl.NumberFormat("ru-RU").format(itemData.price)} руб</div>
                                               
                        <div class="catalog__card-actions">
                            <button class="catalog__card-buy" data-add-basket="${itemData.id}">Добавить в корзину</button>
                        </div>`;

        catalogWrap.appendChild(newItem);
    }
}

function addToBasket() {
    document.addEventListener('click', (event) => {
        const target = event.target;
        const addBtn = target.closest('[data-add-basket]');

        if(!addBtn) {
            return
        }

        const itemId = addBtn.dataset.addBasket;

        let currentBasket = JSON.parse(localStorage.getItem('basket'));

        if (currentBasket[itemId]) {
            return;
        }

        const basketResult = {};

        if (!currentBasket) {
            basketResult[itemId] = {
                id: itemId,
                quantity: 1
            };
            localStorage.setItem('basket', JSON.stringify(basketResult));
        }

        currentBasket[itemId] = {
            id: itemId,
            quantity: 1
        };

        localStorage.setItem('basket', JSON.stringify(currentBasket));
    })
}

addToBasket();

function deleteFromBasket() {
    document.addEventListener('click', (event) => {
        const target = event.target;
        const deleteBtn = target.closest('[data-delete-basket]');
        const deleteItem = target.closest('[data-item]');

        if(!deleteBtn) {
            return
        }

        const itemId = deleteBtn.dataset.deleteBasket;

        let currentBasket = JSON.parse(localStorage.getItem('basket'));

        if (!currentBasket[itemId]) {
            return;
        }

        delete currentBasket[itemId];

        localStorage.setItem('basket', JSON.stringify(currentBasket));

        deleteItem.classList.add('is-deleted');

        getBasketList();
    })
}

deleteFromBasket();

function getBasketList() {
    const basketListWrap = document.querySelector('[data-basket-list]');

    if (!basketListWrap) {
        return;
    }

    const currentBasket = JSON.parse(localStorage.getItem('basket'));

    if(!currentBasket) {
        document.querySelector('[data-basket-empty]').classList.add('is-empty');
    }

    fetch('/data/catalog.json')
        .then((response) => response.json())
        .then((data) => {
            printBasketList(data, currentBasket);
        })
}

getBasketList();

function printBasketList(items, currentBasket) {
    const basketListWrap = document.querySelector('[data-basket-list]');

    if (!basketListWrap) {
        return;
    }

    basketListWrap.innerHTML = '';

    let sum = 0;

    for(const itemId in currentBasket) {
        const itemData = items[itemId];

        const itemSum = parseInt(currentBasket[itemId].quantity) * parseFloat(itemData.price);
        sum = sum + itemSum;

        const newItem = document.createElement('article');

        newItem.classList.add('busket-list__item');
        newItem.dataset['item'] = itemId;
        newItem.dataset['itemPrice'] = itemData.price;
        newItem.innerHTML = `<div class="busket-list__item-img">
                            <img src="${itemData.img}" alt=""></div>
                        <div class="busket-list__item-description">
                            <div class="busket-list__item-title">
                                <a href="">
                                    <h3>${itemData.name}</h3>
                                </a>
                            </div>
                            <div class="busket-list__item-articul">артикул: <span>${itemData.article}</span></div>
                        </div>
                        <div class="busket-list__item-price">${new Intl.NumberFormat("ru-RU").format(itemData.price)} руб</div>

                        <div class="busket-list__item-count">
                            <button class="busker-list__plus-button" data-quantity-action="plus">+</button>
                            <input class="busker-list__count-element" blocked readonly type="text" data-quantity-action="input" value="${currentBasket[itemId].quantity}">
                            <button class="busker-list__minus-button" data-quantity-action="minus">-</button>
                        </div>

                        <div class="busket-list__item-countPrice">
                            <div data-item-sum>${new Intl.NumberFormat("ru-RU").format(itemSum.toFixed(2))} руб</div>
                        </div>
                        <div class="busket-list__item-delete">
                            <button data-delete-basket="${itemId}">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.2856 3.42859H16.2857V2.57143C16.2857 1.15127 15.1344 0 13.7142 0H10.2857C8.86549 0 7.71423 1.15127 7.71423 2.57143V3.42859H1.71421C1.24081 3.42859 0.857056 3.81234 0.857056 4.28574C0.857056 4.75915 1.24086 5.14285 1.71421 5.14285H2.6459L4.28564 23.2208C4.32607 23.6635 4.69828 24.0018 5.1428 24H18.8571C19.3016 24.0019 19.6738 23.6636 19.7143 23.2208L21.3539 5.14285H22.2857C22.7591 5.14285 23.1428 4.7591 23.1428 4.28569C23.1428 3.81229 22.759 3.42859 22.2856 3.42859ZM9.4285 2.57143C9.4285 2.09802 9.81225 1.71427 10.2857 1.71427H13.7142C14.1876 1.71427 14.5714 2.09802 14.5714 2.57143V3.42859H9.42854V2.57143H9.4285ZM18.0745 22.2857H5.92538L4.37137 5.14285H8.57139H19.6328L18.0745 22.2857Z"/>
                                    <path d="M9.42873 19.657C9.42863 19.6558 9.42858 19.6546 9.42848 19.6534L8.57132 7.65346C8.53772 7.18006 8.12669 6.82357 7.65334 6.85717C7.17994 6.89077 6.82345 7.3018 6.85705 7.77515L7.71421 19.7751C7.7462 20.2246 8.12077 20.5726 8.57137 20.5714H8.63309C9.10534 20.5386 9.46158 20.1292 9.42873 19.657Z"/>
                                    <path d="M12 6.85712C11.5266 6.85712 11.1428 7.24087 11.1428 7.71428V19.7142C11.1428 20.1877 11.5266 20.5714 12 20.5714C12.4734 20.5714 12.8571 20.1877 12.8571 19.7142V7.71428C12.8571 7.24087 12.4734 6.85712 12 6.85712Z"/>
                                    <path d="M16.3465 6.85711C15.873 6.82351 15.4621 7.18 15.4285 7.6534L14.5713 19.6534C14.5366 20.1255 14.8912 20.5363 15.3633 20.5711C15.3647 20.5712 15.3661 20.5713 15.3676 20.5714H15.4285C15.8791 20.5725 16.2536 20.2245 16.2856 19.7751L17.1428 7.77509C17.1764 7.30174 16.8199 6.89076 16.3465 6.85711Z"/>
                                </svg>
                            </button>
                        </div>`;

        basketListWrap.appendChild(newItem);
    }

    sumUpdate(sum);
    sumMinUpdate(sum);
}

function sumUpdate(sum) {
    const sumWrap = document.querySelector('[data-total-coast]');

    if(sumWrap && sum) {
        sumWrap.textContent = `${new Intl.NumberFormat("ru-RU").format(sum)} руб`
    }
}

function sumMinUpdate(sum) {
    const sumMinWrap = document.querySelector('[data-basket-minimal]');
    const minSum = parseFloat(sumMinWrap.dataset.basketMinimal);

    if(sumMinWrap && sum && sum < minSum) {
        sumMinWrap.classList.add('is-active');
    }
}

function setQuantity() {
    document.addEventListener('click', (event) => {
        const target = event.target;
        const quantityAction = target.closest('[data-quantity-action]');
        const item = target.closest('[data-item]');
        const itemId = item.dataset.item;
        const itemPrice = item.dataset.itemPrice;
        const itemSum = item.querySelector('[data-item-sum]');

        if (!quantityAction) {
            return;
        }

        const quantityInput = item.querySelector('[data-quantity-action=input]');
        const actionType = quantityAction.dataset.quantityAction;

        if (actionType === 'plus') {
            quantityInput.value = ++quantityInput.value
        }

        if (actionType === 'minus') {
            if (Number(quantityInput.value) === 1) {
                quantityInput.value = 1;
            }
            else {
                quantityInput.value = --quantityInput.value
            }
        }

        const itemSumUpdate = (parseInt(quantityInput.value) * parseFloat(itemPrice)).toFixed(2);
        itemSum.textContent = `${new Intl.NumberFormat("ru-RU").format(itemSumUpdate)} руб`;
        updateQuantity(itemId, quantityInput.value);
    })

    // document.addEventListener('input', (event) => {
    //     const target = event.target;
    //     const quantityInput = target.closest('[data-quantity-action=input]');
    //     const item = target.closest('[data-item]');
    //     const itemId = item.dataset.item;
    //     const itemPrice = item.dataset.itemPrice;
    //     const itemSum = item.querySelector('[data-item-sum]');
    //
    //     if (!quantityInput) {
    //         return;
    //     }
    //
    //     quantityInput.value = quantityInput.value.replace(/\D/gim, '');
    //
    //     if(!quantityInput.value) {
    //         quantityInput.value = 1;
    //     }
    //
    //     const itemSumUpdate = (parseInt(quantityInput.value) * parseFloat(itemPrice)).toFixed(2);
    //     itemSum.textContent = `${new Intl.NumberFormat("ru-RU").format(itemSumUpdate)} руб`;
    //     updateQuantity(itemId, quantityInput.value);
    // })
    //
    // document.addEventListener('keyup', (event) => {
    //     const target = event.target;
    //     const quantityInput = target.closest('[data-quantity-action=input]');
    //     const keyCode = event.code;
    //     const item = target.closest('[data-item]');
    //     const itemId = item.dataset.item;
    //     const itemPrice = item.dataset.itemPrice;
    //     const itemSum = item.querySelector('[data-item-sum]');
    //
    //
    //     if (!quantityInput) {
    //         return;
    //     }
    //
    //     if (keyCode === 'ArrowUp') {
    //         quantityInput.value = ++quantityInput.value
    //     }
    //
    //     if (keyCode === 'ArrowDown') {
    //         if (Number(quantityInput.value) === 1) {
    //             quantityInput.value = 1;
    //         }
    //         else {
    //             quantityInput.value = --quantityInput.value
    //         }
    //     }
    //
    //     const itemSumUpdate = (parseInt(quantityInput.value) * parseFloat(itemPrice)).toFixed(2);
    //     itemSum.textContent = `${new Intl.NumberFormat("ru-RU").format(itemSumUpdate)} руб`;
    //
    //     updateQuantity(itemId, quantityInput.value);
    // })
}

setQuantity();

function updateQuantity(id, quantity) {
    let currentBasket = JSON.parse(localStorage.getItem('basket'));
    currentBasket[id].quantity = quantity;

    localStorage.setItem('basket', JSON.stringify(currentBasket));

    getBasketList();
}
