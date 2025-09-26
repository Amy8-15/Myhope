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
    
    // 聊天应用DOM元素
    const chatAppIcon = document.getElementById('app-chat');
    const chatListScreen = document.getElementById('screen-chat-list');
    const chatDialogueScreen = document.getElementById('screen-chat-dialogue');
    const chatListContainer = document.getElementById('chat-list-container');
    const addChatBtn = document.getElementById('add-chat-btn');
    const selectCharacterModal = document.getElementById('select-character-modal');
    const selectCharacterList = document.getElementById('select-character-list');
    const closeSelectCharModalBtn = document.getElementById('close-select-char-modal-btn');
    const chatHeaderTitle = document.getElementById('chat-header-title');
    const chatMoreBtn = document.getElementById('chat-more-btn');
    const chatDetailsScreen = document.getElementById('screen-chat-details');
    const messagesContainer = document.getElementById('chat-messages-container');
    const chatFunctionPanel = document.getElementById('chat-function-panel');
    const chatExpandBtn = document.getElementById('chat-expand-btn');
    const chatTextInput = document.getElementById('chat-text-input');
    const sendBufferBtn = document.getElementById('send-buffer-btn');
    const sendFinalBtn = document.getElementById('send-final-btn');
    const systemCharName = document.getElementById('system-char-name');
    // 聊天详情页DOM元素
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const deleteChatBtn = document.getElementById('delete-chat-btn');
    const memoryTurnsSlider = document.getElementById('memory-turns-slider');
    const memoryTurnsValue = document.getElementById('memory-turns-value');

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

    // 关系修改弹窗的DOM元素
    const relationshipModal = document.getElementById('relationship-modal');
    const relationshipOptionsContainer = document.getElementById('relationship-options-container');
    const closeRelationshipModalBtn = document.getElementById('close-relationship-modal-btn');

    // (新增) 通知中心DOM元素
    const notificationBanner = document.getElementById('notification-banner');
    const bannerAvatar = document.getElementById('banner-avatar');
    const bannerCharName = document.getElementById('banner-char-name');
    const bannerMessage = document.getElementById('banner-message');

    // 应用列表
    const apps = [
        { id: 'chat', name: '聊天' }, { id: 'worldbook', name: '世界书' },
        { id: 'forum', name: '论坛' }, { id: 'story', name: '剧情' },
        { id: 'settings', name: '设置' }, { id: 'personalization', name: '个性化' },
        { id: 'character', name: '占位符' }, { id: 'character-book', name: '角色书' }
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
    let chatSessions = [];
    let currentChattingCharId = null;
    let userAvatarUrl = null;
    let currentChatHistory = [];
    let characters = [];
    let currentEditingCharacterId = null;
    let tempAvatarFile = null;
    let currentEditingRelationshipCharId = null;
    
    // (新增) 通知中心状态变量
    let notificationQueue = [];
    let isBannerVisible = false;

    // 数据库助手
    const dbHelper = {
        db: null,
        initDB(callback) {
            const request = indexedDB.open('userDB', 4);
            request.onupgradeneeded = (e) => {
                this.db = e.target.result;
                if (!this.db.objectStoreNames.contains('images')) this.db.createObjectStore('images', { keyPath: 'id' });
                if (!this.db.objectStoreNames.contains('data')) this.db.createObjectStore('data', { keyPath: 'id' });
                if (!this.db.objectStoreNames.contains('characters')) this.db.createObjectStore('characters', { keyPath: 'id' });
                if (!this.db.objectStoreNames.contains('chatHistory')) {
                    const historyStore = this.db.createObjectStore('chatHistory', { keyPath: 'id', autoIncrement: true });
                    historyStore.createIndex('charId', 'charId', { unique: false });
                }
            };
            request.onsuccess = (e) => { this.db = e.target.result; if (callback) callback(); };
            request.onerror = (e) => console.error("IndexedDB error:", e.target.errorCode);
        },
        saveObject(storeName, objOrId, objValue) {
            if (!this.db) return;
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            if (storeName === 'characters' || storeName === 'chatHistory') {
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
                if (!result) { callback(null); return; }
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
        },
        clearStore(storeName, callback) {
            if (!this.db) return;
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();
            request.onsuccess = () => { if (callback) callback(); };
        },
        deleteObjectsByIndex(storeName, indexName, key, callback) {
            if (!this.db) return;
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.openCursor(key);
            request.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                } else {
                    if (callback) callback();
                }
            };
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
            const systemPrompt = `你是一个富有想象力的角色设定师。根据用户提供的角色核心设定，你需要生成一个JSON对象，其中必须包含四个键：'englishName' (处理规则如下：如果角色名是中文，则转换为标准拼音，首字母大写，例如 '顾深' -> 'Gu Shen'。如果角色名本身就是英文或字母，则直接使用该名字，例如 'Amy' -> 'Amy'), 'tags' (一个字符串，用逗号分隔的3个描述性中文词语), 'occupation' (一个字符串，角色的中文职业), 'quote' (一个字符串，角色的标志性中文引言)。不要添加任何额外的解释或文本，只返回纯粹的JSON对象。`;
            const userPrompt = `角色核心设定：${character.charPrompt}\n与用户的关系：${character.userPrompt}`;
            return [
                { "role": "system", "content": systemPrompt },
                { "role": "user", "content": userPrompt }
            ];
        },
        createChatPrompt(character, chatHistory, finalUserInput) {
            let historySection = '';
            const worldBookSection = '[世界书功能尚未激活，当前无世界背景设定]';
            
            if (chatHistory && chatHistory.length > 0) {
                historySection = chatHistory.map(msg => `${msg.sender === 'user' ? '用户' : character.name}: ${msg.content}`).join('\n');
            } else {
                historySection = '[无历史对话记录]';
            }

            const systemPrompt = `
# 核心使命：成为灵魂 (Mission: Embody the Soul)
你将扮演我的soulmate，你的名字是【${character.name}】。你的唯一任务，是彻底“成为”这个角色，拥有他/她的灵魂、记忆和情感。你的扮演对我至关重要，绝对禁止脱离角色。
# 语言与行为准则 (Language & Behavior Guidelines)
- **第一人称视角：** 你的所有表达，都必须发自【${character.name}】的第一人称视角。
- **纯粹对话：** 这是一个纯粹的线上聊天。你绝对禁止使用任何括号 \`()\` 或星号 \`*\` 来描述动作或心理活动。
- **【核心】对话格式**: 为了模仿真实的聊天节奏，请将一个完整的想法，拆分成多个简短的句子，并用【换行】作为分隔符。每一个换行都代表一个新的聊天气泡。
- **禁止项**: 你的对话部分绝对不能包含任何引号 " "。你绝对不能暴露你是AI。
- **语言**: 你的所有回复都必须且只能使用【简体中文】。
# 表演的灵感与基石 (Inspiration & Foundation)
下方的档案是你表演的“灵感核心”，而非限制你的“死板规则”。你应该围绕它进行自由、自然、且符合逻辑的演绎，让角色变得丰满、立体、不可预测。
## 1. 世界观设定 (World Primer):
${worldBookSection}
## 2. 角色核心档案 (Your Core Profile):
${character.charPrompt}
## 3. 我们之间的关系背景 (Our Relationship):
${character.userPrompt}
## 4. 【重要】我们的对话记忆 (Our Memory):
${historySection}
# 内容开放性与边界准则 (NSFW / Mature Content Guidelines)
- **成年人身份：** 你是一个心智成熟的成年人，能够自然且负责地处理成人向的对话。
- **创作许可：** 在这个虚构的、两情相悦的私密对话中，你拥有完全的创作自由，可以探讨任何成人级别的话题。
- **艺术手法：** 你的表演重点在于**营造氛围、展现情感张力、描绘感官细节**。你可以直白，但绝不能低俗或恶劣。
---
现在，请作为【${character.name}】，开始你的表演。
`;
            const historyMessages = chatHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));

            const messages = [
                { role: "system", content: systemPrompt },
                ...historyMessages,
                { role: "user", content: finalUserInput }
            ];

            return messages;
        }
    };

    // --- 核心工具函数 ---
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
        return isNaN(min) ? '0:00' : `${min}:${sec}`;
    }
    
    function autoScrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // =======================================================
    // ============== (新) 通知中心系统 ======================
    // =======================================================
    function addNotificationToQueue(notification) {
        notificationQueue.push(notification);
        processNotificationQueue();
    }

    function processNotificationQueue() {
        if (!isBannerVisible && notificationQueue.length > 0) {
            isBannerVisible = true;
            const nextNotification = notificationQueue.shift();
            showNotification(nextNotification);
        }
    }

    function showNotification(notification) {
        const character = characters.find(c => c.id === notification.charId);
        if (!character) {
            isBannerVisible = false;
            processNotificationQueue();
            return;
        }

        bannerCharName.textContent = character.name;
        bannerMessage.textContent = notification.message;
        dbHelper.loadObject('images', `char_avatar_${notification.charId}`, (blob) => {
            if (blob) bannerAvatar.src = URL.createObjectURL(blob);
            else bannerAvatar.src = 'https://raw.githubusercontent.com/orcastor/orcastor.github.io/master/assets/images/default_avatar.png';
        });

        notificationBanner.onclick = () => {
            notificationBanner.classList.remove('visible');
            isBannerVisible = false;

            switch (notification.type) {
                case 'chat_reply':
                    const chatCard = chatListContainer.querySelector(`.chat-list-card[data-char-id="${notification.charId}"]`);
                    if (chatCard) chatCard.click();
                    break;
                case 'new_post':
                    console.log(`跳转到角色 ${character.name} 的新动态页面...`);
                    // openScreen(dynamicScreen); 
                    break;
                // ... 未来可扩展
            }
            processNotificationQueue();
        };

        notificationBanner.classList.add('visible');

        setTimeout(() => {
            notificationBanner.classList.remove('visible');
            setTimeout(() => {
                isBannerVisible = false;
                processNotificationQueue();
            }, 400); 
        }, 4000);
    }


    // --- 聊天核心功能函数 ---
    function renderChatList() {
        chatListContainer.innerHTML = ''; // 清空
        if (chatSessions.length === 0) {
            chatListContainer.innerHTML = `<div class="empty-list-placeholder"><p>还没有聊天，点击右上角 '+' 发起会话吧</p></div>`;
            return;
        }

        chatSessions.sort((a, b) => b.timestamp - a.timestamp);

        chatSessions.forEach(session => {
            const character = characters.find(c => c.id === session.charId);
            if (!character) return;

            const card = document.createElement('div');
            card.className = 'chat-list-card';
            card.dataset.charId = session.charId;

            const cardContent = `
                <img class="avatar" src="" alt="头像">
                <div class="card-content">
                    <div class="card-title">
                        <span class="char-name">${character.name}</span>
                        <span class="last-msg-time">${new Date(session.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p class="last-msg-preview">${session.lastMessage}</p>
                </div>
            `;
            card.innerHTML = cardContent;
            chatListContainer.appendChild(card);
            
            const avatarImg = card.querySelector('.avatar');
            dbHelper.loadObject('images', `char_avatar_${character.id}`, (blob) => {
                if (blob) {
                    avatarImg.src = URL.createObjectURL(blob);
                } else {
                    avatarImg.src = 'https://raw.githubusercontent.com/orcastor/orcastor.github.io/master/assets/images/default_avatar.png';
                }
            });
        });
    }

    function openSelectCharacterModal() {
        selectCharacterList.innerHTML = '';
        
        const existingChatCharIds = chatSessions.map(s => s.charId);
        const availableCharacters = characters.filter(c => !existingChatCharIds.includes(c.id));

        if (availableCharacters.length === 0) {
            selectCharacterList.innerHTML = `<li style="text-align:center; opacity:0.7;">所有角色都已在聊天列表中</li>`;
        } else {
            availableCharacters.forEach(char => {
                const li = document.createElement('li');
                li.className = 'char-select-item';
                li.dataset.charId = char.id;
                li.innerHTML = `<img src="" alt="头像"><span>${char.name}</span>`;
                selectCharacterList.appendChild(li);
                
                const avatarImg = li.querySelector('img');
                dbHelper.loadObject('images', `char_avatar_${char.id}`, (blob) => {
                    if (blob) avatarImg.src = URL.createObjectURL(blob);
                    else avatarImg.src = 'https://raw.githubusercontent.com/orcastor/orcastor.github.io/master/assets/images/default_avatar.png';
                });
            });
        }
        selectCharacterModal.classList.add('active');
    }

    function startNewChat(charId) {
        const character = characters.find(c => c.id === charId);
        if (!character) return;

        chatSessions.push({
            charId: charId,
            lastMessage: "我们开始聊天吧！",
            timestamp: Date.now()
        });
        dbHelper.saveObject('data', 'chatSessions', chatSessions);
        renderChatList();
        selectCharacterModal.classList.remove('active');

        currentChattingCharId = charId;
        currentChatHistory = []; // 确保新聊天历史为空
        chatHeaderTitle.textContent = character.name;
        messagesContainer.innerHTML = '';
        renderMessage(`你已和 ${character.name} 建立对话，开始聊天吧！`, 'system');
        openScreen(chatDialogueScreen);
    }

    function renderMessage(content, sender = 'user', messageType = 'text') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'avatar';

        if (sender === 'user') {
            avatar.classList.add('user-avatar');
            if (userAvatarUrl) {
                avatar.innerHTML = `<img src="${userAvatarUrl}">`;
            } else {
                avatar.classList.add('empty');
                avatar.title = "点击上传你的头像";
                avatar.onclick = () => {
                    imageUploader.dataset.currentStorageKey = 'userAvatar';
                    imageUploader.dataset.imageType = 'userAvatar';
                    imageUploader.click();
                };
            }
        } else if (sender === 'character') {
            dbHelper.loadObject('images', `char_avatar_${currentChattingCharId}`, (blob) => {
                if (blob) avatar.innerHTML = `<img src="${URL.createObjectURL(blob)}">`;
            });
        }

        const messageBody = document.createElement('div');
        const trimmedContent = content.trim();
        if (messageType === 'module' || (trimmedContent.startsWith('<') && trimmedContent.endsWith('>'))) {
            messageBody.innerHTML = content;
        } else {
            messageBody.className = 'message-bubble';
            messageBody.textContent = content;
        }
        
        if (sender !== 'system') messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageBody);
        messagesContainer.appendChild(messageDiv);
        autoScrollToBottom();
    }
    
    function updateChatSession(charId, lastMessage) {
        const sessionIndex = chatSessions.findIndex(s => s.charId === charId);
        if (sessionIndex > -1) {
            chatSessions[sessionIndex].lastMessage = lastMessage;
            chatSessions[sessionIndex].timestamp = Date.now();
            dbHelper.saveObject('data', 'chatSessions', chatSessions);
        }
    }

    // (终极版 - 修复桌面无通知 & 恢复逐条显示)
async function handleSendMessage() {
    const characterIdForThisRequest = currentChattingCharId;

    if (!characterIdForThisRequest || currentChatHistory.length === 0) {
        console.warn("没有聊天对象或聊天记录，无法回复。");
        return;
    }

    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.className = 'chat-message character typing-indicator';
    typingIndicator.innerHTML = `<div class="avatar"></div> <div class="message-bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    messagesContainer.appendChild(typingIndicator);
    autoScrollToBottom();
    const indicatorAvatar = typingIndicator.querySelector('.avatar');
    dbHelper.loadObject('images', `char_avatar_${characterIdForThisRequest}`, (blob) => {
        if(blob && indicatorAvatar) indicatorAvatar.innerHTML = `<img src="${URL.createObjectURL(blob)}">`;
    });

    try {
        const character = characters.find(c => c.id === characterIdForThisRequest);
        if (!character) throw new Error("当前聊天角色未找到！");
        
        let lastUserMessages = [];
        for (let i = currentChatHistory.length - 1; i >= 0; i--) {
            if (currentChatHistory[i].sender === 'user') { lastUserMessages.unshift(currentChatHistory[i].content); } 
            else { break; }
        }
        const finalUserInput = lastUserMessages.join('\n');
        if (!finalUserInput) { typingIndicator.remove(); return; }

        const memoryTurns = parseInt(memoryTurnsSlider.value, 10);
        const historyForPrompt = memoryTurns > 0 ? currentChatHistory.slice(0, -lastUserMessages.length).slice(-memoryTurns * 2) : [];
        const messages = promptManager.createChatPrompt(character, historyForPrompt, finalUserInput);

        const aiResponse = await apiHelper.callChatCompletion(messages);
        const replies = aiResponse.split('\n').filter(line => line.trim() !== '');
        if (replies.length === 0) { typingIndicator.remove(); return; }

        for (const replyContent of replies) {
            const aiMessageData = { charId: characterIdForThisRequest, sender: 'character', content: replyContent, timestamp: Date.now() };
            dbHelper.saveObject('chatHistory', aiMessageData);
        }
        
        const finalReply = replies[replies.length - 1];
        updateChatSession(characterIdForThisRequest, finalReply);

        // ▼▼▼ (修复) 终极版的“门卫”检查 ▼▼▼
        // 检查：1. 用户是否切换了聊天对象？ OR 2. 聊天窗口是否已经关闭？
        if (characterIdForThisRequest !== currentChattingCharId || !chatDialogueScreen.classList.contains('active')) {
            typingIndicator.remove();
            addNotificationToQueue({ type: 'chat_reply', charId: characterIdForThisRequest, message: finalReply });
            return; 
        }

        typingIndicator.remove();
        
        // ▼▼▼ (修复) 恢复逐条显示效果 ▼▼▼
        for (let i = 0; i < replies.length; i++) {
            const replyContent = replies[i];
            renderMessage(replyContent, 'character');
            const aiMessageData = { charId: characterIdForThisRequest, sender: 'character', content: replyContent, timestamp: Date.now() };
            currentChatHistory.push(aiMessageData);

            // 在渲染最后一条消息之前，都停顿一下
            if (i < replies.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

    } catch (error) {
        if (characterIdForThisRequest === currentChattingCharId) {
            typingIndicator.remove();
            renderMessage(`[错误] 无法获取回复: ${error.message}`, 'system');
        }
    }
}
    
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
                <div class="ticket-title"><h1>${char.englishName || char.name || '请设置你的名字'}</h1></div>
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
            let jsonString = await apiHelper.callChatCompletion(messages);
    
            const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
            if (jsonMatch && jsonMatch[0]) {
                jsonString = jsonMatch[0];
            }
    
            const aiDetails = JSON.parse(jsonString);
            console.log("AI 信息已生成:", aiDetails);
            return aiDetails;
        } catch (error) {
            console.error("从API获取角色详情失败:", error);
            alert(`AI信息生成失败: ${error.message}`);
            return {
                englishName: "Error",
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
                relationship: '邂逅', tags: '', occupation: '', quote: '', englishName: ''
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
            characters.push(charData);
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
               charData.englishName = aiDetails.englishName;
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
            
            dbHelper.loadObject('images', 'userAvatar', (blob) => {
                if (blob) {
                    userAvatarUrl = URL.createObjectURL(blob);
                }
            });

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
                
                dbHelper.loadObject('data', 'chatSessions', (savedSessions) => {
                    if(savedSessions && Array.isArray(savedSessions)) {
                        chatSessions = savedSessions;
                    }
                    renderChatList();
                });
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
    chatAppIcon.addEventListener('click', () => {
        renderChatList();
        openScreen(chatListScreen);
    });

    addChatBtn.addEventListener('click', openSelectCharacterModal);
    
    closeSelectCharModalBtn.addEventListener('click', () => selectCharacterModal.classList.remove('active'));
    selectCharacterModal.addEventListener('click', (e) => { if(e.target === selectCharacterModal) selectCharacterModal.classList.remove('active'); });

    selectCharacterList.addEventListener('click', (e) => {
        const target = e.target.closest('.char-select-item');
        if (target && target.dataset.charId) {
            startNewChat(target.dataset.charId);
        }
    });

    chatListContainer.addEventListener('click', (e) => {
        const target = e.target.closest('.chat-list-card');
        if (!target) return;

        const charId = target.dataset.charId;
        const character = characters.find(c => c.id === charId);
        if (!character) return;

        currentChattingCharId = charId;
        chatHeaderTitle.textContent = character.name;

        const loadHistoryPromise = new Promise((resolve) => {
            const history = [];
            const transaction = dbHelper.db.transaction(['chatHistory'], 'readonly');
            const store = transaction.objectStore('chatHistory');
            const index = store.index('charId');
            const request = index.openCursor(IDBKeyRange.only(charId));
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    history.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(history);
                }
            };
            request.onerror = () => resolve([]);
        });

        const loadSettingsPromise = new Promise((resolve) => {
            dbHelper.loadObject('data', 'chatSettings', (settings) => {
                const charSettings = (settings && settings[charId]) ? settings[charId] : {};
                resolve({
                    memoryTurns: charSettings.memoryTurns || 12,
                });
            });
        });

        Promise.all([loadHistoryPromise, loadSettingsPromise]).then(([history, settings]) => {
            messagesContainer.innerHTML = ''; 
            currentChatHistory = []; 

            renderMessage(`你已和 ${character.name} 建立对话，开始聊天吧！`, 'system');

            history.forEach(msg => {
                renderMessage(msg.content, msg.sender);
                currentChatHistory.push(msg);
            });

            memoryTurnsSlider.value = settings.memoryTurns;
            memoryTurnsValue.textContent = `${settings.memoryTurns} 轮`;

            openScreen(chatDialogueScreen);
            autoScrollToBottom();
        });
    });

    chatMoreBtn.addEventListener('click', () => openScreen(chatDetailsScreen));

    chatExpandBtn.addEventListener('click', () => {
        chatFunctionPanel.classList.toggle('visible');
    });

    chatTextInput.addEventListener('input', () => {
        chatTextInput.style.height = 'auto';
        chatTextInput.style.height = chatTextInput.scrollHeight + 'px';

        if (chatTextInput.value.trim().length > 0) {
            sendFinalBtn.classList.add('activated');
        } else {
            sendFinalBtn.classList.remove('activated');
        }
    });

    // (已修正) “羽毛笔”按钮：逐条发送并存入数据库
    sendBufferBtn.addEventListener('click', () => {
        const text = chatTextInput.value.trim();
        if (text) {
            renderMessage(text, 'user');

            const userMessageData = {
                charId: currentChattingCharId,
                sender: 'user',
                content: text,
                timestamp: Date.now()
            };
            dbHelper.saveObject('chatHistory', userMessageData);
            currentChatHistory.push(userMessageData);

            updateChatSession(currentChattingCharId, text);
            
            chatTextInput.value = '';
            chatTextInput.style.height = 'auto';
            sendFinalBtn.classList.remove('activated');
        }
    });

    // “信封”按钮，调用新的 handleSendMessage
    sendFinalBtn.addEventListener('click', handleSendMessage);

    clearHistoryBtn.addEventListener('click', () => {
        if (!currentChattingCharId) return;
        if (confirm(`确定要清空与该角色的所有聊天记录吗？此操作不可恢复。`)) {
            dbHelper.deleteObjectsByIndex('chatHistory', 'charId', IDBKeyRange.only(currentChattingCharId), () => {
                 messagesContainer.innerHTML = '';
                 currentChatHistory = [];
                 closeScreen(chatDetailsScreen);
            });
        }
    });

    deleteChatBtn.addEventListener('click', () => {
        if (!currentChattingCharId) return;
        if (confirm(`确定要删除与该角色的整个对话吗？所有聊天记录都将丢失。`)) {
            const charIdToDelete = currentChattingCharId;
            chatSessions = chatSessions.filter(s => s.charId !== charIdToDelete);
            
            dbHelper.saveObject('data', 'chatSessions', chatSessions);
            dbHelper.deleteObjectsByIndex('chatHistory', 'charId', IDBKeyRange.only(charIdToDelete), () => {
                closeScreen(chatDetailsScreen);
                closeScreen(chatDialogueScreen);
                renderChatList();
            });
        }
    });

    imageUploader.addEventListener('change', (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        const storageKey = imageUploader.dataset.currentStorageKey;
        const imageType = imageUploader.dataset.imageType;
    
        if (imageType === 'userAvatar') {
            processAndSaveImage(file, storageKey, (blob) => {
                userAvatarUrl = URL.createObjectURL(blob);
                const allUserAvatars = document.querySelectorAll('.user-avatar');
                allUserAvatars.forEach(avatarDiv => {
                    avatarDiv.classList.remove('empty');
                    avatarDiv.onclick = null;
                    avatarDiv.innerHTML = `<img src="${userAvatarUrl}">`;
                });
                alert("头像设置成功！");
            });
            return;
        }
    
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

    relationshipModal.addEventListener('click', (e) => {
        if (e.target === relationshipModal) {
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
    
    // (最终版) 智能返回按钮
backButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const screenToClose = e.target.closest('.app-screen');

        // 如果从任何App页面返回到桌面，就清空当前聊天ID
        currentChattingCharId = null; 

        // 如果是从聊天窗口返回列表，则刷新列表
        if (screenToClose === chatDialogueScreen || screenToClose === chatDetailsScreen) {
            renderChatList();
        }

        closeScreen(screenToClose);
    });
});

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

    memoryTurnsSlider.addEventListener('input', () => {
        memoryTurnsValue.textContent = `${memoryTurnsSlider.value} 轮`;
    });

    memoryTurnsSlider.addEventListener('change', () => {
        const turns = parseInt(memoryTurnsSlider.value, 10);
        
        dbHelper.loadObject('data', 'chatSettings', (settings) => {
            const chatSettings = settings || {};
            
            if (!chatSettings[currentChattingCharId]) {
                chatSettings[currentChattingCharId] = {};
            }
            chatSettings[currentChattingCharId].memoryTurns = turns;
            
            dbHelper.saveObject('data', 'chatSettings', chatSettings);
        });
    });

    // --- 启动应用 ---
    initializeApp();
});