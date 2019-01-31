var list = document.getElementById('EventList');
var userList = document.getElementById('MyEventList');

const  Constructor =(json) =>{
    return new Event(this.Id =  json.Id,
      this.Name =  json.Name,
      this.AgeFlag =  json.AgeFlag,
      this.Place =  json.Place,
      this.Time =  json.Time,
      this.Price = json.Price,
      this.usersWillGo =  json.usersWillGo);
  }




var createEventHolderElement = (element) => {
    element = Constructor(element);
    //console.log(element)
    var li =  document.createElement('li')
    li.classList.add('w3-white')
    li.classList.add('w3-opacity')
    li.classList.add('w3-hover-opacity-off')
    li.id =  element.Id;
    var p  = document.createElement('p')
    p.innerHTML =  element.getInformation();
    p.dataset.toggle = 'tooltip';
    p.title =  element.Time;
    li.append(p);
    var i = document.createElement('i');
    i.classList.add('fa');
    i.dataset.Id = element.Id;
    if(loggedUser.type == 'admin'){
        i.classList.add('fa-close');
        i.onclick = (e) => {
            eventsHolder.deleteEvent(e.target.dataset.Id)
        } 
        li.append(i);
    }
    else {
        i.classList.add('fa-thumbs-o-up');
        i.onclick = (e) => {
            var currEvent =  eventsHolder.getEventById(e.target.dataset.id);
            appendUser(loggedUser, currEvent);            
        } 
        li.append(i);
    }
    list.append(li); 
}

var createUserEventHolderElement = (element) => {
    //console.log(element)
    var li =  document.createElement('li')
    li.classList.add('w3-white')
    li.classList.add('w3-opacity')
    li.classList.add('w3-hover-opacity-off')
    li.id =  element.Id;
    var p  = document.createElement('p')
    var res = element.AgeFlag ? '18+' : 'All';
    var price =  Number(element.price) > 0 ? '! ' :'$ ';
    p.innerHTML =  price+ element.Name + ' ' + res + '<br/>' + element.Place +' '+ element.Time+ '<br/>$' + element.Price;
    p.dataset.toggle = 'tooltip';
    p.title =  element.Time;
    li.append(p);
    var i = document.createElement('i');
    i.classList.add('fa');
    i.dataset.Id = 'user`s'+element.Id;
    i.classList.add('fa-times-circle');
    i.onclick = (e) => {
        var currEvent =  eventsHolder.getEventById(e.target.dataset.id);
            
        currEvent.usersWillGo.splice(loggedUser,1)
        debugger;
        loggedUser.balance += Number(currEvent.Price)
        document.getElementById("userBalance").innerText  = 'Balance: $ '+ loggedUser.balance;
        li.remove();
        alert('You already not going to event :(') 
    } 
    li.append(i);
    
    userList.append(li); 
}




var validateEventFields = () => {
    var name = document.getElementById('EventName').value;
    var ageflag =  document.getElementById('EventAgeFlag').checked;
    var eventlocation =  document.getElementById('EventLocation').value;
    var eventtime =  document.getElementById('EventTime').value;
    var eventprice =  document.getElementById('EventPrice').value;
    
    if(name === "" || eventlocation === "")
        return;
    return new Event(null, name, ageflag, eventlocation, eventtime,eventprice,null);

}
class Event {

    constructor(Id, Name, AgeFlag, Place, Time , Price, users){
        this.Id = Id ? Id : this.uuid4();
        this.Name =  Name;
        this.AgeFlag =  AgeFlag;
        this.Place =  Place;
        this.Time =  Time;
        this.Price =  Price;
        this.usersWillGo =  users ? users: []
    }
 
   
    uuid4()
    {
        function hex (s, b)
        {
            return s +
            (b >>> 4   ).toString (16) +  // high nibble
            (b & 0b1111).toString (16);   // low nibble
        }

       let r = crypto.getRandomValues (new Uint8Array (16));

        r[6] = r[6] >>> 4 | 0b01000000; // Set type 4: 0100
        r[8] = r[8] >>> 3 | 0b10000000; // Set variant: 100

        return r.slice ( 0,  4).reduce (hex, '' ) +
            r.slice ( 4,  6).reduce (hex, '-') +
            r.slice ( 6,  8).reduce (hex, '-') +
            r.slice ( 8, 10).reduce (hex, '-') +
            r.slice (10, 16).reduce (hex, '-');
    }
    getInformation(){
        var res = this.AgeFlag ? '18+' : 'All'
        var price =  Number(this.price) > 0 ? '! ' :'$ ';

        return price + this.Name + ' ' + res + '<br/>' + this.Place+' '+ this.Time+  '<br/>$' + this.Price;;
    }

}
var appendUser = (user, event)=>{
    if(event.AgeFlag == true && user.age >= 18)
    {  
        if(event.usersWillGo.includes(user) == false)
            {  
                event.usersWillGo.push(user) 
                if(loggedUser.balance - Number(event.Price)>= 0 )
                {
                    loggedUser.balance -= Number(event.Price)
                    sessionStorage.setItem('LoggedUser',JSON.stringify(loggedUser));
                    document.getElementById("userBalance").innerText  = 'Balance: $ '+ loggedUser.balance;
                    localStorage.setItem('MyEvents', JSON.stringify(eventsHolder.Events))
                    alert('You will go to the event ') 
                    fillUserEvents().map(o=> createUserEventHolderElement(o));
                }
                else 
                    alert('Not enough')
            }

    }
    else{
        alert('Age isn`t compatible')
    }
    console.log(event)

}

class EventsHolder{

    constructor(){
        this.Events =  [];
    }
    appendEvent(event){
        this.Events.push(event);
        localStorage.setItem(event.Id, JSON.stringify(event))
        createEventHolderElement(event);
        localStorage.setItem('MyEvents', JSON.stringify(this.Events))
    }
    deleteEvent(Id){
        this.Events.splice(JSON.parse( this.getEventFromLocalStorage(Id)),1)
        document.getElementById(Id).remove();
        localStorage.removeItem(Id);
        localStorage.setItem('MyEvents', JSON.stringify(this.Events))
    }
    getEventFromLocalStorage(Id){
        return localStorage.getItem(Id);
    }
    rebuildEventsHolder(){
        if( localStorage.getItem('MyEvents') == null)
            return;
        eventsHolder.Events =  JSON.parse(localStorage.getItem('MyEvents'))
        fillEvents();
    }
    getEventById(id){
        return this.Events.filter(i=>i.id == id)[0];
    }
}


const eventsHolder = new EventsHolder();
const sButton =  document.getElementById('SubmitButton');


var fillEvents = () =>  { eventsHolder.Events.map( i=> createEventHolderElement(i) )};
var fillUserEvents =() => { return eventsHolder.Events.filter(i=>i.usersWillGo.filter(i=>i.id=loggedUser.id));}

check = () => {
    if(loggedUser.type == 'user')
        Array.from(document.querySelectorAll('[name=forAdmin]')).map(i=>i.style.display = 'none')
}

sButton.onclick = () => {
    var ev = validateEventFields() ; 
    document.getElementById('EventName').value ='';
    document.getElementById('EventAgeFlag').checked= false;
    document.getElementById('EventLocation').value= '';
    document.getElementById('EventPrice').value = '';
    document.getElementById('EventLocation').value = '';
    
    ev ? eventsHolder.appendEvent( ev ): alert('Fill all fields');
}
var loggedUser = new User();
const userHolder =  new UserHolder();
(function() {
    var id = JSON.parse(sessionStorage.getItem('LoggedUser'));
    loggedUser = userHolder.getUser(id.id);
    eventsHolder.rebuildEventsHolder();
    document.getElementById("userFullName").innerText =  'Name: '+ loggedUser.firstName + ' ' + loggedUser.lastName;
    document.getElementById("userBalance").innerText  = 'Balance: $ '+ loggedUser.balance;
    document.getElementById( "userType").innerText = 'Role: ' + loggedUser.type
    document.getElementById( "userAge").innerText = 'Age: '+ loggedUser.age + ' years'

    fillUserEvents().map(o=> createUserEventHolderElement(o));
    check();

})();



///////////////////////////
