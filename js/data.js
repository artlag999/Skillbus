var data = [] //исходный массив клиентов
var dataSort = [] //отсортированный массив данных
var dataFilter = [] //отфильтрованный массив данных
var dataCopy = [] //копирует массив который нужно отфильтровать (нужен для дальнейшей фильтрации)

//проверяет применение сортировки
var sortIdON = true
var sortNameON = false
var sortCreateON = false
var sortChangeON = false

//
var redactID = 0
var ContactCounter = 0
var contactExist = {}

var contactChecker = false //проверяет количество контактов, меньше 10 - фалсе, больше 10 - тру

document.addEventListener('DOMContentLoaded', async function() {

  var jsID = {}
  let filterOn = false //проверяет применены ли фильтры

  const response = await fetch('http://localhost:3000/api/clients')
  data = await response.json()
  createTable(data)

  // - - - - - - - - - - ДОБАВЛЕНИЕ

  // показать окно добавления
  let createClientBtn = document.querySelector('.section__btn')
  createClientBtn.addEventListener('click', function() {
    let windows = document.querySelector('.windows')
    let windowCreate = document.querySelector('.window__add')
    windows.classList.add('display-visible')
    windowCreate.classList.add('display-visible')
    contactChecker = false
    clickOut()

  })



  // добавление секции контакта
  let addFormAddContact = document.querySelector('.add-form__btn')
  addFormAddContact.addEventListener('click', function(e){
    e.preventDefault()
    doCheckContactLength()
    if (contactChecker == false) {
      let counterDiv = document.createElement('div')
      counterDiv.classList.add(`added-contact${ContactCounter}`, 'forCSS')
      let addContactBlock = `<select name="select${ContactCounter}" class="contact__type" id="select__change${ContactCounter}">
                              <option class="select__option" value="tel">Телефон</option>
                              <option class="select__option" value="other">Другое</option>
                              <option class="select__option" value="email">Email</option>
                              <option class="select__option" value="vk">Vk</option>
                              <option class="select__option" value="fb">Facebook</option>
                            </select>
                            <input type="text" placeholder="Введите данные" class="contact__text contact__text${ContactCounter}">
                            <button type="button" class="thisContact-remove" remove__id=${ContactCounter}>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
                              </svg>
                            </button>`   //Создаёт селкт с импутом для добавления контакта

      counterDiv.innerHTML = addContactBlock
      let addContactDiv = document.querySelector('.add__contact2')
      addContactDiv.classList.add('display-visible')
      addContactDiv.appendChild(counterDiv)
      ContactCounter++

      deleteContact()
      customSelect()
    }
  })



  // кнопка добавления клиента
  let addBtn = document.querySelector('.add-form__submit')
  addBtn.addEventListener('click', function(evt) {
    evt.preventDefault()
    let addFirstName = document.getElementById('add__firstName').value
    let addSecondName = document.getElementById('add__secondName').value
    let addThirdName = document.getElementById('add__thirdName').value


    let contactCheck = []
    //массив данных и ключей для обьекта
    let contactObjValue = []
    let contactObjKey = []
    contactExist = []
    let selectType = document.querySelectorAll('.is-selected')
    selectType.forEach(function(itemType) {
      let item = itemType.getAttribute('data-value')
      contactObjKey.push(item)
      contactCheck.push(item)
    })

    let selectText = document.querySelectorAll('.contact__text')
    selectText.forEach(function(itemType){
      let item = itemType.value
      contactObjValue.push(item)
    })
    let xxx = 0
    while (xxx < contactObjKey.length) {
      let contactObj = {}
      contactObj.type = contactObjKey[xxx]
      contactObj.value = contactObjValue[xxx]
      contactExist.push(contactObj)
      xxx++
    }


    if (hasDuplicates(contactCheck)) {
      let block = document.querySelector('.mistake__add')
      block.classList.add('display-visible')
      let mistakeText = document.querySelector('.mistake-add__text')
      mistakeText.textContent = 'Ошибка: контакты вида "Телефон", "Вк", "email", "Fb" не должны повторяться!'
    }
    else {
      deleteTable()
      createClient()
      async function createClient() {
        const responseFirst = await fetch('http://localhost:3000/api/clients', {
          method: 'POST',
          headers: {'Content-Type' : 'application/json' },
          body: JSON.stringify({
            name: addFirstName,
            surname: addSecondName,
            lastName: addThirdName,
            contacts: contactExist
          })
        })
        const responseAgain = await fetch('http://localhost:3000/api/clients')
        data = await responseAgain.json()
        createTable(data)
        }
        let windows = document.querySelector('.windows')
        let windowCreate = document.querySelector('.window__add')
        windows.classList.remove('display-visible')
        windowCreate.classList.remove('display-visible')
        addFirstName = document.getElementById('add__firstName').value = ''
        addSecondName = document.getElementById('add__secondName').value = ''
        addThirdName = document.getElementById('add__thirdName').value = ''
        let filter = document.querySelector('.filter')
        filter.value = ''
        dataFilter = []
        filterOn = false
        sortId.classList.add('sort__on')
        sortName.classList.remove('sort__on')
        sortTimeCreate.classList.remove('sort__on')
        sortTimeChange.classList.remove('sort__on')

        sortId.classList.remove('sort__back')
        sortName.classList.remove('sort__back')
        sortTimeCreate.classList.remove('sort__back')
        sortTimeChange.classList.remove('sort__back')
        let deletMe = document.querySelector('.add__contact2')
        deletMe.innerHTML = ''
        deletMe.classList.remove('display-visible')
        ContactCounter=0
        let mistakeText2 = document.querySelector('.mistake-add__text')
        mistakeText2.textContent = ''
      }
  })



  // закрыть окно добавления
  let btnCloseAdd = document.querySelector('.add__close')
  let btnCancelAdd = document.querySelector('.add-form__delete')
  btnCancelAdd.addEventListener('click', function(e){
    e.preventDefault()
    let windows = document.querySelector('.windows')
    let windowCreate = document.querySelector('.window__add')
    windows.classList.remove('display-visible')
    windowCreate.classList.remove('display-visible')
    let deletMe = document.querySelector('.add__contact2')
    deletMe.innerHTML = ''
    deletMe.classList.remove('display-visible')
    ContactCounter=0
    let addFirstName = document.getElementById('add__firstName').value=''
    let addSecondName = document.getElementById('add__secondName').value=''
    let addThirdName = document.getElementById('add__thirdName').value=''
    let mistakeText2 = document.querySelector('.mistake-add__text')
        mistakeText2.textContent = ''
  })
  btnCloseAdd.addEventListener('click', function(){
    let windows = document.querySelector('.windows')
    let windowCreate = document.querySelector('.window__add')
    windows.classList.remove('display-visible')
    windowCreate.classList.remove('display-visible')
    let deletMe = document.querySelector('.add__contact2')
    deletMe.innerHTML = ''
    deletMe.classList.remove('display-visible')
    ContactCounter=0
    let addFirstName = document.getElementById('add__firstName').value=''
    let addSecondName = document.getElementById('add__secondName').value=''
    let addThirdName = document.getElementById('add__thirdName').value=''
    let mistakeText2 = document.querySelector('.mistake-add__text')
        mistakeText2.textContent = ''
  })





  // -  - - - - - - - - - РЕДАКТИРОВАНИЕ

  // показать окно редактирования // выполнена как функция для переопределения кнопок с классом после изменения таблицы
  function openChangeWindow() {
    let btnChangeOpen = document.querySelectorAll('.table__change')
    btnChangeOpen.forEach.call(document.querySelectorAll('.table__change'), function(el){
      el.addEventListener('click',  function(e) {
      contactChecker = false
      
      clickOut()


        redactID = e.target.getAttribute('js__id')
        let windows = document.querySelector('.windows')
        let windowChange = document.querySelector('.window__change')
        windows.classList.add('display-visible')
        windowChange.classList.add('display-visible')
        changeClient(redactID)
      })
    })
  }

  // загрузка в окно редактирования клиента
  async function changeClient(id) {
    const responseFirst = await fetch(`http://localhost:3000/api/clients/${id}`)
    const dataClient = await responseFirst.json()
    let firstName = document.querySelector('.change-form__input--firstName')
    let secondName = document.querySelector('.change-form__input--secondName')
    let thirdName = document.querySelector('.change-form__input--thirdName')
    let clientID = document.querySelector('.change__id')
    firstName.value = dataClient.name
    secondName.value = dataClient.surname
    thirdName.value = dataClient.lastName

    let contactTakeFromData = dataClient.contacts
    contactExist = contactTakeFromData
    ContactCounter = 0
    while (ContactCounter < contactExist.length) {
      let contactObj = contactExist[ContactCounter]
      if (contactObj.type == 'vk') {
        let counterDiv = document.createElement('div')
        counterDiv.classList.add(`added-contact${ContactCounter}`, 'forCSS')
        let addContactBlock = `<select name="select${ContactCounter}" class="contact__type" id="select__change${ContactCounter}">
                                <option class="select__option" value="vk">Vk</option>
                                <option class="select__option" value="tel">Телефон</option>
                                <option class="select__option" value="other">Другое</option>
                                <option class="select__option" value="email">Email</option>
                                <option class="select__option" value="fb">Facebook</option>
                              </select>
                              <input type="text" class="contact__text contact__text${ContactCounter}" value="${contactObj.value}">
                              <button type="button" class="thisContact-remove" remove__id="${ContactCounter}">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
                                </svg>
                              </button>`
                              counterDiv.innerHTML = addContactBlock
                              let addContactDiv = document.querySelector('.add__contact')
                              addContactDiv.classList.add('display-visible')
                              addContactDiv.appendChild(counterDiv)
      } else if (contactObj.type == 'fb') {
        let counterDiv = document.createElement('div')
        counterDiv.classList.add(`added-contact${ContactCounter}`, 'forCSS')
        let addContactBlock = `<select name="select${ContactCounter}" class="contact__type" id="select__change${ContactCounter}">
                                <option class="select__option" value="fb">Facebook</option>
                                <option class="select__option" value="vk">Vk</option>
                                <option class="select__option" value="tel">Телефон</option>
                                <option class="select__option" value="other">Другое</option>
                                <option class="select__option" value="email">Email</option>
                              </select>
                              <input type="text" class="contact__text contact__text${ContactCounter}" value="${contactObj.value}">
                              <button type="button" class="thisContact-remove" remove__id="${ContactCounter}">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
                                </svg>
                              </button>`
                              counterDiv.innerHTML = addContactBlock
                              let addContactDiv = document.querySelector('.add__contact')
                              addContactDiv.classList.add('display-visible')
                              addContactDiv.appendChild(counterDiv)
      } else if (contactObj.type == 'tel') {
        let counterDiv = document.createElement('div')
        counterDiv.classList.add(`added-contact${ContactCounter}`, 'forCSS')
        let addContactBlock = `<select name="select${ContactCounter}" class="contact__type" id="select__change${ContactCounter}">
                                <option class="select__option" value="tel">Телефон</option>
                                <option class="select__option" value="vk">Vk</option>
                                <option class="select__option" value="other">Другое</option>
                                <option class="select__option" value="email">Email</option>
                                <option class="select__option" value="fb">Facebook</option>
                              </select>
                              <input type="text" class="contact__text contact__text${ContactCounter}" value="${contactObj.value}">
                              <button type="button" class="thisContact-remove" remove__id="${ContactCounter}">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
                                </svg>
                              </button>`
                              counterDiv.innerHTML = addContactBlock
                              let addContactDiv = document.querySelector('.add__contact')
                              addContactDiv.classList.add('display-visible')
                              addContactDiv.appendChild(counterDiv)
      } else if (contactObj.type == 'email') {
        let counterDiv = document.createElement('div')
        counterDiv.classList.add(`added-contact${ContactCounter}`, 'forCSS')
        let addContactBlock = `<select name="select${ContactCounter}" class="contact__type" id="select__change${ContactCounter}">
                                <option class="select__option" value="email">Email</option>
                                <option class="select__option" value="vk">Vk</option>
                                <option class="select__option" value="tel">Телефон</option>
                                <option class="select__option" value="other">Другое</option>
                                <option class="select__option" value="fb">Facebook</option>
                              </select>
                              <input type="text" class="contact__text contact__text${ContactCounter}" value="${contactObj.value}">
                              <button type="button" class="thisContact-remove" remove__id="${ContactCounter}">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
                                </svg>
                              </button>`
                              counterDiv.innerHTML = addContactBlock
                              let addContactDiv = document.querySelector('.add__contact')
                              addContactDiv.classList.add('display-visible')
                              addContactDiv.appendChild(counterDiv)
      } else if (contactObj.type == 'other') {
        let counterDiv = document.createElement('div')
        counterDiv.classList.add(`added-contact${ContactCounter}`, 'forCSS')
        let addContactBlock = `<select name="select${ContactCounter}" class="contact__type" id="select__change${ContactCounter}">
                                <option class="select__option" value="other">Другое</option>
                                <option class="select__option" value="vk">Vk</option>
                                <option class="select__option" value="tel">Телефон</option>
                                <option class="select__option" value="email">Email</option>
                                <option class="select__option" value="fb">Facebook</option>
                              </select>
                              <input type="text" class="contact__text contact__text${ContactCounter}" value="${contactObj.value}">
                              <button type="button" class="thisContact-remove" remove__id="${ContactCounter}">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
                                </svg>
                              </button>`
                              counterDiv.innerHTML = addContactBlock
                              let addContactDiv = document.querySelector('.add__contact')
                              addContactDiv.classList.add('display-visible')
                              addContactDiv.appendChild(counterDiv)
      }


      ContactCounter++
    }
    deleteContact()
    customSelect()

    clientID.textContent = 'ID: ' + dataClient.id
  }









  // добавление секции контакта
  let changeFormAddContact = document.querySelector('.change-form__btn')
  changeFormAddContact.addEventListener('click', function(e){
    e.preventDefault
    doCheckContactLength()
    if (contactChecker == false) {
      let counterDiv = document.createElement('div')
      counterDiv.classList.add(`added-contact${ContactCounter}`, 'forCSS')
      let addContactBlock = `<select name="select${ContactCounter}" class="contact__type" id="select__change${ContactCounter}">
                              <option class="select__option" value="tel">Телефон</option>
                              <option class="select__option" value="other">Другое</option>
                              <option class="select__option" value="email">Email</option>
                              <option class="select__option" value="vk">Vk</option>
                              <option class="select__option" value="fb">Facebook</option>
                            </select>
                            <input type="text" placeholder="Введите данные" class="contact__text contact__text${ContactCounter}">
                            <button type="button" class="thisContact-remove" remove__id=${ContactCounter}>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
                              </svg>
                            </button>`   //Создаёт селкт с импутом для добавления контакта

      counterDiv.innerHTML = addContactBlock
      let addContactDiv = document.querySelector('.add__contact')
      addContactDiv.classList.add('display-visible')
      addContactDiv.appendChild(counterDiv)
      ContactCounter++
      customSelect()

      deleteContact()
    }


  })




  // применить изменения
  let changeClientSubmit = document.querySelector('.change-form__submit')
  changeClientSubmit.addEventListener('click', async function(e) {
    e.preventDefault

    let firstName = document.querySelector('.change-form__input--firstName').value
    let secondName = document.querySelector('.change-form__input--secondName').value
    let thirdName = document.querySelector('.change-form__input--thirdName').value
    let contactCheck = []
    //массив данных и ключей для обьекта
    let contactObjValue = []
    let contactObjKey = []
    contactExist = []
    let selectType = document.querySelectorAll('.is-selected')
    selectType.forEach(function(itemType) {
      let item = itemType.getAttribute('data-value')
      contactObjKey.push(item)
      contactCheck.push(item)
    })

    let selectText = document.querySelectorAll('.contact__text')
    selectText.forEach(function(itemType){
      let item = itemType.value
      contactObjValue.push(item)
    })
    let xxx = 0
    while (xxx < contactObjKey.length) {
      let contactObj = {}
      contactObj.type = contactObjKey[xxx]
      contactObj.value = contactObjValue[xxx]
      contactExist.push(contactObj)
      xxx++
    }


    if (hasDuplicates(contactCheck)) {
      let block = document.querySelector('.mistake__change')
      block.classList.add('display-visible')
      let mistakeText = document.querySelector('.mistake-change__text')
      mistakeText.textContent = 'Ошибка: контакты вида "Телефон", "Вк", "email", "Fb" не должны повторяться!'
    }
    else {
      deleteTable()
      const responseFirst = await fetch(`http://localhost:3000/api/clients/${redactID}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: firstName,
          surame: secondName,
          lastName: thirdName,
          contacts: contactExist
        })
      })
      const responseAggain = await fetch('http://localhost:3000/api/clients')
      data = await responseAggain.json()

      createTable(data)
      let windows = document.querySelector('.windows')
      let windowChange = document.querySelector('.window__change')
      let addContactDiv = document.querySelector('.add__contact')
      windows.classList.remove('display-visible')
      windowChange.classList.remove('display-visible')
      addContactDiv.classList.remove('display-visible')
      deleteContact()
      function deleteContact() {
        let ii = document.querySelectorAll('.forCSS').length
        let i = 0
        while (i <=ii-1) {
          let contactAdd = document.querySelector('.forCSS')
          contactAdd.parentNode.removeChild(contactAdd);
          i++
        }
      }
      ContactCounter = 0

      filter.value = ''
      dataFilter = []
      filterOn = false
      sortIdON = true
      sortId.classList.add('sort__on')
      sortName.classList.remove('sort__on')
      sortTimeCreate.classList.remove('sort__on')
      sortTimeChange.classList.remove('sort__on')

      sortId.classList.remove('sort__back')
      sortName.classList.remove('sort__back')
      sortTimeCreate.classList.remove('sort__back')
      sortTimeChange.classList.remove('sort__back')
      let mistakeText = document.querySelector('.mistake-change__text')
      mistakeText.textContent = ''
    }

  })
  // Удалить редактируемого клиента
  let changeClientDelete = document.querySelector('.change-form__delete')
  changeClientDelete.addEventListener('click', function(e) {
    e.preventDefault
    deleteTable()
    deleteClient(redactID)
    // загрузка информации для последующего удаления клиента
    async function deleteClient(id) {
      const responseF = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE'
      })
      const responseDel = await fetch('http://localhost:3000/api/clients')
      data = await responseDel.json()
      createTable(data)
    }

    let windows = document.querySelector('.windows')
    let windowDelete = document.querySelector('.window__delete')
    windows.classList.remove('display-visible')
    windowDelete.classList.remove('display-visible')
    filter.value = ''
    dataFilter = []
    filterOn = false
    sortIdON = true
    sortId.classList.add('sort__on')
    sortName.classList.remove('sort__on')
    sortTimeCreate.classList.remove('sort__on')
    sortTimeChange.classList.remove('sort__on')

    sortId.classList.remove('sort__back')
    sortName.classList.remove('sort__back')
    sortTimeCreate.classList.remove('sort__back')
    sortTimeChange.classList.remove('sort__back')
    let deletMe = document.querySelector('.add__contact')
    deletMe.innerHTML = ''
    deletMe.classList.remove('display-visible')
    ContactCounter=0
    let mistakeText = document.querySelector('.mistake-change__text')
      mistakeText.textContent = ''
  })

  // закрыть окно редактирования
  function closeChangeWindow() {
    let btnCloseChange = document.querySelector('.change__close')
    btnCloseChange.addEventListener('click', function(e){
      e.preventDefault
      let windows = document.querySelector('.windows')
      let windowCreate = document.querySelector('.window__change')
      let clientID = document.querySelector('.change__id')
      windows.classList.remove('display-visible')
      windowCreate.classList.remove('display-visible')
      clientID.textContent = ''
      let deletMe = document.querySelector('.add__contact')
      deletMe.innerHTML = ''
      deletMe.classList.remove('display-visible')
      ContactCounter=0
      let mistakeText = document.querySelector('.mistake-change__text')
      mistakeText.textContent = ''
    })
  }



  // -  - - - - - - - - - УДАЛЕНИЕ

  // показать окно удаления
  // выполнена как функция для переопределения кнопок с классом после изменения таблицы

  function openDeleteWindow() {
    let btnDeleteOpen = document.querySelectorAll('.table__delete')
    btnDeleteOpen.forEach.call(document.querySelectorAll('.table__delete'), function(el){
      el.addEventListener('click',  function(e) {

        clickOut()


        jsID.targeted = e.target.getAttribute('js__id')
        let windows = document.querySelector('.windows')
        let windowDelete = document.querySelector('.window__delete')
        windows.classList.add('display-visible')
        windowDelete.classList.add('display-visible')
      })
    })
  }

  let btnDeleteSubmit = document.querySelector('.delete__btn')
  btnDeleteSubmit.addEventListener('click', function(e) {
    e.preventDefault
    deleteTable()
    deleteClient(jsID.targeted)
    // загрузка информации для последующего удаления клиента
    async function deleteClient(id) {
      const responseF = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE'
      })
      const responseDel = await fetch('http://localhost:3000/api/clients')
      data = await responseDel.json()
      createTable(data)
    }
    let windows = document.querySelector('.windows')
    let windowDelete = document.querySelector('.window__delete')
    windows.classList.remove('display-visible')
    windowDelete.classList.remove('display-visible')
    filter.value = ''
    dataFilter = []
    filterOn = false
    sortIdON = true
    sortId.classList.add('sort__on')
    sortName.classList.remove('sort__on')
    sortTimeCreate.classList.remove('sort__on')
    sortTimeChange.classList.remove('sort__on')

    sortId.classList.remove('sort__back')
    sortName.classList.remove('sort__back')
    sortTimeCreate.classList.remove('sort__back')
    sortTimeChange.classList.remove('sort__back')
  })

  // закрыть окно удаления
  function closeDeleteWindow() {
    let btnDeleteChangeX = document.querySelector('.delete__cancel')
    btnDeleteChangeX.addEventListener('click', function(e){
      e.preventDefault
      let windows = document.querySelector('.windows')
      let windowDelete = document.querySelector('.window__delete')
      windows.classList.remove('display-visible')
      windowDelete.classList.remove('display-visible')
    })
    let btnDeleteChange = document.querySelector('.delete__close')
    btnDeleteChange.addEventListener('click', function(e){
      e.preventDefault
      let windows = document.querySelector('.windows')
      let windowDelete = document.querySelector('.window__delete')
      windows.classList.remove('display-visible')
      windowDelete.classList.remove('display-visible')
    })
  }





  // --------------------------------- ФИЛЬТРАЦИЯ
  let timeout;
  let filter = document.querySelector('.filter')
  filter.addEventListener('input', function() {
    clearTimeout(timeout)
    timeout = setTimeout(filterMaker, 300);
    sortIdON = false
    sortNameON = false
    sortCreateON = false
    sortChangeON = false
  })

  function filterMaker() {
    dataFilter = []
    let filterText = document.querySelector('.filter').value
    contrast(filterText)
    if (dataFilter.length > 0) {
      deleteTable()
      createTable(dataFilter)
      filterOn = true

      sortIdON = true
      sortId.classList.add('sort__on')
      sortName.classList.remove('sort__on')
      sortTimeCreate.classList.remove('sort__on')
      sortTimeChange.classList.remove('sort__on')

      sortId.classList.remove('sort__back')
      sortName.classList.remove('sort__back')
      sortTimeCreate.classList.remove('sort__back')
      sortTimeChange.classList.remove('sort__back')
    } else  {
      alert('0 совпадений')
    }
  }

  // функция сравнивания
  function contrast (text) {
    let i = 0
    while (i < data.length) {
      let contrastObj = data[i]
      let contrastText = contrastObj.name + contrastObj.surname + contrastObj.lastName
      text = text.toLowerCase()
      text = text.replace(/\s+/g, "")
      contrastText = contrastText.toLowerCase()
      let zz = contrastText.indexOf(text)
      if (zz >=0) {
        dataFilter.push(contrastObj)
      }
      i++
    }
  }



  // --------------------------------- СОРТИРОВКА
  function byField(key) { //сортировка от 1 к 2
    return (a, b) => a[key] > b[key] ? 1 : -1;
  }
  function byFieldBack(key) { //сортировка от 2 к 1
    return (a, b) => b[key] - a[key];
  }

  // сортировка по ID, таблица изначально отсортирована по id поэтому первый клик отсортирует в обратном порядке
  let sortId = document.getElementById('id')
  sortId.addEventListener('click', function() {
    if (sortIdON == true) {
      if (filterOn == true) {
        dataSort = dataFilter.concat().sort(byFieldBack('id'))
      } else {
        dataSort = data.concat().sort(byFieldBack('id'))
      }
      filterParamOff()
      sortId.classList.add('sort__back')
    } else {
      if (filterOn == true) {
        dataSort = dataFilter.concat().sort(byField('id'))
      } else {
        dataSort = data.concat().sort(byField('id'))
      }
      filterParamOff()
      sortIdON = true
      sortId.classList.add('sort__on')
    }
    deleteTable()
    createTable(dataSort)
  })

  // сортировка по ФИО
  let sortName = document.getElementById('fio')
  sortName.addEventListener('click', function() {
    if (sortNameON == true) {
      if (filterOn == true) {
        doSortName(dataFilter)
        dataSort = dataCopy.concat().sort(byField('fullName')).reverse()
      } else {
        doSortName(data)
        dataSort = dataCopy.concat().sort(byField('fullName')).reverse()
      }
      filterParamOff()
      sortName.classList.add('sort__back')

    } else if (sortNameON == false) {
      if (filterOn == true) {
        doSortName(dataFilter)
        dataSort = dataCopy.concat().sort(byField('fullName'))
      } else {
        doSortName(data)
        dataSort = dataCopy.concat().sort(byField('fullName'))
      }
      filterParamOff()
      sortNameON = true
      sortName.classList.add('sort__on')
    }
    deleteTable()
    createTable(dataSort)
  })
  // функция копирования фильтруемого массива для сортировки по ФИО
  function doSortName(arr) {
    dataCopy = []
    let p = 0
    while (p < arr.length) {
      let copyObj = arr[p]
      let fullNameText = copyObj.name + copyObj.surname + copyObj.lastName
      fullNameText = fullNameText.replace(/\s+/g, "")
      fullNameText = fullNameText.toLowerCase()
      copyObj.fullName = fullNameText
      p++
      dataCopy.push(copyObj)
    }
  }

  // сортировка по времени создания
  let sortTimeCreate = document.getElementById('timeCreate')
  sortTimeCreate.addEventListener('click', function() {
    if (sortCreateON == true) {
      if (filterOn == true) {
        dataSort = dataFilter.concat().sort(byField('createdAt')).reverse()
      } else {
        dataSort = data.concat().sort(byField('createdAt')).reverse()
      }
      filterParamOff()
      sortTimeCreate.classList.add('sort__back')
    } else {
      if (filterOn == true) {
        dataSort = dataFilter.concat().sort(byField('createdAt'))
      } else {
        dataSort = data.concat().sort(byField('createdAt'))
      }
      filterParamOff()
      sortCreateON = true
      sortTimeCreate.classList.add('sort__on')
    }
    deleteTable()
    createTable(dataSort)
  })

  // сортировка по времени редактирования
  let sortTimeChange = document.getElementById('timeChange')
  sortTimeChange.addEventListener('click', function() {
    if (sortChangeON == true) {
      if (filterOn == true) {
        dataSort = dataFilter.concat().sort(byField('updatedAt')).reverse()
      } else {
        dataSort = data.concat().sort(byField('updatedAt')).reverse()
      }
      filterParamOff()
      sortTimeChange.classList.add('sort__back')
    } else {
      if (filterOn == true) {
        dataSort = dataFilter.concat().sort(byField('updatedAt'))
      } else {
        dataSort = data.concat().sort(byField('updatedAt'))
      }
      filterParamOff()
      sortChangeON = true
      sortTimeChange.classList.add('sort__on')
    }
    deleteTable()
    createTable(dataSort)
  })


  // -  - - - - - - - - - ОБЩЕ-ВЫЗЫВАЕМЫЕ ФУНКЦИИ

  // Функция удаления таблицы
  function deleteTable() {
    let ii = document.querySelectorAll('.table__row--js').length
    let i = 0
    while (i <=ii-1) {
      let row = document.querySelector('.table__row--js')
      row.parentNode.removeChild(row);
      i++
    }
  }

  // создание таблицы
  function createTable(arr) {
    let i = 0
    while (i <= arr.length-1) {
      let object = arr[i]
      let table = document.querySelector('tbody')
      let row = document.createElement('tr')
      row.classList.add('table__row', 'table__row--js')
      // добавление  id
      let tdId = document.createElement('td')
      tdId.classList.add('table__id')
      tdId.appendChild (document.createTextNode(object.id))
      // добавление  ФИО
      let tdName = document.createElement('td')
      tdName.classList.add('table__fio')
      let name = object.name + ' ' + object.surname + ' ' + object.lastName
      tdName.appendChild (document.createTextNode(name))
      // добавление  время создания
      let tdTimeCreate = document.createElement('td')
      tdTimeCreate.classList.add('table__timeCreate')
      let spanCreateDate = document.createElement('span')
      spanCreateDate.classList.add('span__date')
      spanCreateDate.appendChild (document.createTextNode(object.createdAt.split('T')[0].split('-').reverse().join('.')))
      let spanCreateTime = document.createElement('span')
      spanCreateTime.classList.add('span__time')
      spanCreateTime.appendChild (document.createTextNode(object.createdAt.split('T')[1].split(':')[0] + ":" +  object.createdAt.split('T')[1].split(':')[1]))
      tdTimeCreate.appendChild(spanCreateDate)
      tdTimeCreate.appendChild(spanCreateTime)
      // добавление  время изменения
      let tdTimeChange = document.createElement('td')
      tdTimeChange.classList.add('table__timeChange')
      let spanChangeDate = document.createElement('span')
      spanChangeDate.classList.add('span__date')
      spanChangeDate.appendChild (document.createTextNode(object.updatedAt.split('T')[0].split('-').reverse().join('.')))
      let spanChangeTime = document.createElement('span')
      spanChangeTime.classList.add('span__time')
      spanChangeTime.appendChild (document.createTextNode(object.updatedAt.split('T')[1].split(':')[0] + ":" +  object.updatedAt.split('T')[1].split(':')[1]))
      tdTimeChange.appendChild(spanChangeDate)
      tdTimeChange.appendChild(spanChangeTime)
      // добавление  контактов
      let tdContact = document.createElement('td')
      tdContact.classList.add('table__contact')
      let contactArr = object.contacts
      let x = 0
        while (x < contactArr.length) {
          let contactArrObj = contactArr[x]
          let values = Object.values(contactArrObj)
          if (values[0].includes('vk') == true) {
            let pointer = values[1]
            let span = document.createElement('span')
            span.classList.add('span__vk', 'table__span')
            span.setAttribute('data-tippy-content', pointer)
            let spanIMG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3000 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/></g></svg>'
            span.innerHTML = spanIMG
            tdContact.appendChild(span)
          } else if (values[0].includes('fb') == true) {
            let pointer = values[1]
            let span = document.createElement('span')
            span.classList.add('span__fb', 'table__span')
            span.setAttribute('data-tippy-content', pointer)
            let spanIMG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/></g></svg>'
            span.innerHTML = spanIMG
            tdContact.appendChild(span)
          } else if (values[0].includes('tel') == true) {
            let pointer = values[1]
            let span = document.createElement('span')
            span.classList.add('span__tel', 'table__span')
            span.setAttribute('data-tippy-content', pointer)
            let spanIMG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><circle cx="8" cy="8" r="8" fill="#9873FF"/><path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/></g></svg>'
            span.innerHTML = spanIMG
            tdContact.appendChild(span)
          } else if (values[0].includes('mail') == true) {
            let pointer = values[1]
            let span = document.createElement('span')
            span.classList.add('span__mail', 'table__span')
            span.setAttribute('data-tippy-content', pointer)
            let spanIMG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/></svg>'
            span.innerHTML = spanIMG
            tdContact.appendChild(span)
          } else if (values[0].includes('other') == true) {
            let pointer = values[1]
            let span = document.createElement('span')
            span.classList.add('span__other', 'table__span')
            span.setAttribute('data-tippy-content', pointer)
            let spanIMG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/></svg>'
            span.innerHTML = spanIMG
            tdContact.appendChild(span)
          }
        x++
      }
      // добавление  действий
      let tdAction = document.createElement('td')
      tdAction.classList.add('table__actions')
      let btnChange = document.createElement('btn')
      let btnDelete = document.createElement('btn')
      btnChange.appendChild (document.createTextNode('Изменить'))
      btnDelete.appendChild (document.createTextNode('Удалить'))
      btnChange.classList.add('table__change')
      btnDelete.classList.add('table__delete')
      btnChange.setAttribute('js__id', object.id)
      btnDelete.setAttribute('js__id', object.id)
      tdAction.appendChild(btnChange)
      tdAction.appendChild(btnDelete)
      // добавление в дум-дерево
      row.appendChild(tdId)
      row.appendChild(tdName)
      row.appendChild(tdTimeCreate)
      row.appendChild(tdTimeChange)
      row.appendChild(tdContact)
      row.appendChild(tdAction)
      table.appendChild(row)
      i++
    }
    openChangeWindow()
    closeChangeWindow()
    openDeleteWindow()
    closeDeleteWindow()
    tippy('.table__span')
  }



  function deleteContact() {//удаление контакта по нажатию
    let contactArrBTN = []
    contactArrBTN = document.querySelectorAll('.thisContact-remove')
    let contactArrDIV = []
    contactArrDIV = document.querySelectorAll('.forCSS')
    contactArrBTN.forEach((button) => {
      button.addEventListener('click', function(e){

        e.preventDefault()
        let deleteID = button.getAttribute('remove__id')
        let deleteEl = contactArrDIV[deleteID]
        deleteEl.remove()
        customSelect()
        contactChecker = false

      })
    })
  }

  function customSelect() { //применяет ко всем селектам кастомизацию
    let choicesArr = document.querySelectorAll('.contact__type')
    choicesArr.forEach(function(choice) {
      let choces = new Choices(choice, {
        searchEnabled: false,
          shouldSort: false,
          itemSelectText: "",
      })
    })
  }





  function clickOut() {//функция закрытия окон при клике вне их, сброс параметров
    document.addEventListener( 'mouseup', function(event) {
      const windowAddDIV = document.querySelector('.window__add')
      const windowDeleteDIV = document.querySelector('.window__delete')
      const windowChangeDIV = document.querySelector('.window__change')

      if (!windowAddDIV.contains(event.target) && !windowDeleteDIV.contains(event.target) && !windowChangeDIV.contains(event.target)) {
        let windows = document.querySelector('.windows')
        let windowAdd = document.querySelector('.window__add')
        windows.classList.remove('display-visible')
        windowAdd.classList.remove('display-visible')
        let deletMe2 = document.querySelector('.add__contact2')
        deletMe2.innerHTML = ''
        deletMe2.classList.remove('display-visible')
        ContactCounter=0
        let addFirstName = document.getElementById('add__firstName').value=''
        let addSecondName = document.getElementById('add__secondName').value=''
        let addThirdName = document.getElementById('add__thirdName').value=''

        let windowDelete = document.querySelector('.window__delete')
        windows.classList.remove('display-visible')
        windowDelete.classList.remove('display-visible')

        let windowCreate = document.querySelector('.window__change')
        let clientID = document.querySelector('.change__id')
        windows.classList.remove('display-visible')
        windowCreate.classList.remove('display-visible')
        clientID.textContent = ''
        let deletMe = document.querySelector('.add__contact')
        deletMe.innerHTML = ''
        deletMe.classList.remove('display-visible')
        let mistakeText = document.querySelector('.mistake-change__text')
        mistakeText.textContent = ''
        let mistakeText2 = document.querySelector('.mistake-add__text')
        mistakeText2.textContent = ''
      }
    })
  }



  // функция провепрки количества контактов
  function doCheckContactLength() {
    let checkContactLength = document.querySelectorAll('.is-selected')
    if (checkContactLength.length >= 10) {
      let block = document.querySelector('.mistake__add')
      block.classList.add('display-visible')
      let mistakeText = document.querySelector('.mistake-add__text')
      mistakeText.textContent = 'Достигнуто максимальное количество контактов для клиента'

      let block2 = document.querySelector('.mistake__change')
      block2.classList.add('display-visible')
      let mistakeText2 = document.querySelector('.mistake-change__text')
      mistakeText2.textContent = 'Достигнуто максимальное количество контактов для клиента'
      contactChecker = true
    }
  }
  // функция сброса фильтров
  function filterParamOff(){
    sortIdON = false
    sortNameON = false
    sortCreateON = false
    sortChangeON = false

    sortId.classList.remove('sort__on')
    sortName.classList.remove('sort__on')
    sortTimeCreate.classList.remove('sort__on')
    sortTimeChange.classList.remove('sort__on')

    sortId.classList.remove('sort__back')
    sortName.classList.remove('sort__back')
    sortTimeCreate.classList.remove('sort__back')
    sortTimeChange.classList.remove('sort__back')
  }

  // проверка контактов на одинаковые типы (кроме "другие")
  function hasDuplicates(arr) {
    while(arr.includes('other') == true) {
      let myIndex = arr.indexOf('other');
      if (myIndex !== -1) {
        arr.splice(myIndex, 1);
      }
    }
    return new Set(arr).size !== arr.length;
  }
})



