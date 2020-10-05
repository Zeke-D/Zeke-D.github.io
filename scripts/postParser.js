/* MUTATES DOCUMENT */
function addPostsToPage(selector, postArray) {
    let parent = document.querySelector(selector);
    console.log("adding posts...");
    postArray.map(post => parent.append(createDOMPost(post)));
}

function createDOMPost(postObj) {
    const {id, title, date, summary, tags, link} = postObj;
    let container = document.createElement('div');
    container.classList = ["post", "card"];

    let info = document.createElement('div');
    let h2 = makeAndSet('h2', title);
    let dateString = makeAndSet('p', new Date(date).toLocaleDateString());
    info.append(h2, dateString);

    let text = makeAndSet('p', summary);

    let readMore = makeAndSet('a', "Read more...");
    readMore.href = link;

    container.append(info, text, readMore);
    return container;
}

function makeAndSet(nodename, innerHTML) {
    let node = document.createElement(nodename);
    node.innerHTML = innerHTML;
    return node;
}