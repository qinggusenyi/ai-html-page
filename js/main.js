// 主逻辑脚本 main.js

function init() {
  renderTemplateGallery();
}

document.addEventListener('DOMContentLoaded', init);

function renderTemplateGallery() {
  const gallery = document.getElementById('template-gallery');
  gallery.innerHTML = '';
  templates.forEach(template => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.onclick = () => selectTemplate(template.id);
    card.innerHTML = `
      <img src="${template.coverImage}" alt="${template.name}">
      <div class="template-name">${template.name}</div>
    `;
    gallery.appendChild(card);
  });
}

let currentTemplate = null;
let currentValues = {};

function selectTemplate(templateId) {
  currentTemplate = templates.find(t => t.id === templateId);
  if (!currentTemplate) return;
  const editorArea = document.getElementById('editor-area');
  editorArea.style.display = '';
  // 生成表单
  let formHtml = '<form class="editor-form" id="editor-form">';
  currentTemplate.fields.forEach(field => {
    formHtml += `<label for="${field.id}">${field.label}</label>`;
    if (field.type === 'text') {
      formHtml += `<input type="text" id="${field.id}" name="${field.id}" value="${field.defaultValue}">`;
    } else if (field.type === 'textarea') {
      formHtml += `<textarea id="${field.id}" name="${field.id}">${field.defaultValue}</textarea>`;
    }
  });
  formHtml += '</form>';
  editorArea.innerHTML = formHtml;
  // 监听输入
  currentTemplate.fields.forEach(field => {
    const input = document.getElementById(field.id);
    input.oninput = updatePreview;
    currentValues[field.id] = field.defaultValue;
  });
  // 显示预览区和生成区
  document.getElementById('preview-area').style.display = '';
  document.getElementById('generation-area').style.display = '';
  // 绑定生成按钮
  document.getElementById('generate-btn').onclick = generateFinalUrl;
  // 初始化预览
  updatePreview();
}

function updatePreview() {
  if (!currentTemplate) return;
  const values = {};
  currentTemplate.fields.forEach(field => {
    const input = document.getElementById(field.id);
    values[field.id] = input.value;
  });
  currentValues = values;
  const dataObj = {
    templateId: currentTemplate.id,
    values: values
  };
  const base64 = btoa(encodeURIComponent(JSON.stringify(dataObj)));
  const url = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}view.html?data=${base64}`;
  document.getElementById('preview-iframe').src = url;
}

function generateFinalUrl() {
  if (!currentTemplate) return;
  const dataObj = {
    templateId: currentTemplate.id,
    values: currentValues
  };
  const base64 = btoa(encodeURIComponent(JSON.stringify(dataObj)));
  const url = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}view.html?data=${base64}`;
  document.getElementById('final-url').value = url;
} 