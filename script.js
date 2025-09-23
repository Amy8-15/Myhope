document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 全局变量和DOM元素获取 ---
    const imageUploader = document.getElementById('image-uploader');
    const audioUploader = document.getElementById('audio-uploader');
    const audioPlayer = document.getElementById('audio-player');
    const mobileFrame = document.querySelector('.mobile-frame');
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleButton.querySelector('i');
    const apiStatusIndicator = document.getElementById('api-status-indicator');
    const albumArt = document.getElementById('music-album-art');
    const directUploadWidgets = {
        'widget-decor': document.getElementById('widget-decor'),
        'widget-photo': document.getElementById('widget-photo'),
    };
    const personalizationAppIcon = document.getElementById('app-personalization');
    const personalizationScreen = document.getElementById('screen-personalization');
    const iconChangerScreen = document.getElementById('screen-icon-changer');
    const menuChangeIcons = document.getElementById('menu-change-icons');
    const menuChangeWallpaper = document.getElementById('menu-change-wallpaper');
    const backButtons = document.querySelectorAll('.back-btn');
    const iconGrid = document.querySelector('.icon-grid');
    const songTitleEl = document.getElementById('song-title');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const prevBtn = document.getElementById('prev-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const playModeBtn = document.getElementById('play-mode-btn');
    const playlistBtn = document.getElementById('playlist-btn');
    const playlistScreen = document.getElementById('screen-playlist');
    const playlistContainer = document.getElementById('playlist-container');
    const addSongBtn = document.getElementById('add-song-btn');
    const addSongModal = document.getElementById('add-song-modal');
    const uploadLocalBtn = document.getElementById('upload-local-btn');
    const urlInput = document.getElementById('url-input');
    const addUrlBtn = document.getElementById('add-url-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('add-song-modal');
    // API设置页面的DOM元素
    const menuApiSettings = document.getElementById('menu-api-settings');
    const apiSettingsScreen = document.getElementById('screen-api-settings');
    const apiListContainer = document.getElementById('api-list-container');
    const newApiForm = document.getElementById('new-api-form');
    const apiNameInput = document.getElementById('api-name-input');
    const apiUrlInput = document.getElementById('api-url-input');
    const apiKeyInput = document.getElementById('api-key-input');
    const apiModelSelect = document.getElementById('api-model-select');
    const fetchModelsBtn = document.getElementById('fetch-models-btn');
    const apiStatusMsg = document.getElementById('api-status-msg');
    const saveApiBtn = document.getElementById('save-api-btn');
    // 字体设置页面的DOM元素
    const menuFontSettings = document.getElementById('menu-font-settings');
    const fontSettingsScreen = document.getElementById('screen-font-settings');
    const fontUrlInput = document.getElementById('font-url-input');
    const applyFontBtn = document.getElementById('apply-font-btn');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValue = document.getElementById('font-size-value');
    
    // 角色书 DOM 元素获取
    const characterBookApp = document.getElementById('app-character-book');
    const characterBookScreen = document.getElementById('screen-character-book');
    const characterEditorScreen = document.getElementById('screen-character-editor');
    const characterListContainer = document.getElementById('character-list-container');
    const addCharBtn = document.getElementById('add-char-btn');
    const editorTitle = document.getElementById('editor-title');
    const saveCharBtn = document.getElementById('save-char-btn');
    const charAvatarUploader = document.getElementById('char-avatar-uploader');
    const charNameInput = document.getElementById('char-name-input');
    const charPromptInput = document.getElementById('char-prompt-input');
    const userPromptInput = document.getElementById('user-prompt-input');
    const deleteCharBtn = document.getElementById('delete-char-btn');

    // (新增) 关系修改弹窗的DOM元素
    const relationshipModal = document.getElementById('relationship-modal');
    const relationshipOptionsContainer = document.getElementById('relationship-options-container');
    const closeRelationshipModalBtn = document.getElementById('close-relationship-modal-btn');

    // 应用列表
    const apps = [
        { id: 'chat', name: '聊天' },
        { id: 'worldbook', name: '世界书' },
        { id: 'forum', name: '论坛' },
        { id: 'story', name: '剧情' },
        { id: 'settings', name: '设置' },
        { id: 'personalization', name: '个性化' },
        { id: 'character', name: '占位符' },
        { id: 'character-book', name: '角色书' }
    ];
    const dockItems = [{ id: '1', name: 'Dock 1' }, { id: '2', name: 'Dock 2' }, { id: '3', name: 'Dock 3' }, { id: '4', name: 'Dock 4' }];
    
    // 全局状态变量
    let playlist = [];
    let currentTrackIndex = -1;
    let isPlaying = false;
    let playMode = 'repeat';
    let apiConfigs = [];
    let activeApiId = null;
    const playModes = ['repeat', 'shuffle', 'repeat-one'];
    const playModeIcons = { 'repeat': 'fa-redo', 'shuffle': 'fa-random', 'repeat-one': 'fa-1' };
    
    // 角色书相关全局变量
    let characters = [];
    let currentEditingCharacterId = null;
    let tempAvatarFile = null;
    let currentEditingRelationshipCharId = null; // (新增) 存储正在修改关系的角色ID

    // 数据库助手
    const dbHelper = {
        db: null,
        initDB(callback) {
            const request = indexedDB.open('userDB', 3);
            request.onupgradeneeded = (e) => {
                this.db = e.target.result;
                if (!this.db.objectStoreNames.contains('images')) this.db.createObjectStore('images', { keyPath: 'id' });
                if (!this.db.objectStoreNames.contains('data')) this.db.createObjectStore('data', { keyPath: 'id' });
                if (!this.db.objectStoreNames.contains('characters')) this.db.createObjectStore('characters', { keyPath: 'id' });
            };
            request.onsuccess = (e) => { this.db = e.target.result; if (callback) callback(); };
            request.onerror = (e) => console.error("IndexedDB error:", e.target.errorCode);
        },
        saveObject(storeName, objOrId, objValue) {
            if (!this.db) return;
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            if (storeName === 'characters') {
                store.put(objOrId);
            } else {
                store.put({ id: objOrId, value: objValue });
            }
        },
        loadObject(storeName, id, callback) {
            if (!this.db) return;
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            request.onsuccess = (e) => {
                const result = e.target.result;
                if (!result) {
                    callback(null);
                    return;
                }
                callback(storeName === 'characters' ? result : result.value);
            };
        },
        loadAll(storeName, callback) {
            if (!this.db) return;
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = (e) => callback(e.target.result || []);
        },
        deleteObject(storeName, id) {
            if (!this.db) return;
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            store.delete(id);
        }
    };

    // 统一的 API 请求模块
    const apiHelper = {
        async callChatCompletion(messages) {
            if (!apiConfigs || apiConfigs.length === 0) {
                throw new Error("尚未配置API。请在设置中添加。");
            }
            const activeApi = apiConfigs.find(c => c.id === activeApiId);
            if (!activeApi) {
                throw new Error("没有找到有效的API配置。请检查设置。");
            }
    
            const { url, key, selectedModel } = activeApi;
    
            let endpoint = url.trim();
            if (endpoint.endsWith('/')) {
                endpoint = endpoint.slice(0, -1);
            }
            if (endpoint.endsWith('/v1/chat/completions')) {
            } else if (endpoint.endsWith('/v1')) {
                endpoint = `${endpoint}/chat/completions`;
            } else {
                endpoint = `${endpoint}/v1/chat/completions`;
            }
    
            const body = JSON.stringify({
                model: selectedModel,
                messages: messages,
                response_format: { type: "json_object" } 
            });
    
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${key}`
                    },
                    body: body
                });
    
                if (!response.ok) {
                    const errorBody = await response.text();
                    throw new Error(`API请求失败，状态码 ${response.status}: ${errorBody}`);
                }
    
                const data = await response.json();
                
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    return data.choices[0].message.content;
                } else {
                    throw new Error("API返回数据格式无效。");
                }
    
            } catch (error) {
                console.error("API 调用失败:", error);
                throw error;
            }
        }
    };

    // 提示词管理器
    const promptManager = {
        createCharacterDetailsPrompt(character) {
            const systemPrompt = `你是一个富有想象力的角色设定师。根据用户提供的角色核心设定，你需要生成一个JSON对象，其中必须包含三个键：'tags' (一个字符串，用逗号分隔的3个描述性词语), 'occupation' (一个字符串，角色的职业), 'quote' (一个字符串，角色的标志性引言)。不要添加任何额外的解释或文本，只返回纯粹的JSON对象。`;
            const userPrompt = `角色核心设定：${character.charPrompt}\n与用户的关系：${character.userPrompt}`;
            return [
                { "role": "system", "content": systemPrompt },
                { "role": "user", "content": userPrompt }
            ];
        },
        createChatPrompt(chatHistory, character) {
            const systemPrompt = `你现在是 ${character.name}。你的设定是：${character.charPrompt}。你正在和 ${character.userPrompt} 聊天。请根据聊天历史进行回应。`;
            const messages = [
                { "role": "system", "content": systemPrompt },
                ...chatHistory
            ];
            return messages;
        }
    };

    // --- 核心工具函数 ---
    function processAndSaveImage(file, storageKey, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const MAX_WIDTH = storageKey === 'wallpaperImage' ? 1080 : 512;
                const MAX_HEIGHT = storageKey === 'wallpaperImage' ? 1920 : 512;
                let { width, height } = img;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    dbHelper.saveObject('images', storageKey, blob);
                    if (callback) callback(blob);
                }, 'image/jpeg', 0.8);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function applyImageFromBlob(storageKey, blob) {
        const targetElement = document.querySelector(`[data-storage-key="${storageKey}"]`);
        if (targetElement) targetElement.classList.add('has-image');
        const imageUrl = URL.createObjectURL(blob);
        if (storageKey === 'wallpaperImage') {
            mobileFrame.style.backgroundImage = `url(${imageUrl})`;
        } else if (storageKey === 'musicWidgetImage') {
            albumArt.style.backgroundImage = `url(${imageUrl})`;
        } else if (storageKey === 'decorWidgetImage') {
            document.getElementById('widget-decor').style.backgroundImage = `url(${imageUrl})`;
        } else if (storageKey === 'photoWidgetImage') {
            document.getElementById('photo-content-img').src = imageUrl;
        } else if (storageKey.startsWith('appIcon')) {
            const iconBg = document.querySelector(`[data-storage-key="${storageKey}"]`);
            const iconPreview = document.getElementById(`preview-${storageKey}`);
            if (iconBg) iconBg.style.backgroundImage = `url(${imageUrl})`;
            if (iconPreview) iconPreview.style.backgroundImage = `url(${imageUrl})`;
        } else if (storageKey.startsWith('dockIcon')) {
            const dockIcon = document.getElementById(`dock-icon-${storageKey.slice(-1)}`);
            const iconPreview = document.getElementById(`preview-${storageKey}`);
            if (dockIcon) dockIcon.style.backgroundImage = `url(${imageUrl})`;
            if (iconPreview) iconPreview.style.backgroundImage = `url(${imageUrl})`;
        }
    }

    function openScreen(screenElement) {
        mobileFrame.classList.add('app-open');
        screenElement.classList.add('active');
    }

    function closeScreen(screenElement) {
        screenElement.classList.remove('active');
        screenElement.addEventListener('transitionend', () => {
            if (document.querySelectorAll('.app-screen.active').length === 0) {
                mobileFrame.classList.remove('app-open');
            }
        }, { once: true });
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
        return isNaN(min) ? '0:00' : `${min}:${sec}`;
    }

    // --- 角色书核心功能函数 ---
    function getRelationshipInfo(status) {
        const relationships = {
            '邂逅': { text: '邂逅', emoji: '🤝' },
            '朋友': { text: '朋友', emoji: '😊' },
            '恋人': { text: '恋人', emoji: '❤️' },
            '知己': { text: '知己', emoji: 'soulmate' },
            '宿敌': { text: '宿敌', emoji: '⚔️' },
            '默认': { text: '未知关系', emoji: '❓' }
        };
        return relationships[status] || relationships['默认'];
    }

    // (已修改) renderCharacterList 函数，关系区域变为可点击
    function renderCharacterList() {
        characterListContainer.innerHTML = '';
        if (characters.length === 0) {
            characterListContainer.innerHTML = `<div class="empty-list-placeholder"><h3>空空如也</h3><p>点击右上角的 '+' 来创造你的第一个伙伴吧！</p></div>`;
            return;
        }
        characters.forEach(char => {
            const ticket = document.createElement('div');
            ticket.className = 'ticket';
            ticket.dataset.id = char.id;
            const relationshipInfo = getRelationshipInfo(char.relationship);
            ticket.innerHTML = `
                <div class="loading-overlay">
                    <div class="loading-spinner"><i class="fas fa-spinner"></i></div>
                </div>
                <div class="ticket-art" data-art-id="${char.id}">
                    <div class="ticket-art-placeholder"><span>📷</span><small>点击上传艺术图</small></div>
                </div>
                <div class="ticket-title"><h1>${char.name || '请设置你的名字'}</h1></div>
                <div class="ticket-subtitle">
                    <p>${char.name || '请设置你的名字'}<br>
                       <small>${relationshipInfo.emoji} (${relationshipInfo.text})</small>
                    </p>
                </div>
                <hr class="dotted-divider">
                <div class="ticket-details">
                    <p><b>核心标签:</b> <span contenteditable="true" class="editable-field" data-field="tags">${char.tags || '点击编辑...'}</span></p>
                    <p><b>职业:</b> <span contenteditable="true" class="editable-field" data-field="occupation">${char.occupation || '点击编辑...'}</span></p>
                    <p><b>创建于:</b> ${new Date(char.createdAt).toLocaleDateString()}</p>
                </div>
                <hr class="dotted-divider">
                <div class="ticket-meta">
                    <div><b>好感度:</b> LV.1</div>
                    <div class="relationship-wrapper" data-char-id="${char.id}">
                        <b>关系:</b>
                        <span>${relationshipInfo.text}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div><b>状态:</b> 离线</div>
                    <div><b>初见:</b> [未开始]</div>
                </div>
                <hr class="dotted-divider">
                <div class="ticket-quote">
                    <blockquote contenteditable="true" class="editable-field" data-field="quote"><p>"${char.quote || '...'}"</p></blockquote>
                </div>
                <div class="ticket-actions">
                    <button class="ticket-edit-btn" data-id="${char.id}"><i class="fas fa-pencil-alt"></i> 编辑</button>
                </div>
            `;
            characterListContainer.appendChild(ticket);
            dbHelper.loadObject('images', `char_art_${char.id}`, (blob) => {
                const artDiv = ticket.querySelector('.ticket-art');
                if (artDiv && blob) {
                    const artUrl = URL.createObjectURL(blob);
                    artDiv.style.backgroundImage = `url(${artUrl})`;
                    artDiv.innerHTML = '';
                }
            });
        });
    }

    // (新增) 关系修改弹窗的相关函数
    function openRelationshipModal(charId) {
        currentEditingRelationshipCharId = charId;
        relationshipOptionsContainer.innerHTML = '';
        const relationshipTypes = ['邂逅', '朋友', '恋人', '知己', '宿敌'];
        relationshipTypes.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'modal-btn';
            btn.textContent = `${getRelationshipInfo(type).emoji} ${type}`;
            btn.dataset.relationship = type;
            relationshipOptionsContainer.appendChild(btn);
        });
        relationshipModal.classList.add('active');
    }

    function closeRelationshipModal() {
        relationshipModal.classList.remove('active');
        currentEditingRelationshipCharId = null;
    }

    function updateRelationship(charId, newRelationship) {
        const charIndex = characters.findIndex(c => c.id === charId);
        if (charIndex > -1) {
            characters[charIndex].relationship = newRelationship;
            dbHelper.saveObject('characters', characters[charIndex]);
            renderCharacterList();
        }
        closeRelationshipModal();
    }
    
    function openCharacterEditor(charId = null) {
        tempAvatarFile = null; 
        currentEditingCharacterId = charId;
        charAvatarUploader.style.backgroundImage = '';
        charAvatarUploader.innerHTML = '<i class="fas fa-camera"></i>';
        charNameInput.value = '';
        charPromptInput.value = '';
        userPromptInput.value = '';
        deleteCharBtn.style.display = 'none';
    
        if (charId) {
            const char = characters.find(c => c.id === charId);
            if (char) {
                editorTitle.textContent = '编辑角色';
                dbHelper.loadObject('images', `char_avatar_${charId}`, (blob) => {
                    if (blob) {
                        const avatarUrl = URL.createObjectURL(blob);
                        charAvatarUploader.style.backgroundImage = `url(${avatarUrl})`;
                        charAvatarUploader.innerHTML = '';
                    }
                });
                charNameInput.value = char.name;
                charPromptInput.value = char.charPrompt;
                userPromptInput.value = char.userPrompt;
                deleteCharBtn.style.display = 'block';
            }
        } else {
            editorTitle.textContent = '创建角色';
        }
        openScreen(characterEditorScreen);
    }
    
    async function fetchAiCharacterDetails(character) {
        console.log("正在为角色生成AI信息:", character.name);
        try {
            const messages = promptManager.createCharacterDetailsPrompt(character);
            const jsonString = await apiHelper.callChatCompletion(messages);
            const aiDetails = JSON.parse(jsonString);
            console.log("AI 信息已生成:", aiDetails);
            return aiDetails;
        } catch (error) {
            console.error("从API获取角色详情失败:", error);
            alert(`AI信息生成失败: ${error.message}`);
            return {
                tags: "获取失败",
                occupation: "获取失败",
                quote: "无法连接到AI服务器..."
            };
        }
    }

    async function saveCharacter() {
        const name = charNameInput.value.trim();
        if (!name) { alert('角色姓名不能为空！'); return; }
    
        let isNewChar = false;
        let charData;
        
        if (currentEditingCharacterId) {
            charData = characters.find(c => c.id === currentEditingCharacterId);
        } else {
            isNewChar = true;
            const newId = `char_${Date.now()}`;
            charData = { 
                id: newId, 
                createdAt: Date.now(),
                name: '', charPrompt: '', userPrompt: '',
                relationship: '邂逅', tags: '', occupation: '', quote: ''
            };
            currentEditingCharacterId = newId;
        }
    
        charData.name = name;
        charData.charPrompt = charPromptInput.value;
        charData.userPrompt = userPromptInput.value;
    
        if (tempAvatarFile) {
            processAndSaveImage(tempAvatarFile, `char_avatar_${charData.id}`);
            tempAvatarFile = null;
        }
        
        if (isNewChar) {
            const faultyIndex = characters.findIndex(c => !c.name && !c.createdAt);
            if (faultyIndex > -1) {
                characters[faultyIndex] = charData;
            } else {
                characters.push(charData);
            }
        } else {
            const charIndex = characters.findIndex(c => c.id === currentEditingCharacterId);
            if (charIndex > -1) characters[charIndex] = charData;
        }

        dbHelper.saveObject('characters', charData);
        renderCharacterList();
        closeScreen(characterEditorScreen);
        
        if (isNewChar) {
            const ticketElement = document.querySelector(`.ticket[data-id="${charData.id}"]`);
            const loadingOverlay = ticketElement?.querySelector('.loading-overlay');
            
            try {
                if (loadingOverlay) loadingOverlay.classList.add('visible');
                const aiDetails = await fetchAiCharacterDetails(charData);
                charData.tags = aiDetails.tags;
                charData.occupation = aiDetails.occupation;
                charData.quote = aiDetails.quote;
                dbHelper.saveObject('characters', charData);
            } catch (error) {
                console.error("AI信息填充失败:", error);
            } finally {
                if (loadingOverlay) loadingOverlay.classList.remove('visible');
                renderCharacterList();
            }
        }
    }

    function deleteCharacter() {
        if (currentEditingCharacterId && confirm('确定要永久删除这个角色吗？')) {
            const idToDelete = currentEditingCharacterId;
            dbHelper.deleteObject('characters', idToDelete);
            dbHelper.deleteObject('images', `char_avatar_${idToDelete}`);
            dbHelper.deleteObject('images', `char_art_${idToDelete}`);
            characters = characters.filter(c => c.id !== idToDelete);
            renderCharacterList();
            closeScreen(characterEditorScreen);
        }
    }

    // --- 音乐播放器功能函数 ---
    function loadTrack(index, shouldPlay = false) {
        if (index < 0 || index >= playlist.length) {
            songTitleEl.textContent = "播放列表为空";
            currentTrackIndex = -1;
            return;
        };
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        audioPlayer.src = track.src;
        songTitleEl.textContent = track.name;
        renderPlaylist();
        if (shouldPlay) {
            playTrack();
        }
    }

    function playTrack() {
        if (currentTrackIndex === -1 && playlist.length > 0) {
            loadTrack(0);
        }
        isPlaying = true;
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function pauseTrack() {
        isPlaying = false;
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    function playNext() {
        if (playlist.length === 0) return;
        let nextIndex;
        if (playMode === 'shuffle') {
            do {
                nextIndex = Math.floor(Math.random() * playlist.length);
            } while (playlist.length > 1 && nextIndex === currentTrackIndex);
        } else {
            nextIndex = (currentTrackIndex + 1) % playlist.length;
        }
        loadTrack(nextIndex, true);
    }

    function playPrev() {
        if (playlist.length === 0) return;
        const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(prevIndex, true);
    }

    function updateProgress() {
        const { duration, currentTime } = audioPlayer;
        if (duration) {
            progressBar.style.width = `${(currentTime / duration) * 100}%`;
            totalTimeEl.textContent = formatTime(duration);
        }
        currentTimeEl.textContent = formatTime(currentTime);
    }
    
    function renderPlaylist() {
        playlistContainer.innerHTML = '';
        if (playlist.length === 0) {
            playlistContainer.innerHTML = '<li class="playlist-item" style="justify-content: center;">播放列表为空</li>';
            return;
        }
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            if (index === currentTrackIndex) {
                li.classList.add('playing');
            }
            li.innerHTML = `
                <div class="song-details" data-index="${index}">
                    <span class="song-index">${index + 1}.</span>
                    <span class="song-name">${song.name}</span>
                </div>
                <button class="delete-song-btn" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
            `;
            playlistContainer.appendChild(li);
        });
    }

    function deleteSong(indexToDelete) {
        if (indexToDelete === currentTrackIndex) {
            pauseTrack();
            audioPlayer.src = '';
        }
        playlist.splice(indexToDelete, 1);
        if (currentTrackIndex > indexToDelete) {
            currentTrackIndex--;
        } else if (currentTrackIndex === indexToDelete) {
            if (playlist.length === 0) {
                currentTrackIndex = -1;
                songTitleEl.textContent = '未选择歌曲';
                currentTimeEl.textContent = '0:00';
                totalTimeEl.textContent = '0:00';
                progressBar.style.width = '0%';
            } else {
                const newIndex = Math.min(indexToDelete, playlist.length - 1);
                loadTrack(newIndex, true);
            }
        }
        dbHelper.saveObject('data', 'playlist', playlist);
        renderPlaylist();
    }

    // --- API管理核心函数 ---
    function updateApiStatusUI(isOnline) {
        if (isOnline) {
            apiStatusIndicator.textContent = 'Online';
            apiStatusIndicator.classList.remove('offline');
            apiStatusIndicator.classList.add('online');
        } else {
            apiStatusIndicator.textContent = 'Offline';
            apiStatusIndicator.classList.remove('online');
            apiStatusIndicator.classList.add('offline');
        }
    }

    async function checkApiStatus() {
        const activeApi = apiConfigs.find(c => c.id === activeApiId);
        if (!activeApi) {
            updateApiStatusUI(false);
            return;
        }
        try {
            let baseUrl = activeApi.url.trim();
            if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
            const finalUrl = baseUrl.endsWith('/v1') ? `${baseUrl}/models` : `${baseUrl}/v1/models`;
            const response = await fetch(finalUrl, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${activeApi.key}` }
            });
            updateApiStatusUI(response.ok);
        } catch (error) {
            console.error("API status check failed:", error);
            updateApiStatusUI(false);
        }
    }

    function renderApiList() {
        apiListContainer.innerHTML = '';
        if (apiConfigs.length === 0) {
            apiListContainer.innerHTML = '<li class="api-item-placeholder">暂无已保存的API配置</li>';
            return;
        }
        apiConfigs.forEach(config => {
            const li = document.createElement('li');
            li.className = 'menu-list-item api-item';
            if (config.id === activeApiId) {
                li.classList.add('active');
            }
            li.dataset.id = config.id;
            li.innerHTML = `
                <div class="api-item-details">
                    <span class="api-item-name">${config.name}</span>
                    <span class="api-item-url">${config.url}</span>
                </div>
                <div class="api-item-actions">
                    <button class="api-delete-btn" data-id="${config.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            apiListContainer.appendChild(li);
        });
    }

    function saveApiConfigsToDB() {
        dbHelper.saveObject('data', 'apiConfigs', apiConfigs);
        localStorage.setItem('activeApiId', activeApiId);
        checkApiStatus();
    }

    async function fetchModels() {
        const url = apiUrlInput.value.trim();
        const key = apiKeyInput.value.trim();
        if (!url || !key) {
            apiStatusMsg.textContent = "URL和Key不能为空";
            return;
        }
        fetchModelsBtn.disabled = true;
        fetchModelsBtn.textContent = '获取中...';
        apiStatusMsg.textContent = "正在请求模型列表...";
        try {
            let baseUrl = url.trim();
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }
            let finalUrl;
            if (baseUrl.endsWith('/v1')) {
                finalUrl = `${baseUrl}/models`;
            } else {
                finalUrl = `${baseUrl}/v1/models`;
            }
            const response = await fetch(finalUrl, { method: 'GET', headers: { 'Authorization': `Bearer ${key}` } });
            if (!response.ok) {
                throw new Error(`网络请求失败: ${response.status}`);
            }
            const data = await response.json();
            const models = data.data || data;
            apiModelSelect.innerHTML = '';
            if (Array.isArray(models) && models.length > 0) {
                models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.id;
                    option.textContent = model.id;
                    apiModelSelect.appendChild(option);
                });
                apiModelSelect.disabled = false;
                saveApiBtn.disabled = false;
                apiStatusMsg.textContent = `成功获取 ${models.length} 个模型！`;
            } else {
                apiStatusMsg.textContent = "未能获取到有效的模型列表";
            }
        } catch (error) {
            console.error("Fetch models error:", error);
            apiStatusMsg.textContent = "获取失败，请检查URL、Key或网络";
        } finally {
            fetchModelsBtn.disabled = false;
            fetchModelsBtn.textContent = '获取模型';
        }
    }

    function resetApiForm() {
        apiNameInput.value = '';
        apiUrlInput.value = '';
        apiKeyInput.value = '';
        apiModelSelect.innerHTML = '<option>请先获取模型列表</option>';
        apiModelSelect.disabled = true;
        saveApiBtn.disabled = true;
        apiStatusMsg.textContent = '';
    }

    // --- 个性化设置函数 ---
    function applyFont(fontUrl) {
        if (!fontUrl) return;
        const oldStyle = document.getElementById('custom-font-style');
        if (oldStyle) {
            oldStyle.remove();
        }
        const style = document.createElement('style');
        style.id = 'custom-font-style';
        style.textContent = `
            @font-face {
                font-family: 'CustomFont';
                src: url('${fontUrl}');
            }
            body {
                font-family: 'CustomFont', 'SF Pro Text', 'Noto Sans SC', sans-serif;
            }
        `;
        document.head.appendChild(style);
        localStorage.setItem('customFontUrl', fontUrl);
    }

    function applyFontSize(size) {
        if (!size) return;
        document.documentElement.style.fontSize = `${size}px`;
        fontSizeValue.textContent = `${size}px`;
        localStorage.setItem('customFontSize', size);
    }

    function updatePlayModeIcon() {
        const iconClass = playModeIcons[playMode] || 'fa-redo';
        playModeBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
        localStorage.setItem('playMode', playMode);
    }

    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        themeIcon.className = `fas fa-${theme === 'dark' ? 'moon' : 'sun'}`;
        localStorage.setItem('theme', theme);
    }

    function initializeIconChanger() {
        iconGrid.innerHTML = '';
        const allItems = [...apps, ...dockItems];
        allItems.forEach(item => {
            const isDock = !!item.name.startsWith('Dock');
            const prefix = isDock ? 'dockIcon' : 'appIcon';
            const id = isDock ? item.id : item.id.charAt(0).toUpperCase() + item.id.slice(1);
            const storageKey = `${prefix}${id}`;
            const gridItem = document.createElement('div');
            gridItem.className = 'icon-changer-item';
            gridItem.innerHTML = `<div class="icon-preview" id="preview-${storageKey}"></div><span>${item.name}</span><button class="change-btn" data-storage-key="${storageKey}">更换</button>`;
            iconGrid.appendChild(gridItem);
            gridItem.querySelector('.change-btn').addEventListener('click', (e) => {
                imageUploader.dataset.currentStorageKey = e.target.dataset.storageKey;
                imageUploader.dataset.imageType = 'widget';
                imageUploader.click();
            });
        });
    }

    // --- 应用初始化 ---
    function initializeApp() {
        initializeIconChanger();
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);

        const savedFontUrl = localStorage.getItem('customFontUrl');
        if (savedFontUrl) {
            applyFont(savedFontUrl);
            fontUrlInput.value = savedFontUrl;
        }
        const savedFontSize = localStorage.getItem('customFontSize') || '16';
        applyFontSize(savedFontSize);
        fontSizeSlider.value = savedFontSize;

        dbHelper.initDB(() => {
            const appKeys = apps.map(app => `appIcon${app.id.charAt(0).toUpperCase() + app.id.slice(1)}`);
            const dockKeys = dockItems.map(item => `dockIcon${item.id}`);
            const allStorageKeys = ['wallpaperImage', 'musicWidgetImage', 'decorWidgetImage', 'photoWidgetImage', ...appKeys, ...dockKeys];
            allStorageKeys.forEach(key => dbHelper.loadObject('images', key, (blob) => {
                if (blob) applyImageFromBlob(key, blob);
            }));
            dbHelper.loadObject('data', 'playlist', (savedPlaylist) => {
                if (savedPlaylist && savedPlaylist.length > 0) {
                    playlist = savedPlaylist;
                    loadTrack(0);
                } else {
                    renderPlaylist();
                    loadTrack(-1);
                }
            });
            dbHelper.loadObject('data', 'apiConfigs', (savedConfigs) => {
                if (savedConfigs && Array.isArray(savedConfigs)) {
                    apiConfigs = savedConfigs;
                    activeApiId = localStorage.getItem('activeApiId');
                    renderApiList();
                    checkApiStatus();
                } else {
                    updateApiStatusUI(false);
                }
            });
            dbHelper.loadAll('characters', (savedCharacters) => {
                characters = savedCharacters;
                renderCharacterList();
            });
        });

        const savedPlayMode = localStorage.getItem('playMode');
        if (savedPlayMode && playModes.includes(savedPlayMode)) {
            playMode = savedPlayMode;
        }
        updatePlayModeIcon();

        const timeElement = document.getElementById('time');
        function updateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }
        updateTime();
        setInterval(updateTime, 60000);
    }
    
    // --- 全局事件监听器 ---
    imageUploader.addEventListener('change', (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        const storageKey = imageUploader.dataset.currentStorageKey;
        const imageType = imageUploader.dataset.imageType;
    
        if (imageType === 'charAvatar') {
            const previewUrl = URL.createObjectURL(file);
            charAvatarUploader.style.backgroundImage = `url(${previewUrl})`;
            charAvatarUploader.innerHTML = '';
            if (currentEditingCharacterId) {
                processAndSaveImage(file, `char_avatar_${currentEditingCharacterId}`);
            } else {
                tempAvatarFile = file;
            }
            return;
        }
    
        if (imageType === 'ticketArt') {
            processAndSaveImage(file, storageKey, (blob) => {
                renderCharacterList();
            });
            return;
        }
    
        processAndSaveImage(file, storageKey, (blob) => {
            applyImageFromBlob(storageKey, blob);
        });
    });

    characterBookApp.addEventListener('click', () => openScreen(characterBookScreen));
    addCharBtn.addEventListener('click', () => openCharacterEditor());
    saveCharBtn.addEventListener('click', saveCharacter);
    deleteCharBtn.addEventListener('click', deleteCharacter);

    // (已修改) 增加了对关系修改区域的点击监听
    characterListContainer.addEventListener('click', (e) => {
        const artUploader = e.target.closest('.ticket-art');
        const editButton = e.target.closest('.ticket-edit-btn');
        const relationshipWrapper = e.target.closest('.relationship-wrapper');
    
        if (artUploader) {
            e.stopPropagation();
            const charId = artUploader.dataset.artId;
            if (charId) {
                imageUploader.dataset.currentStorageKey = `char_art_${charId}`;
                imageUploader.dataset.imageType = 'ticketArt';
                imageUploader.click();
            }
        } else if (editButton) {
            e.stopPropagation();
            const charId = editButton.dataset.id;
            openCharacterEditor(charId);
        } else if (relationshipWrapper) {
            e.stopPropagation();
            const charId = relationshipWrapper.dataset.charId;
            openRelationshipModal(charId);
        }
    });
    
    characterListContainer.addEventListener('focusout', (e) => {
        const editableField = e.target.closest('.editable-field');
        if (editableField) {
            const charId = editableField.closest('.ticket').dataset.id;
            const field = editableField.dataset.field;
            const newText = (field === 'quote' ? editableField.querySelector('p').textContent : editableField.textContent).trim();

            const charIndex = characters.findIndex(c => c.id === charId);
            if (charIndex > -1 && field && characters[charIndex][field] !== newText) {
                characters[charIndex][field] = newText;
                dbHelper.saveObject('characters', characters[charIndex]);
                console.log(`Updated ${field} for character ${charId}`);
            }
        }
    });

    charAvatarUploader.addEventListener('click', () => {
        imageUploader.dataset.imageType = 'charAvatar';
        imageUploader.click();
    });

    // (新增) 关系修改弹窗的事件监听
    relationshipModal.addEventListener('click', (e) => {
        if (e.target === relationshipModal) { // 点击遮罩层关闭
            closeRelationshipModal();
        }
    });
    relationshipOptionsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.modal-btn');
        if (target && target.dataset.relationship) {
            const newRelationship = target.dataset.relationship;
            updateRelationship(currentEditingRelationshipCharId, newRelationship);
        }
    });
    closeRelationshipModalBtn.addEventListener('click', closeRelationshipModal);


    personalizationAppIcon.addEventListener('click', () => openScreen(personalizationScreen));
    menuChangeIcons.addEventListener('click', () => openScreen(iconChangerScreen));
    backButtons.forEach(btn => btn.addEventListener('click', (e) => closeScreen(e.target.closest('.app-screen'))));
    albumArt.addEventListener('click', () => {
        imageUploader.dataset.currentStorageKey = 'musicWidgetImage';
        imageUploader.dataset.imageType = 'widget';
        imageUploader.click();
    });
    Object.values(directUploadWidgets).forEach(widget => {
        widget.addEventListener('click', () => {
            imageUploader.dataset.currentStorageKey = widget.dataset.storageKey;
            imageUploader.dataset.imageType = 'widget';
            imageUploader.click();
        });
    });
    menuChangeWallpaper.addEventListener('click', () => {
        imageUploader.dataset.currentStorageKey = 'wallpaperImage';
        imageUploader.dataset.imageType = 'widget';
        imageUploader.click();
    });
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    playPauseBtn.addEventListener('click', () => { if (playlist.length > 0) { isPlaying ? pauseTrack() : playTrack(); } });
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('play', () => { isPlaying = true; playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; renderPlaylist(); });
    audioPlayer.addEventListener('pause', () => { isPlaying = false; playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; renderPlaylist(); });
    audioPlayer.addEventListener('ended', () => { (playMode === 'repeat-one') ? loadTrack(currentTrackIndex, true): playNext(); });
    playModeBtn.addEventListener('click', () => {
        const currentModeIndex = playModes.indexOf(playMode);
        playMode = playModes[(currentModeIndex + 1) % playModes.length];
        updatePlayModeIcon();
    });

    playlistBtn.addEventListener('click', () => openScreen(playlistScreen));
    addSongBtn.addEventListener('click', () => addSongModal.classList.add('active'));
    closeModalBtn.addEventListener('click', () => addSongModal.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) { addSongModal.classList.remove('active'); } });
    uploadLocalBtn.addEventListener('click', () => audioUploader.click());
    audioUploader.addEventListener('change', (e) => {
        [...e.target.files].forEach(file => playlist.push({ name: file.name.replace(/\.[^/.]+$/, ""), src: URL.createObjectURL(file) }));
        dbHelper.saveObject('data', 'playlist', playlist);
        renderPlaylist();
        if (currentTrackIndex < 0 && playlist.length > 0) { loadTrack(0, true); }
        addSongModal.classList.remove('active');
    });
    addUrlBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url) {
            const name = url.substring(url.lastIndexOf('/') + 1) || 'Network Track';
            playlist.push({ name, src: url });
            dbHelper.saveObject('data', 'playlist', playlist);
            renderPlaylist();
            if (currentTrackIndex < 0 && playlist.length > 0) { loadTrack(0, true); }
            urlInput.value = '';
            addSongModal.classList.remove('active');
        }
    });
    playlistContainer.addEventListener('click', (e) => {
        const songDetails = e.target.closest('.song-details');
        const deleteButton = e.target.closest('.delete-song-btn');
        if (songDetails) {
            const index = parseInt(songDetails.dataset.index, 10);
            loadTrack(index, true);
        } else if (deleteButton) {
            const index = parseInt(deleteButton.dataset.index, 10);
            deleteSong(index);
        }
    });

    menuApiSettings.addEventListener('click', () => openScreen(apiSettingsScreen));
    fetchModelsBtn.addEventListener('click', fetchModels);
    
    saveApiBtn.addEventListener('click', () => {
        const newConfig = {
            id: `api_${Date.now()}`,
            name: apiNameInput.value.trim() || '未命名配置',
            url: apiUrlInput.value.trim(),
            key: apiKeyInput.value.trim(),
            selectedModel: apiModelSelect.value,
        };
        apiConfigs.push(newConfig);
        activeApiId = newConfig.id;
        saveApiConfigsToDB();
        renderApiList();
        resetApiForm();
    });

    apiListContainer.addEventListener('click', (e) => {
        const apiItem = e.target.closest('.api-item');
        const deleteBtn = e.target.closest('.api-delete-btn');
        if (deleteBtn) {
            const idToDelete = deleteBtn.dataset.id;
            apiConfigs = apiConfigs.filter(config => config.id !== idToDelete);
            if (activeApiId === idToDelete) { 
                activeApiId = apiConfigs.length > 0 ? apiConfigs[0].id : null; 
            }
            saveApiConfigsToDB();
            renderApiList();
        } else if (apiItem) {
            activeApiId = apiItem.dataset.id;
            saveApiConfigsToDB();
            renderApiList();
        }
    });

    menuFontSettings.addEventListener('click', () => openScreen(fontSettingsScreen));
    applyFontBtn.addEventListener('click', () => {
        const url = fontUrlInput.value.trim();
        if (url) { applyFont(url); }
    });
    fontSizeSlider.addEventListener('input', () => { applyFontSize(fontSizeSlider.value); });

    // --- 启动应用 ---
    initializeApp();
});