// Services/BookService.cs
using System.Text.Json;

public class BookService
{
    private readonly string _filePath = "books.json";
    private List<Book> _books;

    public BookService()
    {
        LoadBooks();
    }

    private void LoadBooks()
    {
        if (File.Exists(_filePath))
        {
            var jsonData = File.ReadAllText(_filePath);
            _books = JsonSerializer.Deserialize<List<Book>>(jsonData) ?? new List<Book>();
        }
        else
        {
            _books = new List<Book>();
            SeedData();
        }
    }

    private void SaveBooks()
    {
        var jsonData = JsonSerializer.Serialize(_books, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(_filePath, jsonData);
    }

    private void SeedData()
    {
        _books = new List<Book>
        {
            new Book
            {
                Id = 1,
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                Genre = "Fiction",
                Price = 15.99m,
                Stock = 25,
                Publisher = "Scribner",
                PublicationDate = new DateTime(1925, 4, 10),
                Pages = 180,
                Language = "English",
                Description = "A classic American novel set in the Jazz Age."
            },
            new Book
            {
                Id = 2,
                Title = "To Kill a Mockingbird",
                Author = "Harper Lee",
                Genre = "Fiction",
                Price = 12.99m,
                Stock = 18,
                Publisher = "J.B. Lippincott & Co.",
                PublicationDate = new DateTime(1960, 7, 11),
                Pages = 376,
                Language = "English",
                Description = "A gripping tale of racial injustice and childhood innocence."
            }
        };
        SaveBooks();
    }

    public List<Book> GetAllBooks() => _books;

    public Book? GetBookById(int id) => _books.FirstOrDefault(b => b.Id == id);

    public Book CreateBook(Book book)
    {
        book.Id = _books.Count > 0 ? _books.Max(b => b.Id) + 1 : 1;
        _books.Add(book);
        SaveBooks();
        return book;
    }

    public Book? UpdateBook(int id, Book updatedBook)
    {
        var existingBook = GetBookById(id);
        if (existingBook == null) return null;

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Genre = updatedBook.Genre;
        existingBook.Price = updatedBook.Price;
        existingBook.Stock = updatedBook.Stock;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.PublicationDate = updatedBook.PublicationDate;
        existingBook.Pages = updatedBook.Pages;
        existingBook.Language = updatedBook.Language;
        existingBook.Description = updatedBook.Description;

        SaveBooks();
        return existingBook;
    }

    public bool DeleteBook(int id)
    {
        var book = GetBookById(id);
        if (book == null) return false;

        _books.Remove(book);
        SaveBooks();
        return true;
    }
}