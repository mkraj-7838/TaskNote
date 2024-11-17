const addBtn = document.getElementById('add');
const notesContainer = document.querySelector('.note-container');
const notesList = document.getElementById('note-item');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let noteCount = notes.length; // Track the number of notes

// Initially add notes from localStorage to sidebar
notes.forEach(note => addNoteToSidebar(note));

addBtn.addEventListener('click', () => addNewNote());

function addNewNote(text = '', title = '') {
    noteCount++; // Increment the note count for the new note
    const newTitle = title || `Untitled-${noteCount}`; // Set title as 'Untitled-x'
    const note = { title: newTitle, text };
    
    notes.push(note);
    addNoteToSidebar(note);
    showNoteDetail(note);
    updateLS();
}

function addNoteToSidebar(note) {
    const noteItem = document.createElement('li');
    noteItem.classList.add('note-item');
    noteItem.textContent = note.title;
    noteItem.addEventListener('click', () => showNoteDetail(note));
    notesList.appendChild(noteItem);
}

function showNoteDetail(note) {
    notesContainer.innerHTML = '';
    const noteDetail = document.createElement('div');
    noteDetail.classList.add('note');

    noteDetail.innerHTML = `
        <input type="text" class="note-title" value="${note.title}" />
        <div class="tools">
            <button class="edit"><i class="fas fa-edit"></i></button>
            <button class="delete"><i class="fas fa-trash-alt"></i></button>
        </div>
        <div class="main ${note.text ? '' : 'hidden'}"></div>
        <textarea class="${note.text ? 'hidden' : ''}"></textarea>
    `;

    const editBtn = noteDetail.querySelector('.edit');
    const deleteBtn = noteDetail.querySelector('.delete');
    const main = noteDetail.querySelector('.main');
    const textArea = noteDetail.querySelector('textarea');
    const titleInput = noteDetail.querySelector('.note-title');

    textArea.value = note.text;
    main.innerHTML = marked(note.text);

    // Update the title on input change
    titleInput.addEventListener('input', e => {
        note.title = e.target.value;
        updateLS();
        renderSidebar();
    });

    // Delete note functionality
    deleteBtn.addEventListener('click', () => {
        notes = notes.filter(n => n !== note);
        renderSidebar();
        notesContainer.innerHTML = '';
        updateLS();
    });

    // Toggle between viewing and editing the text
    editBtn.addEventListener('click', () => {
        main.classList.toggle('hidden');
        textArea.classList.toggle('hidden');
    });

    // Update note text and save to localStorage
    textArea.addEventListener('input', e => {
        note.text = e.target.value;
        main.innerHTML = marked(note.text);
        updateLS();
    });

    notesContainer.appendChild(noteDetail);
}

function renderSidebar() {
    notesList.innerHTML = '';
    notes.forEach(note => addNoteToSidebar(note));
}

function updateLS() {
    localStorage.setItem('notes', JSON.stringify(notes));
}
