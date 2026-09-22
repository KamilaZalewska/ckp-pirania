const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "content", "aktualnosci");
const OUTPUT_FILE = path.join(__dirname, "..", "aktualnosci-data.json");

function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) return null;

    const [, frontmatterBlock, body] = match;
    const data = {};
    let currentKey = null;
    let foldMode = null; // ">" - złącz kontynuacje spacją, "|" - zachowaj nowe linie

    // Decap CMS zawija długie pola YAML na kilka wciętych linii (plain scalar
    // folding, np. "lead: >-") — linia bez "klucz:" na początku jest kontynuacją
    // poprzedniego pola.
    frontmatterBlock.split(/\r?\n/).forEach(line => {
        const lineMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);

        if (lineMatch) {
            const [, key, rawValue] = lineMatch;
            const trimmed = rawValue.trim();
            const blockIndicator = trimmed.match(/^([|>])[-+]?$/);

            if (blockIndicator) {
                // sam wskaźnik bloku YAML (>, >-, |, |-) - wartość dopiero w kolejnych liniach
                data[key] = "";
                foldMode = blockIndicator[1];
            } else {
                data[key] = trimmed.replace(/^["'](.*)["']$/, "$1");
                foldMode = null;
            }
            currentKey = key;
            return;
        }

        if (currentKey && line.trim()) {
            const separator = foldMode === "|" ? "\n" : " ";
            data[currentKey] = data[currentKey] ? data[currentKey] + separator + line.trim() : line.trim();
        }
    });

    data.body = body.trim();
    return data;
}

function buildNews() {
    if (!fs.existsSync(CONTENT_DIR)) {
        fs.writeFileSync(OUTPUT_FILE, "[]");
        console.log("Brak folderu content/aktualnosci — zapisano pustą listę aktualności.");
        return;
    }

    const files = fs.readdirSync(CONTENT_DIR).filter(name => name.endsWith(".md"));

    const posts = files.map(filename => {
        const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
        const parsed = parseFrontmatter(raw);
        if (!parsed) return null;

        return {
            slug: filename.replace(/\.md$/, ""),
            title: parsed.title || "",
            date: parsed.date || "",
            lead: parsed.lead || "",
            image: parsed.image || "",
            body: parsed.body || ""
        };
    }).filter(Boolean);

    posts.sort((a, b) => (a.date < b.date ? 1 : -1));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts));
    console.log(`Zapisano ${posts.length} aktualności do ${path.basename(OUTPUT_FILE)}.`);
}

buildNews();
