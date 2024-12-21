document.addEventListener('DOMContentLoaded', () => {
    const htmlEditor = document.getElementById('htmlEditor');
    const cssEditor = document.getElementById('cssEditor');
    const jsEditor = document.getElementById('jsEditor');
    const dataEditor = document.getElementById('dataEditor');
    const jsonifyEditor = document.getElementById('jsonifyEditor');
    const preview = document.getElementById('preview');
    const loadProject = document.getElementById('loadProject');
    const saveBtn = document.getElementById('saveBtn');
    const newBtn = document.getElementById('newBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const loadJsonBtn = document.getElementById('loadJsonBtn');
    const jsonFileInput = document.getElementById('jsonFileInput');

    function loadJsonFile() {
        jsonFileInput.click();
    }

    function standardizeJson(jsonString) {
        if (typeof jsonString !== 'string') {
            throw new Error('Input must be a string');
        }

        let processedJson = jsonString.trim().replace(/\s+/g, ' ');
        processedJson = processedJson.replace(/'/g, '"');

        function processNestedStructures(str) {
            str = str.replace(/([{,]\s*)([a-zA-Z0-9_$]+)(\s*:)/g, '$1"$2"$3');
            str = str.replace(/:(\s*)([a-zA-Z][a-zA-Z0-9_$\s]+)([,}\]])/g, ':"$2"$3');
            str = str.replace(/:(\s*)([a-zA-Z][a-zA-Z0-9_$]*)([\s,}\]])/g, ':"$2"$3');
            str = str.replace(/\[(\s*)([a-zA-Z][a-zA-Z0-9_$\s]*)([\s,\]])/g, '[$1"$2"$3');
            str = str.replace(/,(\s*)([a-zA-Z][a-zA-Z0-9_$\s]*)([\s,\]])/g, ',$1"$2"$3');
            return str;
        }

        let previousJson;
        let iterations = 0;
        const MAX_ITERATIONS = 10;

        do {
            previousJson = processedJson;
            processedJson = processNestedStructures(processedJson);
            iterations++;
        } while (previousJson !== processedJson && iterations < MAX_ITERATIONS);

        processedJson = processedJson
            .replace(/"true"/gi, 'true')
            .replace(/"false"/gi, 'false')
            .replace(/"null"/gi, 'null')
            .replace(/"(-?\d+\.?\d*([eE][-+]?\d+)?)"/, '$1');

        try {
            JSON.parse(processedJson);
        } catch (error) {
            throw new Error(`Failed to create valid JSON: ${error.message}`);
        }

        return processedJson;
    }

    function ensureJsonQuotes(jsonString) {
        jsonString = jsonString.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
        jsonString = jsonString.replace(/:\s*([^[{\s\d\-\]},][^,}\]]*?)([,}\]])/g, ':"$1"$2');
        return jsonString;
    }

    function htmlToJson(element) {
        if (!element) return null;

        const obj = {
            tagName: element.tagName ? element.tagName.toLowerCase() : 'root',
            children: []
        };

        // Add attributes if present
        if (element.attributes && element.attributes.length > 0) {
            obj.attributes = {};
            Array.from(element.attributes).forEach(attr => {
                obj.attributes[attr.name] = attr.value;
            });
        }

        // Process child nodes
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    obj.children.push({
                        type: 'text',
                        content: text
                    });
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                obj.children.push(htmlToJson(node));
            }
        });

        return obj;
    }

    loadJsonBtn.addEventListener('click', loadJsonFile);

    jsonFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                dataEditor.value = e.target.result;
                updatePreview(); // Update preview after loading JSON
            };
            reader.readAsText(file);
        }
    });

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.editor').forEach(editor => editor.classList.remove('active'));

            button.classList.add('active');
            const editor = document.getElementById(`${tabId}Editor`);

            if (editor) {
                editor.classList.add('active');
            }

            if (tabId === 'jsonify') {
                const previewDocument = preview.contentDocument;
                const json = JSON.stringify(htmlToJson(previewDocument.body), null, 2);
                jsonifyEditor.value = json;
            }
        });
    });

    function browseFile() {
        document.getElementById('fileInput').click();
    }

    async function processTemplate(templateCode, dataArray) {
        const outputArray = [];

        for (const dataObject of dataArray) {
            await new Promise(resolve => setTimeout(resolve, 100));

            let processedTemplate = templateCode;

            function replaceTags(obj, prefix = '') {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const fullKey = prefix ? `${prefix}.${key}` : key;
                        const value = obj[key];

                        if (Array.isArray(value)) {
                            const arrayString = value.join(', ');
                            const regex = new RegExp(`{{${fullKey}}}`, 'g');
                            processedTemplate = processedTemplate.replace(regex, arrayString);
                        } else if (typeof value === 'object' && value !== null) {
                            replaceTags(value, fullKey);
                        } else {
                            const regex = new RegExp(`{{${fullKey}}}`, 'g');
                            processedTemplate = processedTemplate.replace(regex, value);
                        }
                    }
                }
            }

            replaceTags(dataObject);
            outputArray.push(processedTemplate);
        }

        return outputArray;
    }

    async function updatePreview() {
        const html = htmlEditor.value;
        const css = cssEditor.value;
        const js = jsEditor.value;
        const data = dataEditor.value;

        let htmlCode = html;

        if (data) {
            try {
                const dataArray = JSON.parse(data);
                const processedTemplates = await processTemplate(html, dataArray);
                htmlCode = processedTemplates.join(' ');
            } catch (error) {
                console.error('Error processing template:', error);
            }
        }

        const previewContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>${css}</style>
                </head>
                <body>
                    ${htmlCode}
                    <script>${js}<\/script>
                </body>
            </html>
        `;

        const previewDocument = preview.contentDocument;
        previewDocument.open();
        previewDocument.write(previewContent);
        previewDocument.close();
    }

    [htmlEditor, cssEditor, jsEditor, dataEditor].forEach(editor => {
        editor.addEventListener('input', updatePreview);
    });

    async function loadProjectList() {
        try {
            const response = await fetch('/api/projects');
            const projects = await response.json();
            loadProject.innerHTML = '<option value="">Load Project...</option>';
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project;
                option.textContent = project.replace('.json', '');
                loadProject.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load project list:', error);
        }
    }

    loadProject.addEventListener('change', async () => {
        if (!loadProject.value) return;

        try {
            const response = await fetch(`/api/load/${loadProject.value}`);
            const project = await response.json();

            htmlEditor.value = project.html || '';
            cssEditor.value = project.css || '';
            jsEditor.value = project.js || '';
            dataEditor.value = project.dataEditor || '';

            updatePreview();
        } catch (error) {
            console.error('Failed to load project:', error);
        }
    });

    saveBtn.addEventListener('click', async () => {
        const filename = prompt('Enter project name:');
        if (!filename) return;

        const project = {
            html: htmlEditor.value,
            css: cssEditor.value,
            js: jsEditor.value,
            dataEditor: dataEditor.value
        };

        try {
            await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename,
                    content: project
                })
            });
            loadProjectList();
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    });

    newBtn.addEventListener('click', () => {
        htmlEditor.value = '';
        cssEditor.value = '';
        jsEditor.value = '';
        dataEditor.value = '';
        updatePreview();
    });

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async () => {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        try {
            await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            fileInput.value = '';
        } catch (error) {
            console.error('Failed to upload file:', error);
        }
    });

    loadProjectList();
    updatePreview();
});