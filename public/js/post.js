(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('post-container');

        if (!container) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        const allPosts = JSON.parse(localStorage.getItem('shippitsu_posts') || '[]');
        const post = allPosts.find((entry) => String(entry.id) === postId);

        if (!post) {
            container.innerHTML = `
                <h1>Post not found</h1>
                <p>This article might have been deleted or doesn't exist.</p>
                <a href="/" class="btn-outline">Back to Home</a>
            `;
            return;
        }

        const escapeHtml = window.ShippitsuMarkdown?.escapeHtml || window.escapeHtml;
        const renderMarkdown = window.ShippitsuMarkdown?.renderMarkdown || window.renderMarkdown;

        container.innerHTML = `
            <p class="eyebrow">${escapeHtml(post.tag || 'Article')}</p>
            <h1 style="font-size: 44px; margin-bottom: 12px;">${escapeHtml(post.title)}</h1>
            <div style="font-family: var(--mono); font-size: 13px; color: var(--muted); margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid var(--border);">
                Written by ${escapeHtml(post.author)} on ${escapeHtml(post.date)}
            </div>
            <div class="markdown-content">${renderMarkdown(post.content)}</div>
        `;
    });
})();