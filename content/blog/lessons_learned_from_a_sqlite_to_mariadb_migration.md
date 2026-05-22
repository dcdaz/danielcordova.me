---
title: "Lessons learned from a SQLite to MariaDB migration"
date: 2026-05-21
updated: 2026-05-21
slug: "sqlite-to-mariadb-migration"
authors: ["Daniel Cordova"]
taxonomies:
    categories: ["Databases"]
    tags: ["SQLite", "MariaDB", "Migration"]
description: "Brief explanation of how I migrated a Rust backend from SQLite to MariaDB"
---

I started a while ago a small app called **Anicap** for saving which animes and series I was watching at that time. Sadly I forgot to work on it for quite long time. Last year I resumed the work on it, added a frontend built on VueJS, improved REST API, etc. Until I found myself in a crossroad by using SQLite.

## Problem

### Idea

I wanted to add types and categories to a serie to help me search by them, aka types (anime, ova, movie, etc), categories (sci-fi, horror, comedy, etc). Something Like:

```
Name: The wheel of time
Type: Serie
Categories: Fantasy, Drama, Action
```

### Tracing cause

After adding a section for types and categories, I found myself fighting with my own lazyness to not doing third tables to add those types and categories to a serie/anime, meaning doing a many to many relation. Thus I wanted to add only a column on *serie* table to add an array of *categoriesIds*.

The problem is that SQLite doesn't support arrays as data type for columns. So I decided to migrate the entire app to MariaDB.

## Solution

**Anicap** uses *diesel* as ORM for mapping objects to SQL queries which allows to change between SQLite, MariaDB/MySQL, PostgreSQL with relative ease.

### Update depencendy to use MariaBD

Inside `Cargo.toml` diesel dependency must be updated from this `diesel = { version = "2.3.9", features = ["sqlite", "r2d2", "chrono"] }` to this `diesel = { version = "2.3.9", features = ["mysql", "r2d2", "chrono"] }` thus all code references to SQLite will be unavailable and MySQL ones becomes available.

### Update Pool

After update depndency I needed to change `database_utils.rs` to update `pub type SqlConnection` to MariaDB, this`SqlPool` can use the new database

```rust
use diesel::mysql::{Mysql, MysqlConnection};

pub type SqlConnection = MysqlConnection;
```

> Basically that was the necessary changes to make the app usable with a diff DB.

### Issues found

**In a utopian world that should be it. But in our world shit happens.** So here's a list of the problems I faced while updating the Database

- Didn't want to force users to run schema init from SQL scripts
    - I improved my `migrator.rs` to add a function called `initialize_database`
- Previous versions ran migrations all the time by checking them if exist or not on DB.
    - That wasn't the best approach and after adding `initialize_database` I had to add a way of handling those operations. Now app receive arguments to init or migrate
- No good way of having a working instance of *MariaDB*
    - Added a `docker-compose.yml` to initialize *MariaDB*
- My `schema.sql` script had a quite horrible problem that SQLite just allow it
    - `app_user` table had id as **INT AUTO_INCREMENT** and `serie` table had *user_id* releation as **SMALLINT**. Somehow SQLite allow this relation. But MariaDB didn't, I spent like 3 crazy hours looking at a couple of tables not knowing what was it until I found some message on stackoverflow related to issues with diff types on relations.

### Note

On a side note no app can be executed with arguments

```bash
anicap -> just runs backend
anicap init -> initialize DB schema on a Database
anicap migrate -> look for all migrations and run them if DB is outdated.
anicap -h -> print help menu
anicap --help -> print help menu
```

## Conclusion

Even when that **SMALLINT -> INT** SQL problem gave me a 3 hours headache it was a fun exercise to do the migration from SQLite to MariaDB on a working app, and now it feels like the app starts to be more like a good portfolio app rather than a forgotten toy.
