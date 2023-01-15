( ()=>{


  async function loadClientsData() {
    try {
      const response = await fetch('http://localhost:3000/api/clients');
      const data = await response.json();
      return data;
    } catch (e) {
      if (e.name == 'TypeError') {
        console.log(e.name)
        const tableBody = document.querySelector('.table__body');
        tableBody.classList.remove('table__body--load')
        tableBody.textContent='Сервер не запущен. Для запуска из директории проекта введите: node crm-backend/index.js'

    }
      }
  }

  async function changeClientData(id, client) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
              name: client.name,
              surname: client.surname,
              lastName: client.lastName,
              contacts: client.contacts
            })
    });
  }

  function createTableRow (container) {
    const clientsRow = document.createElement('ul');
    clientsRow.classList.add('table__item', 'flex', 'list-reset');
    const clientID = document.createElement('li');
    clientID.classList.add('table__item-column', 'table__item--id', 'table__text-item', 'table__text-item--id');
    const clientFullName = document.createElement('li');
    clientFullName.classList.add('table__item-column', 'table__item--fullname', 'table__text-item');
    const clientTimeCreate = document.createElement('li');
    clientTimeCreate.classList.add('table__item-column', 'table__item--time-create', 'table__text-item', 'flex');
    const dateCreate = document.createElement('time');
    dateCreate.classList.add('table__data');
    const clockCreate = document.createElement('time');
    clockCreate.classList.add('table__time');
    const clientTimeChange = document.createElement('li');
    clientTimeChange.classList.add('table__item-column', 'table__item--time-change', 'table__text-item');
    const dateChange = document.createElement('time');
    dateChange.classList.add('table__data');
    const clockChange = document.createElement('time');
    clockChange.classList.add('table__time');
    const clientContacts = document.createElement('li');
    clientContacts.classList.add('table__item-column', 'table__item--contacts', 'table__text-item');
    const clientAction = document.createElement('li');
    clientAction.classList.add('table__item-column', 'table__text-item', 'table__btns', 'flex');
    const clientBtnChange = document.createElement('button');
    clientBtnChange.classList.add('table__btn-change', 'btn-reset');
    clientBtnChange.innerHTML = `Изменить`;
    const clientBtnDelete = document.createElement('button');
    clientBtnDelete.classList.add('table__btn-delete', 'btn-reset');
    clientBtnDelete.innerHTML = `Удалить`;
    clientsRow.append(clientID);
    clientsRow.append(clientFullName);
    clientsRow.append(clientTimeCreate);
    clientTimeCreate.append(dateCreate);
    clientTimeCreate.append(clockCreate);
    clientsRow.append(clientTimeChange);
    clientTimeChange.append(dateChange);
    clientTimeChange.append(clockChange);
    clientsRow.append(clientContacts);
    clientsRow.append(clientAction);
    clientAction.append(clientBtnChange);
    clientAction.append(clientBtnDelete);
    container.append(clientsRow);

    clientBtnDelete.addEventListener('click', ()=>{
      const windowPopUp = document.querySelector('.window');
      const formRemoveUser = document.querySelector('.remove');
      const RemoveBtn =document.querySelector('.remove__submit');
      windowPopUp.classList.add('visiable');
      formRemoveUser.classList.remove('hidden');
      RemoveBtn.addEventListener('click', ()=>{
        deleteUserItem(clientID.textContent);
        const windowPopUp = document.querySelector('.window');
        const formRemoveUser = document.querySelector('.remove');
        windowPopUp.classList.remove('visiable');
        formRemoveUser.classList.add('hidden');
      })
    })

    clientBtnChange.addEventListener('click', async ()=>{
      const windowPopUp = document.querySelector('.window');
      const formCreateUser = document.querySelector('.create');
      windowPopUp.classList.add('visiable');
      formCreateUser.classList.add('visiable');
      const formHeader = document.querySelector('.window__create-header');
      formHeader.textContent = 'Изменить данные';
      const newUserSurname = document.querySelector('.user-surname');
      const newUserName = document.querySelector('.user-name');
      const newUserMiddleName = document.querySelector('.user-middle-name');
      const clientFormId = document.querySelector('.window__id');
      const formLabel = document.querySelectorAll('.window__label-value');
      formLabel.forEach((el)=>el.classList.add('visiable'));
      const clientsList = await loadClientsData();
      const currentUser = clientsList.filter((user)=>user.id === clientID.textContent);
      const [formClientData] = currentUser;
      clientFormId.textContent = 'ID: '+formClientData.id;
      newUserSurname.value=formClientData.surname;
      newUserName.value = formClientData.name;
      newUserMiddleName.value = formClientData.lastName;

      const addContactContainer = document.querySelector('.window__contacts-wrapper');
      addContactContainer.classList.add('window__contacts-wrapper--not-empty');
      const createBtn = document.querySelector('.create__submit');
      createBtn.classList.add('hidden');
      const changeBtn = document.querySelector('.change__submit');
      changeBtn.classList.remove('hidden');
      changeBtn.addEventListener('click', ()=>{
        const changedClientData = getFormValue()
        const currentClientData = {
          name: formClientData.name,
          surname: formClientData.surname,
          lastName: formClientData.lastName,
          contacts: formClientData.contacts,
        }
        deepEqual(changedClientData, currentClientData)?0:changeClientData(clientID.textContent, changedClientData);
      })

      formClientData.contacts.forEach((contact)=>{
        const {contactSelect, contactInput} = createUserContact(addContactContainer);
        console.log(contactSelect);
        contactSelect.value = contact.type;
        createSelectCustom(contactSelect);
        removeTelMask(contactInput);
        contactInput.value = contact.value;
        if (contactSelect.value === 'Телефон' || contactSelect.value === 'Доп. телефон') {
          addTelMask(contactInput)
        }
      })

      console.log(formClientData.contacts)
      if (formClientData.contacts.length === 10) {
        btnAddContact.classList.add('hidden');
      } else {
        btnAddContact.classList.remove('hidden');
      }
    })

    return {
      clientID,
      clientFullName,
      dateCreate,
      clockCreate,
      dateChange,
      clockChange,
      clientContacts,
      clientBtnChange,
      clientBtnDelete
    }
  }

  function deepEqual (obj1, obj2){
    return JSON.stringify(obj1)===JSON.stringify(obj2);
 }

  function getFormValue () {
    const name = document.querySelector('.user-name').value;
    const surname = document.querySelector('.user-surname').value;
    const lastName = document.querySelector('.user-middle-name').value;
    const userContactsType = document.querySelectorAll('.select');
    const userContactsValue = document.querySelectorAll('.window__contact-input');
    const contacts = getContacts(userContactsType, userContactsValue);
    return {
      name,
      surname,
      lastName,
      contacts,
    }
  }

  function createClientContacts(clientId, dataContacts, container) {
    const vkIcon = `<svg class="table__contacts-item" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97312 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92644 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70111C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
      </svg>`;
      const fIcon = `<svg class="table__contacts-item" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
      </svg>`;
      const telIcon = `<svg class="table__contacts-item" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
      <circle cx="8" cy="8" r="8" fill="#9873FF"/>
      <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
      </g>
      </svg>`;
      const mailIcon = `<svg class="table__contacts-item" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
      </svg>`;
      const differentIcon = `<svg class="table__contacts-item" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="8" fill="#9873FF"/>
      </svg>`;

      let i = 0
      dataContacts.forEach( ({type, value}) => {
        i +=1
        const contactLink = document.createElement('a')
        contactLink.setAttribute('href', '#')
        contactLink.classList.add(`table__tooltip`, `table__tooltip--${clientId}-${i}`)
        container.clientContacts.append(contactLink)
        switch (type) {
          case 'Телефон':
          case 'Доп. телефон':
            contactLink.innerHTML = telIcon;
            break;
          case 'Вконтакте':
            contactLink.innerHTML = vkIcon;
            break;
          case 'Фейсбук':
            contactLink.innerHTML = fIcon;
            break;
          case 'Почта':
            contactLink.innerHTML = mailIcon;
            break;
        }

        tippy(`.table__tooltip--${clientId}-${i}`, {
          maxWidth: 264,
          content: `${type}: ${value}`,
        });
      })
  }


  function createClientElements(data) {
    const tableBody = document.querySelector('.table__body');

    data.forEach(element => {
      const tableRow = createTableRow(tableBody);
      tableRow.clientID.textContent = `${element.id}`;
      const fullName = `${element.surname} ${element.name} ${element.lastName}`;
      tableRow.clientFullName.textContent = fullName.trim();
      const timeCreate = new Date(element.createdAt);
      const monthCreate = timeCreate.getMonth()+1 < 10 ? '0'+timeCreate.getMonth()+1:timeCreate.getMonth()+1;
      const dayCreate = timeCreate.getDate()<10?'0'+timeCreate.getDate():timeCreate.getDate();
      tableRow.dateCreate.textContent = `${dayCreate}.${monthCreate}.${timeCreate.getFullYear()}`;
      const hoursCreate = timeCreate.getHours()<10?'0'+timeCreate.getHours():timeCreate.getHours();
      const minCreate = timeCreate.getMinutes()<10?'0'+timeCreate.getMinutes():timeCreate.getMinutes();
      tableRow.clockCreate.textContent = `${hoursCreate}:${minCreate}`;
      const timeChange = new Date(element.updatedAt);
      const monthChange = timeChange.getMonth()+1 < 10 ? '0'+timeChange.getMonth()+1:timeChange.getMonth()+1;
      const dayChange = timeChange.getDate()<10?'0'+timeChange.getDate():timeChange.getDate();
      tableRow.dateChange.textContent = `${dayChange}.${monthChange}.${timeChange.getFullYear()}`;
      const hoursChange = timeChange.getHours()<10?'0'+timeChange.getHours():timeChange.getHours();
      const minChange = timeChange.getMinutes()<10?'0'+timeChange.getMinutes():timeChange.getMinutes();
      tableRow.clockChange.textContent = `${hoursChange}:${minChange}`;

      const {id, contacts} = element;
      createClientContacts(id, contacts, tableRow);

    });

    tableBody.classList.remove('table__body--load');
    if (data.length === 0) {
      tableBody.textContent='Список клиетов пуст'
    }
  }

  async function createClientsTable () {
    clientsList = await loadClientsData();
    createClientElements(clientsList);
  }

  const formCreateUser = document.querySelector('.create');
    formCreateUser.addEventListener('submit', (e)=>{
      e.preventDefault();
    })

    const formRemoveUser = document.querySelector('.remove');
    formRemoveUser.addEventListener('submit', (e)=>{
      e.preventDefault();
    })

  const btnAddUser = document.querySelector('.clients__btn-add');

  btnAddUser.addEventListener('click', ()=>{
    const windowPopUp = document.querySelector('.window');
    const formCreateUser = document.querySelector('.create');
    const formCreaateHeader = document.querySelector('.window__create-header');
    formCreaateHeader.textContent = 'Новый клиент';
    const formCreateId = document.querySelector('.window__id');
    formCreateId.textContent = '';
    const formCreateLabel = document.querySelectorAll('.window__label-value');
    formCreateLabel.forEach((el)=>el.classList.remove('visiable'));
    windowPopUp.classList.add('visiable');
    formCreateUser.classList.add('visiable');
  })

  const btnWindowClose = document.querySelector('.create__close');
  btnWindowClose.addEventListener('click', ()=>{
    clearUserForm();
    const windowPopUp = document.querySelector('.window');
    const formCreateUser = document.querySelector('.create');
    windowPopUp.classList.remove('visiable');
    formCreateUser.classList.remove('visiable');
  })

  const btnWindowCancel = document.querySelector('.create__cancel');
  btnWindowCancel.addEventListener('click', ()=>{
    clearUserForm()
    const windowPopUp = document.querySelector('.window');
    const formCreateUser = document.querySelector('.create');
    windowPopUp.classList.remove('visiable');
    formCreateUser.classList.remove('visiable');
  })



  function getContacts(type, value) {
    let contacts = []
    for (let i=0; i<type.length; i++) {
      const contact = {
        type: type[i].value,
        value: value[i].value
      }
      contacts.push(contact)
     }
     return contacts
  }

  function contactValid (contacts) {
    let valid = true
    contacts.forEach(({type, value})=>{
      if (type  === 'Почта') {
        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        if (!EMAIL_REGEXP.test(value)) {
          valid = false
        }
      }
    })
    return valid
  }

  const formAddSubmit = document.querySelector('.create__submit');
  formAddSubmit.addEventListener('click', async ()=>{
    const newUserSurname = document.querySelector('.user-surname');
    const newUserName = document.querySelector('.user-name');
    const newUserMiddleName = document.querySelector('.user-middle-name');
    const userContactsType = document.querySelectorAll('.select');
    const userContactsValue = document.querySelectorAll('.window__contact-input');
    const newUserContacts = getContacts(userContactsType, userContactsValue);
    const isValid = contactValid(newUserContacts)

    if (!newUserSurname.value.trim() && !newUserName.value.trim()) {
      return
    };

    if (isValid) {
      const response = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newUserName.value.trim(),
        surname: newUserSurname.value.trim(),
        lastName: newUserMiddleName.value.trim(),
        contacts: newUserContacts
      })
    });
    clearUserForm();
    clearClientTable();
    createClientsTable();
    const windowPopUp = document.querySelector('.window');
    const formCreateUser = document.querySelector('.create');
    windowPopUp.classList.remove('visiable');
    formCreateUser.classList.remove('visiable');
    } else {
      const warning = document.querySelector('.window__warning');
      warning.textContent = 'Данные введены не верно'
    }


  })

  const btnAddContact = document.querySelector('.window__btn-add');
  btnAddContact.addEventListener('click', ()=>{
    const addContactContainer = document.querySelector('.window__contacts-wrapper');
    addContactContainer.classList.add('window__contacts-wrapper--not-empty');
    const contactUserCount = document.querySelectorAll('.window__new-contact');
    const {contactSelect} = createUserContact(addContactContainer);
    createSelectCustom(contactSelect);
    if (contactUserCount.length === 9) {
      btnAddContact.classList.add('hidden');
    }
  })

  function createUserContact (container) {
    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('window__new-contact')
    const contactSelect = document.createElement('select');
    contactSelect.classList.add('select');
    const contactOptionTel = document.createElement('option');
    contactOptionTel.setAttribute('value', 'Телефон');
    contactOptionTel.textContent='Телефон';
    const contactOptionTelExtra = document.createElement('option');
    contactOptionTelExtra.setAttribute('value', 'Доп. телефон');
    contactOptionTelExtra.textContent='Доп. телефон';
    const contactOptionMail = document.createElement('option');
    contactOptionMail.setAttribute('value', 'Почта');
    contactOptionMail.textContent='Email';
    const contactOptionVk = document.createElement('option');
    contactOptionVk.setAttribute('value', 'Вконтакте');
    contactOptionVk.textContent='Vk';
    const contactOptionFb = document.createElement('option');
    contactOptionFb.setAttribute('value', 'Фейсбук');
    contactOptionFb.textContent='Facebook';
    const contactInput = document.createElement('input');
    contactInput.placeholder='Введите данные контакта';
    contactInput.classList.add('window__contact-input');
    const contactBtnReset = document.createElement('button');
    contactBtnReset.classList.add('window__contact-btn-reset', 'btn-reset', 'hidden');
    contactWrapper.append(contactSelect);
    contactSelect.append(contactOptionTel);
    contactSelect.append(contactOptionTelExtra);
    contactSelect.append(contactOptionMail);
    contactSelect.append(contactOptionVk);
    contactSelect.append(contactOptionFb);
    contactWrapper.append(contactInput);
    contactWrapper.append(contactBtnReset);
    container.append(contactWrapper);

    if (contactSelect.value === 'Телефон') {
      addTelMask(contactInput);
    }

    contactSelect.addEventListener('change', ()=>{
      removeTelMask(contactInput);
      if (contactSelect.value === 'Телефон' || contactSelect.value === 'Доп. телефон') {
        addTelMask(contactInput);
      }
    })

    contactInput.addEventListener('input', ()=>{
      if (contactInput.value) {
        contactBtnReset.classList.remove('hidden');
      } else {
        contactBtnReset.classList.add('hidden');
      }
    })

    contactBtnReset.addEventListener('click', ()=>{
      contactWrapper.remove();
      btnAddContact.classList.remove('hidden');
    })

    return {
      contactSelect,
      contactInput
    }
  }

  function addTelMask (selector) {
    var im = new Inputmask("+7 (999)-999-99-99");
    im.mask(selector);
  }

  function removeTelMask (selector) {
    if (selector.inputmask) {
      selector.inputmask.remove();
    }
  }

  function createSelectCustom (select) {
      const choices = new Choices(select, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        position: 'auto',
        allowHTML: true,
     });
  }

  function clearUserForm () {
    const newUserSurname = document.querySelector('.user-surname');
    const newUserName = document.querySelector('.user-name');
    const newUserMiddleName = document.querySelector('.user-middle-name');
    newUserName.value='';
    newUserSurname.value='';
    newUserMiddleName.value='';
    const contactUserCount = document.querySelectorAll('.window__new-contact');
    contactUserCount.forEach((el)=>el.remove());
    const warning = document.querySelector('.window__warning');
    warning.textContent = ''
  }

  const btnRemoveClose = document.querySelector('.remove__close');
  btnRemoveClose.addEventListener('click', ()=>{
    const windowPopUp = document.querySelector('.window');
    const formRemoveUser = document.querySelector('.remove');
    windowPopUp.classList.remove('visiable');
    formRemoveUser.classList.add('hidden');
  })

  const btnRemoveCancel = document.querySelector('.remove__cancel');
  btnRemoveCancel.addEventListener('click', ()=>{
    const windowPopUp = document.querySelector('.window');
    const formRemoveUser = document.querySelector('.remove');
    windowPopUp.classList.remove('visiable');
    formRemoveUser.classList.add('hidden');
  })

  const btnRemoveUser = document.querySelector('.remove__submit');
  btnRemoveUser.addEventListener('click', ()=>{
  })
  async function deleteUserItem(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE',
    });
    clearClientTable();
    createClientsTable();
  }



function clearClientTable() {
   const containerChildren = document.querySelectorAll('.table__item');
   containerChildren.forEach((el)=>el.remove());
  }

const btnSortById = document.querySelector('.table__btn--id');
const btnSortByName = document.querySelector('.table__btn--fullname');
const btnSortByTimeCreate = document.querySelector('.table__btn--time-create');
const btnSortByTimeChange = document.querySelector('.table__btn--time-change');

let sortId = false;
let sortName = false;
let sortTimeCreate = false;
let sortTimeChange = false;

btnSortById.addEventListener('click', async ()=>{
  clearClientTable();
  const clients = await loadClientsData();
  styleBtnSort(btnSortById, sortId);
  if (!sortId) {
    clients.sort((a,b)=>a.id<b.id?1:-1);
    sortId = true;
  } else {
    clients.sort((a,b)=>a.id>b.id?1:-1);
    sortId = false;
  }
  createClientElements(clients);
})

btnSortByName.addEventListener('click', async ()=>{
  clearClientTable();
  const clients = await loadClientsData();
  styleBtnSort(btnSortByName, sortName);
  if (!sortName) {
    clients.sort((a,b)=>{
      const fullnameA = a.name+a.surname+a.lastName;
      const fullnameB = b.name+b.surname+b.lastName;
      return fullnameA<fullnameB?1:-1
    })
    sortName = true
  } else {
    clients.sort((a,b)=>{
      const fullnameA = a.name+a.surname+a.lastName;
      const fullnameB = b.name+b.surname+b.lastName;
      return fullnameA>fullnameB?1:-1
    })
    sortName = false;
  }
  createClientElements(clients);
})

btnSortByTimeCreate.addEventListener('click', async ()=>{
  clearClientTable();
  const clients = await loadClientsData();
  styleBtnSort(btnSortByTimeCreate, sortTimeCreate);
  if (!sortTimeCreate) {
    clients.sort((a,b)=>{
      const timeCreateA = Date.parse(a.createdAt);
      const timeCreateB = Date.parse(b.createdAt);
      return timeCreateA<timeCreateB?1:-1
    })
    sortTimeCreate = true;
  } else {
    clients.sort((a,b)=>{
      const timeCreateA = Date.parse(a.createdAt);
      const timeCreateB = Date.parse(b.createdAt);
      return timeCreateA>timeCreateB?1:-1
    })
    sortTimeCreate = false;
  }
  createClientElements(clients);
})

function styleBtnSort (btn, sort) {
  const activeBtn = document.querySelector('.table__btn-active');
  if (activeBtn) {
    activeBtn.classList.remove('table__btn-active');
  }
  btn.classList.add('table__btn-active');
  const BtnIcon = btn.querySelector('.table__btn-icon');
  if (!sort) {
    BtnIcon.classList.add('table__btn-icon--active');
  } else {
    BtnIcon.classList.remove('table__btn-icon--active');
  }
}


btnSortByTimeChange.addEventListener('click', async ()=>{
  clearClientTable();
  const clients = await loadClientsData();
  styleBtnSort(btnSortByTimeChange, sortTimeChange);
  if (!sortTimeChange) {
    clients.sort((a,b)=>{
      const timeUpdateA = Date.parse(a.updatedAt);
      const timeUpdateB = Date.parse(b.updatedAt);
      return timeUpdateA<timeUpdateB?1:-1
    })
    sortTimeChange = true;
  } else {
    clients.sort((a,b)=>{
      const timeUpdateA = Date.parse(a.updatedAt);
      const timeUpdateB = Date.parse(b.updatedAt);
      return timeUpdateA>timeUpdateB?1:-1;
    })
    sortTimeChange = false;;
  }
  createClientElements(clients);
})

const search = document.querySelector('.header__search');
let searchRequest;
let timeOut;

search.addEventListener('input', async ()=>{
  clearTimeout(timeOut)
  searchRequest = search.value.trim()
  async function findClient (searchRequest) {
    const clients = await loadClientsData();
    return clients.filter((client)=>
      (client.surname + client.name+client.lastName).toLowerCase().includes(searchRequest.toLowerCase())
    )
  }
   timeOut = setTimeout(async () => {
    const result = await findClient(searchRequest);
    clearClientTable();
    if (result) {
    createClientElements(result);
    }
  }, 300)
})

window.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.table__body');
  btnSortById.click()
});

}) ()
