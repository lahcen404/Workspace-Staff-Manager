
const ZONE_CAPACITY = {
    'conference': 6,
    'staff-room': 6,
    'reception': 2,
    'archive': 2,
    'security': 2,
    'server': 2
};

const ACCESS_RULES = {
    'reception': ['receptionist', 'manager', 'cleaning'],
    'server': ['it-tech', 'manager', 'cleaning'],
    'security': ['security', 'manager', 'cleaning'],
    'archive': ['manager', 'receptionist', 'it-tech', 'security', 'other'], 
    'conference': ['receptionist', 'it-tech', 'manager', 'security', 'cleaning', 'other'], 
    'staff-room': ['receptionist', 'it-tech', 'manager', 'security', 'cleaning', 'other'], 
};


const addModal = document.getElementById("add-employee-modal");
const addNewWorker = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");


const profileModal = document.getElementById("profile-modal");
const closeProfileModal = document.getElementById("close-profile-btn");

const addExperienceBtn = document.getElementById("add-experience-btn");
const experiencesContainer = document.getElementById("experiences-container");

const addEmployeeZone = document.querySelectorAll(".add-employee-zone-btn");
const assignableStaffList = document.getElementById('assignable-staff-list');
const closeStaffListBtn = document.getElementById('close-staff-list-btn');

const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const phoneInput = document.getElementById("phone-input");
const photoInput = document.getElementById("photo-url-input");
const photoPreview = document.getElementById("photo-preview");

const unassignedStaffList = document.getElementById("unassigned-staff-list");
const unassignedStaffModal = document.getElementById('unassigned-staff-modal');


const employeeForm = document.getElementById("employee-form");

// regex validaations
const NAME_REGEX = /^[A-Za-z\s\-']+$/;
const EMAIL_REGEX = /^[\w\.\-]+@[\w\.\-]+\.\w{2,4}$/;
const PHONE_REGEX = /^[0-9\s\-+]{1,12}$/;

// Employess data

let employees = [];
let nextEmployeId = 1;

// localStorage
function saveEmployees() {
  try {
    const data = JSON.stringify({ employees, nextEmployeId });
    localStorage.setItem("EmployeesData", data);
  } catch (error) {
    console.error("error in save daaata", error);
  }
}

function getEmployees() {
  try {
    const data = localStorage.getItem("EmployeesData");
    if (data) {
      const parsingData = JSON.parse(data);
      employees = parsingData.employees || [];
      nextEmployeId = parsingData.nextEmployeId || 1;
    }
  } catch (error) {
    console.error("error in getting data", data);
  }
}

addNewWorker.addEventListener("click", () => {
  addModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  addModal.classList.add("hidden");
});




// dynamic Experiences

function createExperienceGroup() {
  const div = document.createElement("div");

  div.className = "experience-group p-3 border rounded-lg bg-gray-50";
  div.innerHTML = `
              <div class="flex justify-end mb-2">
            <button type="button" class="remove-experience-btn text-red-500 hover:text-red-700 text-lg" title="Remove Experience">
                <i class="fas fa-minus-circle"></i>
            </button>
        </div>
        <label for="experience" class="block text-sm font-medium text-gray-700">Title / Company</label>
        <input id="experience" type="text" name="experience_title[]"  placeholder="ur experience heere ..." class="w-full border border-gray-300 rounded-md shadow-sm p-2">
        <label for="experience-start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
        <input id="experience-start-date" type="date" name="experience_start-date[]" class="w-full border border-gray-300 rounded-md shadow-sm p-2">
        <label for="experience-end-date" class="block text-sm font-medium text-gray-700">End Date</label>
        <input id="experience-end-date" type="date" name="experience_end-date[]" class="w-full border border-gray-300 rounded-md shadow-sm p-2">
    
    `;
  div.querySelector(".remove-experience-btn").addEventListener("click", () => {
    if (experiencesContainer.querySelectorAll(".experience-group").length > 1) {
      div.remove();
    } else {
      alert("pleasse at least add one experience !!!");
    }
  });

  return div;
}

addExperienceBtn.addEventListener("click", () => {
  experiencesContainer.appendChild(createExperienceGroup());
});

// Validatioon

function validationForm() {
  let isValid = true;

  document.querySelectorAll(".error").forEach((er) => {
    er.classList.add("hidden");
  });

  if (!NAME_REGEX.test(nameInput.value)) {
    document.getElementById("name-error").classList.remove("hidden");
    isValid = false;
  }

  if (!EMAIL_REGEX.test(emailInput.value)) {
    document.getElementById("email-error").classList.remove("hidden");
    isValid = false;
  }

  if (!PHONE_REGEX.test(phoneInput.value)) {
    document.getElementById("phone-error").classList.remove("hidden");
    isValid = false;
  }

  // validatiion Experience Dates

const startDate = document.querySelectorAll('input[name="experience_start-date[]"]')
const endDate = document.querySelectorAll('input[name="experience_end-date[]"]')

for(let i=0; i<startDate.length;i++){

    const start = startDate[i].value
    const end = endDate[i].value

    console.log(start)
    console.log(end)


    if(start && end){
        if (new Date(start) > new Date(end)){
            alert("start date can't be afteer end date !!!")
            return false ; // stoop form
        }
    }
}

  return isValid;
}



// Empoyee Form Submit


employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validationForm()) {
    alert("Pleaaase correct validaaton inpuuts (Name or Email or Phone )");
    return;
  }

  const data = new FormData(employeeForm);

  const newEmployee = {
    name: data.get("name"),
    role: data.get("role"),
    photoUrl: data.get("photoUrl") || "./imgs/icons8-user-100.png",
    email: data.get("email"),
    phone: data.get("phone"),
    experienceTitles: data.getAll("experience_title[]"),
    experienceStartDates: data.getAll("experience_start-date[]"),
    experienceEndDates: data.getAll("experience_end-date[]"),
  };

  employees.push({
    id: nextEmployeId++,
    ...newEmployee,
    location: "Unassigned",
  });
  displayUnassignedStaff();

  saveEmployees();
  console.log("employe added success");

  employeeForm.reset();
  addModal.classList.add("hidden");
  experiencesContainer.innerHTML = "";
  experiencesContainer.appendChild(createExperienceGroup());
});

// preview picture
photoInput.addEventListener("input", (e) => {
  const url = e.target.value;
  console.log(url);

  photoPreview.innerHTML = url
    ? `<img src="${url}"  class="w-full h-full object-cover">`
    : `<img src="./imgs/icons8-user-100.png"  class="w-full h-full object-cover">`;
});

//displaying unassigned Staff
function displayUnassignedStaff() {
  unassignedStaffList.innerHTML = "";
  const unassignedEmpls = employees.filter((e) => e.location === "Unassigned");
  unassignedEmpls.forEach((employe) =>
    unassignedStaffList.appendChild(createEmployeeCard(employe))
  );
}


// -------------
// card of assignable workers in assign to
function createAssignableStaffCard(employee, targetZoneId) {
    const card = document.createElement('div');
    card.className = 'p-3 bg-white rounded-md shadow-sm border border-gray-200 cursor-pointer hover:bg-blue-50 transition duration-100';
    card.innerHTML = `
        <div class="flex items-center space-x-3">
            <img src="${employee.photoUrl}"  class="w-8 h-8 rounded-full object-cover flex-shrink-0">
            <span class="font-medium text-gray-800">${employee.name}</span>
            <span class="text-sm text-gray-500">(${employee.role})</span>
        </div>
    `;

    card.addEventListener('click', () => {
        // alert(`Selected ${employee.name} for assignment to ${targetZoneId}`);
        assignEmployeeToZone(employee.id, targetZoneId);
        unassignedStaffModal.classList.add('hidden'); 
    });

    return card;
}




// fiiilter and display unassigned staff  allowed in this zone wiith checkiiing capacity & role
function renderAssignableStaff(targetZoneId) {
    assignableStaffList.innerHTML = '';


    const currentPeopleInZone = employees.filter(e => e.location === targetZoneId).length;
    
    const limit = ZONE_CAPACITY[targetZoneId];


// if fulll
    if (currentPeopleInZone >= limit) {
        assignableStaffList.innerHTML = `
            <div class="text-center py-8">
                <p class="text-red-600 font-bold">Zone is Full!!!</p>
            </div>
        `;
        return; 
    }

const allowedRoles = ACCESS_RULES[targetZoneId]; 

    //  be Unassigned annd have allowed role
    const eligibleEmployees = employees.filter((e) => {
        return e.location === "Unassigned" && allowedRoles.includes(e.role);
    });
    
    if (eligibleEmployees.length === 0) {
        assignableStaffList.innerHTML = `<p class="text-sm text-red-500 text-center py-4">No staff with permission available herre</p>`;
        return;
    }

    eligibleEmployees.forEach((employee) => {
        // card knows where to send ( targeetetZone)
        const card = createAssignableStaffCard(employee, targetZoneId);
        assignableStaffList.appendChild(card);
    });
}

// assign employee to zone
function assignEmployeeToZone(employeeId, targetZoneId) {
    const employee = employees.find(e => e.id === employeeId);
    
    if (employee) {

        employee.location = targetZoneId;
        
        saveEmployees();
        
        
        displayUnassignedStaff(); 
        renderAssignedStaff();    // shoow in room
        
        unassignedStaffModal.classList.add('hidden');
    }
}

// add mini card in zoone
function renderAssignedStaff() {
    const zones = document.querySelectorAll('.zone-area');
// rooms can't be empty
const requiredZones = ['reception', 'security', 'server', 'archive'];

    zones.forEach(zone => {
        const zoneId = zone.dataset.zone;
        const addButton = zone.querySelector('.add-employee-zone-btn');
        const titleSpan = zone.querySelector('span');

        //cleaar old caards
        const existingCards = zone.querySelectorAll('.assigned-mini-card');
        existingCards.forEach(c => c.remove());

        const staffInZone = employees.filter(e => e.location === zoneId);
        const isEmpty = staffInZone.length === 0;

        // colorred it with reed
        if (isEmpty && requiredZones.includes(zoneId)) {
            zone.classList.remove('bg-gray-500/50', 'hover:bg-gray-700/50');
            zone.classList.add('bg-red-500/50', 'border-red-500');
        } else {
            zone.classList.add('bg-gray-500/50', 'hover:bg-gray-700/50');
            zone.classList.remove('bg-red-500/50', 'border-red-500');
        }

        if (!isEmpty) {
            zone.classList.replace('flex-col', 'flex-row');
            zone.classList.add('flex-wrap', 'content-start', 'justify-center', 'overflow-y-auto');
            if(titleSpan) titleSpan.classList.add('w-full', 'mb-1'); // title in toop of dev
        } 

        staffInZone.forEach(emp => {
            const miniCard = document.createElement('div');
            
            miniCard.className = 'assigned-mini-card bg-yellow-100 border border-yellow-300 text-gray-900 text-[6px] md:text-xs font-bold px-0.5 md:px-1.5 rounded shadow-sm flex items-center justify-between gap-0.5 m-0.5 h-3.5 md:h-6 w-auto max-w-[55px] md:max-w-[100px] cursor-pointer ';
            
            miniCard.innerHTML = `
                <div class="flex items-center gap-0.5 overflow-hidden">
                    <img class="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full object-cover border border-white" src="${emp.photoUrl}">
                    <span class="truncate">${emp.name.split(' ')[0]}</span>
                </div>
                <button class="remove-from-zone-btn text-red-500 hover:text-red-700 flex items-center" title="Remove">
                    <i class="fas fa-times-circle"></i>
                </button>
            `;

        
            const removeBtn = miniCard.querySelector('.remove-from-zone-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                removeEmployeeFromZone(emp.id);
            });
            
            if (addButton) {
                zone.insertBefore(miniCard, addButton);
            } else {
                zone.appendChild(miniCard);
            }
             miniCard.addEventListener("click",()=>{
            displayProfileCard(emp.id)
        })

        });

       
    });
}

function removeEmployeeFromZone(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
       
        employee.location = "Unassigned";
        
        
        saveEmployees();
        
        renderAssignedStaff();    
        displayUnassignedStaff(); 
    }
}
// --------------

// create employe card
function createEmployeeCard(employe) {
  const card = document.createElement("div");
  card.className =
    "employee-card p-3 mt-1 bg-white rounded-md shadow-sm border border-gray-200 cursor-pointer hover:bg-yellow-50 transition duration-100";
  card.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${employe.photoUrl}" alt="${employe.name}" class="w-8 h-8 rounded-full object-cover flex-shrink-0">
                <span class="font-medium text-gray-800 truncate">${employe.name}</span>
                <span class="text-sm text-gray-500">(${employe.role})</span>
                <button class="delete-worker text-red-500 hover:text-red-700 flex items-center" title="delete workeer">
                    <i class="fas fa-times-circle"></i>
                </button>
            </div>
        `;

  card.addEventListener("click", () => {
    displayProfileCard(employe.id);
  });


  // delete worker 
  card.querySelector(".delete-worker").addEventListener("click",(e)=>{
    e.stopPropagation()
    if(confirm(`Are you suure you want to delete  ${employe.name}!!`))
       employees = employees.filter((e)=> e.id !== employe.id)
       saveEmployees()
       displayUnassignedStaff()
  })

  return card;
}



// display profile card

function displayProfileCard(id) {
  const employe = employees.find((e) => e.id === id);
  if (!employe) return;

  document.getElementById("profile-photo-large").src = employe.photoUrl;
  document.getElementById("profile-name").textContent = employe.name;
  document.getElementById("profile-phone").textContent = employe.phone;
  document.getElementById("profile-role").textContent = employe.role;
  document.getElementById("profile-location").textContent =
    employe.location || "Unasssigned";
  document.getElementById("profile-email").textContent = employe.email;
  document.getElementById("profile-experience-list").innerHTML =
    employe.experienceTitles
      .map((title, i) => {
        return `
                <li class="truncate">
                    <span class="font-semibold">${title}</span>
                    <span class="text-xs text-gray-400">
                        (${employe.experienceStartDates[i]} to ${employe.experienceEndDates[i]})
                    </span>
                </li>
            `;
      })
      .join("");

  profileModal.classList.remove("hidden");
}


// display unssigned workers in zones
addEmployeeZone.forEach((btn)=>{
    btn.addEventListener('click', (e) => {
        const zoneElement = e.currentTarget.closest('.zone-area');
        const targetZoneId = zoneElement.dataset.zone; 
        
        renderAssignableStaff(targetZoneId);

        unassignedStaffModal.classList.remove('hidden');
    });
});

closeStaffListBtn.addEventListener('click', () => {
    unassignedStaffModal.classList.add('hidden');
});


// close profile modal
closeProfileModal.addEventListener("click", () => {
  profileModal.classList.add("hidden");
});



document.addEventListener("DOMContentLoaded", () => {
  getEmployees();
  experiencesContainer.appendChild(createExperienceGroup());
  displayUnassignedStaff();
  renderAssignedStaff();
});


