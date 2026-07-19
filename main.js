var audio=document.getElementById("audioPlayer"),loader=document.getElementById("preloader");function settingtoggle(){document.getElementById("setting-container").classList.toggle("settingactivate"),document.getElementById("visualmodetogglebuttoncontainer").classList.toggle("visualmodeshow"),document.getElementById("soundtogglebuttoncontainer").classList.toggle("soundmodeshow")}function playpause(){!1==document.getElementById("switchforsound").checked?audio.pause():audio.play()}function visualmode(){document.body.classList.toggle("light-mode"),document.querySelectorAll(".needtobeinvert").forEach(function(e){e.classList.toggle("invertapplied")})}window.addEventListener("load",function(){loader.style.display="none",document.querySelector(".hey").classList.add("popup")});let emptyArea=document.getElementById("emptyarea"),mobileTogglemenu=document.getElementById("mobiletogglemenu");function hamburgerMenu(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.toggle("show-toggle-menu"),document.getElementById("burger-bar1").classList.toggle("hamburger-animation1"),document.getElementById("burger-bar2").classList.toggle("hamburger-animation2"),document.getElementById("burger-bar3").classList.toggle("hamburger-animation3")}function hidemenubyli(){document.body.classList.toggle("stopscrolling"),document.getElementById("mobiletogglemenu").classList.remove("show-toggle-menu"),document.getElementById("burger-bar1").classList.remove("hamburger-animation1"),document.getElementById("burger-bar2").classList.remove("hamburger-animation2"),document.getElementById("burger-bar3").classList.remove("hamburger-animation3")}const sections=document.querySelectorAll("section"),navLi=document.querySelectorAll(".navbar .navbar-tabs .navbar-tabs-ul li"),mobilenavLi=document.querySelectorAll(".mobiletogglemenu .mobile-navbar-tabs-ul li");window.addEventListener("scroll",()=>{let e="";sections.forEach(t=>{let o=t.offsetTop;t.clientHeight,pageYOffset>=o-200&&(e=t.getAttribute("id"))}),mobilenavLi.forEach(t=>{t.classList.remove("activeThismobiletab"),t.classList.contains(e)&&t.classList.add("activeThismobiletab")}),navLi.forEach(t=>{t.classList.remove("activeThistab"),t.classList.contains(e)&&t.classList.add("activeThistab")})}),console.log("%c Designed and Developed by Momen Motaz ","background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;");
if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Momen Motaz',
    artist: 'Momen Motaz',
    album: 'Portfolio'
  });
}
let mybutton=document.getElementById("backtotopbutton");function scrollFunction(){document.body.scrollTop>400||document.documentElement.scrollTop>400?mybutton.style.display="block":mybutton.style.display="none"}function scrolltoTopfunction(){document.body.scrollTop=0,document.documentElement.scrollTop=0}window.onscroll=function(){scrollFunction()},document.addEventListener("contextmenu",function(e){"IMG"===e.target.nodeName&&e.preventDefault()},!1);let Pupils=document.getElementsByClassName("footer-pupil"),pupilsArr=Array.from(Pupils),pupilStartPoint=-10,pupilRangeX=20,pupilRangeY=15,mouseXStartPoint=0,mouseXEndPoint=window.innerWidth,currentXPosition=0,fracXValue=0,mouseYEndPoint=window.innerHeight,currentYPosition=0,fracYValue=0,mouseXRange=mouseXEndPoint-mouseXStartPoint;const mouseMove=e=>{fracXValue=(currentXPosition=e.clientX-mouseXStartPoint)/mouseXRange,fracYValue=(currentYPosition=e.clientY)/mouseYEndPoint;let t=pupilStartPoint+fracXValue*pupilRangeX,o=pupilStartPoint+fracYValue*pupilRangeY;pupilsArr.forEach(e=>{e.style.transform=`translate(${t}px, ${o}px)`})},windowResize=e=>{mouseXEndPoint=window.innerWidth,mouseYEndPoint=window.innerHeight,mouseXRange=mouseXEndPoint-mouseXStartPoint};window.addEventListener("mousemove",mouseMove),window.addEventListener("resize",windowResize);
// Chatbot functionality
function toggleChatbot() {
  const container = document.getElementById('chatbot-container');
  container.classList.toggle('closed');
}

function handleChatKeyPress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

function addMessageToChat(text, sender) {
  const body = document.getElementById('chatbot-body');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender}`;
  msgDiv.setAttribute('dir', 'auto');
  msgDiv.textContent = text;
  body.appendChild(msgDiv);
  body.scrollTop = body.scrollHeight;
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;

  addMessageToChat(message, 'user');
  input.value = '';

  const body = document.getElementById('chatbot-body');
  
  // Create bot message container
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-message bot';
  msgDiv.setAttribute('dir', 'auto');
  msgDiv.innerHTML = '<em>Thinking...</em>';
  body.appendChild(msgDiv);
  body.scrollTop = body.scrollHeight;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let textQueue = '';
    let displayedText = '';
    let isStreamDone = false;
    let isFirstChunk = true;

    // Read stream asynchronously
    (async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          isStreamDone = true;
          break;
        }
        textQueue += decoder.decode(value, { stream: true });
      }
    })();

    // Typewriter effect loop
    const typeWriter = () => {
      if (displayedText.length < textQueue.length) {
        if (isFirstChunk) {
          msgDiv.innerHTML = '';
          isFirstChunk = false;
        }
        
        // Dynamic typing speed: type faster if a lot of text arrived at once
        const remaining = textQueue.length - displayedText.length;
        const charsToAdd = Math.max(1, Math.ceil(remaining / 15)); 
        displayedText += textQueue.substring(displayedText.length, displayedText.length + charsToAdd);
        
        try {
          // Render markdown with a fake typing cursor
          msgDiv.innerHTML = marked.parse(displayedText) + '<span style="color:var(--color-light-purple); font-weight:bold;">|</span>';
        } catch (e) {
          msgDiv.textContent = displayedText;
        }
        body.scrollTop = body.scrollHeight;
      }
      
      if (!isStreamDone || displayedText.length < textQueue.length) {
        setTimeout(typeWriter, 20); // 20ms tick
      } else {
        // Final render without cursor
        try {
          msgDiv.innerHTML = marked.parse(displayedText);
        } catch (e) {
          msgDiv.textContent = displayedText;
        }
        body.scrollTop = body.scrollHeight;
      }
    };
    
    typeWriter();
  } catch (error) {
    msgDiv.innerHTML = 'Error: ' + error.message;
  }
}

// --------------------------------------------------------------------------
// Advanced UI Interactions
// --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        if(scrollProgress) scrollProgress.style.width = scrolled + '%';
    });

    // 2. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    // Check if device supports hover (desktop)
    if(window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            if(cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
            if(cursorDot) {
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
            }
        });

        // Add hover effect to links and buttons
        const interactables = document.querySelectorAll('a, button, input, textarea, .stat-card, .service-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if(cursor) cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                if(cursor) cursor.classList.remove('hover');
            });
        });
    }
});

// --------------------------------------------------------------------------
// Contact Form Submission Handling
// --------------------------------------------------------------------------
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Change button state
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    formStatus.style.display = 'none';

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: new FormData(contactForm),
        headers: {
            'Accept': 'application/json'
        }
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.textContent = 'Thanks! Your message has been sent.';
        formStatus.style.color = '#10B981'; // Success color (emerald)
        formStatus.style.display = 'block';
      } else {
        const data = await response.json();
        if (Object.hasOwn(data, 'errors')) {
          formStatus.textContent = data.errors.map(error => error.message).join(', ');
        } else {
          formStatus.textContent = 'Oops! There was a problem submitting your form.';
        }
        formStatus.style.color = '#EF4444'; // Error color (red)
        formStatus.style.display = 'block';
      }
    } catch (error) {
      formStatus.textContent = 'Oops! There was a problem submitting your form.';
      formStatus.style.color = '#EF4444';
      formStatus.style.display = 'block';
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });
}
