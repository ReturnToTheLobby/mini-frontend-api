const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const form = document.getElementById('post-form');
const formMessage = document.getElementById('form-message');
const postsList = document.getElementById('posts-list');
const searchInput = document.getElementById('search-input');

const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const emptyState = document.getElementById('empty-state');

let allPosts = [];

// 1. Incarcarea listei prin GET la initializare
async function fetchPosts() {
    showState('loading');
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erore HTTP: ${response.status}`);
        
        allPosts = await response.json();
        renderPosts(allPosts);
    } catch (error) {
        console.error(error);
        showState('error');
    }
}

// Gestionarea starilor vizibile
function showState(state) {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    emptyState.classList.add('hidden');
    postsList.replaceChildren(); // Curatam lista de postari afisate

    if (state === 'loading') loadingState.classList.remove('hidden');
    if (state === 'error') errorState.classList.remove('hidden');
    if (state === 'empty') emptyState.classList.remove('hidden');
}

// Randeaza elementele In DOM folosind createElement si textContent (securizat anti-XSS)
function renderPosts(posts) {
    if (posts.length === 0) {
        showState('empty');
        return;
    }

    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    emptyState.classList.add('hidden');
    postsList.replaceChildren(); // Curatam lista de postari afisate

    const fragment = document.createDocumentFragment();

    posts.forEach(post => {
        const li = document.createElement('li');
        li.className = 'post-item';
        li.dataset.id = post.id;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'post-content';

        const h3 = document.createElement('h3');
        h3.textContent = post.title;

        const p = document.createElement('p');
        p.textContent = post.body;

        contentDiv.appendChild(h3);
        contentDiv.appendChild(p);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'sterge';
        deleteBtn.className = 'delete-btn';

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        fragment.appendChild(li);
    });

    postsList.appendChild(fragment);
}

// 2. Creare cu POST JSON si FormData
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.className = 'message hidden';

    // Validare nativa HTML care previne trimiterea datelor invalide
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const postData = {
        title: formData.get('title'),
        body: formData.get('body'),
        email: formData.get('email'),
        userId: 1
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            const newPost = await response.json();
            // JSONPlaceholder returneaza mereu ID-ul 201; Il ajustam pentru vizualizare corecta In lista
            newPost.id = allPosts.length > 0 ? Math.max(...allPosts.map(p => p.id)) + 1 : 1;
            
            allPosts.unshift(newPost);
            renderPosts(allPosts);

            form.reset();
            showFormMessage('Postare adaugata cu succes!', 'success');
        } else if (response.status >= 400 && response.status < 500) {
            showFormMessage(`Erore client (${response.status}): Date invalide trimise catre server.`, 'error');
        } else {
            showFormMessage(`Erore server (${response.status}). Incercati mai tarziu.`, 'error');
        }
    } catch (error) {
        console.error(error);
        showFormMessage('Erore de retea. Verificati conexiunea la internet.', 'error');
    }
});

function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `message ${type}`;
}

// 3. stergere si Filtrare (Delegarea evenimentelor + Cautare In JS)
postsList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const li = e.target.closest('.post-item');
        const id = Number(li.dataset.id);

        try {
            // Simulam si apelul DELETE catre API
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

            // Actualizam starea locala si re-randam
            allPosts = allPosts.filter(post => post.id !== id);
            renderPosts(allPosts);
        } catch (error) {
            alert('Nu s-a putut sterge postarea din cauza unei erori de retea.');
        }
    }
});

// Filtrare In timp real cu Input Event
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = allPosts.filter(post => post.title.toLowerCase().includes(term));
    renderPosts(filtered);
});

// Initializare
fetchPosts();