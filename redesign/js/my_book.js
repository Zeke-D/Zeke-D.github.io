let _prop = 0;
const AnimatedProperties = {
  Rotation: {
    X: _prop++,
  },
  Position: {
    Y: _prop++,
    Z: _prop++,
  }
}

const HitType = {
  Bookmark: _prop++,
}




window.onload = _ => {
      const TAU = 6.283;
      // l(inearly)-(int)erp(olates) between a and b based on ratio [0, 1] t
      function lerp(a, b, t) { return a + t * (b - a); }
      function easeout(a, b, t) { return lerp(a, b, Math.sqrt(t)); }
      function easein(a, b, t) { return lerp(a, b, t*t); }
      function easeinout(a, b, t) { return lerp(easein(a, b, t), easeout(a, b, t), t); }
      function sinspike(a, b, t) { return lerp(a, b, Math.sin(t * TAU / 2)) }


      // throttle function taken from 
      // https://johnkavanagh.co.uk/writing/throttling-scroll-events-in-javascript/
      const throttle = (fn, delay) => {   
        let time = Date.now();    
        return e => {    
          if((time + delay - Date.now()) <= 0) {       
            fn(e);       
            time = Date.now();     
          }   
        }
      }   


      /* 
      We want to make a book. Things we need to be able to do:
      - Create n pages between 2 covers
      - Flip to any page (next, previous, n):
        - This involves every page < n also being flipped up first
        - Every page > n flipped down
        - Intuition says a while loop since we will always be going in linear order
        - If desired index > current index, flip each page up until we reach page
        - If desired index < current index, flip each page down until we reach page
        - If des = cur, do nothin'
      */

      let PAGE_THICKNESS = .0125;
      let COVER_THICKNESS = .035;

      // TODO: take in projects array, texture cubes based on projs
      // for now, constructs n pag4s and returns them as an array of THREE objs
      function makeBook(numPages) {
        function makePage(color, width, height, thickness, origin) {
          // makes a transform anchor point
          let anchor = new THREE.Object3D();
          anchor.position.set(origin.x, origin.y, origin.z)
          const pageGeo = new THREE.BoxGeometry(width, height, thickness);
          const pageMat = new THREE.MeshPhongMaterial({ color: color });
          const page = new THREE.Mesh(pageGeo, pageMat);
          // adds box geometry as child to anchor point
          anchor.add(page);
          page.position.set(0, 0, 0); // zero out pos just in case
          page.translateY(-.5 * height);
          return anchor;
        }
        let origin = new THREE.Vector3(0, 0, 0);
        let frontCover = makePage(0x0088cc, 3.1, 2.05, COVER_THICKNESS, origin);
        let pages = [frontCover];
        for (let i = 0; i < numPages; i++) {
          let page = makePage(0xfcf7e8 , 3, 2, PAGE_THICKNESS, 
            new THREE.Vector3(origin.x, origin.y, origin.z - (COVER_THICKNESS + i * PAGE_THICKNESS)));
          pages.push(page);
        }
        let backCover = makePage(0xaa4080, 3.1, 2.05, COVER_THICKNESS, 
          new THREE.Vector3(origin.x, origin.y, origin.z - (COVER_THICKNESS + numPages * PAGE_THICKNESS + COVER_THICKNESS)));
        pages.push(backCover);
        return pages;
      }

      // sets up camera and renderer
      function setupCamera() {
        const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, .1, 1000);
        camera.position.z = 8;
        renderer.setSize(window.innerWidth, window.innerHeight);
        return camera
      }


      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer();
      document.body.appendChild(renderer.domElement);
      let camera = setupCamera();

      // create the desk
      let deskHeight = 10;
      const desk = new THREE.Mesh(
        new THREE.BoxGeometry(deskHeight, deskHeight * window.innerHeight / window.innerWidth, 2), 
        new THREE.MeshPhongMaterial({ color: 0x333333})
      );
      scene.add(desk);
      desk.position.z = -2;


      // reset aspect ratio when browser is resized
      window.onresize = _ => camera = setupCamera();

      let pages = makeBook(10);
      pages.forEach(page => registerOriginalData(page))
      let book = new THREE.Object3D();
      for (let page of pages) { 
        book.add(page);
      }


      // add bookmark
      let bmp = pages[4];
      let bookmark = new THREE.Mesh(
        new THREE.BoxGeometry(.8, 2, .01), 
        new THREE.MeshPhongMaterial({ color: 0x22ccff})
      );
      bookmark.userData.hitType = HitType.Bookmark;
      bookmark.userData.pageNum = 4;
      bmp.add(bookmark);
      bookmark.position.y -= 1.2;
      bookmark.position.z += PAGE_THICKNESS * .8;
      registerOriginalData(bookmark);

      let raycaster = new THREE.Raycaster();

      function getMouseIntersections(objs, event) {
        let pointer = new THREE.Vector2(
          ( event.clientX / window.innerWidth  ) * 2 - 1,
          ( event.clientY / window.innerHeight ) * -2 + 1
        );
        raycaster.setFromCamera(pointer, camera);
        return raycaster.intersectObjects(objs);
      }
  
      document.addEventListener("mousedown", e => {
        for (let hit of getMouseIntersections(scene.children, e)) {
          switch (hit.object.userData.hitType) {
            case HitType.Bookmark:
              flipToPageIndex(pages, hit.object.userData.pageNum);
              break;
            default:
              break;
          }
        }
      });


      // array of { id: #, obj: obj, seen_now: bool }

      let lastHoveredHits = [];
      document.addEventListener("mousemove", e => {
        let hoveredObjs = getMouseIntersections(scene.children, e)
        for (let hit of hoveredObjs) {

          let ind = lastHoveredHits.findIndex(lastHit => lastHit.object.id === hit.object.id)
          if (ind > -1) lastHoveredHits[ind].seenNow = true;

      
          switch (hit.object.userData.hitType) {
            case HitType.Bookmark:
              !hit.object.userData.animInfo && registerAnimation(hit.object, 300, 0, [
                { 
                  property: AnimatedProperties.Position.Y, 
                  keys: [ hit.object.position.y, hit.object.userData.originalPos.y - .05 ], 
                  interpolator: easeinout
                },
              ])
              break;
            default:
              break;
          }
        }

        // animate out old objects that were hovered and aren't now
        for (let hitRecord of lastHoveredHits.filter(hr => !hr.seenNow)) {
          switch (hitRecord.object.userData.hitType) {
            case HitType.Bookmark:
              animateToOriginal(hitRecord.object, 200, 0, easein)
              break;
            default: break;
          }
        }
    
        lastHoveredHits = hoveredObjs.map(hit => ({ object: hit.object, seen_now: false}));
      });

      /*
      book.position.x = 4;
      book.position.y = -3;
      */
      book.rotation.z = .25 * TAU;

      scene.add(book);


      // make lights

      let lights = [
        {pos: new THREE.Vector3(-1, 10, 20), col: 0xffffff, intensity: .6},
        {pos: new THREE.Vector3(-5, 0, 3), col: 0xedc672, intensity: .4},
        {pos: new THREE.Vector3(5, 0, 3), col: 0xedc672, intensity: .4},
      ]
      lights.forEach(lightInfo => {
        let light = new THREE.PointLight(lightInfo.col, lightInfo.intensity || 1);

        // debug sphere
        if (true) {
          let lightSphere = new THREE.SphereGeometry(.05, 16, 8);
          light.add(new THREE.Mesh(lightSphere, new THREE.MeshBasicMaterial({color: lightInfo.col})))
        }

        scene.add(light);
        light.position.set(lightInfo.pos.x, lightInfo.pos.y, lightInfo.pos.z);
      })



      let CURRENT_PAGE = 0; // global state, WOOOO-HOOO
      let DELAY = 100;
      function flipToPageIndex(pages, endPageIndex) {
        // clamp to array bounds
        endPageIndex = Math.max(Math.min(pages.length, endPageIndex), 0);
        if (endPageIndex > CURRENT_PAGE) {
          // keep flipping forward til page
          for (let i = CURRENT_PAGE; i < endPageIndex; i++) {
            let page = pages[i];
            const keyframes = [
              { 
                property: AnimatedProperties.Rotation.X, 
                keys: [ page.rotation.x, pages[i].userData.originalRot.x + -.5 * TAU ], 
                interpolator: easein
              },
              { 
                property: AnimatedProperties.Position.Z, 
                keys: [ page.position.z, pages[pages.length - 1 - i].userData.originalPos.z ], 
                interpolator: easein
              },
            ];
            registerAnimation(page, 1000, Math.sqrt(i - CURRENT_PAGE)*DELAY, keyframes);
          }
        }
        else if (endPageIndex < CURRENT_PAGE) {
          
          for (let i = CURRENT_PAGE - 1; i >= endPageIndex; i--) {
            let page = pages[i];
            const keyframes = [
              { 
                property: AnimatedProperties.Rotation.X, 
                keys: [ page.rotation.x, pages[i].userData.originalRot.x ], 
                interpolator: easein
              },
              { 
                property: AnimatedProperties.Position.Z, 
                keys: [ page.position.z, pages[i].userData.originalPos.z  ], 
                interpolator: easein
              },
            ];
            let delay = Math.sqrt(CURRENT_PAGE - i - 1) * DELAY;
            registerAnimation(page, 1000, delay, keyframes);
          }
        }
        CURRENT_PAGE = endPageIndex;
      }

      window.addEventListener("wheel", throttle(e => {
          // calculate how many pages to scroll based on event
          // find closest magnitude, if magnitude above 100, animate page forward
          let magnitude = Math.floor(Math.max(0, Math.log10(Math.abs(e.wheelDeltaY / 3))));
          flipToPageIndex(pages, CURRENT_PAGE + Math.sign(-magnitude*e.wheelDeltaY))
      }, 100))

      function registerOriginalData(obj) {
        obj.userData.originalPos = { x: obj.position.x, y: obj.position.y, z: obj.position.z };
        obj.userData.originalRot = { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z };
      }

      function registerAnimation(object, durationMs, delayMs, keyframes) {
        object.userData.animInfo = {
          timeMs:  0,
          delayMs: delayMs,
          durationMs: durationMs,
          keyframes: keyframes
        };
      }

      function animateToOriginal(obj, duration=200, delay=0, interpolator=lerp) {
        registerAnimation(obj, duration, delay, [
          { 
            property: AnimatedProperties.Rotation.X, 
            keys: [ obj.rotation.x, obj.userData.originalRot.x ], 
            interpolator: interpolator
          },
          { 
            property: AnimatedProperties.Position.Y, 
            keys: [ obj.position.y, obj.userData.originalPos.y  ], 
            interpolator: interpolator
          },
          { 
            property: AnimatedProperties.Position.Z, 
            keys: [ obj.position.z, obj.userData.originalPos.z  ], 
            interpolator: interpolator
          },
        ])
      }

      let animatedObjs = [ ...pages, bookmark ]

      let lastTime = +(new Date());
      function animate() {
        // update deltaTime to reflect frame time diffs
        let currentTime = +(new Date());
        let deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // this only works for full screen apps, ignores canvas offset
        let scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);

        // animate all the objects that think they need animating
        for (let obj of animatedObjs) {
          if (!obj.userData.animInfo) {
            continue;
          }
          
          // step animation
          obj.userData.animInfo.timeMs += deltaTime;
          obj.userData.animInfo.timeMs = Math.min(obj.userData.animInfo.timeMs, 
                                            obj.userData.animInfo.durationMs + obj.userData.animInfo.delayMs);

          if (obj.userData.animInfo.timeMs >= obj.userData.animInfo.delayMs) {
            // progress from [0-1] of the animation
            let progress = (obj.userData.animInfo.timeMs-obj.userData.animInfo.delayMs)/obj.userData.animInfo.durationMs;
            obj.userData.animInfo.keyframes.forEach(keyframe => {
              // TODO: handle more than 2 keyframes well... right now it is snapping to next pair before completing current interpolation...
              // technically could fake it with a janky interpolator, but that's #bad and #frownedupon
              let ind = Math.floor(progress * (keyframe.keys.length - 1))
              let nextInd = Math.min(ind + 1, keyframe.keys.length - 1);
              let value = keyframe.interpolator(keyframe.keys[ind], keyframe.keys[nextInd], progress)
              switch (keyframe.property) {
                case AnimatedProperties.Rotation.X: 
                  obj.rotation.x = value;
                  break;
                case AnimatedProperties.Position.Y: 
                  obj.position.y = value;
                  break;
                case AnimatedProperties.Position.Z: 
                  obj.position.z = value;
                  break;
                default:
                  break;
              }
            })
          }
          
          if (obj.userData.animInfo.timeMs >= obj.userData.animInfo.durationMs + obj.userData.animInfo.delayMs) {
            obj.userData.animInfo = undefined;
          }
        }
        
        renderer.render(scene, camera);
        
        requestAnimationFrame(animate);
      }

      animate()
      
}
