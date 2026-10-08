
const DATA = {
    name: 'Andy Apaez',
    user: 'guest',
    host: 'portfolio',
    role: 'Aspiring security engineer',
    focus: 'security · cloud · full-stack',
    tagline: 'Computer Science student at CUNY College of Staten Island working toward security engineering — building detection dashboards, threat-intel pipelines, and full-stack apps people actually use.',
    location: 'Brooklyn, NY',
    email: 'andy.apaez16@gmail.com',
    github: 'https://github.com/andy-apaez',
    repos: 'https://github.com/andy-apaez?tab=repositories',
    linkedin: 'https://www.linkedin.com/in/andy-apaez',
    resume: 'Andy_Apaez_Resume_1 (1).pdf',

    stats: [
        { v: '1', l: 'app live in production' },
        { get v() { return String(DATA.projects.length); }, l: 'projects' },
        { get v() { return String(earnedCerts().length); }, l: 'certifications' }
    ],

    about: [
        "I'm Andy, a Brooklyn-based Computer Science student (B.S.) in my first year at CUNY College of Staten Island, working toward a career in security engineering.",
        "I started by building things people use. While working at Los Tacos (now Mezquilla), I built the restaurant's QR-code online menu with Node.js and MySQL and deployed it on Vercel. It's still serving customers today. Now I'm applying that same hands-on approach to security, starting with a SIEM console prototype and moving on to a containerized threat-intelligence pipeline.",
        "I sharpen my skills on TryHackMe, HackTheBox, and OverTheWire's Bandit, and I'm currently preparing for the CompTIA Security+ exam. Away from the keyboard, you'll find me lifting weights, playing Minecraft modpacks, or following the stock market."
    ],

    
    education: [
        { school: 'College of Staten Island (CUNY)', detail: 'B.S. in Computer Science · freshman, in progress' },
        { school: 'Fort Hamilton High School', detail: 'Graduated' }
    ],

    experience: [
        {
            slug: 'Bloomberg Cybersecurity Mentorship',
            role: 'Mentee',
            org: 'Bloomberg',
            dates: 'OCT 2026 - NOV 2026',
            points: [
                'Participated in a cybersecurity mentorship program.',
                'Learned about industry best practices and real-world applications.'
            ]
        },
        
        {
            slug: 'los-tacos',
            role: 'Server & tech support',
            org: 'Los Tacos (now Mezquilla)',
            dates: 'Sep 2024 – May 2025',
            points: [
                'Built the restaurant\'s QR-code online menu, still live today.',
                'Set up Uber Eats and handled online orders and the POS system.',
                'Served tables, plus side prep, cashier work, and stocking.'
            ]
        }
    ],

    skills: [
        { group: 'Languages', items: ['Python', 'JavaScript / TypeScript', 'Bash', 'SQL', 'C++ (learning for coursework)'] },
        { group: 'Web', items: ['Node.js', 'React', 'Vite', 'Recharts', 'MySQL', 'Vercel'] },
        { group: 'Data & Infrastructure', items: ['Docker Compose', 'OpenSearch', 'Grafana', 'Redpanda', 'Vector'] },
        { group: 'Cloud', items: ['AWS'] },
        { group: 'Systems & Networking', items: ['Linux command line', 'Networking fundamentals'] },
        { group: 'Security Practice', items: ['TryHackMe', 'OverTheWire Bandit', 'HackTheBox'] }
    ],


    projects: [
        {
            slug: 'mezquilla-menu',
            name: 'Mezquilla Online Menu',
            blurb: 'Full-stack QR-code menu still live at the restaurant.',
            desc: 'A full-stack web app with a QR-code menu backed by a database, built for the restaurant I worked at (Los Tacos at the time, now Mezquilla). Customers scan a code at the table to browse the menu. It is still in use today.',
            tags: ['Node.js', 'MySQL', 'Vercel'],
            demo: 'https://wlostacos.vercel.app/',
            code: 'https://github.com/andy-apaez/Los-Tacos'
        },
        {
            slug: 'threat-intel-pipeline',
            name: 'Threat Intelligence Pipeline',
            status: 'in progress',
            blurb: 'Containerized pipeline for streaming and searching threat telemetry.',
            desc: 'A containerized data pipeline on Docker Compose: a Python service generates simulated threat telemetry, Redpanda streams it, Vector (VRL) parses and routes it into OpenSearch, and Grafana visualizes it. Next step: AI analysis of the collected data.',
            tags: ['Python', 'Redpanda', 'Vector', 'OpenSearch', 'Grafana', 'Docker Compose'],
            demo: null,
            code: null
        },
        {
            slug: 'siem-dashboard',
            name: 'SIEM Console Dashboard',
            year: '2025',
            blurb: 'Security operations console prototype running on mock data.',
            desc: 'A frontend prototype of a Security Information and Event Management console: alert backlogs, event streams, ingestion health, and threat-intel watchlists, all driven by mock data so the whole UI can be demonstrated offline.',
            tags: ['React', 'TypeScript', 'Vite', 'Recharts'],
            demo: null,
            code: 'https://github.com/andy-apaez/SIEM-Dashboard'
        },
        {
            slug: 'ai-security-career-research',
            name: 'AI Security Engineer Career Research',
            blurb: 'Senior career exploration project on AI security roles in NYC.',
            desc: 'A senior career exploration project researching the AI Security Engineer role in New York City, delivered as a written portfolio and a presentation.',
            tags: ['Research', 'Security careers'],
            demo: null,
            code: null
        }
    ],

    certs: [
        {
            slug: 'aws-cloud-practitioner',
            name: 'AWS Certified Cloud Practitioner (CLF-C02)',
            org: 'Amazon Web Services',
            short: 'AWS',
            year: '2026',
            kind: 'Cloud',
            desc: 'Core AWS services, cloud concepts, and the security principles behind how modern cloud systems run.'
        },
        {
            slug: 'google-cybersecurity',
            name: 'Foundations of Cybersecurity',
            org: 'Google · Coursera',
            short: 'Google',
            year: '2025',
            kind: 'Security',
            desc: 'Security fundamentals covering network defense, incident response, and identifying vulnerabilities.'
        },
        {
            slug: 'comptia-security-plus',
            name: 'CompTIA Security+',
            org: 'CompTIA',
            short: 'Security+',
            year: 'In progress',
            kind: 'Security',
            inProgress: true,
            desc: 'Currently studying. Exam not yet scheduled.'
        },
        {
            slug: 'Microsoft Azure Fundamentals AZ-900',
            name: 'Microsoft Azure Fundamentals AZ-900',
            org: 'Microsoft',
            short: 'Azure',
            year: '2026',
            kind: 'Cloud',
            desc: 'Core Microsoft Azure services, cloud concepts, and the security principles behind how modern cloud systems run.'
        }
    ]
};

const earnedCerts = () => DATA.certs.filter(c => !c.inProgress);

const BANNER = [
    ' ███  █   █ ████  █   █',
    '█   █ ██  █ █   █  █ █ ',
    '█████ █ █ █ █   █   █  ',
    '█   █ █  ██ █   █   █  ',
    '█   █ █   █ ████    █  ',
    '',
    ' ███  ████   ███  █████ █████',
    '█   █ █   █ █   █ █        █ ',
    '█████ ████  █████ ████    █  ',
    '█   █ █     █   █ █      █   ',
    '█   █ █     █   █ █████ █████'
].join('\n');

const FORTUNES = [
    'Weeks of coding can save you hours of planning.',
    'There are two hard things in software: naming, cache invalidation, and off-by-one errors.',
    'It works on my machine is a deployment strategy, technically.',
    'The best debugger ever made is a well-placed console.log.',
    'Your password is probably in a wordlist somewhere. Just saying.',
    'Commit messages are letters to a future stranger who is also you.',
    'Every project is a learning project if you never finish it.'
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════════════════ virtual filesystem ═══════════════════════ */

const txt = (lines) => ({ type: 'file', render: () => lines });

const root = {
    type: 'dir',
    children: {
        'about.txt': txt(DATA.about.map(p => ({ text: p, cls: 'blk' }))),
        'skills.txt': { type: 'file', render: () => skillLines() },
        'experience.txt': { type: 'file', render: () => experienceLines() },
        'education.txt': { type: 'file', render: () => educationLines() },
        'contact.txt': { type: 'file', render: () => contactLines() },
        'resume.pdf': { type: 'file', render: () => resumeLines() },
        'projects': {
            type: 'dir',
            children: Object.fromEntries(DATA.projects.map(p => [p.slug, {
                type: 'dir',
                children: { 'README.md': { type: 'file', render: () => projectLines(p) } }
            }]))
        },
        'certs': {
            type: 'dir',
            children: Object.fromEntries(DATA.certs.map(c => [`${c.slug}.txt`, {
                type: 'file',
                render: () => certLines(c)
            }]))
        }
    }
};

let cwd = [];

function nodeAt(segs) {
    let node = root;
    for (const seg of segs) {
        if (node.type !== 'dir' || !node.children[seg]) return null;
        node = node.children[seg];
    }
    return node;
}

function resolvePath(input) {
    let segs;
    let parts;
    const raw = input.trim();

    if (raw === '' ) return { segs: cwd.slice(), node: nodeAt(cwd) };
    if (raw === '~' || raw === '/') return { segs: [], node: root };

    if (raw.startsWith('~/')) { segs = []; parts = raw.slice(2).split('/'); }
    else if (raw.startsWith('/')) { segs = []; parts = raw.slice(1).split('/'); }
    else { segs = cwd.slice(); parts = raw.split('/'); }

    for (const part of parts) {
        if (!part || part === '.') continue;
        if (part === '..') { segs.pop(); continue; }
        segs.push(part);
    }

    const node = nodeAt(segs);
    return node ? { segs, node } : null;
}

const pathLabel = (segs) => segs.length ? `~/${segs.join('/')}` : '~';

/* ═══════════════════════ dom + printing ═══════════════════════ */

const screen = document.getElementById('screen');
const output = document.getElementById('output');
const mirror = document.getElementById('mirror');
const ps1El = document.getElementById('ps1');
const input = document.getElementById('cmdline');
const form = document.getElementById('inputline');
const toggle = document.getElementById('modeToggle');

const esc = (s) => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const sleep = (ms) => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));

let busy = false;
let abort = false;

function append(html, cls = '') {
    const el = document.createElement('div');
    if (cls) el.className = cls;
    el.innerHTML = html;
    output.appendChild(el);
    scrollDown();
    return el;
}

function scrollDown() {
    screen.scrollTop = screen.scrollHeight;
}


function print(lines) {
    for (const line of [].concat(lines)) {
        if (line === null || line === undefined) continue;
        if (typeof line === 'string') { append(esc(line) || '&nbsp;'); continue; }
        const body = line.html !== undefined ? line.html : (esc(line.text) || '&nbsp;');
        append(body, line.cls || '');
    }
}

function promptHtml() {
    return `<span class="u">${DATA.user}@${DATA.host}</span>:<span class="p">${pathLabel(cwd)}</span>$`;
}

function renderPrompt() {
    ps1El.innerHTML = promptHtml();
    document.querySelector('.tb-right').textContent = pathLabel(cwd);
}

function echoCommand(raw) {
    append(`${promptHtml()} ${esc(raw)}`, 'echo');
}

async function type(text, cls = '') {
    const el = append('', cls);
    if (reduceMotion) { el.textContent = text; scrollDown(); return; }
    for (let i = 0; i < text.length; i++) {
        el.textContent += text[i];
        if (i % 3 === 0) await sleep(8);
    }
    scrollDown();
}

/* ═══════════════════════ content renderers ═══════════════════════ */

function skillLines() {
    const out = [];
    DATA.skills.forEach(g => {
        out.push({ html: `<span class="acc">${esc(g.group)}</span>` });
        out.push({ html: g.items.map(i => `  ${esc(i)}`).join('\n'), cls: 'blk' });
    });
    return out;
}

function experienceLines() {
    const out = [];
    DATA.experience.forEach(x => {
        out.push({ html: `<span class="acc">${esc(x.role)}</span> <span class="dim">— ${esc(x.org)} · ${esc(x.dates)}</span>` });
        out.push({ html: x.points.map(pt => `  · ${esc(pt)}`).join('\n'), cls: 'blk' });
    });
    return out;
}

function educationLines() {
    return DATA.education.map(e => ({
        html: `<span class="acc">${esc(e.school)}</span>\n  <span class="dim">${esc(e.detail)}</span>`, cls: 'blk'
    }));
}

function certMeta(c) {
    return c.inProgress ? `${c.org} · in progress · ${c.kind}` : `${c.org} · ${c.year} · ${c.kind}`;
}

function projectLinks(p, labels) {
    const links = [];
    if (p.demo) links.push(`<a href="${p.demo}" target="_blank" rel="noopener">${labels[0]}</a>`);
    if (p.code) links.push(`<a href="${p.code}" target="_blank" rel="noopener">${labels[1]}</a>`);
    return links;
}

function contactLines() {
    return [{
        html: `<dl class="kv">
      <dt>email</dt><dd><a href="mailto:${DATA.email}">${DATA.email}</a></dd>
      <dt>github</dt><dd><a href="${DATA.github}" target="_blank" rel="noopener">${DATA.github.replace('https://', '')}</a></dd>
      <dt>linkedin</dt><dd><a href="${DATA.linkedin}" target="_blank" rel="noopener">${DATA.linkedin.replace('https://www.', '')}</a></dd>
      <dt>resume</dt><dd><a href="${DATA.resume}" target="_blank" rel="noopener">Andy Apaez Resume.pdf</a></dd>
    </dl>` },
        { html: `<span class="dim">Fastest path: <span class="acc">open email</span> — or just type <span class="acc">sudo hire andy</span>.</span>`, cls: 'blk' }
    ];
}

function resumeLines() {
    return [
        { html: `<span class="dim">%PDF-1.7 … 112 KB of binary withheld for your safety.</span>` },
        { html: `<span class="dim">Rendering human-readable version:</span>`, cls: 'blk' },
        { html: `<span class="b">${esc(DATA.name)}</span> — ${esc(DATA.role)}, ${esc(DATA.focus)}` },
        { text: '' },
        { html: `<span class="acc">Certifications</span>` },
        { html: DATA.certs.map(c => `  ${esc(c.inProgress ? 'now' : c.year)}  ${esc(c.name)} — ${esc(c.org)}${c.inProgress ? ' (in progress)' : ''}`).join('\n'), cls: 'blk' },
        { html: `<span class="acc">Education</span>` },
        { html: DATA.education.map(e => `  ${esc(e.school)} — ${esc(e.detail)}`).join('\n'), cls: 'blk' },
        { html: `<span class="acc">Experience</span>` },
        { html: DATA.experience.map(x => `  ${esc(x.dates)}  ${esc(x.role)} — ${esc(x.org)}`).join('\n'), cls: 'blk' },
        { html: `<span class="acc">Selected projects</span>` },
        { html: DATA.projects.slice(0, 3).map(p => `  ${esc(p.name)} — ${esc(p.blurb)}`).join('\n'), cls: 'blk' },
        { html: `<span class="acc">Skills</span>` },
        { html: DATA.skills.map(g => `  ${esc(g.group)}: ${esc(g.items.join(', '))}`).join('\n'), cls: 'blk' },
        { html: `Full PDF: <a href="${DATA.resume}" target="_blank" rel="noopener">Andy Apaez Resume.pdf</a> <span class="dim">(or run <span class="acc">resume</span> to open it)</span>`, cls: 'blk' }
    ];
}

function projectLines(p) {
    const links = projectLinks(p, ['live demo', 'source']);
    const meta = [p.status, p.year, ...p.tags].filter(Boolean);
    const out = [
        { html: `<span class="b"># ${esc(p.name)}</span>` },
        { html: `<span class="dim">${esc(meta.join(' · '))}</span>`, cls: 'blk' },
        { text: p.desc, cls: 'blk' }
    ];
    if (links.length) {
        out.push({ html: links.join('  ·  '), cls: 'blk' });
        out.push({ html: `<span class="dim">Shortcut: <span class="acc">open ${esc(p.slug)}</span></span>`, cls: 'blk' });
    }
    return out;
}

function certLines(c) {
    return [
        { html: `<span class="b">${esc(c.name)}</span>` },
        { html: `<span class="dim">${esc(certMeta(c))}</span>`, cls: 'blk' },
        { text: c.desc, cls: 'blk' }
    ];
}

/* ═══════════════════════ commands ═══════════════════════ */

const HELP_GROUPS = [
    {
        title: 'start here', items: [
            ['whoami', 'who I am, in one screen'],
            ['projects', 'what I have built'],
            ['skills', 'languages and tools'],
            ['experience', 'where I have worked'],
            ['certs', 'certifications'],
            ['resume', 'open the PDF'],
            ['contact', 'every way to reach me'],
            ['gui', 'leave the terminal, see the normal site']
        ]
    },
    
    /* change this later */
    {
        title: 'poke around', items: [
            ['ls [-a] [path]', 'list files'],
            ['cd <path>', 'change directory'],
            ['cat <file>', 'read a file'],
            ['pwd', 'where am I'],
            ['tree', 'the whole filesystem at once'],
            ['open <target>', 'open a project, link, or the resume'],
            ['man <cmd>', 'what a command does']
        ]
    },
    {
        title: 'shell things', items: [
            ['history', 'commands you have run'],
            ['theme <name>', 'green · amber · blue · mono'],
            ['clear', 'wipe the screen (Ctrl+L)'],
            ['neofetch', 'system info, portfolio edition'],
            ['banner', 'big letters']
        ]
    },
    {
        title: 'not strictly necessary', items: [
            ['sudo hire andy', 'the important one'],
            ['fortune', 'unsolicited wisdom'],
            ['coffee', 'fuel'],
            ['matrix', 'you know the one'],
            ['vim', 'enter, then panic'],
            ['sl', 'a train. really.']
        ]
    }
];

const commands = {};
const def = (name, desc, run, opts = {}) => {
    commands[name] = { name, desc, run, usage: opts.usage || name, hidden: opts.hidden || false };
};

def('help', 'list every command', () => {
    print([{ html: `<span class="dim">andysh built-ins. Tab completes, ↑ recalls.</span>`, cls: 'blk' }]);
    HELP_GROUPS.forEach(group => {
        const rows = group.items
            .map(([cmd, desc]) => `<div class="help-row"><span>${esc(cmd)}</span><span class="dim">${esc(desc)}</span></div>`)
            .join('');
        append(`<h4>${esc(group.title)}</h4>${rows}`, 'help-grp');
    });
    print([{ html: `<span class="dim">In a hurry? <span class="acc">resume</span>, or hit the GUI mode button.</span>`, cls: 'blk' }]);
});

def('whoami', 'short bio', () => {
    print([
        { html: `<span class="b">${esc(DATA.name)}</span> <span class="dim">— ${esc(DATA.role)}</span>` },
        { html: `<span class="dim">${esc(DATA.focus)}</span>`, cls: 'blk' },
        { text: DATA.tagline, cls: 'blk' },
        {
            html: `<dl class="kv">
      <dt>based in</dt><dd>${esc(DATA.location)}</dd>
      <dt>studying</dt><dd>Computer Technology (A.A.S.) at CUNY College of Staten Island</dd>
      <dt>building</dt><dd>a threat-intelligence pipeline (Redpanda → Vector → OpenSearch → Grafana)</dd>
      <dt>certified</dt><dd>${earnedCerts().map(c => esc(c.short)).join(', ')} · Security+ in progress</dd>
      <dt>goal</dt><dd>security engineer</dd>
      <dt>open to</dt><dd>internships, collaboration, interesting problems</dd>
    </dl>`
        },
        { html: `<span class="dim">Next: <span class="acc">projects</span> · <span class="acc">skills</span> · <span class="acc">resume</span></span>`, cls: 'blk' }
    ]);
});

def('about', 'longer bio', () => print(DATA.about.map(p => ({ text: p, cls: 'blk' }))));

def('projects', 'list projects', (args) => {
    if (args[0]) {
        const p = findProject(args[0]);
        if (!p) return print([{ html: `<span class="err">projects: no such project: ${esc(args[0])}</span>` }]);
        return print(projectLines(p));
    }
    DATA.projects.forEach(p => {
        const links = projectLinks(p, ['demo', 'code']).join(' · ');
        const status = p.status ? ` <span class="warn">[${esc(p.status)}]</span>` : '';
        append(
            `<span class="acc">${esc(p.name)}</span>${status} <span class="dim">— ${esc(p.tags.join(', '))}</span>\n` +
            `  ${esc(p.blurb)}\n  ${links ? links + ' <span class="dim">· </span>' : ''}<span class="dim">cat projects/${esc(p.slug)}/README.md</span>`,
            'blk'
        );
    });
    print([{ html: `<span class="dim">${DATA.projects.length} shown · <a href="${DATA.repos}" target="_blank" rel="noopener">all repositories</a></span>`, cls: 'blk' }]);
}, { usage: 'projects [slug]' });

def('skills', 'languages and tools', () => print(skillLines()));

def('certs', 'certifications', () => {
    DATA.certs.forEach(c => append(
        `<span class="acc">${esc(c.name)}</span>\n  <span class="dim">${esc(certMeta(c))}</span>\n  ${esc(c.desc)}`,
        'blk'
    ));
});

def('experience', 'work history', () => print(experienceLines()));

def('education', 'school', () => print(educationLines()));

def('contact', 'how to reach me', () => print(contactLines()));

def('email', 'open a draft email', () => {
    print([{ html: `Opening <a href="mailto:${DATA.email}">${DATA.email}</a> …` }]);
    window.location.href = `mailto:${DATA.email}`;
});

def('resume', 'open the resume PDF', () => {
    print([{ html: `Opening <a href="${DATA.resume}" target="_blank" rel="noopener">Andy Apaez Resume.pdf</a> in a new tab …` }]);
    window.open(DATA.resume, '_blank', 'noopener');
});

def('ls', 'list directory contents', (args) => {
    const flags = args.filter(a => a.startsWith('-'));
    const target = args.find(a => !a.startsWith('-')) || '';
    const all = flags.some(f => f.includes('a'));

    const res = resolvePath(target);
    if (!res) return print([{ html: `<span class="err">ls: ${esc(target)}: No such file or directory</span>` }]);
    if (res.node.type === 'file') return print([{ text: target }]);

    const names = Object.keys(res.node.children).filter(n => all || !res.node.children[n].hidden);
    if (!names.length) return print([{ html: `<span class="dim">(empty)</span>` }]);

    const cells = names.sort().map(n => {
        const isDir = res.node.children[n].type === 'dir';
        return `<span>${isDir ? `<span class="acc">${esc(n)}/</span>` : esc(n)}</span>`;
    }).join('');
    append(cells, 'cols');
}, { usage: 'ls [-a] [path]' });

def('cd', 'change directory', (args) => {
    const target = args[0] || '~';
    const res = resolvePath(target);
    if (!res) return print([{ html: `<span class="err">cd: ${esc(target)}: No such file or directory</span>` }]);
    if (res.node.type !== 'dir') return print([{ html: `<span class="err">cd: ${esc(target)}: Not a directory</span>` }]);
    cwd = res.segs;
    renderPrompt();
}, { usage: 'cd <path>' });

def('pwd', 'print working directory', () => print([{ text: pathLabel(cwd) }]));

def('cat', 'print a file', (args) => {
    if (!args.length) return print([{ html: `<span class="dim">usage: cat &lt;file&gt; — try <span class="acc">cat about.txt</span></span>` }]);
    args.forEach(target => {
        const res = resolvePath(target);
        if (!res) return print([{ html: `<span class="err">cat: ${esc(target)}: No such file or directory</span>` }]);
        if (res.node.type === 'dir') return print([{ html: `<span class="err">cat: ${esc(target)}: Is a directory</span>` }]);
        print(res.node.render());
    });
}, { usage: 'cat <file>' });

def('tree', 'show the whole filesystem', () => {
    const lines = ['~'];
    const walk = (node, prefix) => {
        const names = Object.keys(node.children).filter(n => !node.children[n].hidden).sort();
        names.forEach((name, i) => {
            const last = i === names.length - 1;
            const child = node.children[name];
            const isDir = child.type === 'dir';
            lines.push(`${prefix}${last ? '└── ' : '├── '}${name}${isDir ? '/' : ''}`);
            if (isDir) walk(child, prefix + (last ? '    ' : '│   '));
        });
    };
    walk(root, '');
    append(esc(lines.join('\n')), 'blk');
});

def('open', 'open a project, link, or file', (args) => {
    const targets = {
        github: DATA.github, repos: DATA.repos, linkedin: DATA.linkedin,
        resume: DATA.resume, email: `mailto:${DATA.email}`
    };
    const key = (args[0] || '').toLowerCase();
    if (!key) return print([{ html: `<span class="dim">usage: open &lt;project|github|linkedin|resume|email&gt;</span>` }]);

    if (targets[key]) {
        print([{ html: `Opening <span class="str">${esc(key)}</span> …` }]);
        if (key === 'email') window.location.href = targets[key];
        else window.open(targets[key], '_blank', 'noopener');
        return;
    }

    const p = findProject(key);
    if (!p) return print([{ html: `<span class="err">open: unknown target: ${esc(key)}</span>` }]);
    const url = p.demo || p.code;
    if (!url) return print([{ html: `<span class="dim">${esc(p.name)} has no public link yet — try <span class="acc">projects ${esc(p.slug)}</span>.</span>` }]);
    print([{ html: `Opening <span class="str">${esc(p.name)}</span> ${p.demo ? 'demo' : 'source'} …` }]);
    window.open(url, '_blank', 'noopener');
}, { usage: 'open <target>' });

def('man', 'describe a command', (args) => {
    const c = commands[(args[0] || '').toLowerCase()];
    if (!c) return print([{ html: `<span class="err">No manual entry for ${esc(args[0] || '')}</span>` }]);
    print([
        { html: `<span class="b">${esc(c.name.toUpperCase())}</span><span class="dim">(1)</span>` },
        { html: `  <span class="acc">${esc(c.usage)}</span>` },
        { text: `  ${c.desc}`, cls: 'blk' }
    ]);
}, { usage: 'man <command>' });

def('history', 'show command history', () => {
    if (!history.length) return print([{ html: `<span class="dim">(nothing yet)</span>` }]);
    append(history.map((h, i) => `<span class="dim">${String(i + 1).padStart(3)}</span>  ${esc(h)}`).join('\n'), 'blk');
});

def('clear', 'clear the screen', () => { output.innerHTML = ''; });

def('theme', 'switch color scheme', (args) => {
    const pick = (args[0] || '').toLowerCase();
    if (!THEMES.includes(pick)) {
        return print([{ html: `<span class="dim">usage: theme &lt;${THEMES.join('|')}&gt; — current: <span class="acc">${document.body.dataset.theme}</span></span>` }]);
    }
    document.body.dataset.theme = pick;
    try { localStorage.setItem('andysh:theme', pick); } catch (e) { /* private mode */ }
    print([{ html: `Theme set to <span class="acc">${esc(pick)}</span>.` }]);
}, { usage: 'theme <green|amber|blue|mono>' });

def('banner', 'big letters', () => {
    append(esc(BANNER), 'ascii');
    print([{ html: `<span class="dim">${esc(DATA.role)} · ${esc(DATA.focus)}</span>`, cls: 'blk' }]);
});
 /* UPDATE LATER */
def('neofetch', 'system info', () => {
    const logo = [
        '        ▄▄▄▄▄        ',
        '     ▄██████████▄    ',
        '   ▄████▀    ▀████▄  ',
        '  ████▀   ▄▄   ▀████ ',
        ' ████    ████    ████',
        ' ████   ██████   ████',
        ' ████  ████████  ████',
        ' ▀███▄▄▀      ▀▄▄███▀',
        '   ▀██████████████▀  '
    ];
    const info = [
        ['', `<span class="acc b">${DATA.user}@${DATA.host}</span>`],
        ['', '<span class="dim">─────────────────────</span>'],
        ['OS', 'PortfolioOS 2.0 (terminal edition)'],
        ['Shell', 'andysh 2.0.1'],
        ['Location', DATA.location],
        ['Packages', `${DATA.projects.length} projects`],
        ['Certs', `${earnedCerts().length} (${earnedCerts().map(c => c.short).join(', ')}) + Security+ in progress`],
        ['Languages', 'Python, JS/TS, SQL, C++'],
        ['Editor', 'VS Code'],
        ['Theme', document.body.dataset.theme],
        ['Status', '<span class="acc">available for hire</span>']
    ];
    const rows = Math.max(logo.length, info.length);
    let html = '';
    for (let i = 0; i < rows; i++) {
        const l = (logo[i] || '').padEnd(21, ' ');
        const pair = info[i];
        const right = pair ? (pair[0] ? `<span class="acc">${pair[0]}</span>: ${pair[1]}` : pair[1]) : '';
        html += `<span class="acc">${esc(l)}</span>  ${right}\n`;
    }
    append(html, 'blk');
});

def('fortune', 'unsolicited wisdom', () => {
    print([{ html: `<span class="dim">"</span>${esc(FORTUNES[Math.floor(Math.random() * FORTUNES.length)])}<span class="dim">"</span>` }]);
});

def('date', 'current date', () => print([{ text: new Date().toString() }]));

def('echo', 'print text', (args) => print([{ text: args.join(' ') }]));

def('coffee', 'brew a cup', async () => {
    await staged([
        ['Grinding beans', 'ok'],
        ['Heating water', 'ok'],
        ['Brewing', 'ok']
    ]);
    append(esc([
        '      ( (',
        '       ) )',
        '    ........',
        '    |      |]',
        '    \\      /',
        '     `----\''
    ].join('\n')), 'blk');
    print([{ html: `<span class="dim">Purely decorative. The productivity is real though.</span>` }]);
});

def('matrix', 'digital rain', async () => {
    if (reduceMotion) return print([{ html: `<span class="dim">(animation skipped — reduced motion is on)</span>` }]);
    const rows = 12, cols = 46;
    const chars = 'アイウエオカキクケコサシスセソ01001011ANDYAPAEZ';
    const el = append('', 'blk');
    el.style.color = 'var(--accent)';
    const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * rows));

    for (let frame = 0; frame < 44 && !abort; frame++) {
        const grid = Array.from({ length: rows }, () => new Array(cols).fill(' '));
        drops.forEach((d, c) => {
            for (let t = 0; t < 4; t++) {
                const r = d - t;
                if (r >= 0 && r < rows) grid[r][c] = chars[Math.floor(Math.random() * chars.length)];
            }
            drops[c] = d + 1 > rows + 4 ? 0 : d + 1;
        });
        el.textContent = grid.map(r => r.join('')).join('\n');
        await sleep(70);
    }
    print([{ html: `<span class="dim">…there is no spoon. Try <span class="acc">whoami</span>.</span>` }]);
});

def('vim', 'a trap', () => {
    print([
        { html: `<span class="dim">~ opening vim …</span>` },
        { html: `You are now inside vim. Classic mistake.`, cls: 'blk' },
        { html: `<span class="dim">Type <span class="acc">:q</span> to escape. Or <span class="acc">:wq</span>. Or close the tab, I don't judge.</span>` }
    ]);
});

def(':q', 'escape vim', () => print([{ html: `<span class="acc">Escaped.</span> <span class="dim">Few manage it on the first try.</span>` }]));
commands[':wq'] = { ...commands[':q'], name: ':wq' };
commands[':q!'] = { ...commands[':q'], name: ':q!' };

def('sl', 'a train', async () => {
    const train = [
        '      ====        ________',
        '  _D _|  |_______/        \\__I_I_____',
        '   |(_)---  |   H\\________/ |   |',
        '   /     |  |   H  |  |     |   |',
        '  |      |  |   H  |__--------------|',
        '  | ________|___H__/__|_____/[][]~\\_|',
        '  |/ |   |-----------I_____I [][] []  D',
        '__/ =| o |=-O=====O=====O=====O   \\ ____'
    ];
    const el = append('', 'blk');
    el.style.whiteSpace = 'pre';
    for (let pad = 26; pad >= 0 && !abort; pad -= 2) {
        el.textContent = train.map(l => ' '.repeat(pad) + l).join('\n');
        await sleep(55);
    }
    print([{ html: `<span class="dim">You typed it wrong, but the train came anyway.</span>` }]);
});

def('sudo', 'elevate privileges', async (args) => {
    const rest = args.join(' ').toLowerCase();

    if (/^hire\s+andy/.test(rest) || rest === 'hire') {
        await staged([
            ['Verifying references', 'ok'],
            ['Reviewing GitHub', 'ok'],
            ['Checking certifications', `${earnedCerts().length} earned, ${DATA.certs.length - earnedCerts().length} in progress`],
            ['Negotiating salary', 'pizza accepted'],
            ['Provisioning workstation', 'ok']
        ]);
        append(esc([
            '█   █ ███ ████  █████ ████ ',
            '█   █  █  █   █ █     █   █',
            '█████  █  ████  ████  █   █',
            '█   █  █  █   █ █     █   █',
            '█   █ ███ █   █ █████ ████ '
        ].join('\n')), 'ascii');
        print([
            { html: `<span class="acc">Andy has been added to your team.</span>`, cls: 'blk' },
            {
                html: `One step left — make it official:<br>` +
                    `<a href="mailto:${DATA.email}">${DATA.email}</a> · ` +
                    `<a href="${DATA.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · ` +
                    `<a href="${DATA.resume}" target="_blank" rel="noopener">Resume</a>`, cls: 'blk'
            }
        ]);
        return;
    }

    if (/rm\s+-rf/.test(rest)) return commands['rm'].run(['-rf', '/']);

    print([
        { html: `<span class="dim">[sudo] password for ${DATA.user}:</span>` },
        { html: `<span class="err">Sorry, try again.</span>` },
        { html: `<span class="err">${DATA.user} is not in the sudoers file. This incident has been reported.</span>` },
        { html: `<span class="dim">The only privileged command here is <span class="acc">sudo hire andy</span>.</span>`, cls: 'blk' }
    ]);
}, { usage: 'sudo <command>' });

def('hire', 'the important one', () => {
    print([{ html: `<span class="dim">Permission denied. This one needs root — try <span class="acc">sudo hire andy</span>.</span>` }]);
});

def('rm', 'delete things', async (args) => {
    const joined = args.join(' ');
    if (!/-rf/.test(joined)) return print([{ html: `<span class="err">rm: this filesystem is read-only. Nice try.</span>` }]);
    await staged([
        ['Deleting /projects', 'gone'],
        ['Deleting /certs', 'gone'],
        ['Deleting portfolio', 'gone']
    ], 220);
    await sleep(320);
    print([
        { html: `<span class="warn">…restoring from backup.</span>` },
        { html: `<span class="acc">Everything is fine.</span> <span class="dim">Version control is a lifestyle.</span>`, cls: 'blk' }
    ]);
}, { usage: 'rm -rf /' });

def('gui', 'switch to the GUI site', () => {
    print([{ html: `<span class="dim">Loading graphical interface …</span>` }]);
    setTimeout(() => setMode('gui'), reduceMotion ? 0 : 260);
});
commands['exit'] = { ...commands['gui'], name: 'exit', desc: 'leave the shell' };
commands['logout'] = { ...commands['gui'], name: 'logout', desc: 'leave the shell', hidden: true };

def('ping', 'check if I am around', async () => {
    for (let i = 0; i < 3 && !abort; i++) {
        print([{ text: `64 bytes from andy.dev: icmp_seq=${i + 1} ttl=64 time=${(Math.random() * 12 + 2).toFixed(1)} ms` }]);
        await sleep(280);
    }
    print([{ html: `<span class="dim">3 packets transmitted, 3 received, 0% packet loss — I'm around.</span>`, cls: 'blk' }]);
}, { hidden: true });

/* helpers used by commands */

function findProject(key) {
    const k = key.toLowerCase().replace(/\/$/, '');
    return DATA.projects.find(p => p.slug === k || p.name.toLowerCase() === k);
}

async function staged(steps, delay = 170) {
    const width = Math.max(...steps.map(s => s[0].length)) + 3;
    for (const [label, result] of steps) {
        if (abort) return;
        const el = append(`${esc(label)}${esc('.'.repeat(width - label.length))} <span class="dim">…</span>`);
        await sleep(delay);
        el.innerHTML = `${esc(label)}${esc('.'.repeat(width - label.length))} <span class="acc">${esc(result)}</span>`;
        scrollDown();
    }
    append('&nbsp;');
}

/* ═══════════════════════ input handling ═══════════════════════ */

const history = [];
let histIdx = -1;
let draft = '';

function updateMirror() {
    const value = input.value;
    const pos = input.selectionStart ?? value.length;
    const before = value.slice(0, pos);
    const rest = value.slice(pos);
    const ghost = rest ? '' : currentGhost();

    let at, after, trailing = '';
    if (rest) {
        at = rest[0];
        after = rest.slice(1);
    } else if (ghost) {
        at = ghost[0];
        after = '';
        trailing = `<span class="ghost">${esc(ghost.slice(1))}</span>`;
    } else {
        at = ' ';
        after = '';
    }

    const cursorCls = (!rest && ghost) ? 'cur ghost-cur' : 'cur';
    mirror.innerHTML = `${esc(before)}<span class="${cursorCls}">${esc(at)}</span>${esc(after)}${trailing}`;
}

/* the dim text trailing the cursor — what Tab or → would accept */
function currentGhost() {
    if (menu) return '';
    const ctx = completionContext();
    if (!ctx.editing || !ctx.matches.length) return '';
    const best = ctx.matches.length === 1 ? ctx.matches[0] : commonPrefix(ctx.matches);
    return best.length > ctx.editing.length ? best.slice(ctx.editing.length) : '';
}

async function runLine(raw) {
    const line = raw.trim();
    echoCommand(raw);
    if (!line) return;

    history.push(line);
    histIdx = history.length;

    const parts = line.split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);
    const cmd = commands[name];

    if (!cmd) {
        print([
            { html: `<span class="err">andysh: command not found: ${esc(parts[0])}</span>` },
            { html: `<span class="dim">${suggest(name)}</span>`, cls: 'blk' }
        ]);
        return;
    }

    busy = true;
    abort = false;
    document.body.classList.add('busy');
    try {
        await cmd.run(args, line);
    } catch (err) {
        print([{ html: `<span class="err">andysh: ${esc(name)} crashed: ${esc(err.message)}</span>` }]);
    } finally {
        busy = false;
        document.body.classList.remove('busy');
        scrollDown();
    }
}

function suggest(name) {
    const near = Object.keys(commands).filter(c => !commands[c].hidden &&
        (c.startsWith(name[0]) || c.includes(name) || name.includes(c)));
    return near.length
        ? `Did you mean: ${near.slice(0, 4).join(', ')}? Type help for the full list.`
        : `Type help to see what this shell understands.`;
}

/* ── tab completion ── */

const PATH_ARG = new Set(['cd', 'ls', 'cat']);
const THEMES = ['green', 'amber', 'blue', 'mono'];

function completionCandidates(tokens, editing) {
    if (tokens.length <= 1) {
        return Object.keys(commands).filter(c => !commands[c].hidden && c.startsWith(editing)).sort();
    }

    const cmd = tokens[0].toLowerCase();

    if (cmd === 'theme') return THEMES.filter(t => t.startsWith(editing));
    if (cmd === 'man') return Object.keys(commands).filter(c => !commands[c].hidden && c.startsWith(editing)).sort();
    if (cmd === 'open') {
        return ['github', 'repos', 'linkedin', 'resume', 'email', ...DATA.projects.map(p => p.slug)]
            .filter(t => t.startsWith(editing));
    }
    if (cmd === 'projects') return DATA.projects.map(p => p.slug).filter(t => t.startsWith(editing));

    if (PATH_ARG.has(cmd)) {
        const slash = editing.lastIndexOf('/');
        const dirPart = slash === -1 ? '' : editing.slice(0, slash + 1);
        const leaf = slash === -1 ? editing : editing.slice(slash + 1);
        const res = resolvePath(dirPart || '.');
        if (!res || res.node.type !== 'dir') return [];
        return Object.keys(res.node.children)
            .filter(n => n.startsWith(leaf) && (!res.node.children[n].hidden || leaf.startsWith('.')))
            .sort()
            .map(n => dirPart + n + (res.node.children[n].type === 'dir' ? '/' : ''));
    }

    return [];
}

function commonPrefix(list) {
    if (!list.length) return '';
    let prefix = list[0];
    for (const item of list.slice(1)) {
        while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    return prefix;
}

function describeCandidate(tokens, cand) {
    const cmd = tokens.length <= 1 ? null : tokens[0].toLowerCase();
    const bare = cand.replace(/\/$/, '');

    if (!cmd || cmd === 'man') return commands[bare] ? commands[bare].desc : '';
    if (cmd === 'theme') return 'color scheme';
    if (cmd === 'projects' || cmd === 'open') {
        const p = DATA.projects.find(x => x.slug === bare);
        if (p) return p.blurb;
        return {
            github: 'my GitHub profile', repos: 'every repository',
            linkedin: 'my LinkedIn', resume: 'the PDF', email: 'compose a message'
        }[bare] || '';
    }
    return cand.endsWith('/') ? 'directory' : 'file';
}

function completionContext() {
    const value = input.value;
    const pos = input.selectionStart ?? value.length;
    const head = value.slice(0, pos);
    const tail = value.slice(pos);
    const tokens = head.split(/\s+/);
    const editing = tokens[tokens.length - 1];
    return {
        value, tail, tokens, editing,
        tokenStart: head.length - editing.length,
        matches: completionCandidates(tokens, editing)
    };
}

function applyCandidate(ctx, candidate, addSpace) {
    const done = candidate + (addSpace && !candidate.endsWith('/') ? ' ' : '');
    const replaced = ctx.value.slice(0, ctx.tokenStart) + done;
    input.value = replaced + ctx.tail;
    input.setSelectionRange(replaced.length, replaced.length);
}

/* ── the completion menu (zsh-style: cycle with Tab, arrows, or click) ── */

let menu = null;

function openMenu(ctx, typed) {
    menu = { ctx, typed, index: -1 };
    const el = document.createElement('div');
    el.className = 'menu';
    el.innerHTML = ctx.matches.map((m, i) => {
        const desc = describeCandidate(ctx.tokens, m);
        return `<button type="button" class="menu-item" data-i="${i}">` +
            `<span class="mi-name">${esc(m)}</span>` +
            `<span class="mi-desc">${esc(desc)}</span></button>`;
    }).join('') +
        `<div class="menu-hint">Tab / arrows to cycle · Enter to accept · Esc to cancel</div>`;

    el.addEventListener('mousedown', (e) => {
        const item = e.target.closest('.menu-item');
        if (!item) return;
        e.preventDefault();
        moveMenu(Number(item.dataset.i), true);
        closeMenu(true);
        input.focus();
    });

    screen.insertBefore(el, form);
    menu.el = el;
    scrollDown();
}

function moveMenu(index, absolute = false) {
    if (!menu) return;
    const total = menu.ctx.matches.length;
    menu.index = absolute ? index : ((index % total) + total) % total;
    applyCandidate(menu.ctx, menu.ctx.matches[menu.index], false);
    updateMirror();

    menu.el.querySelectorAll('.menu-item').forEach((item, i) =>
        item.classList.toggle('on', i === menu.index));
    const active = menu.el.querySelector('.menu-item.on');
    if (active) active.scrollIntoView({ block: 'nearest' });
}

function closeMenu(keep) {
    if (!menu) return;
    const { ctx, typed, index } = menu;
    menu.el.remove();
    menu = null;

    if (keep && index >= 0) applyCandidate(ctx, ctx.matches[index], true);
    else if (!keep) {
        input.value = typed.value;
        input.setSelectionRange(typed.pos, typed.pos);
    }
    updateMirror();
}

function handleTab(shift) {
    if (menu) {
        moveMenu(menu.index + (shift ? -1 : 1));
        return;
    }

    const ctx = completionContext();
    if (!ctx.matches.length) return;

    if (ctx.matches.length === 1) {
        applyCandidate(ctx, ctx.matches[0], true);
        updateMirror();
        return;
    }

    const typed = { value: input.value, pos: input.selectionStart ?? input.value.length };
    const prefix = commonPrefix(ctx.matches);
    if (prefix.length > ctx.editing.length) applyCandidate(ctx, prefix, false);

    openMenu(completionContext(), typed);
    updateMirror();
}

/* ── keys ── */

input.addEventListener('input', updateMirror);
input.addEventListener('click', updateMirror);
input.addEventListener('keyup', updateMirror);

input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        handleTab(e.shiftKey);
        return;
    }

    if (menu) {
        if (e.key === 'Enter') { e.preventDefault(); closeMenu(true); return; }
        if (e.key === 'Escape') { e.preventDefault(); closeMenu(false); return; }
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault(); moveMenu(menu.index + 1); return;
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault(); moveMenu(menu.index - 1); return;
        }
        if (e.key.length === 1 || e.key === 'Backspace') closeMenu(menu.index >= 0);
    }

    /* → at the end of the line accepts the ghost suggestion */
    if (e.key === 'ArrowRight' && input.selectionStart === input.value.length && currentGhost()) {
        e.preventDefault();
        const ctx = completionContext();
        const best = ctx.matches.length === 1 ? ctx.matches[0] : commonPrefix(ctx.matches);
        applyCandidate(ctx, best, ctx.matches.length === 1);
        updateMirror();
        return;
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!history.length) return;
        if (histIdx === history.length) draft = input.value;
        histIdx = Math.max(0, histIdx - 1);
        input.value = history[histIdx];
        input.setSelectionRange(input.value.length, input.value.length);
        updateMirror();
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx >= history.length) return;
        histIdx++;
        input.value = histIdx === history.length ? draft : history[histIdx];
        input.setSelectionRange(input.value.length, input.value.length);
        updateMirror();
        return;
    }

    if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        output.innerHTML = '';
        return;
    }

    if (e.ctrlKey && (e.key === 'c' || e.key === 'C') && !window.getSelection().toString()) {
        e.preventDefault();
        abort = true;
        queue.length = 0;
        echoCommand(input.value + '^C');
        input.value = '';
        updateMirror();
        return;
    }

    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        input.value = '';
        updateMirror();
    }
});

const queue = [];

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const raw = input.value;
    input.value = '';
    updateMirror();

    queue.push(raw);
    if (busy) return;
    while (queue.length) await runLine(queue.shift());
});

/* tapping anywhere in the screen focuses the prompt */
screen.addEventListener('pointerup', () => {
    if (!window.getSelection().toString()) input.focus();
});

/* ═══════════════════════ GUI mode ═══════════════════════ */

const guiView = document.getElementById('guiView');
const terminalView = document.getElementById('terminalView');

function buildGui() {
    const link = (href, label, cls = 'btn') =>
        `<a class="${cls}" href="${href}"${href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener"'}>${label}</a>`;

    document.getElementById('guiCta').innerHTML = [
        link(DATA.resume, 'Resume (PDF)', 'btn primary'),
        link(`mailto:${DATA.email}`, 'Email me'),
        link(DATA.github, 'GitHub'),
        link(DATA.linkedin, 'LinkedIn')
    ].join('');

    document.getElementById('guiStats').innerHTML = DATA.stats
        .map(s => `<li><b>${esc(s.v)}</b><span>${esc(s.l)}</span></li>`).join('');

    document.getElementById('guiProjects').innerHTML = DATA.projects.map(p => `
    <article class="card">
      ${p.status ? `<p class="meta">${esc(p.status)}</p>` : p.year ? `<p class="meta">${esc(p.year)}</p>` : ''}
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.desc)}</p>
      <ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="card-links">
        ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">Live demo →</a>` : ''}
        ${p.code ? `<a href="${p.code}" target="_blank" rel="noopener">Source →</a>` : ''}
      </div>
    </article>`).join('');

    document.getElementById('guiSkills').innerHTML = DATA.skills.map(g => `
    <div class="skill-col">
      <h3>${esc(g.group)}</h3>
      <ul>${g.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`).join('');

    document.getElementById('guiCerts').innerHTML = DATA.certs.map(c => `
    <article class="card">
      <p class="meta">${c.inProgress ? 'In progress' : esc(c.year)} · ${esc(c.kind)}</p>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.desc)}</p>
      <div class="card-links"><span class="meta">${esc(c.org)}</span></div>
    </article>`).join('');

    document.getElementById('guiExperience').innerHTML = DATA.experience.map(x => `
    <article class="card">
      <p class="meta">${esc(x.dates)}</p>
      <h3>${esc(x.role)}</h3>
      <p>${x.points.map(esc).join(' ')}</p>
      <div class="card-links"><span class="meta">${esc(x.org)}</span></div>
    </article>`).join('') + DATA.education.map(e => `
    <article class="card">
      <p class="meta">Education</p>
      <h3>${esc(e.school)}</h3>
      <p>${esc(e.detail)}</p>
    </article>`).join('');

    document.getElementById('guiContact').innerHTML = [
        link(`mailto:${DATA.email}`, esc(DATA.email), 'btn primary'),
        link(DATA.linkedin, 'LinkedIn'),
        link(DATA.github, 'GitHub'),
        link(DATA.repos, 'All repositories')
    ].join('');
}

function setMode(mode) {
    const gui = mode === 'gui';
    document.body.dataset.mode = gui ? 'gui' : 'terminal';
    guiView.hidden = !gui;
    terminalView.hidden = gui;
    toggle.textContent = gui ? '← Terminal mode' : 'GUI mode →';
    toggle.setAttribute('aria-label', gui ? 'Switch back to the terminal interface' : 'Switch to the standard graphical site');

    if (gui) {
        window.scrollTo(0, 0);
        setHash('#gui');
    } else {
        setHash('');
        if (matchMedia('(pointer: fine)').matches) input.focus();
        scrollDown();
    }
}

function setHash(hash) {
    try { window.history.replaceState(null, '', hash || location.pathname); } catch (e) { /* file:// */ }
}

toggle.addEventListener('click', () => setMode(document.body.dataset.mode === 'gui' ? 'terminal' : 'gui'));
document.querySelectorAll('[data-goto]').forEach(btn =>
    btn.addEventListener('click', () => setMode(btn.dataset.goto)));

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.dataset.mode === 'gui') setMode('terminal');
});

/* ═══════════════════════ boot ═══════════════════════ */

async function boot() {
    const lines = [
        'andysh 2.0.1 — portfolio build 2026.09',
        '',
        'Loading profile ................ ok',
        `Mounting /projects ............. ${DATA.projects.length} found`,
        `Reading /certs ................. ${earnedCerts().length} earned, ${DATA.certs.length - earnedCerts().length} in progress`,
        'Starting coffee daemon ......... ok',
        ''
    ];

    for (const line of lines) {
        if (line === '') { append('&nbsp;'); continue; }
        await type(line, 'dim');
        await sleep(55);
    }

    append(esc(BANNER), 'ascii');

    print([
        { html: `<span class="b">${esc(DATA.name)}</span> <span class="dim">— ${esc(DATA.role)} · ${esc(DATA.focus)}</span>` },
        { text: DATA.tagline, cls: 'blk' },
        {
            html: `Type <span class="acc">help</span> for every command, or start with ` +
                `<span class="acc">whoami</span> · <span class="acc">ls projects</span> · <span class="acc">resume</span>.`
        },
        {
            html: `<span class="dim">Recruiter with 30 seconds? Hit <span class="acc">GUI mode</span> (top right) or run <span class="acc">resume</span>.</span>`,
            cls: 'blk'
        }
    ]);
}

function init() {
    try {
        const saved = localStorage.getItem('andysh:theme');
        if (saved) document.body.dataset.theme = saved;
    } catch (e) { /* private mode */ }

    buildGui();
    renderPrompt();
    updateMirror();

    if (location.hash === '#gui') setMode('gui');
    else if (matchMedia('(pointer: fine)').matches) input.focus();

    boot();
}

init();
