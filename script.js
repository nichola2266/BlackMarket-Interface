// State
let selectedCategory = 'PLANT BIOWARE';
let selectedItem = null;
let credits = 2847;
let cart = [];
let pendingItem = null;
let biddingPrices = {};
let timeRemaining = {};
let isLocked = false;
let failedAttempts = 0;

// Categories Data
const categories = {
    'PLANT BIOWARE': {
        items: [
            {
                name: 'Heirloom Seed Stock',
                code: 'GREEN-TRACE-47',
                price: 1200,
                unit: 'SCRIP',
                risk: 'EXTREME',
                description: 'Non-GMO, pre-famine seeds. Phoenix-tier contraband.',
                stock: 3,
                bidding: true
            },
            {
                name: 'Bio-Hacked Fertilizer',
                code: 'GROWBOOST-X',
                price: 180,
                unit: 'SCRIP',
                risk: 'HIGH',
                description: 'Unauthorized compounds. Tricks GMO strains into higher yields.',
                stock: 12,
                bidding: false
            },
            {
                name: 'Atmospheric Regulator',
                code: 'ATMOS-REG-SALV',
                price: 890,
                unit: 'SCRIP',
                risk: 'EXTREME',
                description: 'Scavenged from Inner Sphere borders. Controlled environment use.',
                stock: 2,
                bidding: true
            }
        ]
    },
    'FORBIDDEN TECH': {
        items: [
            {
                name: 'Surveillance Spoofer MK-II',
                code: 'SPOOF-CAM-02',
                price: 450,
                unit: 'SCRIP',
                risk: 'HIGH',
                description: 'Jams local camera grids. Standard NullBorn equipment.',
                stock: 8,
                bidding: false
            },
            {
                name: 'Auth-Pass Clone Key',
                code: 'AUTH-CLONE-1X',
                price: 320,
                unit: 'SCRIP',
                risk: 'MEDIUM',
                description: 'Single-use. Mimics low-level Oligarchy credentials.',
                stock: 15,
                bidding: false
            },
            {
                name: 'Pre-Famine Data Drive',
                code: 'ARCHIVE-UNCORR',
                price: 670,
                unit: 'SCRIP',
                risk: 'MEDIUM',
                description: 'Encrypted. Contains un-corrupted history and science data.',
                stock: 5,
                bidding: true
            }
        ]
    },
    'OLD-WORLD SALVAGE': {
        items: [
            {
                name: 'Rare Earth Components',
                code: 'COPPER-BUNDLE-A',
                price: 240,
                unit: 'SCRIP',
                risk: 'LOW',
                description: 'Clean copper wire, capacitors. Essential for all Jacks work.',
                stock: 22,
                bidding: false
            },
            {
                name: 'Wall-E Unit (Parts)',
                code: 'WALL-E-BLUEPRINT',
                price: 380,
                unit: 'SCRIP',
                risk: 'LOW',
                description: 'Houseplant starter kit parts. Reverse-engineering potential.',
                stock: 7,
                bidding: false
            },
            {
                name: 'Grade-B Filter Media',
                code: 'FILTER-CARB-B',
                price: 95,
                unit: 'SCRIP',
                risk: 'LOW',
                description: 'Scavenged carbon filters. For Whirlwind 2000 maintenance.',
                stock: 31,
                bidding: false
            }
        ]
    },
    'HUMAN OPTIMIZATION': {
        items: [
            {
                name: 'Cognition Booster (Trace)',
                code: 'COGNI-BOOST-TR',
                price: 520,
                unit: 'SCRIP',
                risk: 'HIGH',
                description: 'Illegal nootropics. Attempts to match elite cognitive advantages.',
                stock: 9,
                bidding: true
            },
            {
                name: 'Disease Suppressants',
                code: 'DISEASE-SUPP-CF',
                price: 410,
                unit: 'SCRIP',
                risk: 'MEDIUM',
                description: 'Counterfeit drugs for diseases the elite engineered out.',
                stock: 14,
                bidding: false
            },
            {
                name: 'Longevity Patches',
                code: 'LONGEVITY-LY',
                price: 780,
                unit: 'SCRIP',
                risk: 'MEDIUM',
                description: 'Low-yield supplements. Minor life extension claims.',
                stock: 6,
                bidding: true
            }
        ]
    },
    'INTEL': {
        items: [
            {
                name: 'Oligarchy Data Feed (Delayed)',
                code: 'DATA-FEED-24H',
                price: 290,
                unit: 'SCRIP',
                risk: 'MEDIUM',
                description: '24hr delayed news from Inner Spheres. Critical for logistics.',
                stock: 18,
                bidding: false
            },
            {
                name: 'Ghostline Contract Listing',
                code: 'CONTRACT-SECURE',
                price: 150,
                unit: 'SCRIP',
                risk: 'LOW',
                description: 'NullBorn operations board. High-risk assignment postings.',
                stock: 25,
                bidding: false
            },
            {
                name: 'Purified Water Vials (PWV)',
                code: 'WATER-PWV-5ML',
                price: 65,
                unit: 'SCRIP',
                risk: 'LOW',
                description: 'Medical-grade triple-filtered water. 5ml doses.',
                stock: 42,
                bidding: false
            }
        ]
    }
};

// Initialize
function init() {
    initializeBiddingPrices();
    renderCategoryTabs();
    renderItems();
    updateCreditsDisplay();
    updateCartDisplay();
    startBiddingUpdates();
    setupEventListeners();
}

// Initialize bidding prices and timers
function initializeBiddingPrices() {
    Object.values(categories).forEach(category => {
        category.items.forEach(item => {
            if (item.bidding) {
                biddingPrices[item.code] = item.price;
                timeRemaining[item.code] = Math.floor(Math.random() * 300) + 180;
            }
        });
    });
}

// Start bidding updates
function startBiddingUpdates() {
    setInterval(() => {
        // Update prices
        Object.keys(biddingPrices).forEach(code => {
            const change = Math.floor(Math.random() * 40) - 20;
            biddingPrices[code] = Math.max(50, biddingPrices[code] + change);
        });

        // Update timers
        Object.keys(timeRemaining).forEach(code => {
            timeRemaining[code] = Math.max(0, timeRemaining[code] - 1);
        });

        // Re-render items to show updated prices
        if (selectedItem) {
            renderItems();
        }
    }, 1000);
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Render category tabs
function renderCategoryTabs() {
    const container = document.getElementById('categoryTabs');
    container.innerHTML = '';

    Object.keys(categories).forEach(categoryName => {
        const button = document.createElement('button');
        button.className = `tab-button ${selectedCategory === categoryName ? 'active' : ''}`;
        button.textContent = categoryName;
        button.onclick = () => {
            selectedCategory = categoryName;
            selectedItem = null;
            renderCategoryTabs();
            renderItems();
        };
        container.appendChild(button);
    });
}

// Render items
function renderItems() {
    const headerEl = document.getElementById('categoryHeader');
    const containerEl = document.getElementById('itemsContainer');

    headerEl.textContent = selectedCategory;
    containerEl.innerHTML = '';

    categories[selectedCategory].items.forEach(item => {
        const currentPrice = item.bidding ? biddingPrices[item.code] : item.price;
        const isSelected = selectedItem?.code === item.code;

        // Item card
        const card = document.createElement('div');
        card.className = `item-card ${isSelected ? 'selected' : ''}`;
        
        card.innerHTML = `
            <div class="item-header">
                <div class="item-name">${item.name}</div>
                <svg class="chevron ${isSelected ? 'rotated' : ''}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </div>
            <div class="item-code">CODE: ${item.code}</div>
            <div class="item-info">
                <div class="item-price-area">
                    <span class="item-price digital-font">${currentPrice}</span>
                    <span class="item-unit">${item.unit}</span>
                    ${item.bidding ? `<span class="bidding-tag">[BIDDING: ${formatTime(timeRemaining[item.code] || 0)}]</span>` : ''}
                </div>
                <div class="risk-${item.risk.toLowerCase()}">${item.risk}</div>
            </div>
            <div class="item-stock">STOCK: <span class="digital-font">${item.stock}</span></div>
        `;

        card.onclick = () => {
            selectedItem = isSelected ? null : item;
            renderItems();
        };

        containerEl.appendChild(card);

        // Item details (if selected)
        if (isSelected) {
            const details = document.createElement('div');
            details.className = 'item-details';
            
            details.innerHTML = `
                <div class="details-section">
                    <div class="details-label">DESCRIPTION</div>
                    <div class="details-description">${item.description}</div>
                </div>

                <div class="details-grid">
                    <div>
                        <div class="details-label">CURRENT PRICE</div>
                        <div class="digital-font" style="font-size: 18px; color: #ff0000;">${currentPrice}</div>
                        <div class="details-label">${item.unit}</div>
                    </div>
                    <div>
                        <div class="details-label">RISK LEVEL</div>
                        <div class="risk-${item.risk.toLowerCase()}" style="font-size: 14px;">${item.risk}</div>
                    </div>
                    <div>
                        <div class="details-label">AVAILABLE</div>
                        <div class="digital-font" style="font-size: 18px; color: #ff0000;">${item.stock}</div>
                    </div>
                </div>

                ${item.bidding ? `
                    <div class="auction-notice">
                        <div class="auction-title">⚠ AUCTION MODE</div>
                        <div class="auction-info">Time remaining: <span class="digital-font" style="color: #ff0000;">${formatTime(timeRemaining[item.code] || 0)}</span></div>
                        <div class="auction-info">Price fluctuates until auction ends</div>
                    </div>
                ` : ''}

                <button class="acquire-btn" id="acquireBtn" ${credits < currentPrice ? 'disabled' : ''}>
                    ${credits >= currentPrice ? 'ACQUIRE ITEM' : 'INSUFFICIENT SCRIP'}
                </button>

                <div class="security-notice">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    Requires security verification
                </div>
            `;

            containerEl.appendChild(details);

            // Add event listener to acquire button
            const acquireBtn = document.getElementById('acquireBtn');
            if (acquireBtn && !acquireBtn.disabled) {
                acquireBtn.onclick = () => initiateAcquire(item);
            }
        }
    });
}

// Initiate acquire
function initiateAcquire(item) {
    pendingItem = item;
    document.getElementById('accessModal').classList.remove('hidden');
    document.getElementById('accessCodeInput').value = '';
    document.getElementById('accessCodeInput').focus();
}

// Verify access code
function verifyAccessCode() {
    const accessCode = document.getElementById('accessCodeInput').value;
    
    if (accessCode === 'h$ck@R2893') {
        const itemPrice = pendingItem.bidding ? biddingPrices[pendingItem.code] : pendingItem.price;

        
        
        if (credits >= itemPrice) {
            cart.push(pendingItem);
            credits -= itemPrice;
            updateCreditsDisplay();
            updateCartDisplay();
            showTransactionNotif();
        }
        
        
        closeAccessModal();
        failedAttempts = 0;
        
    } else {
        // Play denial sound
        playDenialSound();
        
        // Lock terminal
        failedAttempts++;
        isLocked = true;
        document.getElementById('lockedScreen').classList.remove('hidden');
        document.getElementById('mainInterface').style.display = 'none';
        closeAccessModal();
 

        // --- PLAY SIREN AUDIO ---
        const siren = document.getElementById('sirenAudio');
        siren.pause();          // make sure it starts fresh
        siren.currentTime = 0;
        siren.loop = true;      // keep it looping
        const playPromise = siren.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Siren blocked by browser autoplay. User interaction required.");
            });
        }


    }
}

// Play denial sound
function playDenialSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audioContext.sampleRate * 0.3;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.15;
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start();
    } catch (e) {
        console.log('Audio playback failed');
    }
}

// Close access modal
function closeAccessModal() {
    document.getElementById('accessModal').classList.add('hidden');
    pendingItem = null;
}

// Show transaction notification
function showTransactionNotif() {
    const notif = document.getElementById('transactionNotif');
    notif.classList.remove('hidden');
    setTimeout(() => {
        notif.classList.add('hidden');
    }, 2000);
}

// Update credits display
function updateCreditsDisplay() {
    document.getElementById('credits').textContent = credits.toLocaleString();
}

// Update cart display
function updateCartDisplay() {
    document.getElementById('cartCount').textContent = cart.length;
}

// Setup event listeners
function setupEventListeners() {
    // Abort button
    document.getElementById('abortBtn').onclick = closeAccessModal;
    
    // Verify button
    document.getElementById('verifyBtn').onclick = verifyAccessCode;
    
    // Enter key in access code input
    document.getElementById('accessCodeInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyAccessCode();
        }
    });
    
    document.getElementById('resetButton').onclick = () => {
            isLocked = false;
            document.getElementById('lockedScreen').classList.add('hidden');
            document.getElementById('mainInterface').style.display = 'block';
            pendingItem = null;

            // Stop siren
            const siren = document.getElementById('sirenAudio');
            siren.pause();
            siren.currentTime = 0;
    };

}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);