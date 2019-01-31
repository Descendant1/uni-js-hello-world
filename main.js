


var input = [  
                document.getElementById('email'),
                document.getElementById('pass'), 
                document.getElementById('cpass'),
              //  document.getElementById('age'),
            ]
var emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;
var newAccPrep =  false;
const mainPageHref = 'file:///C:/Users/Paul/Desktop/Project1/MainPage.html';
var arrowIcon = '<i class="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>';
var modalText =  document.getElementById('modalText')
const userManager = new UserHolder();
//D.Ready
(()=> {
    document.getElementById('email').onfocus = () => hideValidate(document.getElementById('email'));
    document.getElementById('pass').onfocus = () => hideValidate(document.getElementById('pass'));
    document.getElementById('cpass').onfocus = () => hideValidate(document.getElementById('cpass'));
})();

//Auth w/out form
document.getElementById('LoginBtn').onclick= () =>{
    var check = true;
    var length =  newAccPrep==false ? input.length - 1 : input.length 
    for(var i=0; i< length ; i++) 
        if(validate(input[i]) == false){
            showValidate(input[i]);
            check=false;
        }
    newAccPrep == false? Auth(check) : Register(check);
};

var validate = (input) => {
    if(input.getAttribute('type') == 'email' )
        {   
            return emailRegex.test(input.value)       
        }
    else           
    {  
        if(input.getAttribute('type') == 'password' )       
            return input.value != ''
        else if (input.getAttribute('name') == 'confirmPass')  
            return !input.value == '' || !input.value  ==  document.getElementById('pass').value
        
    }
}

var showValidate = (input) => {
    input.parentElement.classList.add('alert-validate')
}

var hideValidate = (input) => {
    input.parentElement.classList.remove('alert-validate')
}

var createNewAccPrep = (ev) => {
    var btn  = document.getElementById('LoginBtn');
    var confPdiv = document.getElementById('confirmPass');
    if(newAccPrep == true)
    {
        btn.innerText = 'Login!'
        confPdiv.style.display = 'none';
        newAccPrep =  false;
        document.getElementById('CreateNewAcc')
                                     .innerHTML = 'Create your Account ' + arrowIcon;
    }
    else
    {
        btn.innerText = 'Register!'
        confPdiv.style.display = 'block';
        newAccPrep =  true;
        document.getElementById('CreateNewAcc')
                                      .innerHTML = 'Login '+  arrowIcon;
    }
}

var Auth = (check) => {
    
    if(check == true){
        var user = userManager.authUserData(document.getElementById('email').value, document.getElementById('pass').value)[0];
    
        if( user )
        {
            sessionStorage.setItem('LoggedUser', JSON.stringify(user));
            window.location.href =  mainPageHref;      

        }
        else 
            {
                modalText.innerHTML = '<br/><br/><br/>User credential not found <br/><br/><br/>'
                document.getElementById('id01').style.display ='block'

            }
    }
}
var Register = (check) => {
    if(check== true){
        userManager.addToAllUsers(new User(document.getElementById('email').value,document.getElementById('pass').value,'user',20))
        Auth(check);
    }
    
}

