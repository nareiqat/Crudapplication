const apiUrl = "http://localhost:5106/employees";

$(document).ready(() => {
    loadEmployees();

    // Add Employee
    $("#employeeForm").on("submit", async (e) => {
        e.preventDefault();
        const employee = {
            name: $("#name").val(),
            position: $("#position").val(),
            department: $("#department").val()
        };

        try {
            await $.ajax({
                url: apiUrl,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(employee),
                success: () => {
                    loadEmployees();
                    $("#employeeForm")[0].reset();
                },
                error: (xhr, status, error) => {
                    console.error("Error posting data:", error);
                }
            });
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    });
});

// Load Employees
function loadEmployees() {
    $.get(apiUrl, (employees) => {
        const employeeRows = employees.map(employee => `
            <tr>
                <td>${employee.name}</td>
                <td>${employee.position}</td>
                <td>${employee.department}</td>
                <td>
                    <button onclick="editEmployee(${employee.id})">Edit</button>
                    <button onclick="deleteEmployee(${employee.id})">Delete</button>
                </td>
            </tr>
        `);
        $("#employeesTable tbody").html(employeeRows);
    }).fail((xhr, status, error) => {
        console.error("Error loading data:", error);
    });
}

// Edit Employee
function editEmployee(id) {
    $.get(`${apiUrl}/${id}`, (employee) => {
        $("#name").val(employee.name);
        $("#position").val(employee.position);
        $("#department").val(employee.department);

        $("#employeeForm").off("submit").on("submit", async (e) => {
            e.preventDefault();
            const updatedEmployee = {
                id: employee.id,
                name: $("#name").val(),
                position: $("#position").val(),
                department: $("#department").val()
            };

            try {
                await $.ajax({
                    url: `${apiUrl}/${id}`,
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(updatedEmployee)
                });
                loadEmployees();
                $("#employeeForm")[0].reset();
                $("#employeeForm").off("submit").on("submit", addEmployee);
            } catch (error) {
                console.error("Error updating employee:", error);
            }
        });
    });
}

// Delete Employee
function deleteEmployee(id) {
    $.ajax({
        url: `${apiUrl}/${id}`,
        method: "DELETE",
        success: loadEmployees,
        error: (error) => console.error("Error deleting employee:", error)
    });
}
