/* import fs from "fs";
import path from "path";
import MarkdownIt from "markdown-it";
import prism from "markdown-it-prism"; */

const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const prism = require("markdown-it-prism");

function extract_frontmatter(markdown) {
    const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
    let content = markdown;
    let metadata = {};
    if (match) { // if there is no frontmatter
        const frontMatter = match[1];
        content = markdown.slice(match[0].length);

        frontMatter.split('\n').forEach(pair => {
            const colonIndex = pair.indexOf(':');
            metadata[pair.slice(0, colonIndex).trim()] = pair
                .slice(colonIndex + 1)
                .trim();
        });
    }
    return { metadata, content };
}

let ENABLE_WRITE = true; //QUICK TOGGLE THIS TO FALSE AFTER GENERATING IF STUCK ON IFNITE RELOAD


let md = MarkdownIt("commonmark").use(prism);
function write_markdown_to_file(source_path, output_path, file_name) {
    let markdown = fs.readFileSync(source_path, "utf-8");
    //console.log(markdown);
    const { content, metadata } = extract_frontmatter(markdown);
    //console.log(metadata);

    let insert = ``;
    if (metadata.youtube) { //import will break if youtube link is not in nested folder. ../ or ../../ are the only 2 allowable options so easy fix
        insert =
            `<script>import Youtube from "../../components/Youtube.svelte";</script><Youtube src="${metadata.youtube}" />`
    }
    let title = `<svelte:head><title>${file_name}</title></svelte:head>`;

    /* 
    console.log(markdown);
    console.log(content);
 */
    const converted = insert + title + `{@html \`${md.render(content)}\`}`;
    fs.writeFileSync(output_path, converted);
}

function filter_ordering_from_name(s) {
    return s.replace(/[0-9]/, "").replace(/[0-9]/, "").replace(/-/, "");
}

function generate() {
    let metadata = {
        title: "",
        structure: {
        },
        exercise_pages: [],
        root: []
    };
    fs.readdirSync("./content/").map((course_name) => {
        metadata.title = course_name;
        //fs.opendirSync(`./content/${course_name}/`).
        let create_root_index = false;
        let roots = fs.readdirSync(`./content/${course_name}/`);

        roots.map((heading) => { //folders are the headings
            let unordered_heading_name = `${filter_ordering_from_name(heading)}`;
            if (path.extname(heading) === "") { //looking through folders to create the heading

                metadata.structure[unordered_heading_name] = [];
                let files = fs.readdirSync(`./content/${course_name}/${heading}/`);
                // console.log(files);


                { //GENERATE INDEX.MD TOC IN THE CONTENTS FOLDER. WARNING, INDEX.MD FILES ARE OVERWRITTEN
                    let toc = files.filter((full_file_name) => { //grab the markdown files
                        if (path.extname(full_file_name) == ".md" && full_file_name !== "index.md" || path.extname(full_file_name) === ".svelte") {
                            return full_file_name;
                        }
                    });
                    let output = `# ${unordered_heading_name.replace(/-/gi, " ")}\n`;
                    toc.map((full_file_name) => {
                        let file_name = full_file_name.substring(0, full_file_name.indexOf(".")); //filtered extension
                        let unordered_file_name = filter_ordering_from_name(file_name);
                        let item = `1. [${unordered_file_name.replace(/-/gi, " ")}](${unordered_heading_name}/${unordered_file_name})\n`;
                        output += item;
                        metadata.structure[unordered_heading_name].push({ name: unordered_file_name, has_read: false });
                    })
                    fs.writeFileSync(`./content/${course_name}/${heading}/index.md`, output);
                }

                files.map((full_file_name) => {

                    fs.mkdirSync(`./src/routes/${unordered_heading_name}/`, { recursive: true });

                    let extension = path.extname(full_file_name);
                    let file_name = full_file_name.substring(0, full_file_name.indexOf("."));
                    let unordered_file_name = filter_ordering_from_name(file_name);
                    if (extension === ".md") {
                        if (ENABLE_WRITE) {
                            write_markdown_to_file(`./content/${course_name}/${heading}/${full_file_name}`, `./src/routes/${unordered_heading_name}/${unordered_file_name}.svelte`, unordered_file_name)
                        }
                    } else if (extension === ".json") { //also minify json?
                        fs.mkdirSync(`./static/exercises`, { recursive: true });
                        if (ENABLE_WRITE) {

                            fs.copyFileSync(`./content/${course_name}/${heading}/${full_file_name}`, `./static/exercises/${unordered_file_name}.json`);
                        }
                        metadata.exercise_pages.push(unordered_file_name);
                    } else if (extension === ".svelte") {
                        if (ENABLE_WRITE) {
                            fs.copyFileSync(`./content/${course_name}/${heading}/${full_file_name}`, `./src/routes/${unordered_heading_name}/${unordered_file_name}.svelte`);
                            /* 
                                                        let custom = fs.readFileSync(`./content/${course_name}/${heading}/${full_file_name}`)
                                                        fs.appendFileSync(`./src/routes/${unordered_heading_name}/${unordered_file_name}.svelte`, custom);
                             */
                        }
                    }

                })
            } else if (path.extname(heading) === ".md") {
                let file_name = heading.substring(0, heading.indexOf("."));
                metadata.root.push(file_name);
                if (ENABLE_WRITE) {

                    write_markdown_to_file(`./content/${course_name}/${heading}`, `./src/routes/${file_name}.svelte`, file_name)
                }

            }

        });
    })
    if (ENABLE_WRITE) {

        fs.writeFileSync("./src/meta.js", "export default " + JSON.stringify(metadata));
    }
}
generate();