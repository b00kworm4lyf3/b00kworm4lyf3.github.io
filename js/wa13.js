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
function addNewEmployee(compJSON, firstName, dept, desig, salary, raiseElig){
    const newEmp = {
        firstName: firstName,
        dept: dept,
        desig: desig,
        salary: salary,
        raiseElig: raiseElig,
    };

    compJSON.employees.push(newEmp);
};

addNewEmployee(compJSON, "Anna", "Tech", "Executive", 25600, false);
console.log("3) New employee added to both JSONs: ", empJSON, compJSON);

//Problem 4
function getTotSal(compJSON){
    let totSal = 0;

    for(let i = 0; i < compJSON.employees.length; i++){
        totSal += compJSON.employees[i].salary;
    }
    return totSal;
};

console.log("4) Total employee salaries: ", getTotSal(compJSON));

//Problem 5
function raiseTime(compJSON){
    for(let i = 0; i < compJSON.employees.length; i++){
        if(compJSON.employees[i].raiseElig){
            compJSON.employees[i].salary *= 1.1;
            compJSON.employees[i].raiseElig = false;
        }
    }
};

raiseTime(compJSON);
console.log("5) Eligible employees given raises: ", compJSON);

//Problem 6
function addWFH(compJSON, empNames){
    compJSON.wfh = empNames;
    for(let i = 0; i < compJSON.employees.length; i++){
        if(compJSON.wfh.includes(compJSON.employees[i].firstName)){
            compJSON.employees[i].wfh = true;
        }
        else{
            compJSON.employees[i].wfh = false;
        }
    }
};

addWFH(compJSON, ['Sam', 'Anna']);
console.log("6) Employees updated with WFH status: ", compJSON);