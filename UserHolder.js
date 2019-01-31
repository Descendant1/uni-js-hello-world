
class UserHolder {

    constructor(){
        this.AllUsers = this.reConstruction();
        if(this.AllUsers.length == 0)
        { 
            this.addToAllUsers(new User('kyrnacz@gmail.com',123,'admin',19))
            this.addToAllUsers(new User('kyrnacz@gmail.ru',123,'user',19))
        }
        this.updateUserStorage();
    }
    addToAllUsers (user){
        this.AllUsers.push(user);
        this.updateUserStorage();
    }
    removeFromAllUsers (user){
        var index =  this.AllUsers.indexOf(user);
        if( index > -1 )
            this.AllUsers.splice(index,1);
    }
    getUser(id){
        return this.AllUsers.filter(i=> i.id == id)[0];
    }
    authUserData(email,pass){
        return this.AllUsers.filter(i=> i.email == email && i.password == pass); 
    }
    updateUserStorage(){
        localStorage.setItem('userList', this.transformToJSON())
    }
    transformToJSON(){
        return JSON.stringify(this.AllUsers);
    }
    reConstruction () {
        return localStorage.getItem('userList') ? JSON.parse(localStorage.getItem('userList')) : [];
    }
}