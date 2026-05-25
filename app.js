lucide.createIcons();

const tabs = { 
  gen: document.getElementById('tab-generator'), 
  scan: document.getElementById('tab-scanner') 
};
const sections = { 
  gen: document.getElementById('section-generator'), 
  scan: document.getElementById('section-scanner') 
};
const indicator = document.getElementById('tab-indicator');

const updateIndicator = (activeTab) => { 
  indicator.style.width = `${activeTab.offsetWidth}px`; 
  indicator.style.left = `${activeTab.offsetLeft}px`; 
};

window.addEventListener('load', () => updateIndicator(tabs.gen));
window.addEventListener('resize', () => { 
  updateIndicator(!sections.scan.classList.contains('hide') ? tabs.scan : tabs.gen); 
});

const switchTab = (tabName) => {
  Object.values(sections).forEach(sec => sec.classList.add('hide'));
  Object.values(tabs).forEach(tab => tab.classList.remove('active'));
  sections[tabName].classList.remove('hide');
  tabs[tabName].classList.add('active');
  updateIndicator(tabs[tabName]);
  if (tabName !== 'scan') stopScanner();
};

tabs.gen.addEventListener('click', () => switchTab('gen'));
tabs.scan.addEventListener('click', () => switchTab('scan'));

let isGridView = true; 
const typeButtonsContainer = document.getElementById('type-buttons');
const toggleViewBtn = document.getElementById('toggle-view-btn');
const viewIcon = document.getElementById('view-icon');
const viewText = document.getElementById('view-text');
const scrollHint = document.getElementById('scroll-hint');
const gridFade = document.getElementById('grid-fade');

toggleViewBtn.addEventListener('click', () => {
  isGridView = !isGridView;
  if (isGridView) {
    typeButtonsContainer.classList.replace('view-scroll', 'view-grid');
    viewIcon.setAttribute('data-lucide', 'list');
    viewText.textContent = 'Scroll';
    scrollHint.classList.add('hide');
    gridFade.classList.remove('hide');
  } else {
    typeButtonsContainer.classList.replace('view-grid', 'view-scroll');
    viewIcon.setAttribute('data-lucide', 'layout-grid');
    viewText.textContent = 'Grid';
    scrollHint.classList.remove('hide');
    gridFade.classList.add('hide');
  }
  lucide.createIcons();
});

const PREVIEW_SIZE = 220; 
const qrOptions = { 
  width: PREVIEW_SIZE, 
  height: PREVIEW_SIZE, 
  data: "Thank you for using QR Master!", 
  margin: 5, 
  imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 5 }, 
  dotsOptions: { color: "#0f172a", type: "rounded" }, 
  backgroundOptions: { color: "#ffffff" }, 
  cornersSquareOptions: { color: "#0f172a", type: "extra-rounded" }, 
  cornersDotOptions: { color: "#0f172a", type: "dot" } 
};
const qrCode = new QRCodeStyling(qrOptions);
qrCode.append(document.getElementById("qr-preview-wrapper"));

const inputTemplates = {
  url: `<input type="url" id="val-url" placeholder="https://example.com" class="custom-input">`,
  text: `<textarea id="val-text" placeholder="Enter your text..." class="custom-input" rows="3"></textarea>`,
  email: `<div class="inputs-wrapper"><input type="email" id="val-email" placeholder="Email Address" class="custom-input"><input type="text" id="val-sub" placeholder="Subject" class="custom-input"><textarea id="val-body" placeholder="Message" class="custom-input" rows="2"></textarea></div>`,
  sms: `<div class="inputs-wrapper"><input type="tel" id="val-phone" placeholder="Phone Number" class="custom-input"><textarea id="val-sms-body" placeholder="Message" class="custom-input" rows="2"></textarea></div>`,
  wifi: `<div class="inputs-wrapper"><input type="text" id="val-ssid" placeholder="Network Name" class="custom-input"><input type="password" id="val-pw" placeholder="Password" class="custom-input"><select id="val-enc" class="custom-input"><option value="WPA">WPA / WPA2</option><option value="WEP">WEP</option><option value="nopass">No Encryption</option></select></div>`,
  vcard: `<div class="inputs-wrapper"><div class="input-grid-2"><input type="text" id="val-fname" placeholder="First Name" class="custom-input"><input type="text" id="val-lname" placeholder="Last Name" class="custom-input"></div><input type="tel" id="val-vc-phone" placeholder="Mobile" class="custom-input"><input type="email" id="val-vc-email" placeholder="Email (Optional)" class="custom-input"><input type="text" id="val-org" placeholder="Company" class="custom-input"></div>`,
  phone: `<input type="tel" id="val-call" placeholder="Phone Number" class="custom-input">`,
  whatsapp: `<div class="inputs-wrapper"><input type="tel" id="val-wa-phone" placeholder="WhatsApp Number" class="custom-input"><textarea id="val-wa-msg" placeholder="Message (Optional)" class="custom-input" rows="2"></textarea></div>`,
  upi: `<div class="inputs-wrapper"><input type="text" id="val-upi-id" placeholder="UPI ID" class="custom-input"><input type="text" id="val-upi-name" placeholder="Payee Name" class="custom-input"><input type="number" id="val-upi-amt" placeholder="Amount (Optional)" class="custom-input"></div>`,
  map: `<input type="text" id="val-map" placeholder="Location Name or Maps Link" class="custom-input">`,
  youtube: `<input type="url" id="val-yt" placeholder="YouTube URL" class="custom-input">`,
  instagram: `<input type="text" id="val-ig" placeholder="Instagram Username or Link" class="custom-input">`,
  facebook: `<input type="url" id="val-fb" placeholder="Facebook URL" class="custom-input">`,
  linkedin: `<input type="url" id="val-li" placeholder="LinkedIn URL" class="custom-input">`,
  telegram: `<input type="text" id="val-tg" placeholder="Telegram Username or Link" class="custom-input">`,
  app: `<input type="url" id="val-app" placeholder="App Store / Play Store Link" class="custom-input">`
};

let currentType = 'url';
const dynamicInputs = document.getElementById('dynamic-inputs');
const errorMsgBox = document.getElementById('input-error-msg');
const errorText = document.getElementById('error-msg-text');
const dlBtn = document.getElementById('main-download-btn');
const qrWrapper = document.getElementById('qr-preview-wrapper');
const indicatorDot = document.getElementById('preview-indicator');

document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('.type-btn');
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    targetBtn.classList.add('active');
    currentType = targetBtn.dataset.type;
    dynamicInputs.innerHTML = inputTemplates[currentType];
    lucide.createIcons();
    attachInputListeners();
    validateAndUpdateQR();
  });
});

dynamicInputs.innerHTML = inputTemplates['url'];
lucide.createIcons();

const validateInputs = () => {
  const getVal = (id) => document.getElementById(id)?.value.trim() || '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+$/;

  switch(currentType) {
    case 'email': 
      if(getVal('val-email') && !emailRegex.test(getVal('val-email'))) return {valid:false, msg:'Invalid email format.'};
      return {valid:true};
    case 'upi':
      if (getVal('val-upi-id') && !upiRegex.test(getVal('val-upi-id'))) {
        return {valid: false, msg: 'Please enter a valid UPI ID ( e.g., 9876543210@ybl  OR name@sbi ).'};
      }
      return {valid: true};
    default: 
      return {valid:true}; 
  }
};

const getFormattedData = () => {
  const getVal = (id) => document.getElementById(id)?.value.trim() || '';
  
  switch(currentType) {
    case 'url': return (/^https?:\/\//i.test(getVal('val-url'))) ? getVal('val-url') : (getVal('val-url') ? 'https://' + getVal('val-url') : ' ');
    case 'text': return getVal('val-text');
    case 'email': return `mailto:${getVal('val-email')}?subject=${encodeURIComponent(getVal('val-sub'))}&body=${encodeURIComponent(getVal('val-body'))}`;
    case 'sms': return `smsto:${getVal('val-phone')}:${getVal('val-sms-body')}`;
    case 'wifi': return `WIFI:T:${getVal('val-enc')};S:${getVal('val-ssid')};P:${getVal('val-pw')};;`;
    case 'vcard': return `BEGIN:VCARD\nVERSION:3.0\nN:${getVal('val-lname')};${getVal('val-fname')}\nFN:${getVal('val-fname')} ${getVal('val-lname')}\nTEL;TYPE=CELL:${getVal('val-vc-phone')}\nEMAIL:${getVal('val-vc-email')}\nORG:${getVal('val-org')}\nEND:VCARD`;
    case 'phone': return `tel:${getVal('val-call')}`;
    case 'whatsapp': return `https://wa.me/${getVal('val-wa-phone').replace(/\+/g,'')}?text=${encodeURIComponent(getVal('val-wa-msg'))}`;
    case 'upi': return `upi://pay?pa=${getVal('val-upi-id')}&pn=${encodeURIComponent(getVal('val-upi-name'))}${getVal('val-upi-amt') ? '&am='+getVal('val-upi-amt') : ''}&cu=INR`;
    
    case 'map': 
      let mapVal = getVal('val-map');
      return /^https?:\/\//i.test(mapVal) ? mapVal : (mapVal ? 'https://maps.google.com/?q=' + encodeURIComponent(mapVal) : ' ');
    
    case 'youtube': return (/^https?:\/\//i.test(getVal('val-yt'))) ? getVal('val-yt') : (getVal('val-yt') ? 'https://' + getVal('val-yt') : ' ');
    case 'facebook': return (/^https?:\/\//i.test(getVal('val-fb'))) ? getVal('val-fb') : (getVal('val-fb') ? 'https://' + getVal('val-fb') : ' ');
    case 'linkedin': return (/^https?:\/\//i.test(getVal('val-li'))) ? getVal('val-li') : (getVal('val-li') ? 'https://' + getVal('val-li') : ' ');
    case 'app': return (/^https?:\/\//i.test(getVal('val-app'))) ? getVal('val-app') : (getVal('val-app') ? 'https://' + getVal('val-app') : ' ');
    
    case 'instagram': 
      let igVal = getVal('val-ig');
      if (!igVal) return ' ';
      if (/^https?:\/\//i.test(igVal)) return igVal; 
      return `https://instagram.com/${igVal.replace('@', '')}`;
      
    case 'telegram': 
      let tgVal = getVal('val-tg');
      if (!tgVal) return ' ';
      if (/^https?:\/\//i.test(tgVal)) return tgVal;
      return `https://t.me/${tgVal.replace('@', '')}`;
  }
};

const validateAndUpdateQR = () => {
  const validation = validateInputs();
  if(!validation.valid) {
    errorText.textContent = validation.msg; 
    errorMsgBox.classList.remove('hide'); 
    qrWrapper.classList.add('disabled'); 
    dlBtn.classList.add('disabled');
    dlBtn.disabled = true;
    indicatorDot.className = 'status-dot inactive';
  } else {
    errorMsgBox.classList.add('hide'); 
    qrWrapper.classList.remove('disabled'); 
    dlBtn.classList.remove('disabled');
    dlBtn.disabled = false;
    indicatorDot.className = 'status-dot active';
    qrOptions.data = getFormattedData() || " "; 
    qrCode.update(qrOptions);
  }
};

let debounceTimer;
const attachInputListeners = () => { 
  dynamicInputs.querySelectorAll('input, textarea, select').forEach(el => {
    if(el.type === 'tel') { 
      el.addEventListener('keypress', (e) => { 
        if(!/[0-9+\- ]/.test(e.key)) e.preventDefault(); 
      }); 
    }
    el.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(validateAndUpdateQR, 500); 
    });
  }); 
};
attachInputListeners(); 
validateAndUpdateQR();

document.getElementById('color-dark').addEventListener('input', (e) => { 
  qrOptions.dotsOptions.color = e.target.value; 
  qrOptions.cornersSquareOptions.color = e.target.value; 
  qrOptions.cornersDotOptions.color = e.target.value; 
  qrCode.update(qrOptions); 
});

document.getElementById('color-light').addEventListener('input', (e) => { 
  qrOptions.backgroundOptions.color = e.target.value; 
  qrCode.update(qrOptions); 
});

document.getElementById('dots-style').addEventListener('change', (e) => { 
  qrOptions.dotsOptions.type = e.target.value; 
  qrCode.update(qrOptions); 
});

document.getElementById('corners-style').addEventListener('change', (e) => { 
  qrOptions.cornersSquareOptions.type = e.target.value; 
  qrOptions.cornersDotOptions.type = e.target.value === 'extra-rounded' ? 'dot' : 'square'; 
  qrCode.update(qrOptions); 
});

const logoInput = document.getElementById('logo-input');
const clearLogoBtn = document.getElementById('clear-logo');

logoInput.addEventListener('change', function(e) { 
  if(e.target.files[0]) { 
    const reader = new FileReader(); 
    reader.onload = (ev) => { 
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 150; 
        canvas.width = size;
        canvas.height = size;
        
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        
        qrOptions.image = canvas.toDataURL('image/png');
        qrCode.update(qrOptions); 
        clearLogoBtn.classList.remove('hide'); 
      };
      img.src = ev.target.result;
    }; 
    reader.readAsDataURL(e.target.files[0]); 
  }
});
    
clearLogoBtn.addEventListener('click', () => { 
  logoInput.value = ''; 
  qrOptions.image = null; 
  qrCode.update(qrOptions); 
  clearLogoBtn.classList.add('hide'); 
});

let selectedFormat = 'png';
const btnPng = document.getElementById('btn-format-png');
const btnSvg = document.getElementById('btn-format-svg');

const updateFormatUI = (format) => {
  selectedFormat = format;
  if(format === 'png') { 
    btnPng.className = "format-btn active"; 
    btnSvg.className = "format-btn inactive"; 
  }
  else { 
    btnSvg.className = "format-btn active"; 
    btnPng.className = "format-btn inactive"; 
  }
};
btnPng.addEventListener('click', () => updateFormatUI('png')); 
btnSvg.addEventListener('click', () => updateFormatUI('svg'));

dlBtn.addEventListener('click', () => {
  if(!validateInputs().valid) return;
  const sizeSelect = document.getElementById('qr-size');
  let downloadSize = parseInt(sizeSelect.value) || 512;
  
  qrCode.update({ width: downloadSize, height: downloadSize });
  qrCode.download({ extension: selectedFormat, name: `QR_Master_${downloadSize}px` }).then(() => { 
    qrCode.update({ width: PREVIEW_SIZE, height: PREVIEW_SIZE }); 
  });
});

let html5QrCode, messageTimeout;
const startCamBtn = document.getElementById('scan-camera-btn');
const stopCamBtn = document.getElementById('stop-camera-btn');
const camPlaceholder = document.getElementById('camera-placeholder');
const resultContainer = document.getElementById('scan-result-container');
const rawDataInput = document.getElementById('raw-scan-data');
const richContentBox = document.getElementById('scan-rich-content');
const scanTypeLabel = document.getElementById('scan-type-label');
    
const showUIMessage = (text, isError = true) => {
  const msgBox = document.getElementById('ui-message'); 
  document.getElementById('ui-message-text').textContent = text;
  msgBox.className = `alert-msg ${isError ? 'error' : 'success'}`;
  clearTimeout(messageTimeout); 
  messageTimeout = setTimeout(() => msgBox.classList.add('hide'), 4000);
};

window.copyWifiPassword = (pwd) => {
  navigator.clipboard.writeText(pwd).then(() => { alert("WiFi Password Copied!"); });
};

const handleScanSuccess = (decodedText) => {
  stopScanner(); 
  rawDataInput.value = decodedText; 
  resultContainer.classList.remove('hide');
  let resultType = 'Text Scanned', icon = 'align-left', resultHTML = '';

  if (decodedText.toLowerCase().startsWith('upi://pay')) {
    resultType = 'UPI Payment Code'; 
    icon = 'indian-rupee';
    let payeeName = 'Unknown Merchant', upiId = 'Unknown ID', amount = '';
    try {
      const upiUrl = new URL(decodedText);
      payeeName = upiUrl.searchParams.get('pn') || 'Unknown Merchant'; 
      upiId = upiUrl.searchParams.get('pa') || 'Unknown ID';
      amount = upiUrl.searchParams.get('am') ? `₹${upiUrl.searchParams.get('am')}` : '';
    } catch(e) {
      const pnMatch = decodedText.match(/[?&]pn=([^&]+)/); 
      const paMatch = decodedText.match(/[?&]pa=([^&]+)/);
      if(pnMatch) payeeName = decodeURIComponent(pnMatch[1]); 
      if(paMatch) upiId = decodeURIComponent(paMatch[1]);
    }
    resultHTML = `<div class="app-res-box t-upi"><span class="l">Paying To:</span><span class="v">${payeeName}</span><span class="s">${upiId}</span>${amount ? `<span class="a">${amount}</span>` : ''}<a href="${decodedText}" class="app-res-btn b-upi"><i data-lucide="smartphone-nfc"></i> Pay with UPI App</a></div>`;
  }
  else if (decodedText.match(/wa\.me/i) || decodedText.match(/^whatsapp:/i)) {
    resultType = 'WhatsApp Action'; icon = 'message-circle';
    resultHTML = buildAppUI(decodedText, 't-wa', 'b-wa', 'message-circle', 'Chat on WhatsApp');
  }
  else if (decodedText.match(/^geo:/i) || decodedText.match(/maps\.google\.com/i) || decodedText.match(/goo\.gl\/maps/i)) {
    resultType = 'Location & Map'; icon = 'map-pin';
    resultHTML = buildAppUI(decodedText, 't-map', 'b-map', 'map-pin', 'Open in Maps');
  }
  else if (decodedText.match(/youtube\.com/i) || decodedText.match(/youtu\.be/i)) {
    resultType = 'YouTube Link'; icon = 'youtube'; 
    resultHTML = buildAppUI(decodedText, 't-yt', 'b-yt', 'youtube', 'Open YouTube');
  } 
  else if (decodedText.match(/instagram\.com/i)) {
    resultType = 'Instagram Profile'; icon = 'instagram'; 
    resultHTML = buildAppUI(decodedText, 't-ig', 'b-ig', 'instagram', 'Open Instagram');
  } 
  else if (decodedText.match(/facebook\.com/i) || decodedText.match(/fb\.me/i)) {
    resultType = 'Facebook Link'; icon = 'facebook'; 
    resultHTML = buildAppUI(decodedText, 't-fb', 'b-fb', 'facebook', 'Open Facebook');
  } 
  else if (decodedText.match(/linkedin\.com/i)) {
    resultType = 'LinkedIn Profile'; icon = 'linkedin'; 
    resultHTML = buildAppUI(decodedText, 't-li', 'b-li', 'linkedin', 'Open LinkedIn');
  } 
  else if (decodedText.match(/t\.me/i) || decodedText.match(/telegram\.me/i)) {
    resultType = 'Telegram Link'; icon = 'send'; 
    resultHTML = buildAppUI(decodedText, 't-tg', 'b-tg', 'send', 'Open Telegram');
  } 
  else if (decodedText.match(/play\.google\.com/i) || decodedText.match(/apps\.apple\.com/i)) {
    resultType = 'App Store Link'; icon = 'layout-grid'; 
    resultHTML = buildAppUI(decodedText, 't-app', 'b-app', 'download', 'Download App');
  }
  else if (decodedText.startsWith('WIFI:')) {
    resultType = 'WiFi Network'; icon = 'wifi';
    let ssid = decodedText.match(/S:(.*?);/)?.[1] || 'Unknown'; 
    let pwd = decodedText.match(/P:(.*?);/)?.[1] || '';
    resultHTML = `<div class="wifi-item"><span class="l">Network Name</span><span class="v">${ssid}</span></div><div class="wifi-item"><span class="l">Password</span><span class="v">${pwd ? pwd : 'No Password'}</span></div>${pwd ? `<button onclick="copyWifiPassword('${pwd.replace(/'/g, "\\'")}')" class="btn-general bg-dark"><i data-lucide="copy"></i> Copy Password</button>` : ''}`;
  } 
  else if (decodedText.startsWith('BEGIN:VCARD')) {
    resultType = 'Contact Details'; icon = 'contact';
    let name = decodedText.match(/FN:(.*?)\n/)?.[1] || 'Unknown'; 
    let phone = decodedText.match(/TEL.*?:(.*?)\n/)?.[1] || '';
    resultHTML = `<div class="vcard-wrap"><span class="n">${name}</span>${phone ? `<span class="p"><i data-lucide="phone"></i> ${phone}</span>` : ''}</div>${phone ? `<a href="tel:${phone.replace(/\s+/g,'')}" class="btn-general bg-indigo"><i data-lucide="phone-call"></i> Call Now</a>` : ''}`;
  } 
  else if (/^https?:\/\//i.test(decodedText)) {
    resultType = 'Website URL'; icon = 'link';
    resultHTML = `<div class="app-res-box t-upi" style="border: 1px solid #e2e8f0; background-color: #eef2ff;"><span>${decodedText}</span><a href="${decodedText}" target="_blank" class="btn-general bg-indigo" style="margin-top: 0.25rem;"><i data-lucide="external-link"></i> Open Website</a></div>`;
  } 
  else if (decodedText.toLowerCase().startsWith('smsto:') || decodedText.toLowerCase().startsWith('tel:')) {
    resultType = 'Phone Action'; icon = 'phone';
    resultHTML = `<div class="plain-text">${decodedText.replace(/^(smsto:|tel:)/i, '')}</div><a href="${decodedText}" class="btn-general bg-green"><i data-lucide="smartphone"></i> Take Action</a>`;
  }
  else {
    resultHTML = `<div class="plain-text">${decodedText}</div>`;
  }

  scanTypeLabel.innerHTML = `<i data-lucide="${icon}"></i> ${resultType}`;
  richContentBox.innerHTML = resultHTML;
  lucide.createIcons();
  
  setTimeout(() => { 
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
  }, 150);
};

const buildAppUI = (url, themeClass, btnClass, lucideIcon, btnText) => {
  return `<div class="app-res-box ${themeClass}"><i data-lucide="${lucideIcon}"></i><span>${url}</span><a href="${url}" target="_blank" class="app-res-btn ${btnClass}"><i data-lucide="external-link"></i> ${btnText}</a></div>`;
};

const startScanner = () => {
  if (!html5QrCode) html5QrCode = new Html5Qrcode("reader");
  
  resultContainer.classList.add('hide'); 
  camPlaceholder.style.display = 'none';
  startCamBtn.classList.add('hide'); 
  stopCamBtn.classList.remove('hide');
  
  const config = { fps: 30, qrbox: { width: 280, height: 280 }, aspectRatio: 1.0, rememberLastUsedCamera: true };
  
  html5QrCode.start( 
    { facingMode: "environment" }, 
    config, 
    (decodedText) => { handleScanSuccess(decodedText); },
    (errorMessage) => { }
  ).catch(err => { 
    showUIMessage("Camera permission denied.", true); 
    stopScanner(); 
  });
};
    
const stopScanner = () => {
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().then(() => { 
      startCamBtn.classList.remove('hide'); 
      stopCamBtn.classList.add('hide'); 
      camPlaceholder.style.display = 'flex'; 
    }).catch(console.error);
  } else {
    startCamBtn.classList.remove('hide'); 
    stopCamBtn.classList.add('hide'); 
    camPlaceholder.style.display = 'flex';
  }
};

startCamBtn.addEventListener('click', startScanner); 
stopCamBtn.addEventListener('click', stopScanner);

document.getElementById('copy-result-btn').addEventListener('click', () => {
  navigator.clipboard.writeText(rawDataInput.value).then(() => {
    const iconBtn = document.getElementById('copy-result-btn');
    const icon = iconBtn.querySelector('i');
    
    icon.setAttribute('data-lucide', 'check'); 
    iconBtn.classList.add('success'); 
    lucide.createIcons();
    
    setTimeout(() => { 
      icon.setAttribute('data-lucide', 'copy'); 
      iconBtn.classList.remove('success'); 
      lucide.createIcons(); 
    }, 2000);
  });
});