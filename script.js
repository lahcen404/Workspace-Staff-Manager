const addModal = document.getElementById("add-employee-modal")
const addNewWorker = document.getElementById("open-modal-btn")
const closeModalBtn = document.getElementById('close-modal-btn');

const profileModal = document.getElementById("profile-modal")
const closeProfileModal = document.getElementById("close-profile-btn")

const addExperienceBtn = document.getElementById("add-experience-btn")
const experiencesContainer = document.getElementById("experiences-container")

const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const phoneInput = document.getElementById('phone-input');
const photoInput = document.getElementById('photo-url-input');
const photoPreview = document.getElementById('photo-preview')

const unassignedStaffList = document.getElementById("unassigned-staff-list")


const employeeForm = document.getElementById("employee-form");

// regex validaations
const NAME_REGEX = /^[A-Za-z\s\-']+$/;
const EMAIL_REGEX = /^[\w\.\-]+@[\w\.\-]+\.\w{2,4}$/;
const PHONE_REGEX = /^[0-9\s\-+]{1,12}$/;


// Employess data

let employees = [];
let nextEmployeId = 1; 

// localStorage
function saveEmployees(){
    try{
        const data = JSON.stringify({employees,nextEmployeId})
        localStorage.setItem("EmployeesData",data);
    }catch(error){
        console.error("error in save daaata",error)
    }
}

function getEmployees(){
    try {
        const data = localStorage.getItem("EmployeesData");
        if(data){
            const parsingData = JSON.parse(data);
            employees = parsingData.employees || [];
            nextEmployeId = parsingData.nextEmployeId || 1;
        }

    } catch (error) {
        console.error("error in getting data",data);
        
    }
}



addNewWorker.addEventListener('click',()=>{
        addModal.classList.remove("hidden")
})

closeModalBtn.addEventListener("click",()=>{
    addModal.classList.add("hidden")
})

// dynamic Experiences

function createExperienceGroup(){
    const div = document.createElement('div');

    div.className="experience-group p-3 border rounded-lg bg-gray-50";
    div.innerHTML=`
              <div class="flex justify-end mb-2">
            <button type="button" class="remove-experience-btn text-red-500 hover:text-red-700 text-lg" title="Remove Experience">
                <i class="fas fa-minus-circle"></i>
            </button>
        </div>
        <label for="experience" class="block text-sm font-medium text-gray-700">Title / Company</label>
        <input id="experience" type="text" name="experience_title[]"  placeholder="ur experience heere ..." class="w-full border border-gray-300 rounded-md shadow-sm p-2">
    
    `
        div.querySelector('.remove-experience-btn').addEventListener('click',()=>{
           if(experiencesContainer.querySelectorAll('.experience-group').length>1){
             div.remove();
           }else{
            alert("pleasse at least add one experience !!!")
           }
        })

        return div;
};

addExperienceBtn.addEventListener('click',()=>{
    experiencesContainer.appendChild(createExperienceGroup());
})

// Validatioon

function validationForm(){
    let isValid = true ;

    document.querySelectorAll(".error").forEach((er)=>{
       er.classList.add('hidden')
    })

     if(!NAME_REGEX.test(nameInput.value)){
       document.getElementById('name-error').classList.remove('hidden')
            isValid=false;
        }

        if(!EMAIL_REGEX.test(emailInput.value)){
       document.getElementById('email-error').classList.remove('hidden')
            isValid=false;
        }

        if(!PHONE_REGEX.test(phoneInput.value)){
       document.getElementById('phone-error').classList.remove('hidden')
            isValid=false;
        }

        return isValid;
}


// Empoyee Form Submit 

employeeForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    if(!validationForm()){
        alert("Pleaaase correct validaaton inpuuts (Name or Email or Phone )")
        return;
    }

    const data = new FormData(employeeForm);

    const newEmployee= {
        name: data.get('name'),
        role: data.get('role'),
        photoUrl:data.get('photoUrl') || './imgs/icons8-user-100.png',
        email:data.get('email'),
        phone:data.get('phone'),
        experience:data.getAll('experience_title[]').filter((t)=> {return t} ).map((title)=> {
            return { title: title};
        })
    }

    employees.push({
        id:nextEmployeId++,
        ...newEmployee,
        location: 'Unassigned'
    })
    displayUnassignedStaff();

    saveEmployees();
    console.log("employe added success");
    
    employeeForm.reset();
    addModal.classList.add('hidden');
    experiencesContainer.innerHTML='';
    experiencesContainer.appendChild(createExperienceGroup());
})

// preview picture
photoInput.addEventListener("input",(e)=>{
    const url = e.target.value;
    console.log(url);
    
    photoPreview.innerHTML= url ? `<img src="${url}"  class="w-full h-full object-cover">` : `<img src="./imgs/icons8-user-100.png"  class="w-full h-full object-cover">`;
})


//displaying unassigned Staff
function displayUnassignedStaff(){

    unassignedStaffList.innerHTML='';
const unassignedEmpls = employees.filter((e)=> e.location === "Unassigned");
unassignedEmpls.forEach((employe)=> unassignedStaffList.appendChild(createEmployeeCard(employe))

)}

// create employe card
function createEmployeeCard(employe){
    const card = document.createElement('div');
     card.className = 'employee-card p-3 mt-1 bg-white rounded-md shadow-sm border border-gray-200 cursor-pointer hover:bg-yellow-50 transition duration-100';
        card.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${employe.photoUrl}" alt="${employe.name}" class="w-8 h-8 rounded-full object-cover flex-shrink-0">
                <span class="font-medium text-gray-800 truncate">${employe.name}</span>
                <span class="text-sm text-gray-500">(${employe.role})</span>
            </div>
        `;

          card.addEventListener("click", () => {
        displayProfileCard(employe.id);
    });
    
        return card;
}

// display profile card 

function displayProfileCard(id){
    const employe = employees.find((e)=> e.id === id);
    if (!employe) return;

    document.getElementById("profile-photo-large").src=employe.photoUrl
    document.getElementById("profile-name").textContent=employe.name
    document.getElementById("profile-phone").textContent=employe.phone
    document.getElementById("profile-role").textContent=employe.role
    document.getElementById("profile-location").textContent=employe.location == 'Unasssigned'
    document.getElementById("profile-email").textContent=employe.email
    document.getElementById("profile-experience-list").innerHTML=employe.experience.map((ex) => { return `<li class="truncate">${ex.title}</li>`; }).join('')

    profileModal.classList.remove("hidden");

}

closeProfileModal.addEventListener('click',()=>{
    profileModal.classList.add('hidden');
})



document.addEventListener('DOMContentLoaded', () => {
    getEmployees();     
    experiencesContainer.appendChild(createExperienceGroup());
    displayUnassignedStaff(); 
    displayProfileCard(1)
});