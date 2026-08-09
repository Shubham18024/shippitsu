const writeForm = document.getElementById('write-form');

writeForm.addEventListener('submit', function (event) {
    event.preventDefault();  //avoid the default form submission behavior

    const title = document.getElementById('title').value;
    const tag = document.getElementById('tag').value;
    const content = document.getElementById('content').value;

    const newPost = {
        id: 'shubhamtiwari' + Date.now() + Math.floor(Math.random() * 100000).toString().padStart(5, '0'), // Creates a unique ID with author name, timestamp, and a random number
        title: title,
        author: 'Shubham Tiwari',  // Hardcoded author name
        tag: tag,
        content: content,
        date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
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