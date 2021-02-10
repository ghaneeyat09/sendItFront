//queried elements
const fname = document.querySelector('.fname');
const lname = document.querySelector('.lname');
const email = document.querySelector('.ename');
const userName = document.querySelector('.username');
const mobile = document.querySelector('.mobile');
const password = document.querySelector('.passcode');
const confirmPassword = document.querySelector('.conpass');
const notification = document.querySelector(".notification");
const errorMsg = document.querySelector(".errMessage");
const instruction = document.querySelector('.instruction');
const passMsg = document.querySelector(".passMsg");
const adminMsg = document.querySelector('.adminMessage');
const signupBtn = document.querySelector('.signup-btn');
const homeAddress = document.querySelector('.hmAddress');
const secretCode = "0987IamSeNDIt87AdMiN0805";
const form = document.querySelector('.form');
//const cors_api_url = "https://cors-anywhere.herokuapp.com";
const url = "https://send-it-back-app.herokuapp.com";


const registerUser = function(e){
    e.preventDefault();
    const fname = document.querySelector('.fname');
    const lname = document.querySelector('.lname');
    const email = document.querySelector('.ename');
    const userName = document.querySelector('.username');
    const mobile = document.querySelector('.mobile');
    const homeAddress = document.querySelector('.hmAddress');
    const password = document.querySelector('.passcode');
    const confirmPassword = document.querySelector('.conpass');

    const admin = {
        firstName: fname.value,
        userName: userName.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value 
    }
    const user = {
        firstName: fname.value,
        lastName: lname.value,
        userName: userName.value,
        email: email.value,
        mobileNo: mobile.value,
        homeAddress: homeAddress.value,
        password: password.value,
        confirmPassword: confirmPassword.value 
        }          
      
        if(fname.value &&
            lname.value &&
            email.value &&
            userName.value &&
            mobile.value &&
            homeAddress.value &&
            password.value && 
            confirmPassword.value
        ){
            if(notification.innerHTML === "" &&
               errorMsg.innerHTML === "" &&
               passMsg.innerHTML === ""){

        fetch(`${url}/user/register`, 
        {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*", "Content-Type": "application/json"
            },
            body: JSON.stringify(user)

        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            if(res.message === "mail exists"){
                console.log("mail exists");
                alert('mail exists');
                return false;
            }
            else if(res.token){
                const { _id } = res.user;
                localStorage.setItem("token", res.token);
                fetch(`${url}/user/login/${_id}`, {
                    method: "GET",
                    headers: {
                        Authorization: res.token,
                    }
                })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    if(res.success){
                        console.log("result", res.data);
                        localStorage.setItem("firstName", res.data.firstName);
                        localStorage.setItem("userId", res.data._id);
                        window.location.href = "./profile.html";
                    }
                    else if(res.error){
                        console.log("error", res.error)
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
}

    else if(
        fname.value &&
        email.value &&
        userName.value &&
        password.value === secretCode &&
        confirmPassword.value &&
        lname.value === "" &&
        mobile.value === ""
     ){
            if(notification.innerHTML === "" &&
               passMsg.innerHTML === ""){
               fetch(`${url}/user/register/admin`, 
        {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*", "Content-Type": "application/json"
            },
            body: JSON.stringify(admin)

        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result);
            if(result.message === "mail exists"){
                console.log("mail exists");
                alert('mail exists');
                return false;
            }
            else if(result.token){
                console.log(result);
                const { _id } = result.admin;
                localStorage.setItem("token", result.token);
                fetch(`${url}/user/login/${_id}/admin`, {
                    method: "GET",
                    headers: {
                        Authorization: result.token,
                    }
                })
                .then((res) => res.json())
                .then((result) => {
                    console.log(result)
                    if(result.success){
                        console.log("result", result.data);
                        localStorage.setItem("firstName", result.data.firstName);
                        localStorage.setItem("email", result.data.email);
                        localStorage.setItem("adminId", result.data._id);
                        window.location.href = "./admin.html";
                    }
                    else if(res.error){
                        console.log("error", res.error)
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })
        }
    }
    else if(fname.value === "" ||
    lname.value === "" ||
    email.value === "" ||
    userName.value === "" ||
    mobile.value === "" ||
    homeAddress.value === "" ||
    password.value=== "" ||
    confirmPassword.value === "")
    {
        alert("please input the field completely");
        return false;
    }
}

        

        
    

function emailValidation() {
    const email = document.querySelector(".ename").value;
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const notification = document.querySelector(".notification");

  if(email.match(pattern))
  {
    form.classList.add("valid");
    form.classList.remove("invalid");
    notification.innerHTML = "";
  }
  else{
    form.classList.add("invalid");
    form.classList.remove("valid");
    notification.innerHTML = "Pls enter a valid email address";
    notification.style.color = "red";
    return false;
  }
  if(email === ""){
    form.classList.remove("valid");
    form.classList.remove("invalid");
    notification.innerHTML = "";
  }
}

function mobileValidation() {
    const mobile = document.querySelector('.mobile').value;
    const errorMsg = document.querySelector(".errMessage");
    const pattern = /^(\+|00)[0-9]{1,3}[0-9]{4,14}(?:x.+)?$/
    //const pattern = /^[\+]?[234]\d{12}$/;
    //const pattern = /^\d{11}$/;


    if(mobile.match(pattern)){
        errorMsg.innerHTML = "";
    }
    else{
        errorMsg.innerHTML = "invalid mobile number";
        errorMsg.style.color = "red";
    }
    if(mobile === ""){
        errorMsg.innerHTML = "";
    }
}
function checkPasswordLenght() {
    const password = document.querySelector('.passcode');
    const adminMsg = document.querySelector('.adminMessage');
    if(password.value.lenght < 6){
        adminMsg.innerHTML = "password must be a minimum of six characters";
        adminMsg.style.color = "red";
        return false;
    }
    else{
        adminMsg.innerHTML = "";
    }
    if(password.value === ""){
        adminMsg.innerHTML = "";
    }
}
function checkPassword() {
    const password = document.querySelector('.passcode');
    const confirmPassword = document.querySelector('.conpass');
    const passMsg = document.querySelector(".passMsg");


    if(confirmPassword.value === password.value){
        passMsg.innerHTML = "";
    }
    else{
        passMsg.innerHTML = "password does not match";
        passMsg.style.color = "red";
    }
    if(confirmPassword.value === ""){
        passMsg.innerHTML = "";
    }
}
function clearField(){
    document.querySelector('.fname').value = "";
    document.querySelector('.lname').value = "";
    document.querySelector('.ename').value = "";
    document.querySelector('.username').value = "";
    document.querySelector('.mobile').value = "";
    document.querySelector('.homeAddress').value = "";
    document.querySelector('.passcode').value = "";
    document.querySelector('.conpass').value = "";
}
//setTimeout(clearField, 3000);


//event listeners
email.addEventListener("change", emailValidation);
mobile.addEventListener("change", () =>{
    mobileValidation();
    instruction.innerHTML = "";
});
mobile.addEventListener("click", function(){
  instruction.innerHTML = "mobile number must include a country code"
});
password.addEventListener("mouseout", checkPasswordLenght);
confirmPassword.addEventListener("mouseout", checkPassword);
form.addEventListener("submit", registerUser);


