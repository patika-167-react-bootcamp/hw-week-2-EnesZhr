//Kullanıcıları tutmak için state oluşturduk
const state = {
  userList: []
}

//sabit değişkenlerimizi oluşturduk
const userNameInput = document.getElementById("userName");
const userBalanceInput = document.getElementById("userBalance");
const senderUser = document.getElementById("selectUserTo")
const buyerUser = document.getElementById("selectUserFrom")
const sendMoneyBalance = document.getElementById("sendToMoney")

//uniq-id oluşturduk
function uniqId() {
  return Math.random() * 100;
}

//Kullanıcıları tutmak için state oluşturduk
function setState(stateName, newValue) {
  state[stateName] = newValue;
  addUsersList();
  optionsList();
}

function addUsersList() {
  const usersList = document.getElementById("usersList");
  // eklenen kullanıcılar users tablosuna eklendi
  usersList.innerHTML= "";
  
  state.userList.forEach(function(user,index) {
    const newTr = document.createElement("tr");

    newTr.className = "d-flex justify-content-around";

    //kullanıcı silme iconu eklendi
    newTr.innerHTML = `
    <td style="cursor:default;">${user.name}</td>
    <td id="${user.balance}">${user.balance} $</td>
    <td ><svg width="15" height="15" class="align-flex-end" onClick="javascript:deleteUser(${index})" style="cursor:pointer;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M95.1 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7c5.625 0 10.73-1.65 15.42-4.029L264.9 304.3C171.3 306.7 95.1 383.1 95.1 477.3zM630.8 469.1l-277.1-217.9c54.69-14.56 95.18-63.95 95.18-123.2C447.1 57.31 390.7 0 319.1 0C250.2 0 193.7 55.93 192.3 125.4l-153.4-120.3C34.41 1.672 29.19 0 24.03 0C16.91 0 9.845 3.156 5.127 9.187c-8.187 10.44-6.375 25.53 4.062 33.7L601.2 506.9c10.5 8.203 25.56 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z" w/></svg></td>
    `;
    usersList.appendChild(newTr);
  })
}
//kullanıcın indexsini alarak users listesinden sildik
function deleteUser(id) {
  state.userList.splice(id,1);
  setState("userList", [...state.userList]);
  addUsersList();
  optionsList();
}



//Transaction History listesinin içine olan değişikliler geçildi
function addTransactionHistory(history) {
  const newHistory = document.getElementById("history");

  const newLi = document.createElement("li");

  newLi.className = "align-item-center"
  newLi.style = "list-style-type:none"
  newLi.innerHTML = history;

  newHistory.appendChild(newLi);
}

//add butonuna basılınca kullanıcımızı aldık 
function addNewUser() {
  const userName = document.getElementById("userName").value;
  const userBalance = document.getElementById("userBalance").value;
  const userId = uniqId();
  //boş alan kontrolu yapıldı
  if(userName !== "" && userBalance !== ""){

    //state listesine oluşturduğumuz isimler eklendi
    setState("userList", [...state.userList, {
      name: userName,
      balance: userBalance,
      id: userId
    }])
    addTransactionHistory(`${userName} add ${userBalance}$ money`);

    //değerlerin içi boşaltıldı
    userNameInput.value = "";
    userBalanceInput.value = "";

  }else{
    alert("isim ve balance alanını boş bırakmayın")
    return false
  }
}

//select içerisine option eklendi
function optionsList() {
  const users = [
      senderUser,
      buyerUser
  ]
  users.forEach(function(user){
      user.innerHTML = ""
      state.userList.forEach(function(item){
          const optionSelectUser = document.createElement("option");
          optionSelectUser.innerText = item.name;
          optionSelectUser.setAttribute("id", item.id)
          user.appendChild(optionSelectUser)
      })
  })
}

//secili olan kişileri alıyoruz 
function sendToMoney() {
  const sendMoney = document.getElementById("sendToMoney").value

  let selectSenderUser = senderUser.options[senderUser.selectedIndex];
  let selectBuyerUser = buyerUser.options[buyerUser.selectedIndex];

  console.log(selectSenderUser,selectBuyerUser);
  
  //secili olanların aynı olması durumu kontrol edildi
  if(selectSenderUser.getAttribute("id") !== selectBuyerUser.getAttribute("id")){

     checkMoney(senderUser,buyerUser,sendMoney)
     addTransactionHistory(`${senderUser.value} send to ${sendMoney}$ from ${buyerUser.value} <svg width="15" height="15" class="align-items-center" style="cursor:pointer;" onClick="javascript:undoBalance()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256c0 123.4-100.5 223.9-223.9 223.9c-48.84 0-95.17-15.58-134.2-44.86c-14.12-10.59-16.97-30.66-6.375-44.81c10.59-14.12 30.62-16.94 44.81-6.375c27.84 20.91 61 31.94 95.88 31.94C344.3 415.8 416 344.1 416 256s-71.69-159.8-159.8-159.8c-37.46 0-73.09 13.49-101.3 36.64l45.12 45.14c17.01 17.02 4.955 46.1-19.1 46.1H35.17C24.58 224.1 16 215.5 16 204.9V59.04c0-24.04 29.07-36.08 46.07-19.07l47.6 47.63C149.9 52.71 201.5 32.11 256.1 32.11C379.5 32.11 480 132.6 480 256z"/></svg>`)

  }else if(sendMoney === ""){
    alert("Gönderilecek miktar boş bırakılamaz")
  }else{
    addTransactionHistory(`You don't send money`)
    return false;
  }
  sendMoneyBalance.value = "";
}
//todo: gerial butonu tamamlanacak
function undoBalance() {
  
}

//secili olan kişiler arasındaki para taransferini yapıyor
function checkMoney(sender, buyer, balance) {

  state.userList.forEach(function(user) {
      if(user.name === sender.value) {
        let newBalanceTo = parseInt(user.balance) - parseInt(balance)
        moneyChangeUsersList(newBalanceTo);
      }

      if(user.name === buyer.value){
        let newBalanceFrom = parseInt(user.balance) + parseInt(balance)
        moneyChangeUsersList(newBalanceFrom); 
      }

      // Users list change money balance
      function moneyChangeUsersList(changeBalance) {
        const checkBalance = document.getElementById(user.balance);
        user.balance = changeBalance;
        checkBalance.innerText = `${user.balance} $`;
        checkBalance.setAttribute("id", user.balance);
      }

  })
}



