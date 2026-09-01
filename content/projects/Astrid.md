---
title: "Astrid"
date: 2026-08-31
updated: 2026-08-31
slug: "astrid"
authors: ["Daniel Cordova"]
taxonomies:
    categories: ["Dev"]
    tags: ["Rust", "QEMU", "VMs"]
description: "Small QEMU wrapper to run VMs based on YML configs"
---

Astrid is a tiny app written in Rust that act as a wrapper for **QEMU** to run Virtual Machines with **YML** config files. Its Github link is: [Astrid](https://github.com/dcdaz/astrid)

### Astrid Config

Astrid config is placed on `XDG_CONFIG_HOME/astrid.yml` and has a variable called `vms_path`

```yml
vms_path: /home/{{user}}/vms
```

### Astrid VMS Path

Inside `vms_path` you can only have *yml* files for configurations or actual VMs.

*YML* config files contains basic configurations that tell **QEMU** how to run such VM. To avoid any missconfig or weird naming, is encouraged to use same name of VM for YML config, Eg: `Arch.qcow2` and `Arch.yml`

```yml
qemu_arch: x86_64
boot: menu=on
cdrom: /home/{{user}}/{{any_path}}/arch-linux.iso // Needed for live or to use installer
drive: /home/{{user}}/vms/Arch.qcow2
memory: 4G
cpu_type: host
cpu_cores: 4
vga: virtio
display: sdl,gl=on
```

### Parameters

#### Print Help

`astrid --help/-h`

```bash
astrid works with the following args:
    -c ImageName ImageSize  -> creates images
    -l                      -> list all vm configs
    -r ConfigName           -> run a vm config
    -h                      -> prints this help menu
```

#### Create an Image file

`astrid -c Arch.qcow2 40G`

> Will create `Arch.qcow2` on `vms_path`

#### List all VMs

`astrid -l`

```bash
Arch.yml
Debian.yml
```

#### Run a VM

`astrid -r Arch`
