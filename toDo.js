let doc = document

function addListners(){
    doc.getElementById('addCaseButton').addEventListener('click', addCase)
    doc.getElementById('canselCaseButton').addEventListener('click', clearCase)
}

class Case{
    constructor(name, time, date, done){
        this.name = name
        this.done = done
        let dati = date.split('-')
        dati.push(time.split(':')[0])
        dati.push(time.split(':')[1])

        this.dT = new Date(dati[0], dati[1]-1, dati[2], dati[3], dati[4])
    }
}

function addCase(){
    let doing = new Case(doc.getElementById('addCase').value, doc.getElementById('addCaseTime').value, doc.getElementById('addCaseDate').value, false)
    localStorage.setItem(`${localStorage.length}`, JSON.stringify(doing))
    doc.getElementById('addCase').value = ''
    doc.getElementById('addCaseTime').value = ''
    doc.getElementById('addCaseDate').value = ''
    showList()
    showNearest()
}

function clearCase(){
    doc.getElementById('addCase').value = ''
    doc.getElementById('addCaseTime').value = ''
    doc.getElementById('addCaseDate').value = ''
}

function showList(){
    let container = doc.getElementById('doList')
    container.innerHTML = ''
    let records = []
    for(let i = 0; i<localStorage.length; i++){
        if(JSON.parse(localStorage.getItem(`${i}`))){
        let record = [JSON.parse(localStorage.getItem(`${i}`)), i]
        records.push(record)}
    }
    records.sort((a, b)=>{
        if(a[0].dT>b[0].dT) return 1
        if(a[0].dT==b[0].dT) return 0
        if(a[0].dT<b[0].dT) return -1
    })
    records.forEach(el=>{
        let row = doc.createElement('div')
        row.classList.add('flex-wrapper')
        row.id = `c${el[1]}`
        row.classList.add('row')
        let when = doc.createElement('div')
        let what = doc.createElement('div')
        let done = doc.createElement('button')
        let del = doc.createElement('button')
        let d = new Date(el[0].dT)
        let now = new Date()
        
        if(Number(d) - Number(now) > 0){
            row.classList.add('fut')
        } else {
            row.classList.add('lost')
        }
        when.innerHTML =`<p>${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}</p> <p>${d.getHours()}:${d.getMinutes()}</p>`
        when.classList.add('when')
        what.innerText = el[0].name
        what.classList.add('what')
        done.innerText = 'done'
        done.classList.add('rowButton')
        del.innerText = 'delete'
        del.classList.add('rowButton')
        if(el[0].done){
            done.setAttribute('disabled', 'disabled')
            what.classList.add('done')
        }
        del.addEventListener('click', delCase)
        done.addEventListener('click', doneCase)
        row.append(when, what, done, del)
        container.append(row)
    })

}

function delCase(e){
    let k = e.target.parentNode.id.slice(1)
    localStorage.removeItem(k)
    showList()
    showNearest()
}

function doneCase(e){
    let k = e.target.parentNode.id.slice(1)
    let c = JSON.parse(localStorage.getItem(k))
    c.done = true
    localStorage.setItem(k, JSON.stringify(c))
    showList()
    showNearest()
}

function showNearest(){
    let el
    if(doc.getElementsByClassName('fut')[0])
    {el = JSON.parse(localStorage.getItem(doc.getElementsByClassName('fut')[0].id.slice(1)))}
    let con = doc.getElementById('nearest')
    con.innerHTML = ''
    if(localStorage.length>0 && !el.done){
        con.append(el.name)
    } else {
        con.innerText = 'You haven`t buissnes for now'
    }
    showList()
}

addListners()
showList()
showNearest()