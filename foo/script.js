const colorSchemes = {
    retro: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FDCB6E', '#8D5524'],
    pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#D66D75'],
    bold: ['#E63946', '#2A9D8F', '#264653', '#F4A261', '#E76F51'],
    monochrome: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC']
};

const fonts = [
    "'Abril Fatface', serif",
    "'Playfair Display', serif",
    "'Roboto Slab', serif",
    "'Indie Flower', cursive",
    "'Caveat', cursive",
    "'Amatic SC', cursive",
    "'Montserrat', sans-serif"
];

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getSelectedColorSchemes() {
    const checkboxes = document.querySelectorAll('input[name="colorScheme"]:checked');
    const customColor = document.getElementById('customColor').value;
    const selected = Array.from(checkboxes).map(cb => colorSchemes[cb.value]);
    return selected.length > 0 ? selected.flat().concat(customColor) : Object.values(colorSchemes).flat().concat(customColor);
}

function createAsset(word, size, shape, font, colors) {
    const asset = document.createElement('div');
    asset.className = 'asset';
    asset.textContent = word;
    asset.style.fontSize = `${size}px`;
    asset.style.fontFamily = font;
    asset.style.color = getRandomItem(colors);
    asset.style.backgroundColor = getRandomItem(colors);
    asset.style.borderRadius = shape === 'circle' ? '50%' : '0';
    return asset;
}

function generateAssets() {
    const input = document.getElementById('input').value;
    const words = input.split(',').map(word => word.trim()).filter(word => word);
    const output = document.getElementById('output');
    output.innerHTML = '';

    if (words.length === 0) {
        output.textContent = 'Please enter at least one word!';
        return;
    }

    const size = document.getElementById('size').value;
    const shape = document.getElementById('shape').value;
    const font = document.getElementById('font').value;
    const colors = getSelectedColorSchemes();

    words.forEach(word => {
        const asset = createAsset(word, size, shape, font, colors);
        output.appendChild(asset);
    });
}

function togglePreview() {
    document.body.classList.toggle('preview-mode');
}

// Event Listeners
document.getElementById('generateBtn').addEventListener('click', generateAssets);
document.getElementById('previewBtn').addEventListener('click', togglePreview);
document.getElementById('printBtn').addEventListener('click', () => window.print());