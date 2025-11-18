const addModal = document.getElementById("add-employee-modal")
const addNewWorker = document.getElementById("open-modal-btn")
const closeModalBtn = document.getElementById('close-modal-btn');

const addExperienceBtn = document.getElementById("add-experience-btn")
const experiencesContainer = document.getElementById("experiences-container")

const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const phoneInput = document.getElementById('phone-input');

// regex validaations
const NAME_REGEX = /^[A-Za-z\s\-']+$/;
const EMAIL_REGEX = /^[\w\.\-]+@[\w\.\-]+\.\w{2,4}$/;
const PHONE_REGEX = /^[0-9\s\-+]{1,12}$/;


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