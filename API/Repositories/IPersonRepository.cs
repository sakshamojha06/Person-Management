using API.Models;

namespace API.Repositories;

public interface IPersonRepository
{
    public Task<List<Person>> GetAll();
    public Task<Person?> GetById(int id);
    public Task<Person> Create(Person person);
    public Task<bool> Update(int id, Person person);
    public Task<bool> Delete(int id);
}