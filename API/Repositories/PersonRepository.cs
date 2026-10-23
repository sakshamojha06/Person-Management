using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class PersonRepository: IPersonRepository
{
    private readonly AppDbContext _context;

    public PersonRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Person>> GetAll()
    {
        return await _context.Person.ToListAsync();
    }

    public async Task<Person?> GetById(int id)
    {
        return await _context.Person.FindAsync(id);
    }

    public async Task<Person> Create(Person person)
    {
        await _context.Person.AddAsync(person);
        await _context.SaveChangesAsync();
        return person;
    }

    public async Task<bool> Update(int id, Person person)
    {
        var existing = await _context.Person.FindAsync(id);
        if(existing == null) return false;

        existing.Name = person.Name;
        existing.Age = person.Age;
        existing.PhotoPath = person.PhotoPath;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Delete(int id)
    {
        var existing = await _context.Person.FindAsync(id);
        if(existing == null) return false;

        _context.Person.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}