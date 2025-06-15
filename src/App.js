import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, Book, User, Calendar, DollarSign } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/books';

const LibraryManager = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    price: '',
    stock: '',
    publisher: '',
    publicationDate: '',
    pages: '',
    language: '',
    description: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError('Error loading books: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        pages: parseInt(formData.pages),
        publicationDate: new Date(formData.publicationDate).toISOString()
      };

      const url = editingBook ? `${API_BASE_URL}/${editingBook.id}` : API_BASE_URL;
      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error('Failed to save book');

      await fetchBooks();
      resetForm();
      setError('');
    } catch (err) {
      setError('Error saving book: ' + err.message);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      price: book.price.toString(),
      stock: book.stock.toString(),
      publisher: book.publisher,
      publicationDate: book.publicationDate.split('T')[0],
      pages: book.pages.toString(),
      language: book.language,
      description: book.description
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete book');

      await fetchBooks();
      setError('');
    } catch (err) {
      setError('Error deleting book: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      genre: '',
      price: '',
      stock: '',
      publisher: '',
      publicationDate: '',
      pages: '',
      language: '',
      description: ''
    });
    setEditingBook(null);
    setShowForm(false);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Library Manager</h1>
                <p className="text-gray-600">Manage your book collection</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>Add Book</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Book Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                      <input
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                      <input
                        type="text"
                        required
                        value={formData.genre}
                        onChange={(e) => setFormData({...formData, genre: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                      <input
                        type="text"
                        required
                        value={formData.publisher}
                        onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
                      <input
                        type="date"
                        required
                        value={formData.publicationDate}
                        onChange={(e) => setFormData({...formData, publicationDate: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                      <input
                        type="number"
                        required
                        value={formData.pages}
                        onChange={(e) => setFormData({...formData, pages: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <input
                        type="text"
                        required
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      {editingBook ? 'Update Book' : 'Add Book'}
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{book.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">{book.author}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-semibold text-green-600">${book.price}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Stock: {book.stock}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Publisher:</strong> {book.publisher}</p>
                    <p><strong>Pages:</strong> {book.pages}</p>
                    <p><strong>Language:</strong> {book.language}</p>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(book.publicationDate).toLocaleDateString()}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && !loading && (
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first book to the library.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryManager;