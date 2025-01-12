import { BooksAPI } from './modules/booksAPI';

const refs = {
  createFormElem: document.querySelector('.js-create-form'),
  updateFormElem: document.querySelector('.js-update-form'),
  resetFormElem: document.querySelector('.js-reset-form'),
  deleteFormElem: document.querySelector('.js-delete-form'),
  bookListElem: document.querySelector('.js-article-list'),
};

const booksApi = new BooksAPI();

refs.createFormElem.addEventListener('submit', onCreateBook);
refs.resetFormElem.addEventListener('submit', onResetBook);
refs.updateFormElem.addEventListener('submit', onUpdateBook);
refs.deleteFormElem.addEventListener('submit', onDeleteBook);
refs.bookListElem.addEventListener('click', onItemClick);

async function onCreateBook(e) {
  e.preventDefault();
  const title = e.target.elements.bookTitle.value;
  const desc = e.target.elements.bookDesc.value;
  const author = e.target.elements.bookAuthor.value;

  const book = { title, desc, author };

  const newBook = await booksApi.createBook(book);
  const markup = bookTemplate(newBook);
  refs.bookListElem.insertAdjacentHTML('beforeend', markup);

  e.target.reset();
}

async function onResetBook(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const book = {};

  formData.forEach((value, key) => {
    key = key.replace('book', '').toLowerCase();
    book[key] = value;
  });

  const newBook = await booksApi.resetBook(book.id, book);
  const markup = bookTemplate(newBook);
  const oldBook = refs.bookListElem.querySelector(`[data-id="${book.id}"]`);
  oldBook.insertAdjacentHTML('afterEnd', markup);
  oldBook.remove();

  e.target.reset();
}

async function onUpdateBook(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const book = {};
  formData.forEach((value, key) => {
    key = key.replace('book', '').toLowerCase();
    book[key] = value || undefined;
  });

  const newBook = await booksApi.updateBook(book.id, book);
  const markup = bookTemplate(newBook);
  const oldBook = refs.bookListElem.querySelector(`[data-id="${book.id}"]`);
  oldBook.insertAdjacentHTML('afterEnd', markup);
  oldBook.remove();

  e.target.reset();
}

async function onDeleteBook(e) {
  e.preventDefault();
  const id = e.target.elements.bookId.value;
  await booksApi.deleteBook(id);
  const oldBook = refs.bookListElem.querySelector(`[data-id="${id}"]`);
  oldBook.remove();
}

async function onItemClick(e) {
  if (e.target === e.currentTarget) return;
  const liElem = e.target.closest('LI');
  const id = liElem.dataset.id;

  await booksApi.deleteBook(id);
  liElem.remove();
}

booksApi.getBooks().then(books => {
  renderBooks(books);
});

// ================================

function bookTemplate(book) {
  const { id, title, desc, author } = book;
  return `<li class="card book-item" data-id="${id}">
  <h3>${id} - ${title}</h3>
  <p>${desc}</p>
  <p>${author}</p>
</li>`;
}

function booksTemplate(books) {
  return books.map(bookTemplate).join('\n');
}

function renderBooks(books) {
  const markup = booksTemplate(books);
  refs.bookListElem.innerHTML = markup;
}
