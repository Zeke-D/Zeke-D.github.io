const Tag = {
  WEBDEV: "Web Dev",
  TYPESCRIPT: "TypeScript", JAVASCRIPT: "JS",
  SVELTE: "Svelte", REACT: "React", VUE: "Vue",
  
  THREE_D: "3D", WEBGL: "WebGL", OPENGL: "OpenGL", UNITY: "Unity", UNREAL: "Unreal",
  SHADERS: "Shaders",
  LOOKING_GLASS: "Looking Glass",
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
    title: "Condor",
    subtitle: "Human Computer Interaction",
    date: new Date("2023-04-07"),
    tags: [Tag.UI_UX, Tag.HCI, Tag.WEBDEV],
    desc: "A semester long group project teaching us how to iteratively test designs each step of the way. Through lofi paper prototypes all the way up to a hifi mockup, we built a travel planning application interface.",
  },
  {
    title: "OpenChiaL",               
    subtitle: "Computer Graphics",
    date: new Date("2022-06-01"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.THREE_D, Tag.OPENGL, Tag.CPP, Tag.SHADERS, Tag.ART],
    desc: "The culmination of my first semester-long foray into the world of low-level graphics. " + 
          "This program takes in a triangulated .obj file and renders it as Chia pet, growing grass out of the faces. " +
          "Using deferred rendering techniques I create a brush for users to paint their pets with."
    ,
  },
  {
    title: "Terrariam",               
    subtitle: "MIT RealityHack 2023 Winner",
    date: new Date("2022-03-26"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.VR_AR_XR, Tag.UI_UX, Tag.AWARD, Tag.CS, Tag.UNITY, Tag.SHADERS, Tag.LOOKING_GLASS],
    desc: "Lorem ipsum something about the project, to be decided later... I am cool, please hire me.",
  },
  {
    title: "BeatBoxer",               
    date: new Date("2022-03-01"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.VR_AR_XR, Tag.UI_UX, Tag.THREE_D, Tag.UNITY, Tag.SHADERS],
    desc: "A clone of a certain popular music-slashing VR hit... this time Rocky style!",
  },
  {
    title: "Coveytown Battlegrounds", 
    subtitle: "Software Engineering",
    date: new Date("2022-04-15"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.WEBDEV, Tag.TYPESCRIPT, Tag.REACT, Tag.UI_UX],
    desc: "What would make a group project requiring a semester's worth of planning and interoperating with a multi-thousand line codebase more exciting? Implementing an entire TypeScript game engine, of course!<br>" +
          "For this project, I implemented a real-time turn-based game for settling arguments within an online media platform.",
  },
  {
    title: "Instagrat",               
    date: new Date("2020-08-15"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.WEBDEV, Tag.SVELTE, Tag.UI_UX, Tag.ART] ,
    desc: `This was a tactical-media art installation created for my Experience Design class using Svelte. I wanted to experiment with using the common infinite-timeline as a narrative device.`,
    link: "projects/Instagrat/index.html",
  },
  {
    title: "Boston Reddiment",        
    date: new Date("2019-04-15"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
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
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.MOBILE, Tag.REACT_NATIVE, Tag.DATABASE, Tag.SQL, Tag.POSTGRESQL],
    desc: `Fun little experiment to learn React Native and Adobe XD.`,
  }
]

function loadProjects() {
  addProjects("section#projects", projects.sort((a, b) => a.date < b.date));
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

  let desc = document.createElement("p");
  desc.innerHTML = project.desc;
  article.append(desc);

  if (project.link) {
    let link = document.createElement('a');
    link.href = project.link;
    link.innerHTML = "See It";
    article.append(link);
  }

  let tags = document.createElement("ul");
  tags.classList.add("tags");
  for (let tag of project.tags) {
    let tagEl = document.createElement("li");
    tagEl.innerHTML = tag;
    tags.appendChild(tagEl);
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