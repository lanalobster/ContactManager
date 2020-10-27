$(document).ready(() => {

    $(".my-row").mouseenter(() => {
        $(this).children().last().find("button").css("visibility", "visible");
    });

    $(".my-row").mouseleave(() => {
        $(this).children().last().find("button").css("visibility", "hidden");
    });

    $(".changeable").on('input', (event) => {
        var row = $(event.target).parent();

        var letterRegex = /[a-zA-Z]/g;
        var numberRegex = /\d/g;

        var name = (row.children().eq(1)).text();
        if (numberRegex.test(name)) {
            alert("Name cannot contain numbers" + "\nThis change won't be saved");
            return;
        }
        
        var phone = (row.children().eq(4)).text();
        if (letterRegex.test(phone)) {
            alert("Phone numbers cannot contain letters" + "\nThis change won't be saved");
            return;
        }

        var salary = (row.children().eq(5)).text();
        if (letterRegex.test(salary)) {
            alert("Salary cannot contain letters" + "\nThis change won't be saved");
            return;
        }

        var married = row.children().eq(3).children().last().val() === "Yes" ? true : false;

        var date = new Date((row.children().eq(2)).children().last().val());
        $.post("/Contacts/Edit",
            {
                Id: (row.children().eq(0)).text(),
                Name: name.trim(),
                DateOfBirth: ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth() + 1)).slice(-2) + "." + date.getFullYear(),
                Married: married,
                Phone: phone.trim(),
                Salary: salary.trim()
            });
    });

    $("th").click(() => {
        var parameter = $(event.target).text().trim();
        var contacts = [];
        var table = document.getElementById("data-table");
        for (var i = 1, row; row = table.rows[i]; i++) {
            var date = new Date($(row.cells[2]).find("input").val());
            var contact = {
                Name: row.cells[1].textContent,
                DateOfBirth: ('0' + date.getDate()).slice(-2) + "." + ('0' + (date.getMonth() + 1)).slice(-2) + "." + date.getFullYear(),
                Married: $(row.cells[3]).find("select").val() === "Yes" ? true : false,
                Phone: row.cells[4].textContent,
                Salary: row.cells[5].textContent
            }
            contacts.push(contact);
        }

        contacts.sort(compareValues(parameter));
        
        for (var i = 1, row; row = table.rows[i]; i++) {
            row.cells[1].textContent = contacts[i-1].Name;
            var dateParts = contacts[i - 1].DateOfBirth.split(".");
            $(row.cells[2]).find("input").val(dateParts[2] + "-" + ('0' + dateParts[1]).slice(-2) + "-" + ('0' + dateParts[0]).slice(-2));
            $(row.cells[3]).find("select").val(contacts[i - 1].Married === true? "Yes" : "No");
            row.cells[4].textContent = contacts[i - 1].Phone;
            row.cells[5].textContent = contacts[i - 1].Salary;
        }
    });

    function compareValues(key) {
        return function innerSort(a, b) {

            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                console.log("property doesn't exist");
                return 0;
            }

            var varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
            var varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

            var comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return comparison;
        };
    }
});