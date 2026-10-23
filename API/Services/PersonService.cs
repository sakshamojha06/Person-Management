using API.Models;
using API.Repositories;

namespace API.Services;

public class PersonService: IPersonService
{
    private readonly IPersonRepository _repo;

    public PersonService(IPersonRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<Person>> GetAll()
    {
        return await _repo.GetAll();
    }

    public async Task<Person?> GetById(int id)
    {
        return await _repo.GetById(id);
    }

    public async Task<Person> Create(Person person)
    {
        return await _repo.Create(person);
    }

    public async Task<bool> Update(int id, Person person)
    {
        return await _repo.Update(id, person);
    }

    public async Task<bool> Delete(int id)
    {
        return await _repo.Delete(id);
    }
}