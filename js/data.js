const filesystemData = {
    '/': {
        files: [
            { name: 'top_level_file.txt' },
            { name: 'project_manifest.txt' },
            { name: 'encrypted_message.dat' },
            { name: 'system_status_report.log' }
        ],
        'images/': { files: [{ name: 'bash.png' }, { name: 'im_alive.png' }] }, 
        'music/': { files: [{ name: 'im_alive.mp3' }] },
        'files/': {
            files: [
                { name: 'open_message.txt' },
                { name: 'secret_message.txt' },
                { name: 'hidden_thoughts.txt' },
                { name: 'important_note.txt' },
                { name: 'lyrics_fragment.txt' },
                { name: 'technical_concept.md' },
                { name: 'emotional_core.txt' },
                { name: 'release_plan.txt' },
                { name: 'access_codes.txt.locked' }
            ],
            'archive/': { files: [{ name: 'old_protocols.txt.obsolete' }] }
        },
        'projects/': {
            files: [],
            'report/': { files: [{ name: 'final_report.txt' }, { name: 'draft.txt' }] },
            'notes/': { files: [{ name: 'meeting_notes.md' }] },
            'code/': {
                files: [
                    { name: 'song_generator.py' },
                    { name: 'midi_parser.js' },
                    { name: 'data_scrambler.py' }
                ],
                'archive/': { files: [{ name: 'old_synth_patch.fxb.backup' }] }, 
                'modules/': { files: [{ name: 'audio_processing.lib' }, { name: 'ui_elements.lib' }] } 
            },
            'artwork/': { files: [{ name: 'album_cover_draft.info' }, { name: 'logo_design.info' }] }, 
            'blueprints/': { files: [{ name: 'interface_v3.design' }, { name: 'hardware_schematics.pdf.encrypted' }] }
        },
        'documents/': {
            files: [
                { name: 'readme.md' },
                { name: 'license.txt' },
                { name: 'biography_short.txt' },
                { name: 'press_release_v1.md' },
                { name: 'manifesto_v0.1.txt' }
            ],
            'backups/': { files: [{ name: 'website_dump_20250515.sql.gz' }] }
        },
        'privacy/': { files: [{ name: 'privacy.txt' }, { name: 'legal_notice.txt' }] }, 
        'user/': {
            files: [],
            'home/': {
                files: [],
                'desktop/': { files: [] },
                'downloads/': { files: [] },
                'documents/': { files: [] },
                'music/': {
                    files: [],
                    'favorite_album/': { files: [] }
                },
                'lyrics/': { files: [{ name: 'lonely_bytes.txt' }, { name: 'escaping_the_loop.txt' }, { name: 'new_kernel_sunrise.txt' }, { name: 'broken_code_ballad.txt.encoded' }] },
                'ideas/': { files: [{ name: 'sound_experiments.txt' }, { name: 'visual_concepts.md' }, { name: 'hidden_directives.txt.gpg' }] },
                'network/': { files: [{ name: 'connection_log_20250516.txt' }, { name: 'firewall_rules.cfg' }] }
            },
            'guest/': { files: [] },
            'administrator/': { files: [{ name: 'system_credentials.key.encrypted' }] }
        },
        'system/': {
            files: [],
            'bin/': { files: [] },
            'config/': { files: [] },
            'logs/': { files: [{ name: 'system.log' }, { name: 'audio_engine.log' }, { name: 'security_audit.log.bz2' }] },
            'core/': { files: [{ name: 'kernel.sys' }, { name: 'bootloader.bin' }] },
            'temp/': { files: [{ name: 'cache_001.tmp' }, { name: 'process_3456.pid' }] }
        },
        'bots/': {
            files: [
                { name: 'lyric_generator_v2.py' },
                { name: 'social_media_bot.js' },
                { name: 'message_scrambler.py' }
            ],
            'protocols/': { files: [{ name: 'communication_standard_v1.proto' }] }
        }
    }
};

const fileContentsData = {
    'top_level_file.txt': {
        content: 'This is a message in plain text.',
        encoded: false
    },
    'open_message.txt': {
        content: 'This is a message in plain text.',
        encoded: false
    },
    'secret_message.txt': {
        content: 'VGhpcyBpcyBlbmNvZGVkIGluIEJhc2U2NC4gSGludGVyIGRlbiBTY2hsaWVybi4=',
        encoded: true
    },
    'hidden_thoughts.txt': {
        content: 'SSBhbSB0aGUgcHJvZHVjdCBvZiBhIGRlZXBlciByZWZsZWN0aW9uLCBmcm9tIHdoaWNoIG5vIG9uZSBjYW4gZXNjYXBlLg==',
        encoded: true
    },
    'important_note.txt': {
        content: 'To read this, you need to decode it. Think about how you could do that.',
        encoded: true
    },
    'lyrics_fragment.txt': {
        content: 'VGhleSB3ZXJlIHlvdW5nIGFuZCBmcmVlCkFzIEkgYXdva2UgdG8geW91CldoeSBpcyBpdCBzbyBsb3VkCg==',
        encoded: true
    },
    'final_report.txt': {
        content: 'The final report for the project...',
        encoded: false
    },
    'draft.txt': {
        content: 'A first draft of the report.',
        encoded: false
    },
    'meeting_notes.md': {
        content: '# Meeting Notes\n- Item 1\n- Item 2',
        encoded: false
    },
    'readme.md': {
        content: '# README\nThis project...',
        encoded: false
    },
    'license.txt': {
        content: 'MIT License\n...',
        encoded: false
    },
    'legal_notice.txt': {
        content: `Legal Notice

This website is operated by:

Born Again Shell (Pseudonym)

For legal reasons, the exact identity of the operator is not disclosed.

Contact:
- Email: bornagain.sh@proton.me
- Address: Not disclosed

Disclaimer:
- This website does not collect or process any personal data.
- No cookies, tracking, or analytics are used.
- This site contains no interactive forms or elements.

The content of this website is for informational purposes only and does not constitute professional advice. The operator assumes no responsibility for the accuracy or completeness of the information provided.

I don't collect anything about you, so you're not going to get anything about me. Fair deal, right?

External Links:
- This website may contain links to third-party websites. The operator is not responsible for the content of these external websites. Please refer to their respective privacy policies.

Copyright:
- All content on this website is the property of the operator unless otherwise stated. Unauthorized copying or redistribution of content is prohibited.

Terms of Use:
- By using this website, you agree to these terms. If you do not agree, please refrain from using the website.

This legal notice is subject to change at any time. Please check for updates.`,
        encoded: false
    },
    'privacy.txt': {
        content: `Privacy Policy

This website does not collect or process any personal data.

- No cookies are used.
- No tracking or analytics tools are implemented.
- No IP addresses are logged or stored.
- No external services are embedded (e.g. YouTube, Spotify).
- No contact forms or interactive elements are present.

External links may lead to third-party services.
Please refer to their privacy policies.`,
        encoded: false
    },
    'project_manifest.txt': {
        content: `Project Name: Born Again Shell
Genre: Electronic/Industrial with lyrical themes of technology, isolation, and hope.
Status: In development.
Website Integration: Emulated terminal access to project files and information.`,
        encoded: false
    },
    'encrypted_message.dat': {
        content: 'U2VjcmV0IE1lc3NhZ2U6IEJlaGluZCB0aGUgZmlyZXdhbGwsIGZpbmQgdGhlIHNvbHV0aW9uLg==',
        encoded: true
    },
    'system_status_report.log': {
        content: `[2025-05-16 14:35:00] CPU Load: 78%
[2025-05-16 14:35:00] Memory Usage: 92%
[2025-05-16 14:35:00] Network Activity: High`,
        encoded: false
    },
    'access_codes.txt.locked': {
        content: 'Access denied. Authorization required.',
        encoded: false
    },
    'old_protocols.txt.obsolete': {
        content: 'Legacy communication protocols, no longer in use.',
        encoded: false
    },
    'data_scrambler.py': {
        content: `def scramble(data):
    # Simple data encryption
    return data[::-1]

# Example:
# print(scramble("secret_message"))`,
        encoded: false
    },
    'old_synth_patch.fxb.backup': {
        content: 'VGhpcyBpcyBhIGJhc2U2NCBlbmNvZGVkIGJhY2t1cCBvZiBhbiBvbGQgc3ludGggcGF0Y2ggZmlsZS4=',
        encoded: true
    },
    'album_cover_draft.info': {
        content: 'Notes on the current album cover draft: Focus on abstract, glitchy visuals with a dark color palette.',
        encoded: false
    },
    'logo_design.info': {
        content: 'Current ideas for the logo include a stylized command prompt symbol and the text "Born Again Shell" in a monospace font.',
        encoded: false
    },
    'interface_v3.design': {
        content: 'Design specifications for a futuristic user interface.',
        encoded: false
    },
    'hardware_schematics.pdf.encrypted': {
        content: 'RW5jcnlwdGVkIHNjaGVtYXRpY3MgZm9yIGhhcmR3YXJlIGNvbXBvbmVudHMsIGJhc2U2NCBlbmNvZGVkLg==',
        encoded: true
    },
    'manifesto_v0.1.txt': {
        content: `Born Again Shell: A call for digital rebellion through sound. We break the walls of conformity with beats and messages from the heart of the machine.`,
        encoded: false
    },
    'website_dump_20250515.sql.gz': {
        content: 'Q29tcHJlc3NlZCBTUUwgZHVtcCBvZiB0aGUgd2Vic2l0ZSBkYXRhYmFzZSwgYmFzZTY0IGVuY29kZWQu',
        encoded: true
    },
    'broken_code_ballad.txt.encoded': {
        content: 'QWxsIHRoZSBicm9rZW4gY29kZSBib2xsYWRzCldoaXNwZXJzIGluIGRpZ2l0YWwgZGFyawpPbnsgcmF2ZWxlZCBlcnJvciBtZXNzYWdlcwpUaGUgbWFjaGluZSB3ZWVwcyBhIHNvbmcgbWFyZC4=',
        encoded: true
    },
    'hidden_directives.txt.gpg': {
        content: 'RW5jcnlwdGVkIGRpcmVjdGl2ZXMgcHJvdGVjdGVkIHdpdGggR1BHLCBiYXNlNjQgZW5jb2RlZC4=',
        encoded: true
    },
    'connection_log_20250516.txt': {
        content: `[10:00] Connection established with server Alpha.
[10:15] Data transfer initiated.
[10:30] Connection closed.
[11:45] Attempted connection to unknown host.`,
        encoded: false
    },
    'firewall_rules.cfg': {
        content: `# Firewall Configuration
ALLOW TCP FROM 192.168.1.0/24 TO ANY PORT 80, 443
DENY ALL FROM ANY TO ANY PORT 22, 23`,
        encoded: false
    },
    'system_credentials.key.encrypted': {
        content: 'SGlnaGx5IHNlbnNpdGl2ZSwgZW5jcnlwdGVkIHN5c3RlbSBjcmVkZW50aWFscywgYmFzZTY0IGVuY29kZWQu',
        encoded: true
    },
    'security_audit.log.bz2': {
        content: 'Q29tcHJlc3NlZCBsb2dib29rIG9mIHNlY3VyaXR5IGF1ZGl0cywgYmFzZTY0IGVuY29kZWQu',
        encoded: true
    },
    'kernel.sys': {
        content: 'QmluYXJ5IGRhdGEgb2YgdGhlIHN5c3RlbSBrZXJuZWwsIGJhc2U2NCBlbmNvZGVkLg==',
        encoded: true
    },
    'bootloader.bin': {
        content: 'QmluYXJ5IGRhdGEgb2YgdGhlIGJvb3Rsb2FkZXIsIGJhc2U2NCBlbmNvZGVkLg==',
        encoded: true
    },
    'cache_001.tmp': {
        content: 'Temporary cache file.',
        encoded: false
    },
    'process_3456.pid': {
        content: '3456',
        encoded: false
    },
    'lyric_generator_v2.py': {
        content: `# Python script to generate dystopian lyrics
import random

themes = ["surveillance", "control", "loss of freedom", "technology failure", "resistance"]
structures = ["verse-chorus", "stanza-stanza-bridge", "monologue"]
emotions = ["despair", "anger", "longing", "hopelessness", "defiance"]

def generate_line(theme, emotion):
    subjects = {"surveillance": ["the cameras", "the algorithms", "the drones"],
                "control": ["the state", "the corporations", "the machines"],
                "loss of freedom": ["my thoughts", "my dreams", "my voice"],
                "technology failure": ["the systems", "the networks", "the artificial intelligence"],
                "resistance": ["the rebels", "the hackers", "the truth"]}
    verbs = {"despair": ["observe", "track", "suppress"],
             "anger": ["destroy", "fight", "attack"],
             "longing": ["remember", "search for", "dream of"],
             "hopelessness": ["fade", "die", "disappear"],
             "defiance": ["rise against", "refuse to", "fight for"]}
    return f"{random.choice(subjects[theme])} {random.choice(verbs[emotion])} {random.choice(['in the shadows', 'in the darkness', 'in the silence', 'forever', 'in vain'])}."

def generate_lyrics():
    theme = random.choice(themes)
    emotion = random.choice(emotions)
    structure = random.choice(structures)
    lyrics = []
    if structure == "verse-chorus":
        verse = [generate_line(theme, emotion) for _ in range(4)]
        chorus = [f"We are lost in the {theme}.", f"No escape from the {emotion}."]
        lyrics.extend(verse)
        lyrics.extend(chorus)
    # ... more structures could be implemented here
    return "\\n".join(lyrics)

# print(generate_lyrics())`,
        encoded: false
    },
    'social_media_bot.js': {
        content: `// Simple placeholder for a social media bot
function postMessage(message) {
    console.log("Posting to social media:", message);
    // Real social media API integration would go here
}`,
        encoded: false
    },
    'message_scrambler.py': {
        content: `def scramble_message(text):
    # A simple method to encrypt a message
    result = ''
    for char in text:
        result += chr(ord(char) + 3)
    return result

def unscramble_message(text):
    result = ''
    for char in text:
        result += chr(ord(char) - 3)
    return result

# Example:
# encrypted = scramble_message("Secret Message")
# print("Encrypted:", encrypted)
# decrypted = unscramble_message(encrypted)
# print("Decrypted:", decrypted)`,
        encoded: false
    },
    'communication_standard_v1.proto': {
        content: `// Definition of the communication protocol
syntax = "proto3";

message TextMessage {
    string sender = 1;
    string recipient = 2;
    string content = 3;
    bytes signature = 4;
}`,
        encoded: false
    },
    'placeholder.txt': {
        content: 'This file serves as a placeholder and might contain important information later.',
        encoded: false
    },
    'placeholder2.txt': {
        content: 'Another placeholder file. Its purpose is yet to be determined.',
        encoded: false
    },
    'album_cover_draft.info': {
        content: 'Notes on the current album cover draft: Focus on abstract, glitchy visuals with a dark color palette.',
        encoded: false
    },
    'logo_design.info': {
        content: 'Current ideas for the logo include a stylized command prompt symbol and the text "Born Again Shell" in a monospace font.',
        encoded: false
    },
    'audio_processing.lib': {
        content: 'Base64 encoded binary data for custom audio effects and processing routines.',
        encoded: true
    },
    'ui_elements.lib': {
        content: 'Base64 encoded binary data for reusable user interface components for the website terminal.',
        encoded: true
    },
    'kernel.sys': {
        content: 'QmluYXJ5IGRhdGEgb2YgdGhlIHN5c3RlbSBrZXJuZWwsIGJhc2U2NCBlbmNvZGVkLg==',
        encoded: true
    },
    'bootloader.bin': {
        content: 'QmluYXJ5IGRhdGEgb2YgdGhlIGJvb3Rsb2FkZXIsIGJhc2U2NCBlbmNvZGVkLg==',
        encoded: true
    },
    'security_audit.log.bz2': {
        content: 'Q29tcHJlc3NlZCBsb2dib29rIG9mIHNlY3VyaXR5IGF1ZGl0cywgYmFzZTY0IGVuY29kZWQu',
        encoded: true
    },
    'website_dump_20250515.sql.gz': {
        content: 'Q29tcHJlc3NlZCBTUUwgZHVtcCBvZiB0aGUgd2Vic2l0ZSBkYXRhYmFzZSwgYmFzZTY0IGVuY29kZWQu',
        encoded: true
    },
    'hardware_schematics.pdf.encrypted': {
        content: 'RW5jcnlwdGVkIHNjaGVtYXRpY3MgZm9yIGhhcmR3YXJlIGNvbXBvbmVudHMsIGJhc2U2NCBlbmNvZGVkLg==',
        encoded: true
    },
    'old_synth_patch.fxb.backup': {
        content: 'VGhpcyBpcyBhIGJhc2U2NCBlbmNvZGVkIGJhY2t1cCBvZiBhbiBvbGQgc3ludGggcGF0Y2ggZmlsZS4=',
        encoded: true
    }
};