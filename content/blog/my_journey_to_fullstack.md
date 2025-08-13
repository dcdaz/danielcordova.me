---
title: "My Journey to Fullstack Dev"
date: 2025-08-12
updated: 2025-08-12
slug: "fullstack-dev"
authors: ["Daniel Cordova"]
taxonomies:
    categories: ["Dev"]
    tags: ["Rust", "Actix", "Backend", "Typescript", "VueJS", "Frontend"]
description: "Thoughts on my personal journey from backend to fullstack"
---

I've decided a few weeks ago to invest some time on learning new things, work on some tools that I wanted to build for quite a long time but never gave them the proper time to do it. So I started with an app that I wanted to write a while ago but never started with it, because I didn't have time, I didn't have a VPS to host it, and specially I didn't have a strong commitment to work on it.

The app is a very simple application to handle series that I'm currently watching or wish to watch, since always my main workflow for this puny task a spreadsheet in Libreoffice Calc and lately (around 2 years) I added a Python-GTK app that I wrote en execute it from my taskbar. So it's a chaotic way of doing things, handle a spreadsheet with series and their season, chapter and in the Python app handle those that I want to see.

## The Chaos

#### Using a spreadsheet
{{ images(path="./assets/fullstack-journey-1.png", alt="Calc Spreadsheet", scale=1) }}

#### Using my Python Notes App
{{ images(path="./assets/fullstack-journey-2.png", alt="Python GTK Notes App", scale=1) }}

## Motivation

As I explained on my previous post about Actix Web and Swagger

> I wanted my own app to track chapters of series, doramas and animes I watch, I know that streaming platforms has this feature integrated, but I prefer to have it completely separated since I tend change from an anime to a dorama or to a thriller or action serie from diff platforms and tracking them on one platform helps me to avoid some *zapping*.

The *main motivation* was to have a way to track series/animes/doramas chapters that could be used from my laptop/tablet/phone, the *second motivation* was to learn different things from different areas and increase my dev skills (*I feel them a little bit rusty after working for some years on the same app/solution*).

## Technical decision

My main skills are on top of JVM langs such as *Java and Kotlin*. So I have to say that my experience with *Frontend* technolgies was a startpage for my browser called [**Caratula**](https://github.com/dcdaz/caratula) wich was badly written in *VueJS*, and this static site. For *Backend* technologies apart from JVM ones I have some experience with *Rust, Python and a little bit of C++* and I have some love for those languages, so the choice was almost obvious to me, **No** JVM technologies.

*C++* is great but I never did a *REST* Api with it and I didn't want to lose time learning a *C++ REST Framework* and remembering how to do things on that language. For *Rust and Python* I did some toy projects with *Flask, Django and Actix Web*, in fact the original *API* was written in *Python + Flask* around 7 years ago.

After some time thinking about *Python + Flask* or *Rust + Actix* for backend I decided to go with **Rust** considering that building the binary for a **ARM64 VPS** could be harder than deploying a *Python* app.

Then it comes the Frontend side, I never liked *React* but I had put it in the list of the possible technologies, so they were *VueJS, React and Svelte* as Frameworks and *Bulma, TailwindCSS* for *CSS*. Considering my previous "experience" with *VueJS* I decided to use it for my frontend along with *Bulma*

Strange choice **Rust + VueJS**

> A backend dev with no knowledge on how to build frontends/webapps/SPAs is like an ape trying to use measuring tape

## The Journey

After work a few days on the backend and make a decent *API*, I started with frontend and it was a nice experience seeing how different parts start to fit as a one solution. I want split this journey into 6 sections that will explain how was it until now

- [Learning VueJS](#learning-vuejs)
- [Learning Vue Router](#learning-vue-router)
- [Learning Pinia Store](#learning-pinia-store)
- [Learning KY](#learning-ky)
- [Learning Typescript](#learning-typescript)
- [Project organization](#project-organization)

### Learning VueJS

#### The beginning

As I said i had a teeny experience with Frontend, I wrote a few things on JS for this static site and the components for *Caratula* startpage, so the the frontend for my app started in the same way as *Caratula*. A sample of how i started

```js
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // expose to template and other options API hooks
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

But something didn't feel completely right with how script section is written, it felt confusing and disconected. In any case i was working in the login page with this path until I saw a different way of write the script section i looked more coherent to me, so I started to use it and then things started to feel right.

```js
<script setup>
// variable
const msg = 'Hello!'

// functions
function log() {
  console.log(msg)
}
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

> `<script setup>` is a blessing to someone who understands only backends.

#### Reactivity and other Quirks

Understand *ref and reactive* and how they can hold value from a html tag and/or update it was a challenge to me, because i couldn't connect the idea in my head. But once I understood it, evertyhing was way easier specially handle the data I got from *API* and show it on web browser.

*onMounted* was a super easy concept to understand what it does and how to use it. About *watch*, is something that I still need to review on documentation to not forget how it works. And one thing that troubles me a lot was to pass Global variables such as backend URL, at the begining I wrote them on the `main.js` file but lately I learned how `.env`, `.env.local` and `.env.production.local` works on *VueJS* and it was kinda a **Eureka** feeling. I used those files on other langs/projects such as *Python* but didn't know how they work with *VueJS*.

### Learning Vue Router

After having a successfull login and create the component for the `dashboard` I couldn't connect the idea of go from one component to another and/or move between screens in my frontend. The concept itself was elusive to me. A frined of mine explained a little bit how a router works and that I should search for some router for my *VueJS* app. Vue-Router was the solution but I had some difficulties to understand how it works until I saw it as sequence or as a **stack** of pages like:

{% mermaid() %}
flowchart TD
    PageA-->PageB
    PageB-->PageA
    PageB-->PageC
    PageC-->PageB
{% end %}

### Learning Pinia Store

I need it a way of dealing with credentials and didn't know how to use *localStorage* or any other storage on browser, so I looked on some places and It was obvious that hold credentials on *localStorage* wasn't the best idea. *VueJS* fellas recommended *Pinia*, so I started with a small tutorial, eveything worked flawlesly but I had this weird behavior when I hit `F5/Ctrl-R` keys and the session got lost, that thing drove me crazy for a couple of days until I understood that pinia didn't persit data on the store. Then using a plugin for persiting data on the store was super wasy and felt it natural.

### Learning KY

This is a wonderfull library, I started to use with really simple calls, but recently I discover its more power with **hooks** that made a huge difference in how I deal with the call to the *API*

### Learning Typescript

Javascript is kinda weird to me, it doesn't feel like I'm writing an entire application, it feels like I'm writing some scripts for specific things/actions. So I heard about the benefits of using Typescript and decided to convert my entire application from JS to TS. The transition was natural to me, having types for everything makes the code strong and easy to read. I can have classes and handle them as I use to in the backend. But most *important* now I feel like I'm writing an entire app and not a bunch of loose files that connects with **magic**. So Typescript was a great choice.

### Project Organization

When the app started to grow like dashboards, adding a new serie, edit a serie, change some color, search bar, etc. I saw the need of having a good organization of my files. Having all *Typescript* code on the same file as *"HTML"* didn't feel right, so I started to extract code, split responsibilites and move things where I think they belong. This organization is not something that I searched on the web but it's based on my backend experience. So I have a files and filders hierarchy like the following:

|   Folder   |                       Purpose                                     |
| -----------| ----------------------------------------------------------------- |
| components | All visual HTML components with small TS code                     |
| services   | TS files where logic and magic happens                            |
| utils      | Some stuff that doesn't belong to a service like a theme switcher |
| router     | Just the router for my app and possibly other routers if need to  |
| stores     | Just the store for my app and possibly other stores if need to    |
| types      | Complex types similar to DTO's on backend                         |
| static     | Custom CSS                                                        |

## Screenshots

#### Login page
{{ images(path="./assets/fullstack-journey-3.png", alt="Login", scale=1) }}
#### Dashboard
{{ images(path="./assets/fullstack-journey-4.png", alt="Dashboard", scale=1) }}
#### Dashboard Search
{{ images(path="./assets/fullstack-journey-5.png", alt="Dashboard Search", scale=1) }}
#### Serie Editor
{{ images(path="./assets/fullstack-journey-6.png", alt="Serie Editor", scale=1) }}
#### New Serie
{{ images(path="./assets/fullstack-journey-7.png", alt="New Serie", scale=1) }}
#### Dark Theme
{{ images(path="./assets/fullstack-journey-8.png", alt="Dark Theme", scale=1) }}
<br />

> You can found the code for this project on [Anicap](https://github.com/dcdaz/anicap)

## Conclusion

Working on frontend was a nice journey to me a little bit stressful, though. That's becuase some concepts are completely different than I thougt and also I didn't understood some of them until I was searching on the internet how to do A or B thing in VueJS. Concepts like KY hooks, reactivity or stores were not in my mind when I was starting with this Journey.

I'm still considering myself as a newbie on the *frontend* world, but so far, I like it.

My recomendation for those **backend devs** who wants to start in the *frontend* world and become **fullstack devs** is to *Study about concepts of the frontend world before learning about A/B framework or how building using npm, pnpm, yarn, etc. And when you understand about how some things work a good start is to use `AlpineJS` rather than complex stuff like VueJS or React*
