interface Company {
    company:string;
    key?:string
}

async function loadBlackListedCompanies():Promise<void>{
    const url = "https://task-management-server-vert.vercel.app/black-listed-companies"
   const res = await fetch(url)
   const data = await res.json()
   localStorage.setItem("black_listed_companies", JSON.stringify(data))
}

function handleSubmit (e:Event):void{
 e.preventDefault()
 const formElement = e.target as HTMLFormElement;
 const inputText = formElement.company_searching_input.value
 if(!!inputText){
    const exist = isExist(inputText)
    if(exist){
       alert(`${inputText} is a blacklisted company. Please do not apply.`)
    }
    else{
       alert(`${inputText} is not in the blacklist. Feel free to apply`)
    }
    formElement.company_searching_input.value = ""
 }
 else{
    alert("Please insert a company name")
 }
 
}

function handleAddCompany(e:Event):void|string{
    e.preventDefault()
    const formElement = e.target as HTMLFormElement;
    const inputText = formElement.company_adding_input.value;
    if(!inputText)return;

    const override = confirm("You are not authorized for this commant. Override commant?")
    if(!override)return; 

    const keystr = prompt("key")
    if(!keystr) return;

    // adding to database by api call
    const companyDetails:Company={
        company:inputText,
        key:keystr
    } 
    formElement.company_adding_input.value = ''
    addCompany(companyDetails)
}

// api call function to add company name to blacklist.
async function addCompany (company:Company):Promise<void>{
    const url = "https://task-management-server-vert.vercel.app/companies/add"
    const res = await fetch(url,{
        method:"PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(company)
    })

    const data = await res.json()
    console.log(data)
  if(data?.upsertedCount ||data?.matchedCount){
    alert(`${company.company} added to blacklist`)

  }
  else if(data?.message==="Invalid key"){
    alert("Please provide valid key")
  }
}

// check if the specific company exist in blacklisted company.
function isExist (name:string):boolean{
    const companiesStr = localStorage.getItem("black_listed_companies")
    const companies:Company[] = companiesStr? JSON.parse(companiesStr) : []
    const exist = companies.length>0 && companies.find(el=>el.company===name)
    return !!exist
}
loadBlackListedCompanies()

