document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // ============== 1. 全局常量、状态和DOM引用 ==============
    // =======================================================

    /**
     * @description 存储所有应用级的常量，避免魔法字符串
     */
    const CONSTANTS = {
        DB_NAME: 'userDB',
        DB_VERSION: 5,
        STORE_NAMES: {
            IMAGES: 'images',
            SETTINGS: 'settings',
            API_CONFIGS: 'apiConfigs',
            CHARACTERS: 'characters',
            CHAT_SESSIONS: 'chatSessions',
            CHAT_HISTORY: 'chatHistory',
            PLAYLIST: 'playlist',
        },
        DEFAULT_AVATAR_URL: 'https://raw.githubusercontent.com/orcastor/orcastor.github.io/master/assets/images/default_avatar.png'
    };

    /**
     * @description 集中管理应用的所有动态状态
     */
    const appState = {
        playlist: [],
        currentTrackIndex: -1,
        isPlaying: false,
        playMode: 'repeat',
        apiConfigs: [],
        activeApiId: null,
        chatSessions: [],
        currentChattingCharId: null,
        userAvatarUrl: null,
        currentChatHistory: [],
        characters: [],
        currentEditingCharacterId: null,
        tempAvatarFile: null,
        currentEditingRelationshipCharId: null,
        notificationQueue: [],
        isBannerVisible: false
    };

    /**
     * @description 集中获取所有DOM元素引用，提高性能
     */
    const DOM = {
        imageUploader: document.getElementById('image-uploader'),
        audioUploader: document.getElementById('audio-uploader'),
        audioPlayer: document.getElementById('audio-player'),
        mobileFrame: document.querySelector('.mobile-frame'),
        themeToggleButton: document.getElementById('theme-toggle-btn'),
        themeIcon: document.querySelector('#theme-toggle-btn i'),
        apiStatusIndicator: document.getElementById('api-status-indicator'),
        albumArt: document.getElementById('music-album-art'),
        widgetDecor: document.getElementById('widget-decor'),
        widgetPhoto: document.getElementById('widget-photo'),
        personalizationAppIcon: document.getElementById('app-personalization'),
        personalizationScreen: document.getElementById('screen-personalization'),
        iconChangerScreen: document.getElementById('screen-icon-changer'),
        menuChangeIcons: document.getElementById('menu-change-icons'),
        menuChangeWallpaper: document.getElementById('menu-change-wallpaper'),
        backButtons: document.querySelectorAll('.back-btn'),
        iconGrid: document.querySelector('.icon-grid'),
        songTitleEl: document.getElementById('song-title'),
        progressBar: document.getElementById('progress-bar'),
        currentTimeEl: document.getElementById('current-time'),
        totalTimeEl: document.getElementById('total-time'),
        prevBtn: document.getElementById('prev-btn'),
        playPauseBtn: document.getElementById('play-pause-btn'),
        nextBtn: document.getElementById('next-btn'),
        playModeBtn: document.getElementById('play-mode-btn'),
        playlistBtn: document.getElementById('playlist-btn'),
        playlistScreen: document.getElementById('screen-playlist'),
        playlistContainer: document.getElementById('playlist-container'),
        addSongBtn: document.getElementById('add-song-btn'),
        addSongModal: document.getElementById('add-song-modal'),
        uploadLocalBtn: document.getElementById('upload-local-btn'),
        urlInput: document.getElementById('url-input'),
        addUrlBtn: document.getElementById('add-url-btn'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        menuApiSettings: document.getElementById('menu-api-settings'),
        apiSettingsScreen: document.getElementById('screen-api-settings'),
        apiListContainer: document.getElementById('api-list-container'),
        apiNameInput: document.getElementById('api-name-input'),
        apiUrlInput: document.getElementById('api-url-input'),
        apiKeyInput: document.getElementById('api-key-input'),
        apiModelSelect: document.getElementById('api-model-select'),
        fetchModelsBtn: document.getElementById('fetch-models-btn'),
        apiStatusMsg: document.getElementById('api-status-msg'),
        saveApiBtn: document.getElementById('save-api-btn'),
        menuFontSettings: document.getElementById('menu-font-settings'),
        fontSettingsScreen: document.getElementById('screen-font-settings'),
        fontUrlInput: document.getElementById('font-url-input'),
        applyFontBtn: document.getElementById('apply-font-btn'),
        fontSizeSlider: document.getElementById('font-size-slider'),
        fontSizeValue: document.getElementById('font-size-value'),
        chatAppIcon: document.getElementById('app-chat'),
        chatListScreen: document.getElementById('screen-chat-list'),
        chatDialogueScreen: document.getElementById('screen-chat-dialogue'),
        chatListContainer: document.getElementById('chat-list-container'),
        addChatBtn: document.getElementById('add-chat-btn'),
        selectCharacterModal: document.getElementById('select-character-modal'),
        selectCharacterList: document.getElementById('select-character-list'),
        closeSelectCharModalBtn: document.getElementById('close-select-char-modal-btn'),
        chatHeaderTitle: document.getElementById('chat-header-title'),
        chatMoreBtn: document.getElementById('chat-more-btn'),
        chatDetailsScreen: document.getElementById('screen-chat-details'),
        messagesContainer: document.getElementById('chat-messages-container'),
        chatFunctionPanel: document.getElementById('chat-function-panel'),
        chatExpandBtn: document.getElementById('chat-expand-btn'),
        chatTextInput: document.getElementById('chat-text-input'),
        sendBufferBtn: document.getElementById('send-buffer-btn'),
        sendFinalBtn: document.getElementById('send-final-btn'),
        systemCharName: document.getElementById('system-char-name'),
        clearHistoryBtn: document.getElementById('clear-history-btn'),
        deleteChatBtn: document.getElementById('delete-chat-btn'),
        memoryTurnsSlider: document.getElementById('memory-turns-slider'),
        memoryTurnsValue: document.getElementById('memory-turns-value'),
        setChatWallpaperBtn: document.getElementById('set-chat-wallpaper-btn'),
        clearWallpaperBtn: document.getElementById('clear-wallpaper-btn'),
        characterBookApp: document.getElementById('app-character-book'),
        characterBookScreen: document.getElementById('screen-character-book'),
        characterEditorScreen: document.getElementById('screen-character-editor'),
        characterListContainer: document.getElementById('character-list-container'),
        addCharBtn: document.getElementById('add-char-btn'),
        editorTitle: document.getElementById('editor-title'),
        saveCharBtn: document.getElementById('save-char-btn'),
        charAvatarUploader: document.getElementById('char-avatar-uploader'),
        charNameInput: document.getElementById('char-name-input'),
        charPromptInput: document.getElementById('char-prompt-input'),
        userPromptInput: document.getElementById('user-prompt-input'),
        deleteCharBtn: document.getElementById('delete-char-btn'),
        relationshipModal: document.getElementById('relationship-modal'),
        relationshipOptionsContainer: document.getElementById('relationship-options-container'),
        closeRelationshipModalBtn: document.getElementById('close-relationship-modal-btn'),
        notificationBanner: document.getElementById('notification-banner'),
        bannerAvatar: document.getElementById('banner-avatar'),
        bannerCharName: document.getElementById('banner-char-name'),
        bannerMessage: document.getElementById('banner-message'),
        timeElement: document.getElementById('time')
    };

    // =======================================================
    // ============== 2. 核心助手模块 (数据库, API) ===========
    // =======================================================

    /**
     * @description 全新的、基于Promise的IndexedDB助手
     */
    const dbHelper = {
        db: null,
        initDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(CONSTANTS.DB_NAME, CONSTANTS.DB_VERSION);

                request.onupgradeneeded = (e) => {
                    this.db = e.target.result;
                    console.log(`Upgrading database to version ${this.db.version}`);
                    
                    if (this.db.objectStoreNames.contains('data')) {
                        this.db.deleteObjectStore('data');
                    }
                    
                    Object.values(CONSTANTS.STORE_NAMES).forEach(storeName => {
                        if (this.db.objectStoreNames.contains(storeName)) return;

                        if (storeName === CONSTANTS.STORE_NAMES.CHAT_HISTORY) {
                            const historyStore = this.db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                            historyStore.createIndex('by_charId', 'charId', { unique: false });
                        } else if (storeName === CONSTANTS.STORE_NAMES.PLAYLIST) {
                            this.db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                        } else if (storeName === CONSTANTS.STORE_NAMES.CHAT_SESSIONS) {
                            this.db.createObjectStore(storeName, { keyPath: 'charId' });
                        } else {
                            this.db.createObjectStore(storeName, { keyPath: 'id' });
                        }
                    });
                };

                request.onsuccess = (e) => {
                    this.db = e.target.result;
                    resolve();
                };

                request.onerror = (e) => {
                    console.error("IndexedDB error:", e.target.errorCode);
                    reject(e.target.errorCode);
                };
            });
        },
        saveObject(storeName, object) {
            return new Promise((resolve, reject) => {
                if (!this.db) return reject("DB not initialized");
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.put(object);
                transaction.oncomplete = () => resolve(request.result);
                transaction.onerror = () => reject(transaction.error);
            });
        },
        loadObject(storeName, id) {
            return new Promise((resolve, reject) => {
                if (!this.db) return reject("DB not initialized");
                const transaction = this.db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },
        loadAll(storeName) {
            return new Promise((resolve, reject) => {
                if (!this.db) return reject("DB not initialized");
                const transaction = this.db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => reject(request.error);
            });
        },
        deleteObject(storeName, id) {
            return new Promise((resolve, reject) => {
                if (!this.db) return reject("DB not initialized");
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.delete(id);
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            });
        },
        loadHistoryForChar(charId) {
            return new Promise((resolve, reject) => {
                if (!this.db) return reject("DB not initialized");
                const transaction = this.db.transaction([CONSTANTS.STORE_NAMES.CHAT_HISTORY], 'readonly');
                const store = transaction.objectStore(CONSTANTS.STORE_NAMES.CHAT_HISTORY);
                const index = store.index('by_charId');
                const request = index.getAll(IDBKeyRange.only(charId));
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => reject(request.error);
            });
        },
        deleteHistoryForChar(charId) {
            return new Promise((resolve, reject) => {
                if (!this.db) return reject("DB not initialized");
                const transaction = this.db.transaction([CONSTANTS.STORE_NAMES.CHAT_HISTORY], 'readwrite');
                const store = transaction.objectStore(CONSTANTS.STORE_NAMES.CHAT_HISTORY);
                const index = store.index('by_charId');
                const request = index.openCursor(IDBKeyRange.only(charId));
                request.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    }
                };
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            });
        }
    };

    const apiHelper = {
        async callChatCompletion(messages) {
            if (!appState.apiConfigs || appState.apiConfigs.length === 0) {
                throw new Error("尚未配置API。请在设置中添加。");
            }
            const activeApi = appState.apiConfigs.find(c => c.id === appState.activeApiId);
            if (!activeApi) {
                throw new Error("没有找到有效的API配置。请检查设置。");
            }

            const { url, key, selectedModel } = activeApi;
            let endpoint = url.trim();
            if (endpoint.endsWith('/')) endpoint = endpoint.slice(0, -1);
            if (endpoint.endsWith('/v1/chat/completions')) {} 
            else if (endpoint.endsWith('/v1')) endpoint = `${endpoint}/chat/completions`;
            else endpoint = `${endpoint}/v1/chat/completions`;
            const body = JSON.stringify({ model: selectedModel, messages: messages });
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
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
        }
    };
    
    const promptManager = {
        createCharacterDetailsPrompt(character) {
            const systemPrompt = `你是一个富有想象力的角色设定师。根据用户提供的角色核心设定，你需要生成一个JSON对象，其中必须包含四个键：'englishName' (处理规则如下：如果角色名是中文，则转换为标准拼音，首字母大写，例如 '顾深' -> 'Gu Shen'。如果角色名本身就是英文或字母，则直接使用该名字，例如 'Amy' -> 'Amy'), 'tags' (一个字符串，用逗号分隔的3个描述性中文词语), 'occupation' (一个字符串，角色的中文职业), 'quote' (一个字符串，角色的标志性中文引言)。不要添加任何额外的解释或文本，只返回纯粹的JSON对象。`;
            const userPrompt = `角色核心设定：${character.charPrompt}\n与用户的关系：${character.userPrompt}`;
            return [{ "role": "system", "content": systemPrompt }, { "role": "user", "content": userPrompt }];
        },
        createChatPrompt(character, chatHistory, finalUserInput) {
            let historySection = chatHistory.length > 0
                ? chatHistory.map(msg => `${msg.sender === 'user' ? '用户' : character.name}: ${msg.content}`).join('\n')
                : '[无历史对话记录]';
            const systemPrompt = `# 核心使命：成为灵魂 (Mission: Embody the Soul)
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
[世界书功能尚未激活，当前无世界背景设定]
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
现在，请作为【${character.name}】，开始你的表演。`;
            const historyMessages = chatHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));
            return [{ role: "system", content: systemPrompt }, ...historyMessages, { role: "user", content: finalUserInput }];
        }
    };
    
    // =======================================================
    // ============== 3. 应用逻辑函数 ========================
    // =======================================================

    // --- 核心工具函数 ---
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
        return isNaN(min) ? '0:00' : `${min}:${sec}`;
    }

    function autoScrollToBottom() {
        DOM.messagesContainer.scrollTop = DOM.messagesContainer.scrollHeight;
    }

    function applyChatWallpaper(blob) {
        const wallpaperUrl = URL.createObjectURL(blob);
        DOM.chatDialogueScreen.style.backgroundImage = `url(${wallpaperUrl})`;
        DOM.chatDialogueScreen.style.backgroundSize = 'cover';
        DOM.chatDialogueScreen.style.backgroundPosition = 'center';
        DOM.chatDialogueScreen.classList.add('has-wallpaper');
        DOM.mobileFrame.classList.add('immersive-chat-active');
    }

    function removeChatWallpaper() {
        DOM.chatDialogueScreen.style.backgroundImage = '';
        DOM.chatDialogueScreen.classList.remove('has-wallpaper');
        DOM.mobileFrame.classList.remove('immersive-chat-active');
    }

    // --- 通知中心系统 ---
    function addNotificationToQueue(notification) {
        appState.notificationQueue.push(notification);
        processNotificationQueue();
    }

    function processNotificationQueue() {
        if (!appState.isBannerVisible && appState.notificationQueue.length > 0) {
            appState.isBannerVisible = true;
            const nextNotification = appState.notificationQueue.shift();
            showNotification(nextNotification);
        }
    }

    async function showNotification(notification) {
        const character = appState.characters.find(c => c.id === notification.charId);
        if (!character) {
            appState.isBannerVisible = false;
            processNotificationQueue();
            return;
        }

        DOM.bannerCharName.textContent = character.name;
        DOM.bannerMessage.textContent = notification.message;
        const avatarResult = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, `char_avatar_${notification.charId}`);
        DOM.bannerAvatar.src = avatarResult ? URL.createObjectURL(avatarResult.value) : CONSTANTS.DEFAULT_AVATAR_URL;

        DOM.notificationBanner.onclick = () => {
            DOM.notificationBanner.classList.remove('visible');
            appState.isBannerVisible = false;
            const chatCard = DOM.chatListContainer.querySelector(`.chat-list-card[data-char-id="${notification.charId}"]`);
            if (chatCard) chatCard.click();
            processNotificationQueue();
        };

        DOM.notificationBanner.classList.add('visible');

        setTimeout(() => {
            DOM.notificationBanner.classList.remove('visible');
            setTimeout(() => {
                appState.isBannerVisible = false;
                processNotificationQueue();
            }, 400);
        }, 4000);
    }

    // --- 聊天核心功能函数 ---
    async function renderChatList() {
        DOM.chatListContainer.innerHTML = '';
        if (appState.chatSessions.length === 0) {
            DOM.chatListContainer.innerHTML = `<div class="empty-list-placeholder"><p>还没有聊天，点击右上角 '+' 发起会话吧</p></div>`;
            return;
        }

        appState.chatSessions.sort((a, b) => b.timestamp - a.timestamp);

        for (const session of appState.chatSessions) {
            const character = appState.characters.find(c => c.id === session.charId);
            if (!character) continue;

            const card = document.createElement('div');
            card.className = 'chat-list-card';
            card.dataset.charId = session.charId;
            card.innerHTML = `
                <img class="avatar" src="${CONSTANTS.DEFAULT_AVATAR_URL}" alt="${character.name}的头像">
                <div class="card-content">
                    <div class="card-title">
                        <span class="char-name">${character.name}</span>
                        <span class="last-msg-time">${new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p class="last-msg-preview">${session.lastMessage}</p>
                </div>`;
            DOM.chatListContainer.appendChild(card);
            
            const avatarImg = card.querySelector('.avatar');
            const avatarResult = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, `char_avatar_${character.id}`);
            if (avatarResult) {
                avatarImg.src = URL.createObjectURL(avatarResult.value);
            }
        }
    }

    async function openSelectCharacterModal() {
        DOM.selectCharacterList.innerHTML = '';
        const existingChatCharIds = appState.chatSessions.map(s => s.charId);
        const availableCharacters = appState.characters.filter(c => !existingChatCharIds.includes(c.id));

        if (availableCharacters.length === 0) {
            DOM.selectCharacterList.innerHTML = `<li style="text-align:center; opacity:0.7;">所有角色都已在聊天列表中</li>`;
        } else {
            for (const char of availableCharacters) {
                const li = document.createElement('li');
                li.className = 'char-select-item';
                li.dataset.charId = char.id;
                li.innerHTML = `<img src="${CONSTANTS.DEFAULT_AVATAR_URL}" alt="${char.name}的头像"><span>${char.name}</span>`;
                DOM.selectCharacterList.appendChild(li);
                
                const avatarImg = li.querySelector('img');
                const avatarResult = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, `char_avatar_${char.id}`);
                if (avatarResult) avatarImg.src = URL.createObjectURL(avatarResult.value);
            }
        }
        DOM.selectCharacterModal.classList.add('active');
    }

    async function startNewChat(charId) {
        const character = appState.characters.find(c => c.id === charId);
        if (!character) return;

        const newSession = {
            charId: charId,
            lastMessage: "我们开始聊天吧！",
            timestamp: Date.now()
        };
        appState.chatSessions.push(newSession);
        await dbHelper.saveObject(CONSTANTS.STORE_NAMES.CHAT_SESSIONS, newSession);
        
        await renderChatList();
        DOM.selectCharacterModal.classList.remove('active');

        appState.currentChattingCharId = charId;
        appState.currentChatHistory = [];
        DOM.chatHeaderTitle.textContent = character.name;
        DOM.messagesContainer.innerHTML = '';
        await renderMessage(`你已和 ${character.name} 建立对话，开始聊天吧！`, 'system');
        openScreen(DOM.chatDialogueScreen);
    }

    async function renderMessage(content, sender = 'user') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        const avatar = document.createElement('div');
        avatar.className = 'avatar';

        if (sender === 'user') {
            avatar.classList.add('user-avatar');
            if (appState.userAvatarUrl) {
                avatar.innerHTML = `<img src="${appState.userAvatarUrl}" alt="用户头像">`;
            } else {
                avatar.classList.add('empty');
                avatar.title = "点击上传你的头像";
                avatar.onclick = () => {
                    DOM.imageUploader.dataset.currentStorageKey = 'userAvatar';
                    DOM.imageUploader.dataset.imageType = 'userAvatar';
                    DOM.imageUploader.click();
                };
            }
        } else if (sender === 'character') {
            const avatarResult = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, `char_avatar_${appState.currentChattingCharId}`);
            if (avatarResult) avatar.innerHTML = `<img src="${URL.createObjectURL(avatarResult.value)}" alt="${sender}头像">`;
        }
        
        const messageBody = document.createElement('div');
        messageBody.className = 'message-bubble';
        messageBody.textContent = content;

        if (sender !== 'system') messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageBody);
        DOM.messagesContainer.appendChild(messageDiv);
        autoScrollToBottom();
    }

    async function updateChatSession(charId, lastMessage) {
        const sessionIndex = appState.chatSessions.findIndex(s => s.charId === charId);
        if (sessionIndex > -1) {
            appState.chatSessions[sessionIndex].lastMessage = lastMessage;
            appState.chatSessions[sessionIndex].timestamp = Date.now();
            await dbHelper.saveObject(CONSTANTS.STORE_NAMES.CHAT_SESSIONS, appState.chatSessions[sessionIndex]);
        }
    }

    async function handleSendMessage() {
        const characterIdForThisRequest = appState.currentChattingCharId;
        if (!characterIdForThisRequest) return;
        
        let lastUserMessages = [];
        for (let i = appState.currentChatHistory.length - 1; i >= 0; i--) {
            if (appState.currentChatHistory[i].sender === 'user') lastUserMessages.unshift(appState.currentChatHistory[i].content);
            else break;
        }
        const finalUserInput = lastUserMessages.join('\n');
        if (!finalUserInput) return;

        DOM.chatTextInput.disabled = true;
        DOM.sendBufferBtn.disabled = true;
        DOM.sendFinalBtn.disabled = true;

        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.className = 'chat-message character typing-indicator';
        typingIndicator.innerHTML = `<div class="avatar"></div> <div class="message-bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
        DOM.messagesContainer.appendChild(typingIndicator);
        autoScrollToBottom();
        const indicatorAvatar = typingIndicator.querySelector('.avatar');
        const avatarResult = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, `char_avatar_${characterIdForThisRequest}`);
        if (avatarResult && indicatorAvatar) indicatorAvatar.innerHTML = `<img src="${URL.createObjectURL(avatarResult.value)}">`;

        try {
            const character = appState.characters.find(c => c.id === characterIdForThisRequest);
            if (!character) throw new Error("当前聊天角色未找到！");
            
            const settingsResult = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.SETTINGS, `chatSettings_${characterIdForThisRequest}`);
            const memoryTurns = settingsResult ? (settingsResult.value.memoryTurns || 12) : 12;

            const historyForPrompt = memoryTurns > 0 ? appState.currentChatHistory.slice(0, -lastUserMessages.length).slice(-memoryTurns * 2) : [];
            const messages = promptManager.createChatPrompt(character, historyForPrompt, finalUserInput);
            const aiResponse = await apiHelper.callChatCompletion(messages);
            const replies = aiResponse.split('\n').filter(line => line.trim() !== '');
            if (replies.length === 0) return;

            for (const replyContent of replies) {
                const aiMessageData = { charId: characterIdForThisRequest, sender: 'character', content: replyContent, timestamp: Date.now() };
                await dbHelper.saveObject(CONSTANTS.STORE_NAMES.CHAT_HISTORY, aiMessageData);
            }
            
            const finalReply = replies[replies.length - 1];
            await updateChatSession(characterIdForThisRequest, finalReply);
            await renderChatList();

            if (characterIdForThisRequest !== appState.currentChattingCharId || !DOM.chatDialogueScreen.classList.contains('active')) {
                addNotificationToQueue({ type: 'chat_reply', charId: characterIdForThisRequest, message: finalReply });
                return;
            }

            for (let i = 0; i < replies.length; i++) {
                await renderMessage(replies[i], 'character');
                appState.currentChatHistory.push({ charId: characterIdForThisRequest, sender: 'character', content: replies[i] });
                if (i < replies.length - 1) await new Promise(resolve => setTimeout(resolve, 500));
            }

        } catch (error) {
            console.error("AI send message failed:", error);
            if (characterIdForThisRequest === appState.currentChattingCharId) {
                await renderMessage(`[错误] 无法获取回复: ${error.message}`, 'system');
            }
        } finally {
            if (document.getElementById('typing-indicator')) document.getElementById('typing-indicator').remove();
            DOM.chatTextInput.disabled = false;
            DOM.sendBufferBtn.disabled = false;
            DOM.sendFinalBtn.disabled = false;
        }
    }
function processAndSaveImage(file, storageKey, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const isWallpaper = storageKey.startsWith('wallpaperImage') || storageKey.startsWith('chat_wallpaper_');
                const MAX_WIDTH = isWallpaper ? 1080 : 512;
                const MAX_HEIGHT = isWallpaper ? 1920 : 512;
                let { width, height } = img;
                if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(async (blob) => {
                    await dbHelper.saveObject(CONSTANTS.STORE_NAMES.IMAGES, { id: storageKey, value: blob });
                    if (callback) callback(blob);
                }, 'image/jpeg', 0.8);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    async function applyImageFromBlob(storageKey, blob) {
        const targetElement = document.querySelector(`[data-storage-key="${storageKey}"]`);
        if (targetElement) targetElement.classList.add('has-image');
        const imageUrl = URL.createObjectURL(blob);
        if (storageKey === 'wallpaperImage') {
            DOM.mobileFrame.style.backgroundImage = `url(${imageUrl})`;
        } else if (storageKey === 'musicWidgetImage') {
            DOM.albumArt.style.backgroundImage = `url(${imageUrl})`;
        } else if (storageKey === 'decorWidgetImage') {
            DOM.widgetDecor.style.backgroundImage = `url(${imageUrl})`;
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
        DOM.mobileFrame.classList.add('app-open');
        screenElement.classList.add('active');
    }

    function closeScreen(screenElement) {
        screenElement.classList.remove('active');
        screenElement.addEventListener('transitionend', () => {
            if (document.querySelectorAll('.app-screen.active').length === 0) {
                DOM.mobileFrame.classList.remove('app-open');
            }
        }, { once: true });
    }

    // --- 角色书核心功能函数 ---
    function getRelationshipInfo(status) {
        const relationships = {
            '邂逅': { text: '邂逅', emoji: '🤝' }, '朋友': { text: '朋友', emoji: '😊' },
            '恋人': { text: '恋人', emoji: '❤️' }, '知己': { text: '知己', emoji: 'soulmate' },
            '宿敌': { text: '宿敌', emoji: '⚔️' }, '默认': { text: '未知关系', emoji: '❓' }
        };
        return relationships[status] || relationships['默认'];
    }

    async function renderCharacterList() {
        DOM.characterListContainer.innerHTML = '';
        if (appState.characters.length === 0) {
            DOM.characterListContainer.innerHTML = `<div class="empty-list-placeholder"><h3>空空如也</h3><p>点击右上角的 '+' 来创造你的第一个伙伴吧！</p></div>`;
            return;
        }
        for (const char of appState.characters) {
            const ticket = document.createElement('div');
            ticket.className = 'ticket';
            ticket.dataset.id = char.id;
            const relationshipInfo = getRelationshipInfo(char.relationship);
            ticket.innerHTML = `
                <div class="loading-overlay"><div class="loading-spinner"><i class="fas fa-spinner"></i></div></div>
                <div class="ticket-art" data-art-id="${char.id}"><div class="ticket-art-placeholder"><span>📷</span><small>点击上传艺术图</small></div></div>
                <div class="ticket-title"><h1>${char.englishName || char.name || '请设置你的名字'}</h1></div>
                <div class="ticket-subtitle"><p>${char.name || '请设置你的名字'}<br><small>${relationshipInfo.emoji} (${relationshipInfo.text})</small></p></div>
                <hr class="dotted-divider">
                <div class="ticket-details">
                    <p><b>核心标签:</b> <span contenteditable="true" class="editable-field" data-field="tags">${char.tags || '点击编辑...'}</span></p>
                    <p><b>职业:</b> <span contenteditable="true" class="editable-field" data-field="occupation">${char.occupation || '点击编辑...'}</span></p>
                    <p><b>创建于:</b> ${new Date(char.createdAt).toLocaleDateString()}</p>
                </div>
                <hr class="dotted-divider">
                <div class="ticket-meta">
                    <div><b>好感度:</b> LV.1</div>
                    <div class="relationship-wrapper" data-char-id="${char.id}"><b>关系:</b><span>${relationshipInfo.text}</span><i class="fas fa-chevron-down"></i></div>
                    <div><b>状态:</b> 离线</div><div><b>初见:</b> [未开始]</div>
                </div>
                <hr class="dotted-divider">
                <div class="ticket-quote"><blockquote contenteditable="true" class="editable-field" data-field="quote"><p>"${char.quote || '...'}"</p></blockquote></div>
                <div class="ticket-actions"><button class="ticket-edit-btn" data-id="${char.id}"><i class="fas fa-pencil-alt"></i> 编辑</button></div>`;
            DOM.characterListContainer.appendChild(ticket);
            const artResult = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, `char_art_${char.id}`);
            if (artResult) {
                const artDiv = ticket.querySelector('.ticket-art');
                artDiv.style.backgroundImage = `url(${URL.createObjectURL(artResult.value)})`;
                artDiv.innerHTML = '';
            }
        }
    }

    function openRelationshipModal(charId) {
        appState.currentEditingRelationshipCharId = charId;
        DOM.relationshipOptionsContainer.innerHTML = '';
        const relationshipTypes = ['邂逅', '朋友', '恋人', '知己', '宿敌'];
        relationshipTypes.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'modal-btn';
            btn.textContent = `${getRelationshipInfo(type).emoji} ${type}`;
            btn.dataset.relationship = type;
            DOM.relationshipOptionsContainer.appendChild(btn);
        });
        DOM.relationshipModal.classList.add('active');
    }

    function closeRelationshipModal() {
        DOM.relationshipModal.classList.remove('active');
        appState.currentEditingRelationshipCharId = null;
    }

    async function updateRelationship(charId, newRelationship) {
        const charIndex = appState.characters.findIndex(c => c.id === charId);
        if (charIndex > -1) {
            appState.characters[charIndex].relationship = newRelationship;
            await dbHelper.saveObject(CONSTANTS.STORE_NAMES.CHARACTERS, appState.characters[charIndex]);
            await renderCharacterList();
        }
        closeRelationshipModal();
    }

    async function openCharacterEditor(charId = null) {
        appState.tempAvatarFile = null;
        appState.currentEditingCharacterId = charId;
        DOM.charAvatarUploader.style.backgroundImage = '';
        DOM.charAvatarUploader.innerHTML = '<i class="fas fa-camera"></i>';
        DOM.charNameInput.value = '';
        DOM.charPromptInput.value = '';
        DOM.userPromptInput.value = '';
        DOM.deleteCharBtn.style.display = 'none';

        if (charId) {
            const char = appState.characters.find(c => c.id === charId);
            if (char) {
                DOM.editorTitle.textContent = '编辑角色';
                const avatarResult = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, `char_avatar_${charId}`);
                if (avatarResult) {
                    DOM.charAvatarUploader.style.backgroundImage = `url(${URL.createObjectURL(avatarResult.value)})`;
                    DOM.charAvatarUploader.innerHTML = '';
                }
                DOM.charNameInput.value = char.name;
                DOM.charPromptInput.value = char.charPrompt;
                DOM.userPromptInput.value = char.userPrompt;
                DOM.deleteCharBtn.style.display = 'block';
            }
        } else {
            DOM.editorTitle.textContent = '创建角色';
        }
        openScreen(DOM.characterEditorScreen);
    }

    async function fetchAiCharacterDetails(character) {
        console.log("正在为角色生成AI信息:", character.name);
        try {
            const messages = promptManager.createCharacterDetailsPrompt(character);
            let jsonString = await apiHelper.callChatCompletion(messages);
            const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
            if (jsonMatch && jsonMatch[0]) jsonString = jsonMatch[0];
            const aiDetails = JSON.parse(jsonString);
            console.log("AI 信息已生成:", aiDetails);
            return aiDetails;
        } catch (error) {
            console.error("从API获取角色详情失败:", error);
            alert(`AI信息生成失败: ${error.message}`);
            return { englishName: "Error", tags: "获取失败", occupation: "获取失败", quote: "无法连接到AI服务器..." };
        }
    }

    async function saveCharacter() {
        const name = DOM.charNameInput.value.trim();
        if (!name) { alert('角色姓名不能为空！'); return; }

        let isNewChar = false;
        let charData;

        if (appState.currentEditingCharacterId) {
            charData = appState.characters.find(c => c.id === appState.currentEditingCharacterId);
        } else {
            isNewChar = true;
            const newId = `char_${Date.now()}`;
            charData = {
                id: newId, createdAt: Date.now(), name: '', charPrompt: '', userPrompt: '',
                relationship: '邂逅', tags: '', occupation: '', quote: '', englishName: ''
            };
            appState.currentEditingCharacterId = newId;
        }

        charData.name = name;
        charData.charPrompt = DOM.charPromptInput.value;
        charData.userPrompt = DOM.userPromptInput.value;

        if (appState.tempAvatarFile) {
            processAndSaveImage(appState.tempAvatarFile, `char_avatar_${charData.id}`);
            appState.tempAvatarFile = null;
        }

        await dbHelper.saveObject(CONSTANTS.STORE_NAMES.CHARACTERS, charData);

        if (isNewChar) {
            appState.characters.push(charData);
        } else {
            const charIndex = appState.characters.findIndex(c => c.id === appState.currentEditingCharacterId);
            if (charIndex > -1) appState.characters[charIndex] = charData;
        }

        await renderCharacterList();
        closeScreen(DOM.characterEditorScreen);

        if (isNewChar) {
            const ticketElement = document.querySelector(`.ticket[data-id="${charData.id}"]`);
            const loadingOverlay = ticketElement?.querySelector('.loading-overlay');
            try {
                if (loadingOverlay) loadingOverlay.classList.add('visible');
                const aiDetails = await fetchAiCharacterDetails(charData);
                Object.assign(charData, aiDetails);
                await dbHelper.saveObject(CONSTANTS.STORE_NAMES.CHARACTERS, charData);
            } catch (error) {
                console.error("AI信息填充失败:", error);
            } finally {
                if (loadingOverlay) loadingOverlay.classList.remove('visible');
                await renderCharacterList();
            }
        }
    }

    async function deleteCharacter() {
        if (!appState.currentEditingCharacterId || !confirm('确定要永久删除这个角色吗？')) return;
        const idToDelete = appState.currentEditingCharacterId;
        await Promise.all([
            dbHelper.deleteObject(CONSTANTS.STORE_NAMES.CHARACTERS, idToDelete),
            dbHelper.deleteObject(CONSTANTS.STORE_NAMES.IMAGES, `char_avatar_${idToDelete}`),
            dbHelper.deleteObject(CONSTANTS.STORE_NAMES.IMAGES, `char_art_${idToDelete}`)
        ]);
        appState.characters = appState.characters.filter(c => c.id !== idToDelete);
        await renderCharacterList();
        closeScreen(DOM.characterEditorScreen);
    }

    // --- 音乐播放器功能函数 ---
    function loadTrack(index, shouldPlay = false) {
        if (index < 0 || index >= appState.playlist.length) {
            DOM.songTitleEl.textContent = "播放列表为空";
            appState.currentTrackIndex = -1;
            return;
        }
        appState.currentTrackIndex = index;
        const track = appState.playlist[appState.currentTrackIndex];
        DOM.audioPlayer.src = track.src;
        DOM.songTitleEl.textContent = track.name;
        renderPlaylist();
        if (shouldPlay) playTrack();
    }

    function playTrack() {
        if (appState.currentTrackIndex === -1 && appState.playlist.length > 0) loadTrack(0);
        appState.isPlaying = true;
        DOM.audioPlayer.play();
        DOM.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function pauseTrack() {
        appState.isPlaying = false;
        DOM.audioPlayer.pause();
        DOM.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    function playNext() {
        if (appState.playlist.length === 0) return;
        let nextIndex;
        if (appState.playMode === 'shuffle') {
            do { nextIndex = Math.floor(Math.random() * appState.playlist.length); }
            while (appState.playlist.length > 1 && nextIndex === appState.currentTrackIndex);
        } else {
            nextIndex = (appState.currentTrackIndex + 1) % appState.playlist.length;
        }
        loadTrack(nextIndex, true);
    }

    function playPrev() {
        if (appState.playlist.length === 0) return;
        const prevIndex = (appState.currentTrackIndex - 1 + appState.playlist.length) % appState.playlist.length;
        loadTrack(prevIndex, true);
    }

    function updateProgress() {
        const { duration, currentTime } = DOM.audioPlayer;
        if (duration) DOM.progressBar.style.width = `${(currentTime / duration) * 100}%`;
        DOM.totalTimeEl.textContent = formatTime(duration);
        DOM.currentTimeEl.textContent = formatTime(currentTime);
    }

    function renderPlaylist() {
        DOM.playlistContainer.innerHTML = '';
        if (appState.playlist.length === 0) {
            DOM.playlistContainer.innerHTML = '<li class="playlist-item" style="justify-content: center;">播放列表为空</li>';
            return;
        }
        appState.playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            if (index === appState.currentTrackIndex) li.classList.add('playing');
            li.innerHTML = `
                <div class="song-details" data-index="${index}">
                    <span class="song-index">${index + 1}.</span>
                    <span class="song-name">${song.name}</span>
                </div>
                <button class="delete-song-btn" data-index="${index}"><i class="fas fa-trash-alt"></i></button>`;
            DOM.playlistContainer.appendChild(li);
        });
    }

    async function deleteSong(indexToDelete) {
        if (indexToDelete === appState.currentTrackIndex) {
            pauseTrack();
            DOM.audioPlayer.src = '';
        }
        const songToDelete = appState.playlist[indexToDelete];
        if(songToDelete.id) await dbHelper.deleteObject(CONSTANTS.STORE_NAMES.PLAYLIST, songToDelete.id);
        
        appState.playlist.splice(indexToDelete, 1);
        if (appState.currentTrackIndex > indexToDelete) {
            appState.currentTrackIndex--;
        } else if (appState.currentTrackIndex === indexToDelete) {
            if (appState.playlist.length === 0) {
                appState.currentTrackIndex = -1;
                DOM.songTitleEl.textContent = '未选择歌曲';
                DOM.currentTimeEl.textContent = '0:00';
                DOM.totalTimeEl.textContent = '0:00';
                DOM.progressBar.style.width = '0%';
            } else {
                loadTrack(Math.min(indexToDelete, appState.playlist.length - 1), true);
            }
        }
        renderPlaylist();
    }

    // --- API管理核心函数 ---
    function updateApiStatusUI(isOnline) {
        DOM.apiStatusIndicator.textContent = isOnline ? 'Online' : 'Offline';
        DOM.apiStatusIndicator.classList.toggle('online', isOnline);
        DOM.apiStatusIndicator.classList.toggle('offline', !isOnline);
    }

    async function checkApiStatus() {
        const activeApi = appState.apiConfigs.find(c => c.id === appState.activeApiId);
        if (!activeApi) { updateApiStatusUI(false); return; }
        try {
            let baseUrl = activeApi.url.trim();
            if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
            const finalUrl = baseUrl.endsWith('/v1') ? `${baseUrl}/models` : `${baseUrl}/v1/models`;
            const response = await fetch(finalUrl, { method: 'GET', headers: { 'Authorization': `Bearer ${activeApi.key}` } });
            updateApiStatusUI(response.ok);
        } catch (error) {
            console.error("API status check failed:", error);
            updateApiStatusUI(false);
        }
    }

    function renderApiList() {
        DOM.apiListContainer.innerHTML = '';
        if (appState.apiConfigs.length === 0) {
            DOM.apiListContainer.innerHTML = '<li class="api-item-placeholder">暂无已保存的API配置</li>';
            return;
        }
        appState.apiConfigs.forEach(config => {
            const li = document.createElement('li');
            li.className = 'menu-list-item api-item';
            if (config.id === appState.activeApiId) li.classList.add('active');
            li.dataset.id = config.id;
            li.innerHTML = `
                <div class="api-item-details">
                    <span class="api-item-name">${config.name}</span>
                    <span class="api-item-url">${config.url}</span>
                </div>
                <div class="api-item-actions"><button class="api-delete-btn" data-id="${config.id}"><i class="fas fa-trash-alt"></i></button></div>`;
            DOM.apiListContainer.appendChild(li);
        });
    }

    async function fetchModels() {
        const url = DOM.apiUrlInput.value.trim();
        const key = DOM.apiKeyInput.value.trim();
        if (!url || !key) { DOM.apiStatusMsg.textContent = "URL和Key不能为空"; return; }
        DOM.fetchModelsBtn.disabled = true;
        DOM.fetchModelsBtn.textContent = '获取中...';
        DOM.apiStatusMsg.textContent = "正在请求模型列表...";
        try {
            let baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
            const finalUrl = baseUrl.endsWith('/v1') ? `${baseUrl}/models` : `${baseUrl}/v1/models`;
            const response = await fetch(finalUrl, { method: 'GET', headers: { 'Authorization': `Bearer ${key}` } });
            if (!response.ok) throw new Error(`网络请求失败: ${response.status}`);
            const data = await response.json();
            const models = data.data || data;
            DOM.apiModelSelect.innerHTML = '';
            if (Array.isArray(models) && models.length > 0) {
                models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.id;
                    option.textContent = model.id;
                    DOM.apiModelSelect.appendChild(option);
                });
                DOM.apiModelSelect.disabled = false;
                DOM.saveApiBtn.disabled = false;
                DOM.apiStatusMsg.textContent = `成功获取 ${models.length} 个模型！`;
            } else {
                DOM.apiStatusMsg.textContent = "未能获取到有效的模型列表";
            }
        } catch (error) {
            console.error("Fetch models error:", error);
            DOM.apiStatusMsg.textContent = "获取失败，请检查URL、Key或网络";
        } finally {
            DOM.fetchModelsBtn.disabled = false;
            DOM.fetchModelsBtn.textContent = '获取模型';
        }
    }

    function resetApiForm() {
        DOM.apiNameInput.value = '';
        DOM.apiUrlInput.value = '';
        DOM.apiKeyInput.value = '';
        DOM.apiModelSelect.innerHTML = '<option>请先获取模型列表</option>';
        DOM.apiModelSelect.disabled = true;
        DOM.saveApiBtn.disabled = true;
        DOM.apiStatusMsg.textContent = '';
    }

    // --- 个性化设置函数 ---
    async function applyFont(fontUrl) {
        if (!fontUrl) return;
        const oldStyle = document.getElementById('custom-font-style');
        if (oldStyle) oldStyle.remove();
        const style = document.createElement('style');
        style.id = 'custom-font-style';
        style.textContent = `@font-face { font-family: 'CustomFont'; src: url('${fontUrl}'); } body { font-family: 'CustomFont', 'SF Pro Text', 'Noto Sans SC', sans-serif; }`;
        document.head.appendChild(style);
        await dbHelper.saveObject(CONSTANTS.STORE_NAMES.SETTINGS, { id: 'customFontUrl', value: fontUrl });
    }

    async function applyFontSize(size) {
        if (!size) return;
        document.documentElement.style.fontSize = `${size}px`;
        DOM.fontSizeValue.textContent = `${size}px`;
        await dbHelper.saveObject(CONSTANTS.STORE_NAMES.SETTINGS, { id: 'customFontSize', value: size });
    }

    async function updatePlayModeIcon() {
        const playModeIcons = { 'repeat': 'fa-redo', 'shuffle': 'fa-random', 'repeat-one': 'fa-1' };
        const iconClass = playModeIcons[appState.playMode] || 'fa-redo';
        DOM.playModeBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
        await dbHelper.saveObject(CONSTANTS.STORE_NAMES.SETTINGS, { id: 'playMode', value: appState.playMode });
    }

    async function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        DOM.themeIcon.className = `fas fa-${theme === 'dark' ? 'moon' : 'sun'}`;
        appState.theme = theme;
        await dbHelper.saveObject(CONSTANTS.STORE_NAMES.SETTINGS, { id: 'theme', value: theme });
    }

    function initializeIconChanger() {
        DOM.iconGrid.innerHTML = '';
        const apps = [ { id: 'chat', name: '聊天' }, { id: 'worldbook', name: '世界书' }, { id: 'forum', name: '论坛' }, { id: 'story', name: '剧情' }, { id: 'settings', name: '设置' }, { id: 'personalization', name: '个性化' }, { id: 'character', name: '占位符' }, { id: 'characterBook', name: '角色书' } ];
        const dockItems = [{ id: '1', name: 'Dock 1' }, { id: '2', name: 'Dock 2' }, { id: '3', name: 'Dock 3' }, { id: '4', name: 'Dock 4' }];
        [...apps, ...dockItems].forEach(item => {
            const isDock = !!item.name.startsWith('Dock');
            const prefix = isDock ? 'dockIcon' : 'appIcon';
            const id = isDock ? item.id : item.id.charAt(0).toUpperCase() + item.id.slice(1);
            const storageKey = `${prefix}${id}`;
            const gridItem = document.createElement('div');
            gridItem.className = 'icon-changer-item';
            gridItem.innerHTML = `<div class="icon-preview" id="preview-${storageKey}"></div><span>${item.name}</span><button class="change-btn" data-storage-key="${storageKey}">更换</button>`;
            DOM.iconGrid.appendChild(gridItem);
            gridItem.querySelector('.change-btn').addEventListener('click', (e) => {
                DOM.imageUploader.dataset.currentStorageKey = e.target.dataset.storageKey;
                DOM.imageUploader.dataset.imageType = 'widget';
                DOM.imageUploader.click();
            });
        });
    }

    function updateTime() {
        const now = new Date();
        DOM.timeElement.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    // =======================================================
    // ============== 4. 初始化和事件监听 ===================
    // =======================================================

    function initializeEventListeners() {
        DOM.chatAppIcon.addEventListener('click', () => { renderChatList(); openScreen(DOM.chatListScreen); });
        DOM.addChatBtn.addEventListener('click', openSelectCharacterModal);
        DOM.closeSelectCharModalBtn.addEventListener('click', () => DOM.selectCharacterModal.classList.remove('active'));
        DOM.selectCharacterModal.addEventListener('click', (e) => { if (e.target === DOM.selectCharacterModal) DOM.selectCharacterModal.classList.remove('active'); });

        DOM.selectCharacterList.addEventListener('click', (e) => {
            const target = e.target.closest('.char-select-item');
            if (target && target.dataset.charId) startNewChat(target.dataset.charId);
        });

        DOM.chatListContainer.addEventListener('click', async (e) => {
            const target = e.target.closest('.chat-list-card');
            if (!target) return;
            const charId = target.dataset.charId;
            const character = appState.characters.find(c => c.id === charId);
            if (!character) return;
            appState.currentChattingCharId = charId;
            DOM.chatHeaderTitle.textContent = character.name;
            const [history, settingsResult, wallpaperResult] = await Promise.all([
                dbHelper.loadHistoryForChar(charId),
                dbHelper.loadObject(CONSTANTS.STORE_NAMES.SETTINGS, `chatSettings_${charId}`),
                dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, `chat_wallpaper_${charId}`)
            ]);
            if (wallpaperResult) applyChatWallpaper(wallpaperResult.value); else removeChatWallpaper();
            DOM.messagesContainer.innerHTML = '';
            appState.currentChatHistory = history;
            await renderMessage(`你已和 ${character.name} 建立对话，开始聊天吧！`, 'system');
            for(const msg of history) { await renderMessage(msg.content, msg.sender); }
            const charSettings = settingsResult ? settingsResult.value : {};
            DOM.memoryTurnsSlider.value = charSettings.memoryTurns || 12;
            DOM.memoryTurnsValue.textContent = `${DOM.memoryTurnsSlider.value} 轮`;
            openScreen(DOM.chatDialogueScreen);
            autoScrollToBottom();
        });

        DOM.chatMoreBtn.addEventListener('click', () => openScreen(DOM.chatDetailsScreen));
        DOM.chatExpandBtn.addEventListener('click', () => DOM.chatFunctionPanel.classList.toggle('visible'));
        DOM.chatTextInput.addEventListener('input', () => {
            DOM.chatTextInput.style.height = 'auto';
            DOM.chatTextInput.style.height = `${DOM.chatTextInput.scrollHeight}px`;
            DOM.sendFinalBtn.classList.toggle('activated', DOM.chatTextInput.value.trim().length > 0);
        });

        DOM.sendBufferBtn.addEventListener('click', async () => {
            const text = DOM.chatTextInput.value.trim();
            if (!text) return;
            await renderMessage(text, 'user');
            const userMessageData = { charId: appState.currentChattingCharId, sender: 'user', content: text, timestamp: Date.now() };
            await dbHelper.saveObject(CONSTANTS.STORE_NAMES.CHAT_HISTORY, userMessageData);
            appState.currentChatHistory.push(userMessageData);
            await updateChatSession(appState.currentChattingCharId, text);
            await renderChatList();
            DOM.chatTextInput.value = '';
            DOM.chatTextInput.style.height = 'auto';
            DOM.sendFinalBtn.classList.remove('activated');
        });

        DOM.sendFinalBtn.addEventListener('click', handleSendMessage);

        DOM.clearHistoryBtn.addEventListener('click', async () => {
            if (!appState.currentChattingCharId || !confirm(`确定要清空与该角色的所有聊天记录吗？此操作不可恢复。`)) return;
            await dbHelper.deleteHistoryForChar(appState.currentChattingCharId);
            DOM.messagesContainer.innerHTML = '';
            appState.currentChatHistory = [];
            closeScreen(DOM.chatDetailsScreen);
            await renderMessage(`你已和 ${DOM.chatHeaderTitle.textContent} 建立对话，开始聊天吧！`, 'system');
        });
        
        DOM.deleteChatBtn.addEventListener('click', async () => {
            if (!appState.currentChattingCharId || !confirm(`确定要删除与该角色的整个对话吗？所有聊天记录都将丢失。`)) return;
            const charIdToDelete = appState.currentChattingCharId;
            appState.chatSessions = appState.chatSessions.filter(s => s.charId !== charIdToDelete);
            await dbHelper.deleteObject(CONSTANTS.STORE_NAMES.CHAT_SESSIONS, charIdToDelete);
            await dbHelper.deleteHistoryForChar(charIdToDelete);
            closeScreen(DOM.chatDetailsScreen);
            closeScreen(DOM.chatDialogueScreen);
            await renderChatList();
        });

        DOM.imageUploader.addEventListener('change', (e) => {
            if (!e.target.files || !e.target.files[0]) return;
            const file = e.target.files[0];
            const storageKey = DOM.imageUploader.dataset.currentStorageKey;
            const imageType = DOM.imageUploader.dataset.imageType;
            if (imageType === 'userAvatar') {
                processAndSaveImage(file, storageKey, (blob) => {
                    appState.userAvatarUrl = URL.createObjectURL(blob);
                    document.querySelectorAll('.user-avatar').forEach(avatarDiv => {
                        avatarDiv.classList.remove('empty');
                        avatarDiv.onclick = null;
                        avatarDiv.innerHTML = `<img src="${appState.userAvatarUrl}" alt="用户头像">`;
                    });
                    alert("头像设置成功！");
                });
                return;
            }
            if (imageType === 'charAvatar') {
                DOM.charAvatarUploader.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
                DOM.charAvatarUploader.innerHTML = '';
                if (appState.currentEditingCharacterId) {
                    processAndSaveImage(file, `char_avatar_${appState.currentEditingCharacterId}`);
                } else {
                    appState.tempAvatarFile = file;
                }
                return;
            }
            if (imageType === 'ticketArt') {
                processAndSaveImage(file, storageKey, () => renderCharacterList());
                return;
            }
            if (imageType === 'chatWallpaper') {
                processAndSaveImage(file, storageKey, (blob) => { applyChatWallpaper(blob); alert("壁纸设置成功！"); });
                return;
            }
            processAndSaveImage(file, storageKey, (blob) => applyImageFromBlob(storageKey, blob));
        });

        DOM.characterBookApp.addEventListener('click', () => openScreen(DOM.characterBookScreen));
        DOM.addCharBtn.addEventListener('click', () => openCharacterEditor());
        DOM.saveCharBtn.addEventListener('click', saveCharacter);
        DOM.deleteCharBtn.addEventListener('click', deleteCharacter);
        DOM.characterListContainer.addEventListener('click', (e) => {
            const artUploader = e.target.closest('.ticket-art');
            const editButton = e.target.closest('.ticket-edit-btn');
            const relationshipWrapper = e.target.closest('.relationship-wrapper');
            if (artUploader) {
                const charId = artUploader.dataset.artId;
                DOM.imageUploader.dataset.currentStorageKey = `char_art_${charId}`;
                DOM.imageUploader.dataset.imageType = 'ticketArt';
                DOM.imageUploader.click();
            } else if (editButton) {
                openCharacterEditor(editButton.dataset.id);
            } else if (relationshipWrapper) {
                openRelationshipModal(relationshipWrapper.dataset.charId);
            }
        });
        DOM.characterListContainer.addEventListener('focusout', (e) => {
            const editableField = e.target.closest('.editable-field');
            if (!editableField) return;
            const charId = editableField.closest('.ticket').dataset.id;
            const field = editableField.dataset.field;
            const newText = (field === 'quote' ? editableField.querySelector('p').textContent : editableField.textContent).trim();
            const charIndex = appState.characters.findIndex(c => c.id === charId);
            if (charIndex > -1 && field && appState.characters[charIndex][field] !== newText) {
                appState.characters[charIndex][field] = newText;
                dbHelper.saveObject(CONSTANTS.STORE_NAMES.CHARACTERS, appState.characters[charIndex]);
            }
        });
        DOM.charAvatarUploader.addEventListener('click', () => { DOM.imageUploader.dataset.imageType = 'charAvatar'; DOM.imageUploader.click(); });
        DOM.relationshipModal.addEventListener('click', (e) => { if (e.target === DOM.relationshipModal) closeRelationshipModal(); });
        DOM.relationshipOptionsContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.modal-btn');
            if (target && target.dataset.relationship) updateRelationship(appState.currentEditingRelationshipCharId, target.dataset.relationship);
        });
        DOM.closeRelationshipModalBtn.addEventListener('click', closeRelationshipModal);
        DOM.personalizationAppIcon.addEventListener('click', () => openScreen(DOM.personalizationScreen));
        DOM.menuChangeIcons.addEventListener('click', () => openScreen(DOM.iconChangerScreen));
        DOM.backButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const screenToClose = e.target.closest('.app-screen');
                if (!screenToClose) return;
                if (screenToClose === DOM.chatDetailsScreen) {
                    if (appState.currentChattingCharId) {
                        const wallpaperResult = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, `chat_wallpaper_${appState.currentChattingCharId}`);
                        if (wallpaperResult) applyChatWallpaper(wallpaperResult.value); else removeChatWallpaper();
                    }
                } else if (screenToClose === DOM.chatDialogueScreen) {
                    await renderChatList();
                    removeChatWallpaper();
                    appState.currentChattingCharId = null;
                } else if (screenToClose === DOM.chatListScreen) {
                    appState.currentChattingCharId = null;
                }
                closeScreen(screenToClose);
            });
        });
        DOM.albumArt.addEventListener('click', () => { DOM.imageUploader.dataset.currentStorageKey = 'musicWidgetImage'; DOM.imageUploader.dataset.imageType = 'widget'; DOM.imageUploader.click(); });
        [DOM.widgetDecor, DOM.widgetPhoto].forEach(widget => { widget.addEventListener('click', () => { DOM.imageUploader.dataset.currentStorageKey = widget.dataset.storageKey; DOM.imageUploader.dataset.imageType = 'widget'; DOM.imageUploader.click(); }); });
        DOM.menuChangeWallpaper.addEventListener('click', () => { DOM.imageUploader.dataset.currentStorageKey = 'wallpaperImage'; DOM.imageUploader.dataset.imageType = 'widget'; DOM.imageUploader.click(); });
        DOM.themeToggleButton.addEventListener('click', () => { setTheme(document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); });
        DOM.playPauseBtn.addEventListener('click', () => { if (appState.playlist.length > 0) appState.isPlaying ? pauseTrack() : playTrack(); });
        DOM.nextBtn.addEventListener('click', playNext);
        DOM.prevBtn.addEventListener('click', playPrev);
        DOM.audioPlayer.addEventListener('timeupdate', updateProgress);
        DOM.audioPlayer.addEventListener('play', () => { appState.isPlaying = true; DOM.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; renderPlaylist(); });
        DOM.audioPlayer.addEventListener('pause', () => { appState.isPlaying = false; DOM.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; renderPlaylist(); });
        DOM.audioPlayer.addEventListener('ended', () => { (appState.playMode === 'repeat-one') ? loadTrack(appState.currentTrackIndex, true) : playNext(); });
        DOM.playModeBtn.addEventListener('click', () => {
            const playModes = ['repeat', 'shuffle', 'repeat-one'];
            const currentModeIndex = playModes.indexOf(appState.playMode);
            appState.playMode = playModes[(currentModeIndex + 1) % playModes.length];
            updatePlayModeIcon();
        });
        DOM.playlistBtn.addEventListener('click', () => openScreen(DOM.playlistScreen));
        DOM.addSongBtn.addEventListener('click', () => DOM.addSongModal.classList.add('active'));
        DOM.closeModalBtn.addEventListener('click', () => DOM.addSongModal.classList.remove('active'));
        DOM.addSongModal.addEventListener('click', (e) => { if (e.target === DOM.addSongModal) DOM.addSongModal.classList.remove('active'); });
        DOM.uploadLocalBtn.addEventListener('click', () => DOM.audioUploader.click());
        DOM.audioUploader.addEventListener('change', async (e) => {
            for (const file of e.target.files) {
                const newSong = { name: file.name.replace(/\.[^/.]+$/, ""), src: URL.createObjectURL(file), isLocal: true };
                const savedId = await dbHelper.saveObject(CONSTANTS.STORE_NAMES.PLAYLIST, newSong);
                newSong.id = savedId;
                appState.playlist.push(newSong);
            }
            renderPlaylist();
            if (appState.currentTrackIndex < 0 && appState.playlist.length > 0) loadTrack(0, true);
            DOM.addSongModal.classList.remove('active');
        });
        DOM.addUrlBtn.addEventListener('click', async () => {
            const url = DOM.urlInput.value.trim();
            if (!url) return;
            const name = url.substring(url.lastIndexOf('/') + 1) || 'Network Track';
            const newSong = { name, src: url, isLocal: false };
            const savedId = await dbHelper.saveObject(CONSTANTS.STORE_NAMES.PLAYLIST, newSong);
            newSong.id = savedId;
            appState.playlist.push(newSong);
            renderPlaylist();
            if (appState.currentTrackIndex < 0 && appState.playlist.length > 0) loadTrack(0, true);
            DOM.urlInput.value = '';
            DOM.addSongModal.classList.remove('active');
        });
        DOM.playlistContainer.addEventListener('click', (e) => {
            const songDetails = e.target.closest('.song-details');
            const deleteButton = e.target.closest('.delete-song-btn');
            if (songDetails) loadTrack(parseInt(songDetails.dataset.index, 10), true);
            else if (deleteButton) deleteSong(parseInt(deleteButton.dataset.index, 10));
        });
        DOM.menuApiSettings.addEventListener('click', () => openScreen(DOM.apiSettingsScreen));
        DOM.fetchModelsBtn.addEventListener('click', fetchModels);
        DOM.saveApiBtn.addEventListener('click', async () => {
            const newConfig = { id: `api_${Date.now()}`, name: DOM.apiNameInput.value.trim() || '未命名配置', url: DOM.apiUrlInput.value.trim(), key: DOM.apiKeyInput.value.trim(), selectedModel: DOM.apiModelSelect.value, };
            await dbHelper.saveObject(CONSTANTS.STORE_NAMES.API_CONFIGS, newConfig);
            appState.apiConfigs.push(newConfig);
            appState.activeApiId = newConfig.id;
            await dbHelper.saveObject(CONSTANTS.STORE_NAMES.SETTINGS, { id: 'activeApiId', value: newConfig.id });
            renderApiList(); resetApiForm(); checkApiStatus();
        });
        DOM.apiListContainer.addEventListener('click', async (e) => {
            const apiItem = e.target.closest('.api-item');
            const deleteBtn = e.target.closest('.api-delete-btn');
            if (deleteBtn) {
                e.stopPropagation();
                const idToDelete = deleteBtn.dataset.id;
                await dbHelper.deleteObject(CONSTANTS.STORE_NAMES.API_CONFIGS, idToDelete);
                appState.apiConfigs = appState.apiConfigs.filter(config => config.id !== idToDelete);
                if (appState.activeApiId === idToDelete) {
                    appState.activeApiId = appState.apiConfigs.length > 0 ? appState.apiConfigs[0].id : null;
                    if(appState.activeApiId) await dbHelper.saveObject(CONSTANTS.STORE_NAMES.SETTINGS, { id: 'activeApiId', value: appState.activeApiId });
                    else await dbHelper.deleteObject(CONSTANTS.STORE_NAMES.SETTINGS, 'activeApiId');
                }
            } else if (apiItem) {
                appState.activeApiId = apiItem.dataset.id;
                await dbHelper.saveObject(CONSTANTS.STORE_NAMES.SETTINGS, { id: 'activeApiId', value: appState.activeApiId });
            }
            renderApiList();
            await checkApiStatus();
        });
        DOM.menuFontSettings.addEventListener('click', () => openScreen(DOM.fontSettingsScreen));
        DOM.applyFontBtn.addEventListener('click', () => { applyFont(DOM.fontUrlInput.value.trim()); });
        DOM.fontSizeSlider.addEventListener('input', () => { applyFontSize(DOM.fontSizeSlider.value); });
        DOM.memoryTurnsSlider.addEventListener('input', () => { DOM.memoryTurnsValue.textContent = `${DOM.memoryTurnsSlider.value} 轮`; });
        DOM.memoryTurnsSlider.addEventListener('change', async () => {
            const turns = parseInt(DOM.memoryTurnsSlider.value, 10);
            const settingsResult = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.SETTINGS, `chatSettings_${appState.currentChattingCharId}`) || { id: `chatSettings_${appState.currentChattingCharId}`, value: {} };
            settingsResult.value.memoryTurns = turns;
            await dbHelper.saveObject(CONSTANTS.STORE_NAMES.SETTINGS, settingsResult);
        });
        DOM.setChatWallpaperBtn.addEventListener('click', () => { if (appState.currentChattingCharId) { DOM.imageUploader.dataset.currentStorageKey = `chat_wallpaper_${appState.currentChattingCharId}`; DOM.imageUploader.dataset.imageType = 'chatWallpaper'; DOM.imageUploader.click(); } });
        DOM.clearWallpaperBtn.addEventListener('click', async () => { if (appState.currentChattingCharId && confirm('确定要清除当前聊天背景吗？')) { await dbHelper.deleteObject(CONSTANTS.STORE_NAMES.IMAGES, `chat_wallpaper_${appState.currentChattingCharId}`); removeChatWallpaper(); alert('壁纸已清除。'); } });
    }

    async function initializeApp() {
        try {
            await dbHelper.initDB();
            console.log("Database initialized successfully.");

            const [settings, apiConfigs, characters, chatSessions, playlist, userAvatarResult] = await Promise.all([
                dbHelper.loadAll(CONSTANTS.STORE_NAMES.SETTINGS),
                dbHelper.loadAll(CONSTANTS.STORE_NAMES.API_CONFIGS),
                dbHelper.loadAll(CONSTANTS.STORE_NAMES.CHARACTERS),
                dbHelper.loadAll(CONSTANTS.STORE_NAMES.CHAT_SESSIONS),
                dbHelper.loadAll(CONSTANTS.STORE_NAMES.PLAYLIST),
                dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, 'userAvatar')
            ]);
            
            appState.apiConfigs = apiConfigs;
            appState.characters = characters;
            appState.chatSessions = chatSessions;
            appState.playlist = playlist;
            if (userAvatarResult) appState.userAvatarUrl = URL.createObjectURL(userAvatarResult.value);
            
            const themeSetting = settings.find(s => s.id === 'theme');
            setTheme(themeSetting ? themeSetting.value : 'light');
            
            const activeApiIdSetting = settings.find(s => s.id === 'activeApiId');
            appState.activeApiId = activeApiIdSetting ? activeApiIdSetting.value : null;

            const fontUrlSetting = settings.find(s => s.id === 'customFontUrl');
            if(fontUrlSetting) { applyFont(fontUrlSetting.value); DOM.fontUrlInput.value = fontUrlSetting.value; }

            const fontSizeSetting = settings.find(s => s.id === 'customFontSize');
            const fontSize = fontSizeSetting ? fontSizeSetting.value : '16';
            applyFontSize(fontSize); DOM.fontSizeSlider.value = fontSize;

            const playModeSetting = settings.find(s => s.id === 'playMode');
            appState.playMode = playModeSetting ? playModeSetting.value : 'repeat';
            await updatePlayModeIcon();

            console.log("All data loaded from DB.", appState);

            initializeIconChanger();
            const allStorageKeys = [...document.querySelectorAll('[data-storage-key]')].map(el => el.dataset.storageKey);
            for(const key of allStorageKeys) {
                const result = await dbHelper.loadObject(CONSTANTS.STORE_NAMES.IMAGES, key);
                if(result) applyImageFromBlob(key, result.value);
            }

            await renderCharacterList();
            await renderChatList();
            await checkApiStatus();
            renderApiList();
            
            if (appState.playlist.length > 0) loadTrack(0); else { renderPlaylist(); loadTrack(-1); }

            updateTime();
            setInterval(updateTime, 60000);
            
            initializeEventListeners();
        } catch (error) {
            console.error("Failed to initialize the application:", error);
            alert("应用初始化失败，请检查控制台以获取更多信息。");
        }
    }

    initializeApp();
});