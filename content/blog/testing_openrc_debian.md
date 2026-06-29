---
title: "Replacing Systemd with OpenRC in Debian"
date: 2026-06-24
updated: 2026-06-28
slug: "debian-openrc"
authors: ["Daniel Cordova"]
taxonomies:
    categories: ["Linux"]
    tags: ["Debian", "ARM", "Systemd", "OpenRC"]
description: "Thoughts on my testing process related to replacing Systemd with OpenRC"
---

## TL;DR

I'm not a fan of **systemd** but I'm not against its use either. AKA if it works for you then it's ok.

*My case* though is more of a mix between **curiosity and discomfort**. *Curiosity* of how init systems works and *discomfort* of how *systemd* integrates things or new features.I'm aware that it works well for most of its use cases (I've been using it since its early days) and also I agree that *systemd* breaks all **KISS** philosphy principles, but other projects do it as well, right?

**So why the discomfort?**

Well it began a while ago, when I was reading some news of how the project started to grab more and more responsibilities that belongs to other projects and how some **prod deployments** failed so bad because of a breaking change that could've been prevented if that responsibility wasn't part of *systemd*. Nothing too worrying for me though, in any case the first real kick of discomfort came when [**age verification law**](https://github.com/BryanLunduke/DoesItAgeVerify) was cooking and my innocent thought was `Ok, Windows and Mac will integrate it, but Linux and other OpenSource OSs and projects will "fight" against this ridiculous law!!`.

Then my next thought was `Wait what?, the law is not even approved on some states/countries and systemd already integrated it, why?, what happened with the usual "fight" against non-sense laws?`.

> I got pretty mad about it, I know, I'm not a contributor of that project and *it's only an optional field* but **it didn't feel right at all**. All the hate that the dev got wasn't right either.

Then the second kick of discomfort came while I was reading tech news and I found this one [systemd integrates sys-install](https://www.muylinux.com/2026/06/22/systemd-261/) `systemd integrates it's own "system installer" called 'systemd-sysinstall' among other things`.

All right, one thing is to have tons of responsibilities for an init system. But another one is going from being PID 1 to being the sys installer too, and no matter how you want to sell that idea there's an ocean of difference on what you can call **"Init system responsibilities"** and **"Systemd's weird responsibilities and wishes"**. So the **curiosity** entered the game and decided to try to install [**OpenRC**](https://wiki.gentoo.org/wiki/OpenRC) on my [*Thinkpad X13s Snapdragon*](https://danielcordova.me/blog/linux-x13s-snapdragon/) which I use for home hacking, testing stuff, etc. Laptop is running **Debian** BTW.

## Installation

Installing **OpenRC** in **Debian Testing** is not hard but isn't a trivial operation either. I faced a few challenges and issues regarding to how apt-get and apt works with **essential packages**

### Challenges

I faced two major challenges while trying to install *OpenRC* at the same time as uninstalling *Systemd*.

- *apt-get* can't uninstall *systemd* at all and only errors out that is not possible
- *apt* shows a better error of why it can't uninstall systemd

After digging a bit about it and reading a few pages on the internet, I learned that i need to pass an argument to **apt** thus it can uninstall an **essential** package. So for uninstalling it'll be something like this:

```bash
sudo apt purge --allow-remove-essential systemd
```
> **Don't copy and paste it yet.**

Before deleting *systemd*, need to be sure that *OpenRC* will be installed, to so the command will be

```bash
sudo apt purge --allow-remove-essential systemd && sudo apt install openrc sysvinit-core
```
> That command will uninstall systemd and install some dependencies that might not be needed in the future.

### Issues

After installing *OpenRC* and uninstalling *systemd*, system didn't boot properly, so I had to go to **recovery mode** and hit **Ctrl-D** to allow me to fix the error.

Issue itself was that while uninstalling *systemd* somehow *OpenRC* was removed too or not installed at all. So I went to *recovery mode*, then I connected to my wifi network and installed *OpenRC* again with `apt install openrc sysvinit-core`.

So far so good. But neither **Battery Status nor Audio** worked. I knew that *battery status* was due to the [kernel's regression](https://lwn.net/ml/linux-kernel/20240115135249.296822-1-arnaud.pouliquen@foss.st.com/) I faced while installing **Debian Testing** on the laptop. So I converted my *systemd* service to a script and put it in `/etc/init.d/`, thus *OpenRC* can start it or enable it. It worked. I think audio needs a different service related to pipewire and wireplumber, or to launch them on login. I'll test them later on.

Systemd Service:
```bash
[Unit]
Description=Start Qualcomm remoteprocs (SLPI/ADSP/CDSP)
DefaultDependencies=no
After=initrd-root-fs.target local-fs.target
Before=sysinit.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/bin/sh -c 'echo start > /sys/class/remoteproc/remoteproc0/state; echo start > /sys/class/remoteproc/remoteproc1/state; echo start > /sys/class/remoteproc/remoteproc2/state'

[Install]
WantedBy=sysinit.target
```

OpenRC Script
```bash
#!/bin/sh

echo start > /sys/class/remoteproc/remoteproc0/state;
echo start > /sys/class/remoteproc/remoteproc1/state;
echo start > /sys/class/remoteproc/remoteproc2/state;
```
> I need to convert it into a proper **OpenRC** script

## Future

Currently **OpenRC** does the work. I'm not sure if it'll be my default **Init system** for the comming ages, but I feel that my experiment was successful.

I'll continue testing **OpenRC** on my *"Home Hacking Laptop"* for the next days, maybe weeks, and if I feel comfortable enough I'll migrate my work laptop (which runs Debian Testing too and has the same dotfiles in it) to **OpenRC** as well.

Even though changing *Init System* on a working **Linux** installation has its quirks and challenges and might not be the best idea, I'm happy with my current results.

If this works for you too, then I'll be happier to know that you're ditching *systemd* in favor of *OpenRC* as well, *aside from jokes*, in the end that's part of the unix freedom **to use whatever you want and whatever works for you.**

Happy Hacking!!

## Links

Some links if you're interested in **OpenRC** too

- [Debian: Switching Init System Easily (OpenRC, Sysvinit, Runit)](https://lecorbeausvault.wordpress.com/2022/02/07/debian-switching-init-system-easily-openrc-sysvinit-runit/)
- [Beyond systemd: A Technical Deep Dive into OpenRC for Modern Linux Systems](https://linux-digest.com/beyond-systemd-a-technical-deep-dive-into-openrc-for-modern-linux-systems)
- [Introduction to OpenRC: Managing Services with Ease](https://www.foxipex.com/2024/11/15/introduction-to-openrc-managing-services-with-ease/)
- [OpenRC on debian](https://members.loria.fr/EJeandel/posts/openrc/)
