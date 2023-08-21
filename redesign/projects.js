const Tag = {
  WEBDEV: "Web Dev",
  TYPESCRIPT: "TypeScript", JAVASCRIPT: "JS",
  SVELTE: "Svelte", REACT: "React", VUE: "Vue",
  
  THREE_D: "3D", WEBGL: "WebGL", OPENGL: "OpenGL", UNITY: "Unity", UNREAL: "Unreal",
  SHADERS: "Shaders",
  LOOKING_GLASS: "Looking Glass",
  VR_AR_XR: "VR/AR/XR",
  
  UI_UX: "UI/UX",
  RESEARCH: "Research",
  DATAVIS: "Data Vis",
  
  THEATRE: "Theatre", ART: "Art",
  
  ASM: "Assembly", CS: "C#", CPP: "C++", ODIN: "Odin", RUST: "Rust",
  DATABASE: "Database", SQL: "SQL", POSTGRESQL: "Postgres", 
  
  MOBILE: "Mobile Dev",
  REACT_NATIVE: "React Native", FLUTTER: "Flutter",
  
  AWARD: "Award",
}

class Project {
  title;
  date;
  imgSrc;
  description;
  tags;
}

// TODO: add in dumping ground for class-specific assignments/collections

const projects = [
  {
    title: "OpenChiaL",               
    date: new Date("2022-06-01"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.THREE_D, Tag.OPENGL, Tag.CPP, Tag.SHADERS, Tag.ART],
    desc: "Lorem ipsum something about the project, to be decided later... I am cool, please hire me.",
  },
  {
    title: "Terrariam",               
    date: new Date("2022-03-26"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.VR_AR_XR, Tag.UI_UX, Tag.AWARD, Tag.CS, Tag.UNITY, Tag.SHADERS, Tag.LOOKING_GLASS],
    desc: "Lorem ipsum something about the project, to be decided later... I am cool, please hire me.",
  },
  {
    title: "BeatBoxer",               
    date: new Date("2022-04-15"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.VR_AR_XR, Tag.UI_UX, Tag.THREE_D, Tag.UNITY, Tag.SHADERS],
    desc: "Lorem ipsum something about the project, to be decided later... I am cool, please hire me.",
  },
  {
    title: "Coveytown Battlegrounds", 
    date: new Date("2022-04-15"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.WEBDEV, Tag.TYPESCRIPT, Tag.REACT, Tag.UI_UX],
    desc: "Lorem ipsum something about the project, to be decided later... I am cool, please hire me.",
  },
  {
    title: "Instagrat",               
    date: new Date("2020-08-15"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.WEBDEV, Tag.SVELTE, Tag.UI_UX, Tag.ART] ,
    desc: "Lorem ipsum something about the project, to be decided later... I am cool, please hire me.",
  },
  {
    title: "Boston Reddiment",        
    date: new Date("2019-04-15"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.RESEARCH, Tag.DATAVIS],
    desc: "Lorem ipsum something about the project, to be decided later... I am cool, please hire me.",
  },
  {
    title: "Connected",               
    date: new Date("2018-04-15"),
    imgSrc: "https://images.pexels.com/photos/5957094/pexels-photo-5957094.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    tags: [Tag.MOBILE, Tag.REACT_NATIVE, Tag.DATABASE, Tag.SQL, Tag.POSTGRESQL],
    desc: "Lorem ipsum something about the project, to be decided later... I am cool, please hire me.",
  }
]


/*
let currentProj;
window.onload = _ => {
  addProjects("section#portfolio .container");
}

function addProjects(selector) {
  let el = document.querySelector(selector);
  projects.forEach(project => {
    let h3 = document.createElement("h3");
    h3.classList.add('heather');
    h3.innerHTML = project.title;

    let desc = document.createElement("p");
    desc.innerHTML = project.desc;

    let tagList = document.createElement("ul");
    project.tags.forEach(tag => {
      let tagEl = document.createElement("li");
      tagEl.innerHTML = tag;
      tagList.appendChild(tagEl);
    })
    
    let imgContainer = document.createElement("header");
    imgContainer.style.backgroundImage = `url(${project.imgSrc})`;
    
    let projInfo = document.createElement("section");
    projInfo.appendChild(h3);
    projInfo.appendChild(desc);
    projInfo.appendChild(tagList);
    
    let article = document.createElement("article");
    article.appendChild(imgContainer);
    article.appendChild(projInfo)
    
    article.onclick = _ => {
      currentProj?.classList.toggle("selected");
      if (currentProj == article) {
        currentProj = null;
        return;
      }
      article.classList.toggle("selected");
      currentProj = article;
    }
    el.appendChild(article);
  });
}
*/

function setProject(project) {
  document.querySelector("#projects article h2").innerHTML = project.title;
  document.querySelector("#projects article .description").innerHTML = project.desc;
}