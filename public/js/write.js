(function () {
    const writeForm = document.getElementById('write-form');

    if (!writeForm) {
        return;
    }

    const contentArea = document.getElementById('content');
    const wordCountDisplay = document.getElementById('word-count-display');
    const clearModal = document.getElementById('clear-modal');
    const previewTitle = document.getElementById('preview-title');
    const previewMeta = document.getElementById('preview-meta');
    const previewBody = document.getElementById('preview-body');
    const previewStats = document.getElementById('preview-stats');

    const storageKey = 'shippitsu_posts';
    let textHistory = [contentArea.value];
    let historyIndex = 0;

    function syncHistory() {
        const currentValue = contentArea.value;

        if (currentValue === textHistory[historyIndex]) {
            return;
        }

        if (historyIndex < textHistory.length - 1) {
            textHistory = textHistory.slice(0, historyIndex + 1);
        }

        textHistory.push(currentValue);
        historyIndex = textHistory.length - 1;
    }

    function countWords(text) {
        const strippedText = String(text || '').replace(/```[\s\S]*?```/g, ' ').trim();

        if (!strippedText) {
            return 0;
        }

        if (window.Intl && typeof window.Intl.Segmenter === 'function') {
            const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
            let wordCount = 0;

            for (const segment of segmenter.segment(strippedText)) {
                if (segment.isWordLike) {
                    wordCount += 1;
                }
            }

            return wordCount;
        }

        const words = strippedText.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu);
        return words ? words.length : 0;
    }

    function updateWordCount() {
        const wordTotal = countWords(window.ShippitsuMarkdown?.stripMarkdown(contentArea.value) || contentArea.value);
        wordCountDisplay.textContent = `Word count: ${wordTotal}`;
        previewStats.textContent = `${wordTotal} words`;
    }

    function updatePreview() {
        const title = document.getElementById('title').value.trim();
        const tag = document.getElementById('tag').value.trim();
        const rawContent = contentArea.value.trim();
        const renderMarkdown = window.ShippitsuMarkdown?.renderMarkdown || window.renderMarkdown || ((value) => value);
        const escapeHtml = window.ShippitsuMarkdown?.escapeHtml || window.escapeHtml || ((value) => value);

        previewTitle.textContent = title || 'Your title will appear here';
        previewMeta.textContent = tag ? `# ${tag.replace(/^#/, '').trim()}` : 'Add tags and start writing to see a live markdown preview.';

        if (!rawContent) {
            previewBody.classList.add('preview-empty');
            previewBody.innerHTML = 'Nothing to preview yet.';
            return;
        }

        previewBody.classList.remove('preview-empty');
        previewBody.innerHTML = renderMarkdown(rawContent) || escapeHtml(rawContent);
    }

    function attachLiveFields() {
        const titleInput = document.getElementById('title');
        const tagInput = document.getElementById('tag');

        titleInput.addEventListener('input', updatePreview);
        tagInput.addEventListener('input', updatePreview);
    }

    function formatText(prefix, suffix) {
        const start = contentArea.selectionStart;
        const end = contentArea.selectionEnd;
        const text = contentArea.value;
        const selectedText = text.substring(start, end);
        const replacement = `${prefix}${selectedText}${suffix}`;

        contentArea.value = text.substring(0, start) + replacement + text.substring(end);
        contentArea.selectionStart = start + prefix.length;
        contentArea.selectionEnd = start + prefix.length + selectedText.length;
        contentArea.focus();

        updateWordCount();
        updatePreview();
        syncHistory();
    }

    function insertCodeBlock() {
        const start = contentArea.selectionStart;
        const end = contentArea.selectionEnd;
        const text = contentArea.value;
        const selectedText = text.substring(start, end);
        const block = `\n\`\`\`\n${selectedText}\n\`\`\`\n`;

        contentArea.value = text.substring(0, start) + block + text.substring(end);
        contentArea.selectionStart = start + 5;
        contentArea.selectionEnd = start + 5 + selectedText.length;
        contentArea.focus();

        updateWordCount();
        updatePreview();
        syncHistory();
    }

    function customUndo() {
        if (historyIndex <= 0) {
            return;
        }

        historyIndex -= 1;
        contentArea.value = textHistory[historyIndex];
        updateWordCount();
        updatePreview();
        contentArea.focus();
    }

    function customRedo() {
        if (historyIndex >= textHistory.length - 1) {
            return;
        }

        historyIndex += 1;
        contentArea.value = textHistory[historyIndex];
        updateWordCount();
        updatePreview();
        contentArea.focus();
    }

    function showClearModal() {
        clearModal.style.display = 'flex';
    }

    function hideClearModal() {
        clearModal.style.display = 'none';
    }

    function confirmClear() {
        contentArea.value = '';
        updateWordCount();
        updatePreview();
        syncHistory();
        hideClearModal();
        contentArea.focus();
    }

    writeForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const tag = document.getElementById('tag').value.trim();
        const content = contentArea.value;

        const newPost = {
            id: `shubhamtiwari${Date.now()}${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
            title,
            author: 'Shubham Tiwari',
            tag,
            content,
            date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
        };

        const allPosts = JSON.parse(localStorage.getItem(storageKey) || '[]');
        allPosts.unshift(newPost);
        localStorage.setItem(storageKey, JSON.stringify(allPosts));

        window.location.href = '/';
    });

    contentArea.addEventListener('input', function () {
        updateWordCount();
        updatePreview();
        syncHistory();
    });

    contentArea.addEventListener('keydown', function (event) {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
            event.preventDefault();

            if (event.shiftKey) {
                customRedo();
            } else {
                customUndo();
            }
        }
    });

    updateWordCount();
    updatePreview();
    attachLiveFields();

    window.formatText = formatText;
    window.insertCodeBlock = insertCodeBlock;
    window.customUndo = customUndo;
    window.customRedo = customRedo;
    window.showClearModal = showClearModal;
    window.hideClearModal = hideClearModal;
    window.confirmClear = confirmClear;
})();