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
    subtitle: "MIT RealityHack 2023 Finalist",
    date: new Date("2022-03-26"),
    images: [
      {
        position: "87% center",
        src: "imgs/Terrariam/me-talking.jpeg"
      },
      {
        src: "imgs/Terrariam/me-talking.jpeg",
        iframe: "https://www.youtube.com/embed/wtCWMM_7NuE?enablejsapi=1",
      },
      {
        src: "imgs/Terrariam/me-talking.jpeg",
        iframe: "https://www.youtube.com/embed/aM9F0wimqzY?enablejsapi=1",
      },
    ],
    tags: [Tag.VR_AR_XR, Tag.UI_UX, Tag.AWARD, Tag.CS, Tag.UNITY, Tag.SHADERS, ],
    desc: "This project aimed to physicalize an emotional environment. Using a <a href='https://lookingglassfactory.com/'>holographic display</a>, we rendered realtime interpretations of" + 
          " webcam emotional data. We ended up finishing<b> Top 10 </b>in the whole event and won<b> 1st Prize </b>for the Looking Glass subcategory. Recently demonstrated the project at AWE 2023 this past June.",
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
      {
        src: "imgs/Condor/PaperPrototype.png",
      },
      {
        src: "imgs/Condor/PaperPrototype.png",
        iframe: "https://youtube.com/embed/4ZIGfC6iR3k?enablejsapi=1",
      },
      {
        src: "imgs/Condor/PaperPrototype.png",
        iframe: "https://codepen.io/Pseudonymous/embed/YzOgVVw?default-tab=result",
      }
    ],
  },
  {
    title: "OpenChiaL",               
    subtitle: "Computer Graphics",
    date: new Date("2022-06-01"),
    images: [
      {src: "imgs/OpenChiaL/Grass.png"},
      {src: "imgs/OpenChiaL/Rabbit.png"},
      {src: "imgs/OpenChiaL/Rabbit2.png"},
      {
        src: "imgs/OpenChiaL/Rabbit2.png", 
        iframe: "https://www.youtube.com/embed/kVwgti5Q0po?enablejsapi=1",
      },
    ],
    tags: [Tag.THREE_D, Tag.OPENGL, Tag.CPP, Tag.SHADERS, Tag.ART],
    desc: "The culmination of a semester-long foray into the world of low-level graphics. " + 
          "This program takes in a triangulated .obj file and renders it as a Chia pet, growing grass out of the faces. " +
          "Using deferred rendering techniques I create a brush for users to paint their pets with."
    ,
  },
  {
    title: "Coveytown Battlegrounds", 
    subtitle: "Software Engineering",
    date: new Date("2022-04-15"),
    images: [
      {src: "imgs/CoveyTown/tag.png"},
      {src: "imgs/CoveyTown/wizard-wars.png"},
      {
        src: "imgs/CoveyTown/wizard-wars.png",
        iframe:  "https://www.youtube.com/embed/t_5VT0DOnFA?enablejsapi=1",
      },
    ],
    tags: [Tag.WEBDEV, Tag.TYPESCRIPT, Tag.REACT, Tag.UI_UX],
    desc: "What would make a group project requiring a semester's worth of planning and interoperating with a multi-thousand line codebase more exciting? Implementing an entire TypeScript game engine, of course!<br>" +
          "For this project, I implemented a real-time turn-based game for settling arguments within an online media platform.",
  },
  /*
  {
    title: "BeatBoxer",               
    date: new Date("2022-03-01"),
    tags: [Tag.VR_AR_XR, Tag.UI_UX, Tag.THREE_D, Tag.UNITY, Tag.SHADERS],
    desc: "A clone of a certain popular music-slashing VR hit... this time Rocky style!",
  },
  */
  {
    title: "CyberRunner 2048",               
    date: new Date("2022-04-01"),
    tags: [Tag.VR_AR_XR, Tag.UI_UX, Tag.THREE_D, Tag.UNITY, Tag.SHADERS],
    images: [
      {src: "imgs/CyberRunner/gamepic.png"},
      {src: "imgs/CyberRunner/promo.png"},
      {src: "imgs/CyberRunner/promo.png",
       iframe: "https://youtube.com/embed/IVsZ5CNVieU?enablejsapi=1",
      },
    ],
    desc: "A video game project made for my Mixed Reality class final.",
  },
  {
    title: "Instagrat",               
    date: new Date("2020-08-15"),
    tags: [Tag.WEBDEV, Tag.SVELTE, Tag.UI_UX, Tag.ART] ,
    desc: `This was a tactical-media art installation created for my Experience Design class using Svelte. I wanted to experiment with using the common infinite-timeline as a narrative device.`,
    images: [
      {src: "imgs/Instagrat/Thumb.png"}
    ],
    links: [{url: "projects/Instagrat/index.html", text: "See it"}],
  },
  /*
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
  */
  {
    title: "Connected",               
    date: new Date("2018-04-15"),
    images: [
      { src: "imgs/Connected/Hero.jpg" },
      { src: "imgs/Connected/UI-proto.png" },
      { src: "imgs/Connected/UI-design.png" },
      { src: "imgs/Connected/Demo.mov" },
      { src: "imgs/Connected/Demo2.mov" },
      { src: "imgs/Connected/UI_Demo.mp4" },
    ],
    tags: [Tag.MOBILE, Tag.REACT_NATIVE, Tag.DATABASE, Tag.SQL, Tag.POSTGRESQL],
    desc: `Fun little experiment to learn React Native and Adobe XD.`,
  }
]


/*
function loadProjects() {
  addProjects("section#projects", projects.filter(proj => proj.date > new Date("2020-01-01"))) //.sort((a, b) => a.date < b.date));
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
  article.append(tags);
  // article.append(bookmark);

  return article;
}

function addProjects(selector, projects) {
  let domEl = document.querySelector(selector);
  projects.forEach(project => domEl.prepend(makeProject(project)));
}

*/


function setProject(project) {
  document.querySelector("#projects article h2").innerHTML = project.title;
  document.querySelector("#projects article .description").innerHTML = project.desc;
  
  let imagesContainer = document.querySelector("#projects article .images")
  imagesContainer.innerHTML = "";
  // add iframes and images
  let main = document.querySelector("figure.main");
  
  if (project.images?.length > 0 || project.iframes?.length > 0) {
    project.images.forEach(image => {
      let newIcon = document.createElement("div");
      let position = image.position ?? "center center";

      if (image.iframe) {
        // video 
        let className = image.iframe.includes("youtube") ? "video-thumb" : "iframe-thumb";
        newIcon.classList.add(className);
      }
      else {
        if (image.src.includes(".mp4") || image.src.includes(".mov") ) {
          newIcon.classList.add("video-thumb");
        }
        else {
          // flat image
          newIcon.style.backgroundImage = `url(./${image.src})`;
          newIcon.style.backgroundPosition = position;
        }
      }
      
      newIcon.onclick = _ => {
        // reset main element
        main.innerHTML = "";
        main.style.backgroundImage = `none`;
        
        if (image.iframe) {
          // TODO: deal with iframes
          main.style.backgroundImage = "";
          let newIframe = document.createElement("iframe");
          newIframe.src = image.iframe;
          main.appendChild(newIframe);
        }
        else {
          if (image.src.includes(".mp4") || image.src.includes(".mov") ) {
            let video = document.createElement("video");
            video.src = image.src;
            video.controls = true;
            main.appendChild(video);
          }
          else {
            main.style.backgroundImage = `url(./${image.src})`;
            main.style.backgroundPosition = position;
          }
        }
      }
      imagesContainer.appendChild(newIcon);
    })


    imagesContainer.querySelector("div").onclick();

  }
}

let cur_ind = 0;
let projLinks = [];
window.onload = _ => {
  let nav = document.querySelector("#proj-nav");
  projects.forEach((proj, ind) => {
    let h1 = document.createElement("h1");
    h1.innerHTML = (ind < 10 ? "0" : "") + ind;
    h1.onclick = _ => {
      setProject(proj);
      projLinks[cur_ind].classList.remove("active");
      h1.classList.add("active");
      cur_ind = ind;
    }
    projLinks.push(h1);
    nav.appendChild(h1);
  })
  projLinks[0].onclick();
}