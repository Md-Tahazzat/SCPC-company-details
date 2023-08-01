"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function loadBlackListedCompanies() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://task-management-server-vert.vercel.app/black-listed-companies";
        const res = yield fetch(url);
        const data = yield res.json();
        localStorage.setItem("black_listed_companies", JSON.stringify(data));
    });
}
function handleSubmit(e) {
    e.preventDefault();
    const formElement = e.target;
    const inputText = formElement.company_searching_input.value;
    if (!!inputText) {
        const exist = isExist(inputText);
        if (exist) {
            alert(`${inputText} is a blacklisted company. Please do not apply.`);
        }
        else {
            alert(`${inputText} is not in the blacklist. Feel free to apply`);
        }
        formElement.company_searching_input.value = "";
    }
    else {
        alert("Please insert a company name");
    }
}
function handleAddCompany(e) {
    e.preventDefault();
    const formElement = e.target;
    const inputText = formElement.company_adding_input.value;
    if (!inputText)
        return;
    const override = confirm("You are not authorized for this commant. Override commant?");
    if (!override)
        return;
    const keystr = prompt("key");
    if (!keystr)
        return;
    // adding to database by api call
    const companyDetails = {
        company: inputText,
        key: keystr,
    };
    formElement.company_adding_input.value = "";
    addCompany(companyDetails);
}
// api call function to add company name to blacklist.
function addCompany(company) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://task-management-server-vert.vercel.app/companies/add";
        const res = yield fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(company),
        });
        const data = yield res.json();
        console.log(data);
        if ((data === null || data === void 0 ? void 0 : data.upsertedCount) || (data === null || data === void 0 ? void 0 : data.matchedCount)) {
            alert(`${company.company} added to blacklist`);
        }
        else if ((data === null || data === void 0 ? void 0 : data.message) === "Invalid key") {
            alert("Please provide valid key");
        }
    });
}
// check if the specific company exist in blacklisted company.
function isExist(name) {
    const companiesStr = localStorage.getItem("black_listed_companies");
    const companies = companiesStr ? JSON.parse(companiesStr) : [];
    const exist = companies.length > 0 &&
        companies.find(({ company }) => company.replace(/\s/g, "").toLowerCase() ===
            name.replace(/\s/g, "").toLowerCase());
    return !!exist;
}
loadBlackListedCompanies();
