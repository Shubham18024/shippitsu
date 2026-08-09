document.addEventListener('DOMContentLoaded', () => {
    const postGrid = document.getElementById('post-grid');
    const deleteModal = document.getElementById('delete-modal');
    const deleteModalTitle = document.getElementById('delete-modal-title');
    const deleteModalMessage = document.getElementById('delete-modal-message');
    const deleteConfirmButton = document.getElementById('delete-confirm-button');
    
    // Only run this script if we are actually on the homepage
    if (!postGrid) return;


    const storageKey = 'shippitsu_posts';
    const existingPostsJSON = localStorage.getItem(storageKey);
    let allPosts = [];
    
    if (existingPostsJSON) {
        allPosts = JSON.parse(existingPostsJSON);
    }

    // 2. Clear the placeholder HTML
    postGrid.innerHTML = '';

    // 3. If there are no posts, show a friendly message
    if (allPosts.length === 0) {
        postGrid.innerHTML = `
            <p style="color: var(--muted); grid-column: 1 / -1;">
                No posts yet. Head over to the Write page to publish your first article!
            </p>
        `;
        return;
    }

    let activeDeletePostId = null;

    function closeDeleteModal() {
        activeDeletePostId = null;
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }
    }

    function openDeleteModal(post) {
        activeDeletePostId = post.id;

        if (deleteModalTitle) {
            deleteModalTitle.textContent = 'Delete Post?';
        }

        if (deleteModalMessage) {
            deleteModalMessage.textContent = `Are you sure you want to delete “${post.title}”? This cannot be undone.`;
        }

        if (deleteModal) {
            deleteModal.style.display = 'flex';
        }
    }

    if (deleteConfirmButton) {
        deleteConfirmButton.addEventListener('click', () => {
            if (!activeDeletePostId) {
                return;
            }

            const posts = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const nextPosts = posts.filter((entry) => String(entry.id) !== String(activeDeletePostId));
            localStorage.setItem(storageKey, JSON.stringify(nextPosts));

            const postCard = postGrid.querySelector(`[data-post-id="${CSS.escape(String(activeDeletePostId))}"]`);
            if (postCard) {
                postCard.remove();
            }

            if (nextPosts.length === 0) {
                postGrid.innerHTML = `
                    <p style="color: var(--muted); grid-column: 1 / -1;">
                        No posts yet. Head over to the Write page to publish your first article!
                    </p>
                `;
            }

            closeDeleteModal();
        });
    }

    if (deleteModal) {
        deleteModal.addEventListener('click', (event) => {
            if (event.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }

    allPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'card post-card';
        card.dataset.postId = String(post.id);

        const link = document.createElement('a');
        link.href = `/post?id=${post.id}`;
        link.className = 'post-card-link';

        const stripMarkdown = window.ShippitsuMarkdown?.stripMarkdown || window.stripMarkdown || ((value) => value);
        const escapeHtml = window.ShippitsuMarkdown?.escapeHtml || window.escapeHtml || ((value) => value);
        const preview = stripMarkdown(post.content.substring(0, 140));

        link.innerHTML = `
            <h3>${escapeHtml(post.title)}</h3>
            <p style="margin-bottom: 8px;">${escapeHtml(preview)}${post.content.length > 140 ? '...' : ''}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                <span class="tag">${post.tag ? escapeHtml(post.tag) : ''}</span>
                <span style="font-family: var(--mono); font-size: 11px; color: var(--muted);">${escapeHtml(post.date)}</span>
            </div>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'post-delete-btn';
        deleteButton.title = 'Delete post';
        deleteButton.setAttribute('aria-label', `Delete ${post.title}`);
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H4V1.5A1.5 1.5 0 0 1 5.5 0h5A1.5 1.5 0 0 1 12 1.5V2h1.5a1 1 0 0 1 1 1M5.5 1a.5.5 0 0 0-.5.5V2h6v-.5a.5.5 0 0 0-.5-.5zM6 4h4v9H6z"/>
            </svg>
        `;

        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            openDeleteModal(post);
        });

        card.appendChild(link);
        card.appendChild(deleteButton);

        postGrid.appendChild(card);
    });
});