const tasks = document.querySelectorAll(".tasks");
const form = document.querySelector('.form');
const logIn = document.querySelector('form');
const preloader = document.querySelector('.preloader');


let page = 0;
let name = '';

//preloader
setTimeout(()=>{
    if(name==''|| name==null)
    logIn.style.display = 'block';
    else
    preloader.style.display = 'none';


},2000);

//submit name
logIn.addEventListener('submit', (e) => {
    e.preventDefault();
    if(logIn.name.value){
    name = logIn.name.value;
    localStorage.setItem('name', name);
    logIn.name.value = '';
    preloader.style.display = 'none';
    }
});

//rendering new task
function newTask(doc){
    let li = document.createElement('li');
    let task = document.createElement('p');
    

    li.setAttribute('data-id', doc.id);
    task.textContent = doc.data().task;


    li.appendChild(task);
    if(page==0){
    li.addEventListener('dblclick', (e)=>{
        var d = new Date();
        var month = d.getMonth() + 1;
        var date = d.getHours() + 1 + ':' + d.getMinutes() + ':' + d.getSeconds() + ' | ' + d.getDate() + '/' + month + '/' + d.getFullYear() ;
        db.collection('donetasks').add({
          task: e.target.textContent,
          name: name,
          date: date
        });
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('tasks').doc(id).delete();

    })

}
else if(page==1){
        let task1 = document.createElement('span');
        task1.textContent = name;
        li.appendChild(task1);
}
    tasks[page].appendChild(li);
 
}

//saving data

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    db.collection('tasks').add({
        task: form.task.value
    });
    form.task.value ='';
});

//real-time listener function

function realTimeListener(snapshot){
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            newTask(change.doc);
        } else if (change.type == "removed") {
            let li = tasks[page].querySelector('[data-id=' + change.doc.id + ']');
            tasks[page].removeChild(li);
        }
    });   
}

//real-time listener
db.collection('tasks').onSnapshot(snapshot =>{
    realTimeListener(snapshot);
});

db.collection('donetasks').onSnapshot(snapshot=>{
    page++;
    realTimeListener(snapshot);
    page=0;
});

//switching beetwen pages

const doneBtn = document.querySelector('.toggle--done');
const undoneBtn = document.querySelector('.toggle--undone');
const done = document.querySelector('.done');
const undone = document.querySelector('.undone');

doneBtn.addEventListener('click',(e)=>{
    done.style.display = 'block';
    undone.style.display = 'none';
    doneBtn.classList.remove('toggle--done');
    doneBtn.classList.add('toggle--done__clicked');
    undoneBtn.classList.remove('toggle--undone');
    undoneBtn.classList.add('toggle--undone__unfocused');
});

undoneBtn.addEventListener('click', (e) => {
    done.style.display = 'none';
    undone.style.display = 'block';
    doneBtn.classList.add('toggle--done');
    doneBtn.classList.remove('toggle--done__clicked');
    undoneBtn.classList.add('toggle--undone');
    undoneBtn.classList.remove('toggle--undone__unfocused');
});

//test local storage
function testLocalStorage(){
    var foo = 'foo';
    try{
        localStorage.setItem(foo, foo);
        localStorage.removeItem(foo);
        return true;
    }catch(e){
        return false;
    }
}

function initLocalStorage(){
    if(!testLocalStorage()){
        console.log('Sorry, you cannot use localStorage');
    }
    else{
    name = localStorage.getItem('name');
    }
}
initLocalStorage();
