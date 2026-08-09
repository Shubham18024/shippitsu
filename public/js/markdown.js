(function () {
    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function sanitizeUrl(rawUrl) {
        const url = String(rawUrl || '').trim();

        if (/^(https?:|mailto:|\/|#)/i.test(url)) {
            return escapeHtml(url);
        }

        return '#';
    }

    function renderInline(markdown) {
        let html = markdown;

        html = html.replace(/&lt;u&gt;([\s\S]*?)&lt;\/u&gt;/g, '<u>$1</u>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/(^|[\s(>])\*(?!\s)([^*\n]+?)\*(?=[\s<).,!?:;]|$)/g, function (_, prefix, content) {
            return `${prefix}<em>${content}</em>`;
        });
        html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, text, url) {
            return `<a href="${sanitizeUrl(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        });

        return html;
    }

    function renderCodeBlocks(markdown) {
        const codeBlocks = [];

        let html = escapeHtml(String(markdown || ''));

        html = html.replace(/```([a-z0-9_-]+)?\n([\s\S]*?)```/gi, function (_, language, code) {
            const index = codeBlocks.length;
            const languageClass = language ? ` class="language-${escapeHtml(language)}"` : '';
            const codeHtml = code.replace(/\n$/, '');

            codeBlocks.push(`<pre><code${languageClass}>${codeHtml}</code></pre>`);
            return `%%CODE_BLOCK_${index}%%`;
        });

        return { html, codeBlocks };
    }

    function renderMarkdown(markdown) {
        const renderedCode = renderCodeBlocks(markdown);
        let html = renderInline(renderedCode.html);
        html = html.replace(/\n/g, '<br>');

        return html.replace(/%%CODE_BLOCK_(\d+)%%/g, function (_, index) {
            return renderedCode.codeBlocks[Number(index)] || '';
        });
    }

    function stripMarkdown(markdown) {
        return String(markdown || '')
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/(^|[\s(>])\*(?!\s)([^*\n]+?)\*(?=[\s<).,!?:;]|$)/g, '$1$2')
            .replace(/~~(.+?)~~/g, '$1')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    window.ShippitsuMarkdown = {
        escapeHtml,
        renderMarkdown,
        stripMarkdown,
    };

    window.escapeHtml = escapeHtml;
    window.renderMarkdown = renderMarkdown;
    window.stripMarkdown = stripMarkdown;
})();