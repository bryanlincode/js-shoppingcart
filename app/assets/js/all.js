
const api_path = "luckyshop";
const token = "ZLaQ9zJkgzUGHMO1qt0B07BG4uB2";

const carbodyLst = document.querySelector('.cartList-tbody')
let producsTitel = document.querySelector('.productWrap')
let getProducsData = [];
let cartData = [];

// 渲染初始畫面
function init() {
  getProducsList();
  getCartList()
}
init()

function renderList() {
  let str = '';
  getProducsData.forEach(function(item) {
    str += showHtmlString(item);
  });
  producsTitel.innerHTML = str;
}
// 取得商品清單
function getProducsList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function(res) {
      getProducsData = res.data.products;
      // console.log(getProducsData);
      renderList()
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
}
const changList = document.querySelector('.productSelect');
const addProducsList = document.querySelector('.productWrap');

// 統一管理 li 字串
function showHtmlString(item) {
  return `<li class="productCard">
                <h4 class="productType">${item.category}</h4>
                <img src="${item.images}" alt="${item.title}">
                <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`
}
changList.addEventListener('change', function(e) {
  // console.log(e.target.value);
  const category = e.target.value;
  if (category == "全部") {
    renderList();
    return;
  }
  let str = '';
  getProducsData.forEach(function(item) {
    if (item.category == category) {
      str += showHtmlString(item);
    }
  })
  producsTitel.innerHTML = str;
})

addProducsList.addEventListener('click', function(e) {
  e.preventDefault();
  let addCartCalss = e.target.getAttribute('class')

  if (addCartCalss !== "addCardBtn") {
    return;
  } else {
    //取得ID
    let addCardId = e.target.getAttribute('data-id');
    // console.log(addCardId);
    // 加入到購物車
    let numCheck = 1
    cartData.forEach(function(item) {
      // console.log('cart', item);
      if (item.product.id === addCardId) {
        numCheck = item.quantity += 1
      }
    });
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
      "data": {
        "productId": addCardId,
        "quantity": numCheck
      }
    }).then(function(res) {
      console.log(res);
      alert('已加入購物車');
      getCartList()
    })
  }
})
// 取得購物車清單
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(res) {
      document.querySelector('.cardTotal').textContent = res.data.finalTotal
      let str = '';
      cartData = res.data.carts;
      cartData.forEach(function(item) {
        str += `<tr>
            <td>
              <div class="cardItem-title">
                <img src="${item.product.images}" alt="">
                <p>${item.product.title}</p>
              </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>NT$${item.product.price * item.quantity}</td>
            <td class="discardBtn">
              <a href="#" class="material-icons" data-id="${item.id}">
                clear
              </a>
            </td>
          </tr>`
      });
      carbodyLst.innerHTML = str;
    })
}
// 刪除購物車單筆
carbodyLst.addEventListener('click', function(e) {
  e.preventDefault();
  const deleatCardId = e.target.getAttribute("data-id");
  // console.log(deleatCardId);
  if (deleatCardId !== null) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${deleatCardId}`).then(function(res) {
      alert('購物車已刪除');
      getCartList();
    })
  }
})
// 刪除購物車全部
const deleteAllCart = document.querySelector(".discardAllBtn");
deleteAllCart.addEventListener('click', function(e) {
  e.preventDefault();
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/`).then(function(res) {
    alert('購物車已全部清空');
    getCartList();
  }).catch(function(res) {
    alert('購物車沒有產品 請加入產品')
  })

})

// 送出訂單功能

const getBut = document.querySelector('.orderInfo-btn');
getBut.addEventListener('click', function(e) {
  if (cartData.length == 0) {
    alert('你還未加入購物車喔？')
  }
  e.preventDefault();
  let customerName = document.querySelector("#customerName").value;
  let customerPhone = document.querySelector("#customerPhone").value;
  let customerEmail = document.querySelector("#customerEmail").value;
  let customerAddress = document.querySelector("#customerAddress").value;
  let customerTradeWay = document.querySelector("#tradeWay").value;
  // console.log(customerName, customerPhone, customerEmail, customerAddress, customerTradeWay);
  if (customerName == "" || customerPhone == "" || customerEmail == "" || customerAddress == "" || customerTradeWay == "") {
    alert("請輸入訂單資訊")
    return
  }
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": customerTradeWay
      }
    }
  }).then(function(res) {
    alert('訂單成功');
    // 訂單input清空 value
    document.querySelector("#customerName").value = "";
    document.querySelector("#customerPhone").value = "";
    document.querySelector("#customerEmail").value = "";
    document.querySelector("#customerAddress").value = "";
    document.querySelector("#tradeWay").value = "ATM"
    getCartList();

  })
})