const writeForm = document.getElementById('write-form');

writeForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const tag = document.getElementById('tag').value;
    const content = document.getElementById('content').value;

    const newPost = {
        id: author.replace(/\s+/g, '').toLowerCase() + Date.now() + Math.floor(Math.random() * 100000).toString().padStart(5, '0'), // Creates a unique ID 
        title: title,
        author: author,
        tag: tag,
        content: content,
        date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    const storageKey = 'shippitsu_posts';
    const existingPostsJSON = localStorage.getItem(storageKey);
    let allPosts = [];

    if (existingPostsJSON) {
        allPosts = JSON.parse(existingPostsJSON);
    }
    allPosts.unshift(newPost);

    localStorage.setItem(storageKey, JSON.stringify(allPosts));

    window.location.href = '/';
});