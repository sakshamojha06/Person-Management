using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controller;

[Route("api/[controller]")]
[ApiController]
public class PersonController: ControllerBase
{
    private readonly IPersonService _service;

    public PersonController(IPersonService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var people = await _service.GetAll();
        return Ok(people);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var person = await _service.GetById(id);
        if(person == null) return NotFound("Person not found");

        return Ok(person);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Person person)
    {
        var result = await _service.Create(person);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Person person)
    {
        var result = await _service.Update(id, person);
        if(!result) return NotFound("Person not found");

        return Ok("Person updated successfully");
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.Delete(id);
        if(!result) return NotFound("Person not found");

        return Ok("Person deleted successfully");  
    }
}