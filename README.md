# stormy

a small set of tools to make education more interactive, made with svelte and sapper

## Constraints:
* no spaces in file names, use underscores.
* prefix with numbers to control ordering
* files cannot be named index.md (automatically generated)
* no support for 2 level nested sub directores(until popular demand requires it): e.g Foundations -> Introduction -> What is a game?
* all image and video files should go into a static folder.

## How it works:
* Create a folder in the .content directory, the name of which will be the title for the site.
* Any sub folders will have a route/path automatically created, and any markdown files will be converted to svelte files in src.
* .svelte files in your .content directory will be copied to src, so if you want programmable interactive segments(random generation, etc), create a .svelte
* Exercise files are written in JSON and need to have the same name as the markdown file to link with the page and sync with right panel.
* For more advanced exercises(like random generation and animation), write a .svelte file. No support for using right panel atm.
* ```npm run build:content``` to start building the folder structure of the .content folder
* ```npx run export``` to export it as a static website and host it on github pages or netify, etc.

## Show and not tell
is the golden rule of creating effective content in writing, film, and just about everything. It emphasizes first hand experience above all else.
* You don't learn to build, you learn by building.
* You don't learn to speak, you speak to learn.

Learning is not a straight forward path from point A to point B. Mistakes will be made and gradually collecting the corrections of mistakes is what builds understanding. Currently students are afraid to make mistakes because it might impact their grade and such.

## Towards an ideal system of education

* Interactivity needs to be maximized allowing freedom to make mistakes, therefore we need a nearly infinite amount of exercise problems. It would be crazy for me to ask teachers to write thousands of these and not get paid overtime for doing so but what if students help write them? This forces students to get creative and think when and where they will apply what they've learned.

* Course material should be scienced, that is that we immediately toss out what doesn't work and collabratively iterate towards what does work. Technology makes this possible because we don't have to re-print changes every time.

* Project based learning, aka building to learn. Exercise problems help, but we need concrete project based implementations of abstract ideas, particularly in math and science because projects are less forgettable.

stormy is a result of my frustration against overpriced textbooks and education materials. I imagine education should be more like
wikipedia, easy to contribute to and open to iterate upon. For now it mainly suits the needs of my youtube channel but in the future I hope to expand it. 