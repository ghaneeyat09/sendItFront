$(document).on('click', '.editBtn', function(e){
   const row =  $(e.target).closest('tr');
   const rowId = row.find('.orderId')[0].innerHTML;
   const rowStatus = row.find('.status')[0].innerHTML;

   //console.log(rowId);
   //localStorage.setItem("rowId", rowId);
   if(rowStatus !== "delivered" && rowStatus !== "cancelled"){
     const newDest = prompt("Enter a new destination");
       if(newDest.value !== ""){
         fetch(`${url}/order/${rowId}`, {
         method: "PATCH",
         headers: {
          "Content-type": "application/json",
           Authorization: token
        },
        body: JSON.stringify({
          destination: newDest
        }), 
      })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
          if(res.message === "data patched"){
              console.log("yay");
              alert("Destination changed successfully");
              location.reload();
          }
      })
      .catch((err) => {
          console.log(err);
      })
    }
   }
else if(rowStatus === "delivered"){
       alert("parcel order has been delivered");
   }
else if(rowStatus === "cancelled"){
    alert("parcel order has been cancelled");
}
});
 
$(document).on('click', '.cancelBtn', function(e){
    const row =  $(e.target).closest('tr');
    const rowId = row.find('.orderId')[0].innerHTML;
    const rowStatus = row.find('.status')[0].innerHTML;
    if(rowStatus !== "delivered"){
     cancelOrder(rowId);
    }
    else if(rowStatus === "delivered"){
      alert("parcel order has been delivered");
    }
})
   /*form.style.display = "block";
   destination.value = oldDestination;
   orderSubmit.innerHTML = "Update";
        
});*/


//queried elements
const recipientMobile = document.querySelector('.recMob');
const senderMobile = document.querySelector('.sendMob');
const errormsg = document.querySelector('.errorMsg');
const errormsg2 = document.querySelector('.errorMsg2');
const mainNav = document.querySelector('#main-nav');
const createBtn = document.querySelector('.createBtn');
const viewBtn = document.querySelector(".getOrders");
const form = document.querySelector('#orderField');
const destination = document.querySelector('.destination')
const emptyMsg = document.querySelector('.emptyMsg')
const orderSubmit = document.querySelector('.orderSubmit');
const summary = document.querySelector('#summary');
const logout = document.querySelector('.logOut');
const table = document.querySelector('.table');
const username = document.querySelector('.user');
const url = "https://send-it-back-app.herokuapp.com";
const tbody = document.querySelector('.tbody');
const weight = document.querySelector('.weight');
const amount = document.querySelector('.amount');
const modal = document.querySelector('#editModal');

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");
const userName = localStorage.getItem("firstName");

/*if(!token && !userId){
    window.location.href = "./login.html";
}*/

username.innerHTML = `Welcome ${userName}`;
//create an order
const submitOrder = (e) => {
         e.preventDefault();
    const pickup = document.querySelector('.pickup').value;
    const destination = document.querySelector('.destination').value;
    const recipientName = document.querySelector('.recName').value;
    const recipientMobile = document.querySelector('.recMob').value;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if(orderSubmit.innerHTML === "submit"){
    const order = {
        userId: localStorage.getItem("userId"),
        pickup: document.querySelector('.pickup').value,
        destination: document.querySelector('.destination').value,
        recName: document.querySelector('.recName').value,
        recPhoneNo: document.querySelector('.recMob').value,
        weight: document.querySelector('.weight').value,
    
    }
    if(userId &&
       pickup &&
       destination &&
       recipientName &&
       recipientMobile &&
       weight
        ){
         if(errormsg.innerHTML !== "invalid mobile no"){
      fetch(`${url}/order`, {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*", "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify(order)
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            if(res.message === "order created"){
                alert("Order created successfully");
                clearInput();
                location.reload();
                
            }
            else if(res.error){
                console.log(res.error);
                return false;
            }
        })
        .catch((err) => {
            alert("an error occured");
            console.log(err);
        })
        }
    }
    else if(
        pickup === ""||
        destination === ""||
        recipientMobile === "" ||
        recipientName === ""
        )
        {
        alert("pls enter the field correctly");
        return false;
        }
}

    /*else if(orderSubmit.innerHTML === "Update"){
     if(destination.value !== ""){
        const rowId = localStorage.getItem("rowId");
        const destination = document.querySelector('.destination');
        const newDest = destination.value;
        fetch(`${url}/order/${rowId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify(
            {
                destination: newDest
            }
        )
        })
        .then((res) => {
            console.log(res)
            if(res.status === 200){
                console.log('yAY');
                alert('destination changed successfully.View your orders again to see the change');
                location.reload();    
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
}    
    
 */   
    

}


//get orders by specific user
const viewOrders = function(){

    fetch(`${url}/user/${userId}/order`,{
        method: "GET",
        headers: {
            Authorization: token
        }
    })
    .then((res) => res.json())
    .then((res) => {
        console.log(res);
        if(res.orders){
            const orders = res.orders;
            const totalOrders = document.querySelector('.totalOrders');
            const deliveredOrders = document.querySelector('.deliveredOrders');
            const ordersOnTransit = document.querySelector('.ordersOnTransit');
            const tbody = document.querySelector('.tbody');
            orders.forEach((order) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<th scope="row" class="orderId">${order._id}</th>
                            <td>${order.pickup}</td>
                            <td class="dest">${order.destination}</td>
                            <td>${order.recName}</td>
                            <td>${order.recPhoneNo}</td> 
                            <td class="status">${order.status}</td>
                            <td><button type="button" id="editBtn" class="editBtn" data-toggle="#editModal" orderid="${order._id}" >Edit</button></td>
                            <td><button type="button" id="cancelBtn" class="cancelBtn">Cancel</button></td>`;
                        
            tbody.appendChild(tr);
            table.appendChild(tbody);
            totalOrders.innerHTML = res.orders.length;
            const delivered = res.orders.filter((value) => value.status === "delivered").length;
            deliveredOrders.innerHTML = `${delivered}`;
            const transit = res.orders.filter((value) => value.status === "on transit").length;
            ordersOnTransit.innerHTML = `${transit}`;
        });
        if(res.orders.length === 0){
            emptyMsg.innerHTML = "No parcel delivery order yet";
            totalOrders.innerHTML = 0;
            deliveredOrders.innerHTML = 0;
            ordersOnTransit.innerHTML = 0;
        }
    }
        
        else if(res.error){
            console.log(error)
        }

    })
    .catch((err) => {
        console.log(err);
    })
}   
viewOrders();



//cancel order
const cancelOrder = function(rowId){
    fetch(`${url}/order/${rowId}/cancel`,
    {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            status
        })
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
           if(res.message === "data cancelled"){
               console.log("order cancelled!");
               alert("order cancelled");
               location.reload();

           }
        })
        .catch((err) => {
            console.log(err)
        })
    }
//calculate amount
 function calcAmount(){
    const weight = document.querySelector('.weight').value;
    const amount = document.querySelector('.amount');
    if(weight){
    amount.value = weight * 330;
    }
    else{
    amount.value = "";
    }
 }
//functions
 
 function recPhoneNovalidation() {
    const recipientMobile = document.querySelector('.recMob').value;
    const errormsg = document.querySelector('.errorMsg');
    const pattern = /^(\+|00)[0-9]{1,3}[0-9]{4,14}(?:x.+)?$/;
     
    if(recipientMobile.match(pattern)){
        errormsg.innerHTML = "";
    }
    else{
        errormsg.innerHTML = "invalid mobile no";
        errormsg.style.color = "red";
    }
    if(recipientMobile === ""){
        errormsg.innerHTML = "";
    }

 }
 
 function clearInput() {
    document.querySelector('.pickup').value = "";
    document.querySelector('.destination').value = "";
    document.querySelector('.recName').value = "";
    document.querySelector('.recMob').value = "";
    document.querySelector('.weight').value = "";
    document.querySelector('.amount').value = "";

 }
 

//event listeners
createBtn.onclick = () => {
    form.style.display = "block";
    table.style.display = "none";
    summary.style.display = "none";
    emptyMsg.innerHTML = "";
}
recipientMobile.addEventListener('change', recPhoneNovalidation);

form.addEventListener("submit", submitOrder);

weight.addEventListener("mouseout", calcAmount);
/*viewBtn.addEventListener("click", () => {
    form.style.display = "none";
    summary.style.display = "block";
    tbody.innerHTML = "";
    table.style.display = "block";
    viewOrders();
});*/
orderSubmit.addEventListener("click", submitOrder);
logout.addEventListener("click", () => {
     localStorage.clear();
     username.innerHTML = "";
     window.location.href = "./index.html";
});


if(!userId && !token){
    window.location.href = "./login.html";
}





