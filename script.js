const addModal = document.getElementById("add-employee-modal")
const addNewWorker = document.getElementById("open-modal-btn")
const closeModalBtn = document.getElementById('close-modal-btn');


addNewWorker.addEventListener('click',()=>{
        addModal.classList.remove("hidden")
})

closeModalBtn.addEventListener("click",()=>{
    addModal.classList.add("hidden")
})