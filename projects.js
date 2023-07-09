const Tag = {
  WEBDEV: "Web Dev",
  TYPESCRIPT: "TypeScript", JAVASCRIPT: "JS",
  SVELTE: "Svelte", REACT: "React", VUE: "Vue",
  
  THREE_D: "3D", WEBGL: "WebGL", OPENGL: "OpenGL", UNITY: "Unity", UNREAL: "Unreal",
  SHADERS: "Shaders",
  VR_AR_XR: "VR/AR/XR",
  
  UI_UX: "UI/UX", HCI: "HCI",
  RESEARCH: "Research",
  DATAVIS: "Data Vis",
  
  ACTING: "Acting", ART: "Art",
  
  ASM: "Assembly", CS: "C#", CPP: "C++", ODIN: "Odin", RUST: "Rust",
  DATABASE: "Database", SQL: "SQL", POSTGRESQL: "Postgres", 
  
  MOBILE: "Mobile Dev",
  REACT_NATIVE: "React Native", FLUTTER: "Flutter",
  
  AWARD: "Award",
}

// TODO: add in dumping ground for class-specific assignments/collections

const projects = [
  {
    title: "Terrariam",               
    subtitle: "MIT RealityHack 2023 Winner",
    date: new Date("2022-03-26"),
    images: ["imgs/Terrariam/me-talking.jpeg"],
    iframes: [
      "https://www.youtube.com/embed/wtCWMM_7NuE?enablejsapi=1",
      "https://www.youtube.com/embed/aM9F0wimqzY?enablejsapi=1",
    ],
    tags: [Tag.VR_AR_XR, Tag.UI_UX, Tag.AWARD, Tag.CS, Tag.UNITY, Tag.SHADERS, ],
    desc: "This project aimed to physicalize an emotional environment. Using a <a href='https://lookingglassfactory.com/'>holographic display</a>, we rendered realtime interpretations of" + 
          " webcam emotional data. We ended up finishing<b> Top 10 </b>in the whole event and won<b> 1st Prize </b>for the Looking Glass subcategory.",
    links: [
      {text: "LKG Blog", url: "https://blog.lookingglassfactory.com/community/looking-glass-factory-x-mit-reality-hack/"},
      {text: "Khoury News", url:"https://www.khoury.northeastern.edu/khoury-college-students-win-award-for-holographic-project-at-mit-hackathon/"},
    ],
  },
  {
    title: "Condor",
    subtitle: "Human Computer Interaction",
    date: new Date("2023-04-07"),
    tags: [Tag.UI_UX, Tag.HCI, Tag.WEBDEV],
    desc: "A semester long group project teaching us how to iteratively test designs each step of the way. Through lofi paper prototypes all the way up to a hifi mockup, we built a travel planning application interface.",
    images: [
      "imgs/Condor/PaperPrototype.PNG"
    ],
    iframes: [
      "https://youtube.com/embed/4ZIGfC6iR3k?enablejsapi=1",
      "https://codepen.io/Pseudonymous/embed/YzOgVVw?default-tab=result",
    ],
  },
  {
    title: "OpenChiaL",               
    subtitle: "Computer Graphics",
    date: new Date("2022-06-01"),
    images: [
      "imgs/OpenChiaL/Grass.PNG",
      "imgs/OpenChiaL/Rabbit.PNG",
      "imgs/OpenChiaL/Rabbit2.PNG",
    ],
    iframes: [
      "https://www.youtube.com/embed/kVwgti5Q0po?enablejsapi=1",
    ],
    tags: [Tag.THREE_D, Tag.OPENGL, Tag.CPP, Tag.SHADERS, Tag.ART],
    desc: "The culmination of my first semester-long foray into the world of low-level graphics. " + 
          "This program takes in a triangulated .obj file and renders it as a Chia pet, growing grass out of the faces. " +
          "Using deferred rendering techniques I create a brush for users to paint their pets with."
    ,
  },
  {
    title: "Coveytown Battlegrounds", 
    subtitle: "Software Engineering",
    date: new Date("2022-04-15"),
    iframes: [
      "https://www.youtube.com/embed/t_5VT0DOnFA?enablejsapi=1",
    ],
    images: [
      "imgs/CoveyTown/tag.PNG",
      "imgs/CoveyTown/wizard-wars.PNG",
    ],
    tags: [Tag.WEBDEV, Tag.TYPESCRIPT, Tag.REACT, Tag.UI_UX],
    desc: "What would make a group project requiring a semester's worth of planning and interoperating with a multi-thousand line codebase more exciting? Implementing an entire TypeScript game engine, of course!<br>" +
          "For this project, I implemented a real-time turn-based game for settling arguments within an online media platform.",
  },
  // {
  //   title: "BeatBoxer",               
  //   date: new Date("2022-03-01"),
  //   media: ["https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"],
  //   tags: [Tag.VR_AR_XR, Tag.UI_UX, Tag.THREE_D, Tag.UNITY, Tag.SHADERS],
  //   desc: "A clone of a certain popular music-slashing VR hit... this time Rocky style!",
  // },
  {
    title: "Instagrat",               
    date: new Date("2020-08-15"),
    media: ["https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"],
    tags: [Tag.WEBDEV, Tag.SVELTE, Tag.UI_UX, Tag.ART] ,
    desc: `This was a tactical-media art installation created for my Experience Design class using Svelte. I wanted to experiment with using the common infinite-timeline as a narrative device.`,
    links: [{url: "projects/Instagrat/index.html", text: "See it"}],
  },
  {
    title: "Boston Reddiment",        
    date: new Date("2019-04-15"),
    media: ["https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"],
    tags: [Tag.RESEARCH, Tag.DATAVIS],
    desc: `<ul>
            <li>Performed Sentiment Analysis on the Reddit Ecosystem</li>
            <li>Wrangled R and Google's BigQuery to generate relevant data visualizations</li>
            <li>Established observable patterns in the mood of Reddit over year-long trends</li>
          </ul>`,
  },
  {
    title: "Connected",               
    date: new Date("2018-04-15"),
    media: ["https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"],
    tags: [Tag.MOBILE, Tag.REACT_NATIVE, Tag.DATABASE, Tag.SQL, Tag.POSTGRESQL],
    desc: `Fun little experiment to learn React Native and Adobe XD.`,
  }
]

function loadProjects() {
  addProjects("section#projects", projects) //.sort((a, b) => a.date < b.date));
}

function makeProject(project) {
  // <article>
  //   <h3>CoveyTown Battlegrounds</h3>
  //   <span>Software Engineering Final Project</span>
  //   <button class="add-bookmark">Bookmark</button>
  //   <button class="bookmark"></button>
  // </article>
  let article = document.createElement("article");
  let title = document.createElement("h3");
  title.innerHTML = project.title;
  article.append(title);

  if (project.subtitle) {
    let subtitle = document.createElement("span");
    subtitle.innerHTML = project.subtitle;
    article.append(subtitle);
  }

  let months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]

  let dateEl = document.createElement('span');
  dateEl.classList.add('date');
  dateEl.innerHTML = `${months[project.date.getMonth()]} ${project.date.getUTCFullYear()}`;
  article.append(dateEl);

  let desc = document.createElement("p");
  desc.innerHTML = project.desc;
  article.append(desc);

  let links = document.createElement("ul");
  links.classList.add("links");
  project.links?.forEach(link => {
    let linkEl = document.createElement('a');
    linkEl.classList.add("btn");
    linkEl.href = link.url;
    linkEl.innerHTML = link.text;
    links.append(linkEl);
  })
  article.append(links);
  
  let tags = document.createElement("ul");
  tags.classList.add("tags");
  for (let tag of project.tags) {
    let tagEl = document.createElement("li");
    tagEl.innerHTML = tag;
    tags.appendChild(tagEl);
  }

  if (project.iframes || project.images) {
    let mediaStack = document.createElement("ul");

    // all media-stacks will have an associated paperclip as a sibling
    let paperClip = document.createElement("div");
    paperClip.classList.add('paperclip');
    paperClip.classList.add("media") // as opposed to news clip
    article.append(paperClip);

    mediaStack.classList.add("media-stack");
    project.iframes?.forEach(video => {
      let item = document.createElement("li");
      let vid = document.createElement("iframe");
      vid.src = video;
      item.append(vid);
      mediaStack.append(item)
    })
    project.images?.forEach(image => {
      let item = document.createElement("li");
      let img  = document.createElement("img");
      img.src = image;
      item.append(img);
      mediaStack.append(item)
    })
    article.append(mediaStack)
  }
  

  let bookmark = document.createElement("button");
  bookmark.classList.add("bookmark");
  [tags, bookmark].forEach(el => article.append(el))

  return article;
}

function addProjects(selector, projects) {
  let domEl = document.querySelector(selector);
  projects.forEach(project => domEl.prepend(makeProject(project)));
}