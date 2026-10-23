using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using ImageMagick;

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

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.Delete(id);
        if(!result) return NotFound("Person not found");

        return Ok("Person deleted successfully");  
    }

    [HttpPost("upload-photo")]
    public async Task<IActionResult> UploadPhoto(IFormFile photo)
    {
        if (photo == null || photo.Length == 0)
            return BadRequest("Please select a photo.");

        var allowedExtensions = new[]
        {
            ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"
        };

        var extension = Path.GetExtension(photo.FileName)
                            .ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid image format.");

        bool isHeic = extension == ".heic" || extension == ".heif";

        var savedExtension = isHeic ? ".jpg" : extension;

        var fileName = $"{Guid.NewGuid()}{savedExtension}";

        var uploadFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "uploads"
        );

        Directory.CreateDirectory(uploadFolder);

        var filePath = Path.Combine(uploadFolder, fileName);

        if (isHeic)
        {
            using var image = new MagickImage(photo.OpenReadStream());

            image.AutoOrient();
            image.Format = MagickFormat.Jpeg;
            image.Quality = 85;

            image.Write(filePath);
        }
        else
        {
            using var stream = new FileStream(
                filePath,
                FileMode.Create
            );

            await photo.CopyToAsync(stream);
        }

        var photoPath = $"/uploads/{fileName}";

        return Ok(new
        {
            message = "Photo uploaded successfully",
            photoPath = photoPath
        });
    }
}