"use strict";

var api_path = "luckyshop";
var token = "ZLaQ9zJkgzUGHMO1qt0B07BG4uB2";
var carbodyLst = document.querySelector('.cartList-tbody');
var producsTitel = document.querySelector('.productWrap');
var getProducsData = [];
var cartData = []; // 渲染初始畫面

function init() {
  getProducsList();
  getCartList();
}

init();

function renderList() {
  var str = '';
  getProducsData.forEach(function (item) {
    str += showHtmlString(item);
  });
  producsTitel.innerHTML = str;
} // 取得商品清單


function getProducsList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/products")).then(function (res) {
    getProducsData = res.data.products; // console.log(getProducsData);

    renderList();
  })["catch"](function (error) {
    // handle error
    console.log(error);
  });
}

var changList = document.querySelector('.productSelect');
var addProducsList = document.querySelector('.productWrap'); // 統一管理 li 字串

function showHtmlString(item) {
  return "<li class=\"productCard\">\n                <h4 class=\"productType\">".concat(item.category, "</h4>\n                <img src=\"").concat(item.images, "\" alt=\"").concat(item.title, "\">\n                <a href=\"#\" class=\"addCardBtn\" data-id=\"").concat(item.id, "\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n                <h3>").concat(item.title, "</h3>\n                <del class=\"originPrice\">NT$").concat(item.origin_price, "</del>\n                <p class=\"nowPrice\">NT$").concat(item.price, "</p>\n            </li>");
}

changList.addEventListener('change', function (e) {
  // console.log(e.target.value);
  var category = e.target.value;

  if (category == "全部") {
    renderList();
    return;
  }

  var str = '';
  getProducsData.forEach(function (item) {
    if (item.category == category) {
      str += showHtmlString(item);
    }
  });
  producsTitel.innerHTML = str;
});
addProducsList.addEventListener('click', function (e) {
  e.preventDefault();
  var addCartCalss = e.target.getAttribute('class');

  if (addCartCalss !== "addCardBtn") {
    return;
  } else {
    //取得ID
    var addCardId = e.target.getAttribute('data-id'); // console.log(addCardId);
    // 加入到購物車

    var numCheck = 1;
    cartData.forEach(function (item) {
      // console.log('cart', item);
      if (item.product.id === addCardId) {
        numCheck = item.quantity += 1;
      }
    });
    axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts"), {
      "data": {
        "productId": addCardId,
        "quantity": numCheck
      }
    }).then(function (res) {
      console.log(res);
      alert('已加入購物車');
      getCartList();
    });
  }
}); // 取得購物車清單

function getCartList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (res) {
    document.querySelector('.cardTotal').textContent = res.data.finalTotal;
    var str = '';
    cartData = res.data.carts;
    cartData.forEach(function (item) {
      str += "<tr>\n            <td>\n              <div class=\"cardItem-title\">\n                <img src=\"".concat(item.product.images, "\" alt=\"\">\n                <p>").concat(item.product.title, "</p>\n              </div>\n            </td>\n            <td>NT$").concat(item.product.price, "</td>\n            <td>").concat(item.quantity, "</td>\n            <td>NT$").concat(item.product.price * item.quantity, "</td>\n            <td class=\"discardBtn\">\n              <a href=\"#\" class=\"material-icons\" data-id=\"").concat(item.id, "\">\n                clear\n              </a>\n            </td>\n          </tr>");
    });
    carbodyLst.innerHTML = str;
  });
} // 刪除購物車單筆


carbodyLst.addEventListener('click', function (e) {
  e.preventDefault();
  var deleatCardId = e.target.getAttribute("data-id"); // console.log(deleatCardId);

  if (deleatCardId !== null) {
    axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts/").concat(deleatCardId)).then(function (res) {
      alert('購物車已刪除');
      getCartList();
    });
  }
}); // 刪除購物車全部

var deleteAllCart = document.querySelector(".discardAllBtn");
deleteAllCart.addEventListener('click', function (e) {
  e.preventDefault();
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts/")).then(function (res) {
    alert('購物車已全部清空');
    getCartList();
  })["catch"](function (res) {
    alert('購物車沒有產品 請加入產品');
  });
}); // 送出訂單功能

var getBut = document.querySelector('.orderInfo-btn');
getBut.addEventListener('click', function (e) {
  if (cartData.length == 0) {
    alert('你還未加入購物車喔？');
  }

  e.preventDefault();
  var customerName = document.querySelector("#customerName").value;
  var customerPhone = document.querySelector("#customerPhone").value;
  var customerEmail = document.querySelector("#customerEmail").value;
  var customerAddress = document.querySelector("#customerAddress").value;
  var customerTradeWay = document.querySelector("#tradeWay").value; // console.log(customerName, customerPhone, customerEmail, customerAddress, customerTradeWay);

  if (customerName == "" || customerPhone == "" || customerEmail == "" || customerAddress == "" || customerTradeWay == "") {
    alert("請輸入訂單資訊");
    return;
  }

  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/orders"), {
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": customerTradeWay
      }
    }
  }).then(function (res) {
    alert('訂單成功'); // 訂單input清空 value

    document.querySelector("#customerName").value = "";
    document.querySelector("#customerPhone").value = "";
    document.querySelector("#customerEmail").value = "";
    document.querySelector("#customerAddress").value = "";
    document.querySelector("#tradeWay").value = "ATM";
    getCartList();
  });
});
"use strict";

var api_path = "luckyshop";
var token = "ZLaQ9zJkgzUGHMO1qt0B07BG4uB2";
//# sourceMappingURL=all.js.map
