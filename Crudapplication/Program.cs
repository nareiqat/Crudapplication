using Crudapplication.Models;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<Employee2DbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();


app.UseStaticFiles();

app.MapGet("/employees", async (Employee2DbContext dbContext) =>
{
    var employees = await dbContext.EmployeesTables.ToListAsync();

    return Results.Ok(employees);
});

app.MapPost("/employees", async (EmployeesTable employee, Employee2DbContext dbContext) => {
    dbContext.EmployeesTables.Add(employee);
    await dbContext.SaveChangesAsync();
    return Results.Created($"/employees/{employee.id}", employee);
});

app.MapGet("/employees/{id}", async (int id, Employee2DbContext dbContext) =>
{
    var employee = await dbContext.EmployeesTables.FindAsync(id);
    return employee is not null ? Results.Ok(employee) : Results.NotFound();
});

app.MapPut("/employees/{id}", async (int id, EmployeesTable updatedEmployee, Employee2DbContext dbContext) => {
    var employee = await dbContext.EmployeesTables.FindAsync(id);
    if ( employee is null) return Results.NotFound();

    employee.id = updatedEmployee.id;
    employee.name = updatedEmployee.name;
    employee.position = updatedEmployee.position;
    employee.department = updatedEmployee.department;

    await dbContext.SaveChangesAsync();

    return Results.NoContent();

});

app.MapDelete("/employees/{id}", async (int id, Employee2DbContext dbContext) =>
{
    var employee = await dbContext.EmployeesTables.FindAsync(id);
    if (employee is null) return Results.NotFound();

    dbContext.EmployeesTables.Remove(employee);
    await dbContext.SaveChangesAsync();

    return Results.NoContent();
});




















app.Run();
