
// Controllers/BooksController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookService _bookService;

    public BooksController()
    {
        _bookService = new BookService();
    }

    [HttpGet]
    public ActionResult<List<Book>> GetAllBooks()
    {
        return Ok(_bookService.GetAllBooks());
    }

    [HttpGet("{id}")]
    public ActionResult<Book> GetBook(int id)
    {
        var book = _bookService.GetBookById(id);
        if (book == null)
            return NotFound($"Book with id {id} not found.");

        return Ok(book);
    }

    [HttpPost]
    public ActionResult<Book> CreateBook([FromBody] Book book)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdBook = _bookService.CreateBook(book);
        return CreatedAtAction(nameof(GetBook), new { id = createdBook.Id }, createdBook);
    }

    [HttpPut("{id}")]
    public ActionResult<Book> UpdateBook(int id, [FromBody] Book book)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedBook = _bookService.UpdateBook(id, book);
        if (updatedBook == null)
            return NotFound($"Book with id {id} not found.");

        return Ok(updatedBook);
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteBook(int id)
    {
        var success = _bookService.DeleteBook(id);
        if (!success)
            return NotFound($"Book with id {id} not found.");

        return NoContent();
    }
}