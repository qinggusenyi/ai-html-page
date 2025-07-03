// 展示页逻辑 view.js

function init() {
  parseUrlAndRender();
}

document.addEventListener('DOMContentLoaded', init);

function parseUrlAndRender() {
  const params = new URLSearchParams(window.location.search);
  const dataParam = params.get('data');
  const container = document.getElementById('content-container');
  
  console.log('Parsing URL for data:', dataParam); // Debugging log

  if (!dataParam) {
    container.innerHTML = '<div style="text-align:center;color:#888;">无效链接或缺少数据。</div>';
    return;
  }
  let dataObj;
  try {
    dataObj = JSON.parse(decodeURIComponent(atob(dataParam)));
    console.log('Decoded data object:', dataObj); // Debugging log
    console.log('Template ID from URL data:', dataObj.templateId); // Add this log
  } catch (e) {
    console.error('Data parsing failed:', e); // Debugging error
    container.innerHTML = '<div style="text-align:center;color:#e74c3c;">数据解析失败，请检查链接是否完整。</div>';
    return;
  }
  const template = templates.find(t => t.id === dataObj.templateId);
  console.log('Found template:', template); // Debugging log
  console.log('Template found by ID:', template ? template.id : 'None'); // Add this log

  if (!template) {
    container.innerHTML = '<div style="text-align:center;color:#e67e22;">未找到对应模板。</div>';
    return;
  }
  // 判断是否为互动道歉信
  if (template.id === 'panda-apology') {
    console.log('Rendering Panda Apology interactive template.'); // Debugging log
    renderInteractiveApology(template, dataObj.values);
    return;
  }
  // 判断是否为互动猫咪表白信
  if (template.id === 'cat-confession') {
    console.log('Rendering Cat Confession interactive template.'); // Debugging log
    renderInteractiveCatConfession(template, dataObj.values);
    return;
  }
  console.log('Rendering generic template.'); // Debugging log
  // 其他模板原有渲染（确保这里也能正确处理图片路径，即使它没有 gif 属性）
  // 这里可以添加一个逻辑，如果 template.view.gif 不存在，就用一个默认图片或者不显示图片
  const imageUrl = template.view.gif || template.view.initialGif || ''; // Prefer gif, then initialGif, then empty
  let html = `<div style="background:url('${template.view.backgroundImage}') center/cover no-repeat; border-radius:12px; padding:2rem 1rem 1.5rem 1rem; text-align:center; position:relative; min-height:260px;">
    ${imageUrl ? `<img src="${imageUrl}" alt="${template.name}" style="width:90px;height:90px;position:absolute;top:-45px;left:50%;transform:translateX(-50%);border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.10);background:#fff;">` : ''}
    <h2 style="margin-top:${imageUrl ? 60 : 20}px;font-size:1.5rem;color:#333;">${escapeHtml(dataObj.values.title || '')}</h2>
    <div style="margin:1.2rem 0 0.5rem 0;font-size:1.1rem;color:#444;white-space:pre-line;">${escapeHtml(dataObj.values.message || '')}</div>
  </div>`;
  container.innerHTML = html;
}

function renderInteractiveApology(template, values) {
  document.body.style.background = '#FFEFFE';
  const container = document.getElementById('content-container');
  container.innerHTML = `
    <div id="center-box" style="background:#fff;border-radius:18px;box-shadow:0 2px 12px #0001;padding:2.5rem 2rem 2rem 2rem;max-width:340px;margin:80px auto 0 auto;text-align:center;position:relative;overflow:visible;">
      <div id="top-word" style="min-height:2.2em;font-size:1.1rem;color:#d72660;font-weight:600;margin-bottom:0.5em;"></div>
      <img id="main-img" src="${template.view.gif}" alt="gif" style="width:120px;height:120px;border-radius:12px;transition:all 0.3s;">
      <div id="main-title" style="margin:1.5rem 0 1.2rem 0;font-size:1.3rem;font-weight:600;color:#333;">${escapeHtml(values.title)}</div>
      <div style="display:flex;justify-content:center;gap:1.2rem;">
        <button id="btn-accept" style="background:#d72660;color:#fff;font-size:1.1rem;padding:0.7rem 2.2rem;border:none;border-radius:8px;cursor:pointer;transition:all 0.3s cubic-bezier(.4,2,.6,1);z-index:2;">和好</button>
        <button id="btn-reject" style="background:#4f8cff;color:#fff;font-size:1.1rem;padding:0.7rem 2.2rem;border:none;border-radius:8px;cursor:pointer;">不要</button>
      </div>
    </div>
  `;

  const rejectBtn = document.getElementById('btn-reject');
  const acceptBtn = document.getElementById('btn-accept');
  const topWord = document.getElementById('top-word');
  const centerBox = document.getElementById('center-box');
  const mainImg = document.getElementById('main-img');
  const mainTitle = document.getElementById('main-title');
  const rejectWords = template.rejectWords || ['对不起我错了', '给你买了零食', '你就原谅我嘛'];
  const imgs = template.successImages || [template.view.gif];
  let lastWord = '';
  let lastImg = template.view.gif; // Initialize lastImg with the default gif
  let acceptScale = 1;
  let isFullScreen = false;

  // 调试日志：检查按钮元素和其样式
  console.log('Panda Apology: Accept button element:', acceptBtn);
  console.log('Panda Apology: Accept button initial transform style:', acceptBtn.style.transform);

  // "不要"按钮点击，顶部词语和图片都随机切换，并让"和好"按钮变大
  rejectBtn.addEventListener('click', () => {
    let word, img;
    do {
      word = rejectWords[Math.floor(Math.random() * rejectWords.length)];
    } while (word === lastWord && rejectWords.length > 1);
    lastWord = word;
    topWord.textContent = word;
    // 图片也切换
    if (imgs.length > 0) { // Only attempt to change if there are multiple images
      do {
        img = imgs[Math.floor(Math.random() * imgs.length)];
      } while (img === lastImg && imgs.length > 1);
      lastImg = img;
      mainImg.src = img;
      console.log('Panda Apology: image changed to:', img); // Debugging log
    }

    // 让"和好"按钮变大
    if (!isFullScreen) {
      acceptScale += 0.5;
      if (acceptScale > 3) {
        isFullScreen = true;
        setAcceptButtonFullScreen(acceptBtn, centerBox, topWord, mainImg, mainTitle, rejectBtn);
      } else {
        acceptBtn.style.transform = `scale(${acceptScale})`;
        centerBox.style.overflow = 'visible';
        console.log('Panda Apology: Accept button scale:', acceptScale); // Debugging log
      }
    }
  });

  // "和好"按钮全屏后点击，按钮消失，仅显示图片和message，内容居中适配移动端
  acceptBtn.addEventListener('click', () => {
    if (isFullScreen) {
      acceptBtn.style.display = 'none';
      centerBox.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;width:100vw;padding:10px;">
          <img src="${lastImg || template.view.gif}" alt="" style="width:160px;height:160px;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.02);max-width:90vw;object-fit:cover;">
          <div style="margin:2.5rem 0 0 0;font-size:1.5rem;font-weight:700;color:#d72660;white-space:pre-line;text-align:center;max-width:90vw;">${escapeHtml(values.message || '(没有输入内容)')}</div>
        </div>
      `;
    }
  });
}

// 辅助函数：设置"和好"按钮全屏样式
function setAcceptButtonFullScreen(acceptBtn, centerBox, topWord, mainImg, mainTitle, rejectBtn) {
  // 进入全屏前，保存图片和留言内容
  const finalImg = mainImg.src;
  const finalMsg = mainTitle.textContent || '(没有输入内容)';

  centerBox.innerHTML = `
    <div id="accept-fullscreen-btn"
         style="display:flex;align-items:center;justify-content:center;
                width:100vw;height:100vh;position:fixed;top:0;left:0;
                background:transparent;z-index:999;">
      <button style="background:#d72660;color:#fff;font-size:3rem;padding:2.5rem 6rem;
        border:none;border-radius:3rem;box-shadow:0 4px 24px #d7266040;cursor:pointer;">
        和好
      </button>
    </div>
  `;
  // 添加点击事件，点击后显示最终图片和message
  const fullBtn = document.getElementById('accept-fullscreen-btn');
  fullBtn.addEventListener('click', () => {
    centerBox.innerHTML = `
      <div style="
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        width:100vw;height:100vh;position:fixed;top:0;left:0;
        background:linear-gradient(135deg,#ffe0f0 0%,#ffeffe 100%);
        z-index:999;">
        <img src="${finalImg}" alt="" style="width:180px;height:180px;border-radius:50%;box-shadow:0 0 15px rgba(255,107,107,0.15);margin-bottom:2rem;">
        <div style="font-size:2.2rem;color:#d72660;font-weight:700;text-align:center;white-space:pre-line;max-width:90vw;">
          ${finalMsg}
        </div>
      </div>
    `;
  });
  // 调试日志
  console.log('Panda Apology: Accept button isFullScreen set to true by helper (div version).');
}

// 新增：渲染互动猫咪表白场景
function renderInteractiveCatConfession(template, values) {
  console.log('Entering renderInteractiveCatConfession function.'); // Add this log
  console.log('Cat Template initialGif:', template.view.initialGif); // Add this log
  console.log('Cat Template beggingGifs:', template.beggingGifs); // Add this log
  console.log('Cat Template successImagesCat:', template.successImagesCat); // Add this log
  document.body.style.background = '#FFEFFE'; // 淡粉色背景
  const container = document.getElementById('content-container');
  container.innerHTML = `
    <div id="cat-center-box" style="background:#fff;border-radius:18px;box-shadow:0 2px 12px rgba(0,0,0,0.06);padding:2.5rem 2rem 2rem 2rem;max-width:380px;margin:80px auto 0 auto;text-align:center;position:relative;overflow:hidden;">
      <div id="cat-top-message" style="min-height:2.2em;font-size:1.1rem;color:#d72660;font-weight:600;margin-bottom:0.5em;"></div>
      <img id="cat-main-img" src="${template.view.initialGif}" alt="可爱猫咪" style="width:150px;height:150px;border-radius:12px;transition:all 0.3s;object-fit:cover;">
      <div id="cat-main-title" style="margin:1.5rem 0 1.2rem 0;font-size:1.3rem;font-weight:600;color:#333;">${escapeHtml(values.title)}</div>
      <div id="cat-user-message" style="margin-bottom:1.5rem;font-size:1.1rem;color:#555;white-space:pre-line;">${escapeHtml(values.message)}</div>
      <div style="display:flex;justify-content:center;gap:1.2rem;">
        <button id="cat-btn-accept" style="background:linear-gradient(45deg, #ff6b6b, #ee5253);color:#fff;font-size:1.2rem;padding:0.8rem 2.5rem;border:none;border-radius:8px;cursor:pointer;transition:all 0.4s cubic-bezier(.4,2,.6,1), transform 0.4s cubic-bezier(.4,2,.6,1);z-index:2;box-shadow:0 4px 10px rgba(255,107,107,0.3);">接受</button>
        <button id="cat-btn-reject" style="background:#6c5ce7;color:#fff;font-size:1.1rem;padding:0.7rem 2.2rem;border:none;border-radius:8px;cursor:pointer;transition:all 0.2s;">考虑一下</button>
      </div>
    </div>
    <!-- 浪漫动画区域 -->
    <div id="romantic-animation-area" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:linear-gradient(135deg, #ffe0f0 0%, #ffeffe 100%);z-index:999;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity 0.5s ease-out;">
      <img id="cat-success-img" src="" alt="" style="width:200px;height:200px;object-fit:cover;border-radius:50%;box-shadow:0 0 15px rgba(255,107,107,0.5);transform:scale(0.8);transition:transform 0.5s ease-out;animation:heart-pulse 2s ease-in-out infinite;">
      <div id="cat-final-message" style="margin-top:2rem;font-size:2.5rem;color:#d72660;font-weight:700;text-align:center;white-space:pre-line;font-family:'Brush Script MT', cursive;text-shadow:2px 2px 8px rgba(0,0,0,0.1);transform:scale(0.8);transition:transform 0.5s ease-out;"></div>
      <div id="cat-final-confession" style="margin-top:1rem;font-size:1.3rem;color:#777;text-align:center;">${template.finalConfessionText}</div>
    </div>
  `;

  const rejectBtn = document.getElementById('cat-btn-reject');
  const acceptBtn = document.getElementById('cat-btn-accept');
  const topMessage = document.getElementById('cat-top-message');
  const catMainImg = document.getElementById('cat-main-img');
  const catCenterBox = document.getElementById('cat-center-box');
  const romanticArea = document.getElementById('romantic-animation-area');
  const catSuccessImg = document.getElementById('cat-success-img');
  const catFinalMessage = document.getElementById('cat-final-message');

  const rejectWordsCat = template.rejectWordsCat || ['再想想嘛...', '别急着拒绝呀~'];
  const beggingGifs = template.beggingGifs || [template.view.initialGif];
  const successImagesCat = template.successImagesCat || [template.view.initialGif];

  let currentBeggingGifIndex = 0;
  let acceptScale = 1;

  // "考虑一下"按钮点击逻辑
  rejectBtn.addEventListener('click', () => {
    // 随机切换顶部文字
    const randomWord = rejectWordsCat[Math.floor(Math.random() * rejectWordsCat.length)];
    topMessage.textContent = randomWord;

    // 顺序切换猫咪图片
    currentBeggingGifIndex = (currentBeggingGifIndex + 1) % beggingGifs.length;
    catMainImg.src = beggingGifs[currentBeggingGifIndex];

    // "接受"按钮逐渐变大
    acceptScale += 0.2; // 每次点击增加0.2
    acceptBtn.style.transform = `scale(${acceptScale})`;

    // 可选：加个小震动效果
    rejectBtn.style.transform = 'translateX(5px)';
    setTimeout(() => {
      rejectBtn.style.transform = 'translateX(0)';
    }, 100);
  });

  // "接受"按钮点击逻辑
  acceptBtn.addEventListener('click', () => {
    catCenterBox.style.display = 'none';
    romanticArea.style.display = 'flex';
    setTimeout(() => {
      romanticArea.style.opacity = '1';
      catSuccessImg.style.transform = 'scale(1)';
      catFinalMessage.style.transform = 'scale(1)';
    }, 50);

    // 随机选择最终成功图片
    const randomSuccessImg = successImagesCat[Math.floor(Math.random() * successImagesCat.length)];
    catSuccessImg.src = randomSuccessImg;
    catFinalMessage.textContent = escapeHtml(values.message);

    // 触发心形粒子动画 (CSS 动画，需要 CSS 配合)
    // romanticArea.classList.add('heart-animation'); // This will be applied via direct style on romantic-animation-area
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (s) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'})[s];
  });
} 