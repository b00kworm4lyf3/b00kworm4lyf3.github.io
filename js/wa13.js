//Problem 1
const empJSON = {
    employees: [
        {
            firstName: "Sam",
            dept: "Tech",
            desig: "Manager",
            salary: 40000,
            raiseElig: true,
        },
        {
            firstName: "Mary",
            dept: "Finance",
            desig: "Trainee",
            salary: 18500,
            raiseElig: true,
        },
        {
            firstName: "Bill",
            dept: "HR",
            desig: "Executive",
            salary: 21200,
            raiseElig: false,
        },
    ]
};

console.log("1) Employee JSON created: ", empJSON);

//Problem 2
const compJSON = {
    compName: "Tech Stars",
    web: "www.techstars.site",
    employees: empJSON.employees,
};

console.log("2) Company JSON created: ", compJSON);

//Problem 3
const newEmp = {
    firstName: "Anna",
    dept: "Tech",
    desig: "Executive",
    salary: 25600,
    raiseElig: false,
};

compJSON.employees.push(newEmp);
console.log("3) New employee added to both JSONs: ", empJSON, compJSON);

//Problem 4
let totSal = 0;

for(let i = 0; i < compJSON.employees.length; i++){
    totSal += compJSON.employees[i].salary;
}
console.log("4) Total employee salaries: ", totSal);

//Problem 5
for(let i = 0; i < compJSON.employees.length; i++){
    if(compJSON.employees[i].raiseElig){
        compJSON.employees[i].salary *= 1.1;
        compJSON.employees[i].raiseElig = false;
    }
}

console.log("5) Eligible employees given raises: ", compJSON);

//Problem 6
compJSON.wfh = ['Anna', 'Sam'];
for(let i = 0; i < compJSON.employees.length; i++){
    if(compJSON.wfh.includes(compJSON.employees[i].firstName)){
        compJSON.employees[i].wfh = true;
    }
    else{
        compJSON.employees[i].wfh = false;
    }
}

console.log("6) Employees updated with WFH status: ", compJSON);