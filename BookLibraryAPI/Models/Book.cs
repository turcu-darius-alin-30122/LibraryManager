// Models/Book.cs
public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Publisher { get; set; } = string.Empty;
    public DateTime PublicationDate { get; set; }
    public int Pages { get; set; }
    public string Language { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}