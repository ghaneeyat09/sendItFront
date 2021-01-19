const email = document.querySelector('.email');
const password = document.querySelector('.password');
const loginBtn = document.querySelector('.loginBtn');
const form = document.querySelector("#loginField");
const adminMsg = document.querySelector('.adminMessage');
const secretCode = "0987IamSeNDIt87AdMiN0805";
const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//const cors_api_url = "https://cors-anywhere.herokuapp.com";
const url = "https://send-it-back-app.herokuapp.com";


const logUser = function(e) {
    e.preventDefault();
    const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
   
   if(
     email.value.match(pattern) &&
     password.value !== secretCode){
       loginBasicUser();
}

   else if(
          email.value.match(pattern) && 
          password.value === secretCode){
            logAdmin();
          
   }
   else if(email.value === "" || password.value === ""){
        alert("pls enter your field completely");
        }
}
//logUser
function loginBasicUser(){
       fetch(`${url}/user/login`, 
       {
           method: "POST",
           headers: {
             Accept: "application/json, text/plain, */*", "Content-Type": "application/json"
           },
           body: JSON.stringify({
               email: email.value,
               password: password.value
           })
       })
       .then((res) => res.json())
       .then((res) => {
           if(res.message === "user not found" && password.value != ""){
               alert('user not registered');
               return false;
           }
           if(res.message === "incorrect password"){
               alert('incorrect password');
           }
           else if(res.token){
             const { _id } = res.user;
             localStorage.setItem("token", res.token)
             fetch(`${url}/user/login/${_id}`, {
                 method: "GET",
                 headers: {
                     Authorization: res.token,
                 }
             })
             .then((res) => res.json())
             .then((res) => {
                 if(res.success){
                     alert('user logged in successfully');
                     localStorage.setItem("firstName", res.data.firstName);
                     localStorage.setItem("userId", res.data._id);
                     email.value = "";
                     window.location.href = "./profile.html";
                 }
                 else if(res.error){
                    console.log(res.error)
                 }
             })
         }
     })
     .catch((err) => {
         console.log(err);
     });
 } 

//log admin
function logAdmin(){
        fetch(`${url}/user/login/admin`, 
        {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*", "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            if(res.message === "admin not found" && password.value != ""){
                alert('admin not registered');
                return false;
            }
            else if(res.message === "incorrect password"){
                alert('incorrect password');
            }
            else if(res.token){
                const { _id } = res.admin;
                localStorage.setItem("token", res.token)
                fetch(`${url}/user/login/${_id}/admin`, {
                    method: "GET",
                    headers: {
                        Authorization: res.token,
                    }
                })
                .then((res) => res.json())
                .then((res) => {
                    if(res.success){
                        alert('admin logged in successfully');
                        localStorage.setItem("firstName", res.data.firstName);
                        localStorage.setItem("userId", res.data._id);
                        localStorage.setItem("email", res.data.email);
                        email.value = "";
                        window.location.href = "./admin.html";
                    }
                    else if(res.error){
                    console.log(res.error)
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err);
        });
        }   


form.addEventListener("submit", logUser)

