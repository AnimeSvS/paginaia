// blog.js - Carga dinámica de entradas desde el backend

async function loadBlogEntries() {
    try {
        const res = await fetch('/api/blog');
        const entries = await res.json();

        const container = document.getElementById('blog-entries');
        const emptyMsg = document.getElementById('blog-empty');

        if (!entries.length) {
            emptyMsg.classList.remove('d-none');
            return;
        }

        container.innerHTML = entries.map(entry => `
      <div class="col-md-6 col-lg-4">
        <article class="blog-card card h-100">
          ${entry.foto ? `<img src="${entry.foto}" alt="${entry.titulo}" class="blog-img">` : ''}
          <div class="card-body">
            <h5 class="blog-title">${entry.titulo}</h5>
            <p class="blog-text">${entry.texto}</p>
            <small class="blog-date">${new Date(entry.fecha).toLocaleDateString('es-ES')}</small>
          </div>
        </article>
      </div>
    `).join('');
    } catch (error) {
        console.error('Error al cargar el blog:', error);
    }
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', loadBlogEntries);