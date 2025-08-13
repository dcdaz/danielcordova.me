---
title: "Swagger on Actix Web"
date: 2025-07-04
updated: 2025-07-04
slug: "swagger-actix-web"
authors: ["Daniel Cordova"]
taxonomies:
    categories: ["Dev"]
    tags: ["Rust", "REST", "Swagger"]
description: "How to add Swagger on a rest api built with Rust + Actix Web"
---

I've been toying with **Rust** for quite a few time, but never take it seriously due to several reasons such as work, work and more work and other as not having spare time to work on my own projects.

Anywway I decided to start again with **Rust** but hopefully this time more seriously than ever and started again with an old *API* of my own to track chapters of series and animes I watch, I know that streaming platforms has this feature integrated, but I prefer to have it completely separated since I tend change from an Isekai anime to a dorama or to a thriller or action serie from diff platforms and having them on one platform helps me to avoid some *zapping*.

So, I've been working on a *REST API* written on **Rust** with [*Actix Web*](https://actix.rs/), everything worked well, but I had this feelling that I need to do it right even though this project currently serves to my own needs (Hopefully it helps other fellas in the future). That's why I wanted to add *Swagger* to it, and want to share my thoughts on how to implement it on a simple API.

## Steps

- [Add dependency](#add-dependency)
- [Create configuration](#create-configuration)
- [Add Swagger to routes](#add-swagger-to-routes)
- [Document endpoints](#document-endpoints)
- [Add Security](#add-security)
- [Results](#results)


## Add dependency

For adding Swagger and OpenAPI on the API, I choose [Utoipa](https://crates.io/crates/utoipa) it has tons of documentation and there are several places to get some quick guides or tutorials like this one. There are 2 dependencies for this purpose, *Utoipa* itself and its *Swagger* implementation.

Add the following dependencies to your `Cargo.toml`
```toml
utoipa = "5.4.0"
utoipa-swagger-ui = { version = "9.0.2", features = ["actix-web"] }
```
> Swagger implementation for Utoipa can be used in actix, rocket, axum , etc.

## Create configuration

In order to have an ordered code I don't want to add config in the same files/modules as handlers/controllers/endpoints, so just create a different rust file named `openapi_config.rs` with the following content

```rust
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    paths( // Here you can add you endpoint functions
        controllers::register,
        controllers::login,
        controllers::logout,
        controllers::insert_serie,
        controllers::search_series,
        controllers::get_serie_by_id,
        controllers::update_serie,
    )
)]
pub struct ApiDoc; // Struct that contains our open api docs
```

## Add Swagger to routes

Actix web has a *configure* function that allows to add every route we want to be exposed on the *API*, this method uses a `ServiceConfig` struct where we can add our routes. Below there's a sample of how to have your routes configured in your API


`route_config.rs`
```rust
use actix_web::web;

// Endpoints registration config
pub fn routes(config: &mut web::ServiceConfig) {
    use crate::controllers::{
        search_series, get_serie_by_id, insert_serie, login, logout, register, update_serie,
    };

    config // Config is passed from "configure" function in main.rs file
        .service(register) // Each endpoins is a service so they're added manually here
        .service(login)
        .service(logout)
        .service(insert_serie)
        .service(search_series)
        .service(get_serie_by_id)
        .service(update_serie);
}
```

`main.rs`
```rust
mod configuration;
use configuration::routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .configure(routes) // Add routes functions which contiains all endpoints registered
    })
    .bind(server_url)?
    .run()
    .await
}
```

So, our configuration goes into `route_config.rs` by adding Swagger to allowed routes, file wile be as follows

```rust
use super::openapi_config::ApiDoc;
use actix_web::web;
use utoipa::OpenApi;

// Endpoints registration config
pub fn routes(config: &mut web::ServiceConfig) {
    use crate::controllers::{
        search_series, get_serie_by_id, insert_serie, login, logout, register, update_serie,
    };
    use utoipa_swagger_ui::SwaggerUi;

    config
        .service(register)
        .service(login)
        .service(logout)
        .service(insert_serie)
        .service(search_series)
        .service(get_serie_by_id)
        .service(update_serie)
        .service( // Here the new route contains swagger and openapi json file
            SwaggerUi::new("/swagger/{_:.*}")
                .url("/api-docs/openapi.json", ApiDoc::openapi().clone()),
        );
}

```

## Document Endpoints

Every endpoint should contain its own documentation, so in this section there are some documentation about the basic operations

### GET

```rust
#[utoipa::path(
    get,
    path = "/serie/{serie_id}",
    tag = "Series",
    description = "Get a serie by its id",
    params(("serie_id" = i16, Path, description = "Id of a serie")),
    responses(
        (status = 200, body = SerieResponse),
        (status = 401, body = ErrorMessage),
        (status = 404, body = ErrorMessage),
    )
)]
#[get("/serie/{serie_id}")]
pub async fn get_serie_by_id(
    authenticated_request: AuthenticatedRequest,
    serie_id: web::Path<(i16,)>,
)
```

### POST

```rust
#[utoipa::path(
    post,
    path = "/serie",
    tag = "Series",
    description = "Add a new serie",
    request_body(
        content = SerieRequest,
        example = json!({"name": "Sample Serie", "season": 2, "chapter": 0, "score": 0})
    ),
    responses(
        (status = 201),
        (status = 400, body = ErrorMessage),
        (status = 401, body = ErrorMessage),
    )
)]
#[post("/serie")]
pub async fn insert_serie(
    authenticated_request: AuthenticatedRequest,
    request: web::Json<SerieRequest>,
)
```

### PUT

```rust
#[utoipa::path(
    put,
    path = "/serie/{serie_id}",
    tag = "Series",
    description= "Update a serie",
    params(("serie_id" = i16, Path, description = "Id of a serie")),
    request_body(
        content = SerieRequest,
        example = json!({"name": "Sample Serie", "season": 2, "chapter": 0, "score": 0})
    ),
    responses(
        (status = 204),
        (status = 400, body = ErrorMessage),
        (status = 401, body = ErrorMessage),
    )
)]
#[put("/serie/{serie_id}")]
pub async fn update_serie(
    authenticated_request: AuthenticatedRequest,
    serie_id: web::Path<(i16,)>,
    request: web::Json<SerieRequest>,
)
```


## Add Security

If our *API* has security, we can add it to our **OpenAPI** struct and then to our endpoints, so starting from improving our **OpenAPI** struct we need to create a new struct that will hold security features

```rust
struct SecurityAddon; // New Struct
impl Modify for SecurityAddon { // Implement Modify for our struct
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        openapi.components.as_mut().unwrap().add_security_scheme(
            "token", // This name could be anything, will be used on API documentation.
            SecurityScheme::Http(
                HttpBuilder::new()
                    .scheme(utoipa::openapi::security::HttpAuthScheme::Bearer)
                    .bearer_format("JWT")
                    .build(),
            ),
        );
    }
}
```

After create our *Security* struct we need to add it to out **OpenAPI**

```rust
#[derive(OpenApi)]
#[openapi(
    paths(
        crate::controllers::register,
        crate::controllers::login,
        crate::controllers::logout,
        crate::controllers::insert_serie,
        crate::controllers::search_series,
        crate::controllers::get_serie_by_id,
        crate::controllers::update_serie,
    ),
    modifiers(&SecurityAddon) // SecurityAddon is placed here, as a modifier
)]
pub struct ApiDoc;
```

Now it's the time to add authorization to our endpoint documentation, by adding `security(("token" = [])),` to **Utoipa** documentation, like the following

```rust
#[utoipa::path(
    get,
    path = "/serie/{serie_id}",
    tag = "Series",
    description = "Get a serie by its id",
    params(("serie_id" = i16, Path, description = "Id of a serie")),
    security(("token" = [])), // "token" is the name we used on SecurityAddon config
    responses(
        (status = 200, body = SerieResponse),
        (status = 401, body = ErrorMessage),
        (status = 404, body = ErrorMessage),
    )
)]
#[get("/serie/{serie_id}")]
pub async fn get_serie_by_id(
    authenticated_request: AuthenticatedRequest,
    serie_id: web::Path<(i16,)>,
)
```

After that you can have security added on your Swagger page

## Results

To check our results just go to your *API* URL + `/swagger/`, like: `http://127.0.0.1:8085/swagger/`, you'll see a screen similar to the following.

### Swagger Screen
{{ images(path="./assets/swagger-actix-1.png", alt="Swagger Screen", scale=1) }}
### Swagger Screen GET
{{ images(path="./assets/swagger-actix-2.png", alt="Swagger Screen GET", scale=1) }}
### Swagger Screen POST
{{ images(path="./assets/swagger-actix-3.png", alt="Swagger Screen POST", scale=1) }}
### Swagger Screen PUT
{{ images(path="./assets/swagger-actix-4.png", alt="Swagger Screen PUT", scale=1) }}

If you want to check source code for this you can check [Anicap](https://github.com/dcdaz/anicap) project.